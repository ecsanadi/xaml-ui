# xaml-ui — `*ShadowedElement` Structural Directive

## Goal

Provide a reusable Angular structural directive in xaml-ui that wraps any element subtree in a real Shadow DOM boundary, replays the necessary Angular component styles into the shadow root, and keeps theming working through CSS custom-property inheritance.

The directive is the building block for embedding xaml-ui content inside hostile host applications (where the host's global CSS would otherwise leak into and out of xaml-ui's tree). It is also intended to be used internally by xaml-ui's portal infrastructure so flyouts and dialogs are isolated by default.

## Motivation

xaml-ui's [theming redesign](THEMING_REDESIGN.md) gives a clean theming API and blocks hostile *inherited* properties via `all: initial` on `XamlRoot`. But selector-based host styles (tag selectors, class selectors, universal selectors, framework resets) still match xaml-ui elements when they live in the same document scope.

Shadow DOM is the only browser-level mechanism that provides true bi-directional selector isolation. By offering `*ShadowedElement` as a primitive in xaml-ui, any consumer of the library (Ridge today, others later) can opt content subtrees into shadow isolation with a single directive at the call site, without touching component definitions or stylesheet structure.

## Use cases

- A consumer like Ridge wraps its root view: `<MainView *ShadowedElement/>`. Everything inside renders inside a shadow root; host-app selectors can't reach in.
- xaml-ui's `FlyoutBase` (and `DialogBase`) wrap portaled content in `*ShadowedElement` internally, so every opened flyout is automatically isolated. Consumers get this for free without changing how they write `<Flyout>…</Flyout>`.
- A consumer that *doesn't* want isolation simply doesn't use the directive. Backwards compatible — opt-in.

## Design overview

The directive captures its template, creates a hidden host component dynamically, and renders the template inside that host's shadow root. On creation, the host copies the relevant Angular `<style>` tags from `document.head` into its own shadow root so emulated component styles work inside.

```
<MainView *ShadowedElement/>
     │
     ▼ (Angular desugars to)
<ng-template ShadowedElement>
  <MainView/>
</ng-template>
     │
     ▼ (directive runs)
<shadowed-host>
  #shadow-root (open)
    <style>/* replayed: xaml-ui globals + all emulated component styles */</style>
    <MainView>…</MainView>
  /shadow-root
</shadowed-host>
```

## Implementation

Three small artifacts: one directive, one host component, one filter function.

### `projects/xaml-ui/src/lib/shadowed/ShadowedElementDirective.ts`

```ts
import {
  ComponentRef, Directive, OnDestroy, OnInit, TemplateRef, ViewContainerRef,
} from '@angular/core';
import { ShadowedHostComponent } from './ShadowedHostComponent';

@Directive({
  selector: '[ShadowedElement]',
  standalone: true,
})
export class ShadowedElementDirective implements OnInit, OnDestroy {
  private hostRef?: ComponentRef<ShadowedHostComponent>;

  constructor(
    private template: TemplateRef<unknown>,
    private vcr: ViewContainerRef,
  ) {}

  ngOnInit() {
    this.hostRef = this.vcr.createComponent(ShadowedHostComponent);
    this.hostRef.setInput('content', this.template);
  }

  ngOnDestroy() {
    this.hostRef?.destroy();
  }
}
```

### `projects/xaml-ui/src/lib/shadowed/ShadowedHostComponent.ts`

```ts
import {
  AfterViewInit, ChangeDetectionStrategy, Component, ElementRef, Input,
  OnDestroy, TemplateRef, ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { adoptAngularStylesInto } from './style-replay';

@Component({
  selector: 'shadowed-host',
  template: `<ng-container *ngTemplateOutlet="content"/>`,
  encapsulation: ViewEncapsulation.ShadowDom,
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  imports: [CommonModule],
})
export class ShadowedHostComponent implements AfterViewInit, OnDestroy {
  @Input() content!: TemplateRef<unknown>;

  private observer?: MutationObserver;

  constructor(private elementRef: ElementRef<HTMLElement>) {}

  ngAfterViewInit() {
    const shadowRoot = this.elementRef.nativeElement.shadowRoot;
    if (!shadowRoot) return;
    this.observer = adoptAngularStylesInto(shadowRoot);
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }
}
```

### `projects/xaml-ui/src/lib/shadowed/style-replay.ts`

