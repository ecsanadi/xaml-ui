# xaml-ui — Theming and Global Style Redesign

## Goal

Replace the current consumer-imported `XamlGlobals.css` with global styles automatically shipped through the `XamlRoot` component using `encapsulation: ViewEncapsulation.None`. Establish a clear theming API via `--XamlUiOverride*` variables.

## Why

Today consumers must remember to `@use 'xaml-ui/styles/XamlGlobals.css'` in their own global stylesheet. If they forget, components render without tokens. Theming is done by overriding token names directly at `:root`, which works today but offers no clear "this is the public API" surface and depends on the consumer-import contract.

After this change:
- No consumer CSS import required. Tokens and overlay infrastructure arrive automatically the moment a `<XamlRoot>` is instantiated.
- The override-API is explicit and prefixed (`--XamlUiOverride*`), so consumers see a clear surface.
- Tokens are scoped to elements inside a `<XamlRoot>` — they don't pollute the host app's variable namespace.
- Custom-property inheritance still lets overrides from `:root` propagate in (because the consumer sets the `--XamlUiOverride*` slot at `:root` and the chain inside XamlRoot reads it).

## The pattern

Single block on the `XamlRoot` element selector. It does three things: cuts the inheritance chain so hostile host-app styles can't leak in, re-establishes xaml-ui's chrome, and declares each token via a chain that reads an override slot first, falling back to a hardcoded default.

```scss
// Marker selector — fingerprints this stylesheet for the *ShadowedElement
// directive's style-replay (see SHADOWED_ELEMENT.md). The selector matches
// no real element; its only job is to be findable in the style's text content.
xui-global-marker { display: none }

XamlRoot {
  // Block hostile inheritance from the host app.
  // `all: initial` resets every inherited property to its spec-initial value,
  // cutting the cascade chain at this element. Custom properties (--*) are
  // exempt from `all`, so theming via --XamlUiOverride* still flows through.
  // `direction` and `unicode-bidi` are also exempt, preserving RTL behavior.
  all: initial;

  // Re-establish chrome (these declarations win over `all: initial` via source order).
  display: grid;
  overflow: hidden;
  user-select: none;
  touch-action: none;
  box-sizing: border-box;

  // Re-establish inherited properties we care about, sourced from our own tokens
  // rather than the host's cascade.
  font-family: var(--SystemFontFamily);
  font-size: var(--SystemFontSize);
  color: var(--TextFillColorPrimary);

  // token defaults — dark mode
  --AcrylicBlur:                       var(--XamlUiOverrideAcrylicBlur,                       blur(12px));
  --ControlBorderThickness:            var(--XamlUiOverrideControlBorderThickness,            1px);
  --ControlCornerRadius:               var(--XamlUiOverrideControlCornerRadius,               4px);
  --OverlayCornerRadius:               var(--XamlUiOverrideOverlayCornerRadius,               8px);

  --SystemFontSize:                    var(--XamlUiOverrideSystemFontSize,                    10pt);
  --SystemFontFamily:                  var(--XamlUiOverrideSystemFontFamily,                  'Segoe UI', Arial, sans-serif);
  --SymbolFontFamily:                  var(--XamlUiOverrideSymbolFontFamily,                  'Segoe Fluent Icons', 'Segoe MDL2 Assets');

  --SystemAccentColor:                 var(--XamlUiOverrideSystemAccentColor,                 #0078d4);
  --SmokeFillColorDefault:             var(--XamlUiOverrideSmokeFillColorDefault,             #0000004D);

  --ControlNormalAnimationDuration:    var(--XamlUiOverrideControlNormalAnimationDuration,    0.25s);
  --ControlFastAnimationDuration:      var(--XamlUiOverrideControlFastAnimationDuration,      0.167s);
  --ControlFasterAnimationDuration:    var(--XamlUiOverrideControlFasterAnimationDuration,    0.083s);

  // …continue for every variable currently in XamlGlobals.css :root block
  // dark-mode values from the current top-level :root section

  @media (prefers-color-scheme: light) {
    // re-declare the values that differ in light mode, using the same chain pattern
    --ControlFillColorDefault:         var(--XamlUiOverrideControlFillColorDefault,           #FFFFFFB3);
    --TextFillColorPrimary:            var(--XamlUiOverrideTextFillColorPrimary,              #000000E4);
    // …etc.
  }
}

// Overlay infrastructure — global, outside the XamlRoot scope by design
// (CDK Overlay creates these elements at <body> level).
// Scoped via `.xaml-overlay-pane` so we only affect xaml-ui's own overlays,
// not other CDK Overlay usage in the host app. See "CDK overlay pane scoping" below.
.xaml-flyout-overlay-backdrop {
  background: transparent;
}

.xaml-dialog-overlay-backdrop {
  background: var(--SmokeFillColorDefault);
}

.cdk-overlay-pane.xaml-overlay-pane {
  display: grid !important;
}
```

