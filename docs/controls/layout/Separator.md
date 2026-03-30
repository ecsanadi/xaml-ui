# Separator

> Source: [Separator.ts](../../../projects/xaml-ui/src/lib/layout/Separator.ts)

A thin divider line used to visually separate content. Extends [FrameworkElement](../FrameworkElement.md).

## Own Properties

None. Separator is a simple rounded component that fills its container.

## Inherited Properties

- From [FrameworkElement](../FrameworkElement.md): `Width`, `Height`, `Margin`, `Padding`, etc.

## Examples

```html
<StackPanel Orientation="Horizontal" Spacing="6px">
  <TextBlock Text="Left" />
  <Separator />
  <TextBlock Text="Center" />
  <!-- Specifying width -->
  <Separator Width="4px" />
  <TextBlock Text="Right" />
</StackPanel>
```
