'use strict';

/*
 * The 31 entries are the PUI roots that the real miniprogram WXML currently
 * renders. Input is intentionally kept as a composed rule below: it is a
 * platform field inside Search/Combobox rather than an additional page root.
 * A value of false means that the global preference must not add that effect
 * to the component's root. A shadow value names the only eligible elevation.
 */
const appearanceContracts = Object.freeze({
  'action-sheet': { surface: 'edge-attached', shadow: 'edge-bottom', frostedGlass: true, largeRadius: true, bordered: true, equalSpacing: true, gradient: false },
  alert: { surface: 'inline-surface', shadow: 'none', frostedGlass: true, largeRadius: true, bordered: true, equalSpacing: false, gradient: false },
  'back-top': { surface: 'detached-surface', shadow: 'floating', frostedGlass: true, largeRadius: true, bordered: false, equalSpacing: false, gradient: false },
  badge: { surface: 'leaf', shadow: 'none', frostedGlass: false, largeRadius: true, bordered: false, equalSpacing: false, gradient: false },
  button: { surface: 'control-surface', shadow: 'card', frostedGlass: true, largeRadius: true, bordered: true, equalSpacing: false, gradient: false },
  cell: { surface: 'list-item', shadow: 'none', frostedGlass: false, largeRadius: true, bordered: true, equalSpacing: false, gradient: false },
  'cell-group': { surface: 'collection-root', shadow: 'none', frostedGlass: false, largeRadius: true, bordered: true, equalSpacing: true, gradient: false },
  collapsible: { surface: 'collection-root', shadow: 'none', frostedGlass: true, largeRadius: true, bordered: true, equalSpacing: true, gradient: false },
  combobox: { surface: 'anchored-surface', shadow: 'floating', frostedGlass: true, largeRadius: true, bordered: true, equalSpacing: true, gradient: false },
  'config-provider': { surface: 'provider', shadow: 'none', frostedGlass: false, largeRadius: false, bordered: false, equalSpacing: false, gradient: false },
  divider: { surface: 'hierarchy-mark', shadow: 'none', frostedGlass: false, largeRadius: false, bordered: false, equalSpacing: false, gradient: false },
  'dropdown-menu': { surface: 'anchored-surface', shadow: 'floating', frostedGlass: true, largeRadius: true, bordered: true, equalSpacing: true, gradient: false },
  empty: { surface: 'content-state', shadow: 'none', frostedGlass: false, largeRadius: true, bordered: false, equalSpacing: false, gradient: false },
  icon: { surface: 'leaf', shadow: 'none', frostedGlass: false, largeRadius: false, bordered: false, equalSpacing: false, gradient: false },
  image: { surface: 'media-leaf', shadow: 'none', frostedGlass: false, largeRadius: true, bordered: true, equalSpacing: false, gradient: false },
  loading: { surface: 'leaf', shadow: 'none', frostedGlass: false, largeRadius: false, bordered: false, equalSpacing: false, gradient: false },
  navbar: { surface: 'edge-attached', shadow: 'edge-top', frostedGlass: true, largeRadius: false, bordered: true, equalSpacing: false, gradient: false },
  'notice-bar': { surface: 'inline-surface', shadow: 'none', frostedGlass: true, largeRadius: true, bordered: true, equalSpacing: false, gradient: false },
  overlay: { surface: 'mask', shadow: 'none', frostedGlass: true, largeRadius: false, bordered: false, equalSpacing: false, gradient: false },
  popover: { surface: 'anchored-surface', shadow: 'floating', frostedGlass: true, largeRadius: true, bordered: true, equalSpacing: true, gradient: false },
  popup: { surface: 'detached-surface', shadow: 'directional', frostedGlass: true, largeRadius: true, bordered: true, equalSpacing: true, gradient: false },
  progress: { surface: 'content-state', shadow: 'none', frostedGlass: false, largeRadius: false, bordered: false, equalSpacing: false, gradient: false },
  result: { surface: 'content-state', shadow: 'none', frostedGlass: false, largeRadius: true, bordered: false, equalSpacing: false, gradient: false },
  'scroll-area': { surface: 'layout', shadow: 'none', frostedGlass: false, largeRadius: false, bordered: false, equalSpacing: false, gradient: false },
  search: { surface: 'composed-input', shadow: 'card', frostedGlass: true, largeRadius: true, bordered: true, equalSpacing: false, gradient: false },
  sheet: { surface: 'edge-attached', shadow: 'edge-bottom', frostedGlass: true, largeRadius: true, bordered: true, equalSpacing: true, gradient: false },
  skeleton: { surface: 'content-state', shadow: 'none', frostedGlass: false, largeRadius: true, bordered: false, equalSpacing: false, gradient: false },
  switch: { surface: 'control-surface', shadow: 'none', frostedGlass: false, largeRadius: true, bordered: false, equalSpacing: false, gradient: false },
  tabbar: { surface: 'edge-attached', shadow: 'edge-bottom', frostedGlass: true, largeRadius: true, bordered: true, equalSpacing: false, gradient: false },
  tabs: { surface: 'navigation-control', shadow: 'none', frostedGlass: false, largeRadius: true, bordered: true, equalSpacing: false, gradient: false },
  tag: { surface: 'leaf', shadow: 'none', frostedGlass: true, largeRadius: true, bordered: true, equalSpacing: false, gradient: false },
  toast: { surface: 'detached-surface', shadow: 'floating', frostedGlass: true, largeRadius: true, bordered: true, equalSpacing: false, gradient: false },
});

const composedAppearanceContracts = Object.freeze({
  input: {
    consumedBy: ['search', 'combobox'],
    surface: 'field-surface',
    shadow: 'card',
    frostedGlass: true,
    largeRadius: true,
    bordered: true,
    equalSpacing: false,
    gradient: false,
  },
});

const directionalShadowTokens = Object.freeze([
  'none',
  'floating',
  'edge-top',
  'edge-bottom',
  'edge-left',
  'edge-right',
  'directional',
  'card',
]);

module.exports = {
  appearanceContracts,
  composedAppearanceContracts,
  directionalShadowTokens,
};