Component code stays the same as today — components read tokens by their short names (`var(--TextFillColorPrimary)`) and inherit through the DOM tree from the nearest `<XamlRoot>` ancestor.

## Inheritance-blocking with `all: initial`

The `all: initial` declaration at the top of the `XamlRoot { … }` block is intentional and central to the defensive design. Without it, hostile host-app styles like `body { font-family: 'Comic Sans MS' }` or `html { line-height: 4 }` would inherit through into xaml-ui content via standard CSS inheritance — even when the consumer wraps Ridge in a shadow root, because inherited properties cross shadow boundaries.

What `all: initial` does here:
- Resets every CSS property on the `XamlRoot` element to its spec-defined initial value.
- **Exempts CSS custom properties** (the spec carves these out of `all`). Theming via `--XamlUiOverride*` continues to work — those values still flow in from `:root` through inheritance and the token chain resolves them inside XamlRoot.
- **Exempts `direction` and `unicode-bidi`** (also spec-carved). RTL languages keep working without xaml-ui having to think about it.

Why source order matters: every declaration after `all: initial` in the same rule wins via cascade source-order. So `display: grid`, the explicit inherited-property re-declarations (`font-family`, `font-size`, `color`), and the token chains all take effect.

What is *not* re-established (and what to do about it): inherited properties xaml-ui doesn't care about (e.g., `text-align`, `letter-spacing`, `white-space`, `list-style-*`) end up at their spec-initial values rather than inheriting from the host. That's almost always preferable to inheriting hostile values — but if some component relies on inheriting `text-align` or similar from its parent, that component must declare the property explicitly in its own stylesheet.

Form elements (`<input>`, `<button>`, `<textarea>`, `<select>`) have their own user-agent stylesheets and won't be affected by XamlRoot's reset — their styling continues to come from xaml-ui's per-component `styleUrls` (TextBox, Button, etc.).

## CDK overlay pane scoping

xaml-ui creates CDK overlays for flyouts and dialogs. CDK applies the class `.cdk-overlay-pane` to every overlay pane in the document, including ones the host app might create for its own purposes. If xaml-ui's global rule `.cdk-overlay-pane { display: grid !important }` is unconditional, it changes the layout of every CDK overlay in the host app — an outbound leak we want to avoid.

Fix: have xaml-ui mark its own panes with an additional class via CDK Overlay's `panelClass` option, then scope the global rule to the combined selector.

### `projects/xaml-ui/src/lib/primitives/FlyoutBase.ts`

In `showOverlay()`, add `panelClass: 'xaml-overlay-pane'` to the `OverlayConfig`:

```ts
let config = new OverlayConfig({
  hasBackdrop: this.HasBackdrop,
  panelClass: 'xaml-overlay-pane',                    // ← add this
  scrollStrategy: this._overlay.scrollStrategies.reposition(),
  backdropClass: 'xaml-flyout-overlay-backdrop'
});
```

### Dialogs