```ts
/**
 * Copy Angular-emitted styles into `shadowRoot`, and keep watching for new
 * ones (lazy-loaded components, etc.). Returns the MutationObserver so the
 * caller can disconnect it on teardown.
 *
 * Filter rule: a style is adopted if it contains either
 *   (a) an emulated/component attribute selector — `[_ngcontent-*]` or `[_nghost-*]`,
 *   (b) the xaml-ui global marker `xui-global-marker`,
 * which covers every Angular component style (xaml-ui, consumer libraries,
 * the host app's own components) plus xaml-ui's encapsulation:None globals.
 * Host-app global stylesheets (resets, framework globals, tag selectors)
 * carry none of these markers, so they are intentionally NOT copied — they
 * stay outside the shadow root and cannot leak in.
 */
export function adoptAngularStylesInto(shadowRoot: ShadowRoot): MutationObserver {
  // 1) Copy what's already in document.head.
  for (const style of Array.from(document.head.querySelectorAll('style'))) {
    if (shouldAdopt(style)) {
      shadowRoot.appendChild(style.cloneNode(true));
    }
  }

  // 2) Watch for newly added styles (lazy components, hot-reloaded chunks).
  const observer = new MutationObserver(records => {
    for (const r of records) {
      for (const node of Array.from(r.addedNodes)) {
        if (node instanceof HTMLStyleElement && shouldAdopt(node)) {
          shadowRoot.appendChild(node.cloneNode(true));
        }
      }
    }
  });
  observer.observe(document.head, { childList: true });
  return observer;
}

function shouldAdopt(style: HTMLStyleElement): boolean {
  const text = style.textContent ?? '';
  return text.includes('xui-global-marker')
      || /\[_ngcontent-|\[_nghost-/.test(text);
}
```

### `projects/xaml-ui/src/lib/shadowed/index.ts`

Barrel export so consumers can `import { ShadowedElementDirective } from 'xaml-ui'`.

```ts
export { ShadowedElementDirective } from './ShadowedElementDirective';
export { ShadowedHostComponent } from './ShadowedHostComponent';
```

### `projects/xaml-ui/src/public-api.ts`

Add the new exports so the directive is part of xaml-ui's public API.

## Filter design — why this set of rules

| Style category | Where it lives | Adopted into shadow root? | Why |
| --- | --- | --- | --- |
| xaml-ui's `XamlRoot.scss` (encapsulation: None) | `document.head`, contains `xui-global-marker` | **Yes** | Provides tokens + chrome that xaml-ui content needs |
| Any Angular component's emulated styles (xaml-ui, Ridge, host app's own components) | `document.head`, contains `[_ngcontent-…]` / `[_nghost-…]` | **Yes** | xaml-ui & consumer components need theirs to render; host-app component styles are inert inside the shadow because their encapsulation attributes don't exist on xaml-ui elements |
| Host app's global stylesheets (resets, normalize, framework globals, tag/class/universal selectors) | `document.head`, no Angular markers | **No** | These are the leakage threats we're isolating against |
| Inherited CSS properties on `html`/`body` from the host | (not a `<style>` tag adoption issue — handled by inheritance) | N/A | Blocked by `all: initial` in `XamlRoot` per the theming redesign |
| CSS custom properties (`--XamlUiOverride*`, theme values) | (not a `<style>` tag adoption issue) | N/A | Cross the shadow boundary via custom-property inheritance; this is the theming surface and is intentional |

The asymmetry between "Angular component styles get adopted" and "host-app globals get filtered out" is the heart of the design. Angular's component styles are self-scoping via the `[_ngcontent-…]` attribute pattern — copying them in is safe because they only match elements that have the corresponding attribute. Host globals use unscoped selectors (`button`, `*`, `.toolbar`) that *would* match xaml-ui elements if they reached the shadow root, so we keep them out.

## Integration with xaml-ui's portal infrastructure

`FlyoutBase` and `DialogBase` currently render portaled content via `TemplatePortal` into a CDK overlay. To make every portaled flyout/dialog automatically isolated, wrap the template content with `*ShadowedElement`.

### `projects/xaml-ui/src/lib/primitives/FlyoutBase.ts`

Change the `PopupTemplate` constant:

```ts
// Before
export const PopupTemplate = `<ng-template #template>
  <FlyoutPresenter #presenter [IsVisible]="isVisible" [TransitionAnimation]="transitionAnimation" [Padding]="Padding">
    <ng-content/>
  </FlyoutPresenter>
</ng-template>`;

// After
export const PopupTemplate = `<ng-template #template>
  <ng-container *ShadowedElement>
    <FlyoutPresenter #presenter [IsVisible]="isVisible" [TransitionAnimation]="transitionAnimation" [Padding]="Padding">
      <ng-content/>
    </FlyoutPresenter>
  </ng-container>
</ng-template>`;
```

The `<ng-content/>` continues to project the consumer's flyout body content. Content projection is resolved at template-creation time (when FlyoutBase is instantiated), so the consumer's `<Flyout>…body…</Flyout>` still works unchanged. The projected nodes land inside FlyoutPresenter, which now lives inside a shadow root created by `*ShadowedElement`.

Update FlyoutBase's `@Component.imports` (or wherever the template's directives are resolved) to include `ShadowedElementDirective`.

### `projects/xaml-ui/src/lib/primitives/DialogBase.ts` (or wherever ContentDialog's overlay is created)

Apply the same change — wrap the dialog-presenter template in `*ShadowedElement` so every dialog is isolated too.

### Positioning still works

CDK Overlay positions the overlay pane (the element with class `cdk-overlay-pane`). The shadow boundary lives one level deeper, inside the pane's content. Positioning logic is unaffected because it manipulates the pane's transform/position, not anything inside.

## Caveats and known limits