Apply the same `panelClass: 'xaml-overlay-pane'` wherever xaml-ui creates dialog overlays (e.g., in `DialogBase` or whichever class handles `ContentDialog`'s overlay creation). Audit all xaml-ui call sites to `new OverlayConfig({ ... })` or `overlay.create({ ... })` and add the panel class.

### Global stylesheet

In `XamlRoot.scss`, change `.cdk-overlay-pane { display: grid !important }` to `.cdk-overlay-pane.xaml-overlay-pane { display: grid !important }`. Host-app overlays now keep CDK's default pane styling; xaml-ui's overlays continue to get the grid layout they need.

Same hardening should be applied to any other rule in `XamlRoot.scss` that targets a shared CDK class unconditionally — if you find such a rule during the implementation, narrow it the same way.

## Files to change

### `projects/xaml-ui/src/lib/XamlRoot.ts`
Add `encapsulation: ViewEncapsulation.None` to the `@Component` decorator. Import `ViewEncapsulation` from `@angular/core`.

### `projects/xaml-ui/src/lib/XamlRoot.scss`
Replace the entire current content with the structure shown above:
1. `xui-global-marker { display: none }` — fingerprint selector for the `*ShadowedElement` directive's style-replay.
2. `XamlRoot { … }` block containing `all: initial` first, then the chrome rules + every token from `XamlGlobals.css`'s `:root` block, each wrapped in the `--XamlUiOverride*` chain pattern.
3. `@media (prefers-color-scheme: light) { … }` block inside `XamlRoot { … }` for the light-mode token values (sourced from the current `@media` block in `XamlGlobals.css`).
4. The three overlay infrastructure rules (`.xaml-flyout-overlay-backdrop`, `.xaml-dialog-overlay-backdrop`, `.cdk-overlay-pane.xaml-overlay-pane`) at the top level — these stay global because the elements they target (CDK overlay containers) live at `<body>` level outside any XamlRoot. The pane rule is scoped by the additional `.xaml-overlay-pane` class so it only affects xaml-ui's own overlays.

Drop the current `&, &::ng-deep :host { font-family … }` piercing trick. With `font-family: var(--SystemFontFamily)` declared on XamlRoot itself, `font-family` cascades to all descendants via normal CSS inheritance — no piercing needed.

### `projects/xaml-ui/src/lib/primitives/FlyoutBase.ts` (and DialogBase or equivalent)
Add `panelClass: 'xaml-overlay-pane'` to every `OverlayConfig` constructed by xaml-ui's portal code. See "CDK overlay pane scoping" above for details.

### `projects/xaml-ui/styles/XamlGlobals.css`
Delete this file.

### `projects/xaml-ui/ng-package.json`
- Remove `"styleIncludePaths": ["styles"]` from the `lib` section.
- Remove `"styles"` from the `assets` array. If `assets` becomes `["assets"]` only and the `assets` directory is empty or unused, it can be removed entirely.

### Shared `:host` chrome — `XamlRoot.scss` is currently used as a base styleUrl

Today `Button.ts`, `FlyoutPresenter.ts`, `DialogPresenter.ts`, and `ContentDialog.ts` all declare `styleUrls: ['../XamlRoot.scss', 'Self.scss']` to reuse `XamlRoot.scss`'s `:host { display: grid; … }` rules. After this redesign that no longer works — `XamlRoot.scss` becomes `encapsulation: None` content keyed to the `XamlRoot` element selector, not `:host`.

Fix: extract the shared chrome into a SCSS partial mixin.

Create `projects/xaml-ui/src/lib/_xui-host-base.scss`:

```scss
@mixin xui-host-base {
  display: grid;
  overflow: hidden;
  user-select: none;
  touch-action: none;
  font-family: var(--SystemFontFamily);
  font-size: var(--SystemFontSize);
  color: var(--TextFillColorPrimary);
}
```

Update each affected component's .scss to use it:

```scss
@use '../xui-host-base' as b;

:host {
  @include b.xui-host-base;
  // …plus the component's own specific rules
}
```

Then remove `'../XamlRoot.scss'` from those components' `styleUrls` arrays in their .ts files. They keep only their own component stylesheet.

Affected files:
- `projects/xaml-ui/src/lib/basic-input/Button.ts` + `Button.scss`
- `projects/xaml-ui/src/lib/primitives/FlyoutPresenter.ts` + `FlyoutPresenter.scss`
- `projects/xaml-ui/src/lib/primitives/DialogPresenter.ts` + `DialogPresenter.scss`
- `projects/xaml-ui/src/lib/dialogs-and-flyouts/ContentDialog.ts` (only the `styleUrls` array — verify it actually references `XamlRoot.scss`)

### `projects/xaml-ui/README.md` (or wherever docs live)

Add a Theming section documenting:
- The library auto-loads its styles when `<XamlRoot>` is first used; no CSS import required.
- To theme, declare `--XamlUiOverride*` variables at `:root` (or any ancestor of the `<XamlRoot>`).
- List the available override variables and what they control.

Example:
```css
:root {
  --XamlUiOverrideAccentFillColorDefault: #608ff4;
  --XamlUiOverrideSystemFontFamily: 'Red Hat Text', sans-serif;
  --XamlUiOverrideControlFillColorDefault: #131516;
}
```

## Constraints / things to keep working

- All existing public component selectors keep working. This is a styling change, not an API change.
- The three overlay-infrastructure rules must remain at global selector level. CDK Overlay attaches its container to `document.body`, outside any XamlRoot subtree; if these rules were scoped under `XamlRoot`, overlay backdrops and panes would lose styling.
- Light-mode token values must continue to work. The `@media (prefers-color-scheme: light)` block goes inside the `XamlRoot { … }` selector so the chain re-resolves under each media context.
- Existing consumer apps (Ridge, etc.) that already work with the current `XamlGlobals.css` import will break by definition (the file is gone). This is intended — consumers update to the new model. Note in the PR description that consumers should remove their `@use 'xaml-ui/…/XamlGlobals.css'` import and rename any direct token overrides to the `--XamlUiOverride*` form.

## Verification

Before marking complete:

1. Build `xaml-ui` via ng-packagr — no build errors, no warnings about missing styleIncludePaths.
2. In a scratch consumer app, import a Button or any xaml-ui component, wrap it in `<XamlRoot>`, and confirm it renders with the default xaml-ui look without importing any CSS file from xaml-ui.
3. In the same scratch app, declare `:root { --XamlUiOverrideAccentFillColorDefault: red }` and confirm accent-using elements pick up the red.
4. Add a hostile inherited style to the scratch app: `body { font-family: 'Comic Sans MS', cursive }`. Confirm xaml-ui content inside `<XamlRoot>` continues to use the configured `--SystemFontFamily`, not Comic Sans. This validates the `all: initial` reset.
5. Toggle OS dark/light mode and confirm the components switch themes.
6. Open a flyout and confirm its backdrop, presenter chrome, and animations still work (this verifies the overlay-infrastructure rules and the per-component chrome extraction).
7. Inspect a flyout's overlay element in DevTools and confirm it has both `cdk-overlay-pane` AND `xaml-overlay-pane` classes. Then add a non-xaml-ui CDK overlay in the scratch app and confirm it does *not* receive the `display: grid` override.
8. Verify `dist/xaml-ui/` no longer contains a `styles/` directory.
9. View one of the compiled `<style>` tags in DevTools and confirm the `xui-global-marker { display: none }` rule survived the build pipeline (it's the fingerprint that `*ShadowedElement` relies on).

## Out of scope for this PR

- Shadow DOM isolation for embedding xaml-ui in a foreign host. Handled separately in the downstream Ridge work.
- Renaming or restructuring the internal token names themselves (`--TextFillColorPrimary`, etc.). Keep them as they are today; only the override slot is new.
- Migrating Ridge or other consumers. They should be updated in their own PRs after this lands.