- **Performance of style replay**: cloning all qualifying `<style>` tags into each shadow root has a cost per shadow root created. For a long session opening many flyouts, this adds up. Once the directive is shipped and working, a follow-up optimization is to use `document.adoptedStyleSheets` + `shadowRoot.adoptedStyleSheets` to share the same `CSSStyleSheet` objects across all shadow roots instead of cloning. Angular 17+ uses constructable stylesheets internally; the optimization is straightforward but treated as future work in this design.
- **Form-element internals**: native form elements (`<input>`, `<button>`) still get their user-agent default styling regardless of shadow boundary. xaml-ui's per-component styles override what they need; nothing changes.
- **Devtools experience**: shadow roots are visible in DevTools and can be inspected normally — the design doesn't make Ridge content harder to debug.
- **SSR**: this directive runs DOM operations and is not SSR-safe as written. xaml-ui's audience doesn't currently use SSR (per the wider project context), but if SSR support is ever needed the host component's `ngAfterViewInit` should guard with `isPlatformBrowser`.
- **Inert host-app component styles**: if a Ridge/xaml-ui component is ever Angular-projected (via `<ng-content>`) into a host-app component, the projected element acquires the host's `_ngcontent` attribute. That would make the host's emulated component styles non-inert inside the shadow root after replay. In practice this doesn't happen for `<RidgeView>` (it's a leaf in the host's tree, not a projection target), but if a future consumer projects xaml-ui content from outside, the inert-claim weakens and the filter would need to be stricter.

## Verification

Once implemented:

1. **Smoke test the directive**: in a scratch consumer app, write `<button>Test</button>` inside `<MainView *ShadowedElement/>` (or any element with xaml-ui content). Inspect with DevTools and confirm a `<shadowed-host>` element exists with an open shadow root containing the content.
2. **Inbound isolation**: add `body { font-family: 'Comic Sans MS' }` and `button { background: red !important }` to the scratch app's global styles. Confirm xaml-ui content inside `*ShadowedElement` continues to render with xaml-ui's own font and button styling. (Outside the directive, host elements would be affected — that's expected.)
3. **Outbound isolation**: confirm xaml-ui's component styles inside the shadow root don't bleed out to the host. A scratch `<button>` outside `*ShadowedElement` should look like a normal browser button, not xaml-ui's styled button.
4. **Theming flows through**: set `:root { --XamlUiOverrideAccentFillColorDefault: red }` in the scratch app's global CSS. Confirm xaml-ui content *inside* `*ShadowedElement` picks up the override — the chain inside XamlRoot reads it via custom-property inheritance.
5. **Portal isolation**: open a flyout in the scratch app. Inspect the overlay pane in DevTools and confirm there's a `<shadowed-host>` with a shadow root containing the FlyoutPresenter and the flyout body. Then add a hostile global style targeting elements inside the flyout body and confirm the flyout content is unaffected.
6. **No replay regressions**: open a flyout that contains lazy-loaded content (a component whose styles weren't in `document.head` at app startup). Confirm the lazy styles get replayed into the shadow root via the MutationObserver and the lazy content looks correct.

## Files to add

- `projects/xaml-ui/src/lib/shadowed/ShadowedElementDirective.ts`
- `projects/xaml-ui/src/lib/shadowed/ShadowedHostComponent.ts`
- `projects/xaml-ui/src/lib/shadowed/style-replay.ts`
- `projects/xaml-ui/src/lib/shadowed/index.ts`

## Files to modify

- `projects/xaml-ui/src/public-api.ts` — export `ShadowedElementDirective` (and `ShadowedHostComponent` if it should be public).
- `projects/xaml-ui/src/lib/primitives/FlyoutBase.ts` — wrap `PopupTemplate` content in `*ShadowedElement`. Add `ShadowedElementDirective` to whatever imports list applies.
- `projects/xaml-ui/src/lib/primitives/DialogBase.ts` (or equivalent) — same wrap for dialog templates.
- `projects/xaml-ui/README.md` — document the new directive with usage examples.

## Dependencies

This design depends on the [theming redesign](THEMING_REDESIGN.md) having landed first, because:

- The `xui-global-marker` selector used by the style-replay filter is introduced by the theming redesign.
- The `XamlRoot { … }` global stylesheet (encapsulation: None) needs to exist for the filter to have something to find when copying xaml-ui's tokens into the shadow root.
- The `all: initial` reset and the `panelClass: 'xaml-overlay-pane'` scoping from the theming redesign are both relied on by this design for full defensive isolation.

Land the theming redesign first, then this directive.

## Out of scope

- Switching to `adoptedStyleSheets` for sharing `CSSStyleSheet` objects across shadow roots (performance optimization — follow-up PR).
- SSR support for the directive (no current consumer needs it).
- Configurable filters on the directive (e.g., `*ShadowedElement="'my-marker'"`). The default filter is sufficient for current consumers; configurability can be added if a real use case emerges.
- Replacing existing `XamlRoot` usage. `*ShadowedElement` is additive; it does not deprecate or change `<XamlRoot>`. The two compose: a consumer may have `<XamlRoot>` inside `<*ShadowedElement>` for isolation, or use either alone.
