'use strict';

function stripPrefix(name) {
  return String(name || '').replace(/^pui-/, '');
}

function finalize(meta) {
  if (!meta.previewScaffoldTarget) meta.previewScaffoldTarget = meta.previewTarget;
  meta.previewScaffold = (meta.previewScaffold || []).filter(function (value, index, source) {
    return source.indexOf(value) === index;
  });
  return meta;
}

function previewMeta(name, group) {
  var value = stripPrefix(name);
  var themedValue = value.replace(/^dark-/, '');
  var meta = {
    previewKind: 'layout',
    previewTarget: 'layout',
    previewSafety: 'bounded',
    previewTheme: /^dark-/.test(value) ? 'dark' : 'current',
    previewScaffold: []
  };

  if (group === 'size') {
    meta.previewTarget = 'measure';
    if (/^(?:full-width|w-)/.test(value)) {
      meta.previewKind = 'width';
      meta.previewScaffold = ['pui-h-half'];
    } else if (/^min-w-/.test(value)) {
      meta.previewKind = 'min-width';
      meta.previewScaffold = ['pui-w-0', 'pui-h-half'];
    } else if (/^max-w-/.test(value)) {
      meta.previewKind = 'max-width';
      meta.previewScaffold = ['pui-w-screen', 'pui-h-half'];
    } else if (/^(?:full-height|h-)/.test(value)) {
      meta.previewKind = 'height';
      meta.previewScaffold = ['pui-w-half'];
    } else if (/^min-h-/.test(value)) {
      meta.previewKind = 'min-height';
      meta.previewScaffold = ['pui-h-0', 'pui-w-half'];
    } else if (/^max-h-/.test(value)) {
      meta.previewKind = 'max-height';
      meta.previewScaffold = ['pui-h-screen', 'pui-w-half'];
    } else if (/^aspect-/.test(value)) {
      meta.previewKind = 'aspect';
      meta.previewScaffold = ['pui-w-half'];
    }
    if (/-screen$/.test(value)) meta.previewSafety = 'viewport-clipped';
    else if (/-0$/.test(value)) meta.previewSafety = 'trace';
    return finalize(meta);
  }

  if (group === 'spacing') {
    if (/^m(?:[trblxy])?(?:-|$)/.test(value)) {
      meta.previewKind = 'margin-' + ((value.match(/^m([trblxy])?(?:-|$)/) || ['', 'all'])[1] || 'all');
      meta.previewTarget = 'outer';
    } else if (/^p(?:[trblxy])?(?:-|$)/.test(value)) {
      meta.previewKind = 'padding-' + ((value.match(/^p([trblxy])?(?:-|$)/) || ['', 'all'])[1] || 'all');
      meta.previewTarget = 'surface';
    } else if (/^gap(?:-([xy]))?(?:-|$)/.test(value)) {
      meta.previewKind = 'gap-' + ((value.match(/^gap(?:-([xy]))?(?:-|$)/) || ['', 'all'])[1] || 'all');
      meta.previewTarget = 'items';
    }
    if (/-safe$/.test(value)) meta.previewSafety = 'safe-area';
    return finalize(meta);
  }

  if (group === 'typography') {
    meta.previewTarget = 'text';
    if (/^text-(?:cut|truncate|clamp|break)/.test(themedValue)) meta.previewKind = 'text-overflow';
    else if (/^text-(?:display|headline|title-|body-|label$|caption$)/.test(themedValue)) meta.previewKind = 'text-size';
    else if (/^font-(?:sans|mono)$/.test(themedValue)) meta.previewKind = 'font-family';
    else if (/^font-/.test(themedValue)) meta.previewKind = 'font-weight';
    else if (/^text-(?:left|center|right|start|end)$/.test(themedValue)) meta.previewKind = 'text-align';
    else if (/^text-/.test(themedValue)) meta.previewKind = meta.previewTheme === 'dark' ? 'dark-text-color' : 'text-color';
    else if (/^leading-/.test(themedValue)) meta.previewKind = 'line-height';
    else if (/^tracking-/.test(themedValue)) meta.previewKind = 'letter-spacing';
    else if (/^(?:uppercase|lowercase|capitalize|normal-case)$/.test(themedValue)) meta.previewKind = 'text-transform';
    else if (/^(?:underline|line-through|no-underline)$/.test(themedValue)) meta.previewKind = 'text-decoration';
    else if (/^(?:italic|not-italic)$/.test(themedValue)) meta.previewKind = 'font-style';
    else if (/^whitespace-/.test(themedValue)) meta.previewKind = 'whitespace';
    else if (/^tabular-nums$/.test(themedValue)) meta.previewKind = 'numeric';
    meta.previewScaffold = /^text-(?:display|headline|title-|body-|label$|caption$)/.test(themedValue) ? [] : ['pui-text-body-md'];
    if (/^(?:text-transparent|text-cut|text-truncate|text-clamp)/.test(themedValue)) meta.previewSafety = 'trace';
    return finalize(meta);
  }

  if (group === 'background') {
    meta.previewTarget = 'surface';
    if (value === 'theme--dark') {
      meta.previewKind = 'theme-scope';
      meta.previewTheme = 'dark';
      meta.previewScaffold = ['pui-bg-muted', 'pui-radius-sm'];
    } else if (/^bg-/.test(themedValue)) meta.previewKind = meta.previewTheme === 'dark' ? 'dark-background' : 'background';
    else if (/^border-(?:0|x|y|t|r|b|l)$/.test(themedValue) || themedValue === 'border') meta.previewKind = 'border-width';
    else if (/^border-(?:solid|dashed|dotted)$/.test(themedValue)) meta.previewKind = 'border-style';
    else if (/^border-/.test(themedValue)) meta.previewKind = meta.previewTheme === 'dark' ? 'dark-border-color' : 'border-color';
    else if (/^radius-/.test(themedValue)) meta.previewKind = 'radius';
    else if (/^shadow-/.test(themedValue)) meta.previewKind = meta.previewTheme === 'dark' ? 'dark-shadow' : 'shadow';
    else if (/^opacity-/.test(themedValue)) meta.previewKind = 'opacity';

    if (!/^(?:bg-|dark-bg-)/.test(value)) meta.previewScaffold.push('pui-bg-muted');
    if (/^border-(?:solid|dashed|dotted|brand|success|warning|danger|info|red|orange|amber|emerald|teal|blue|violet|pink|transparent)$/.test(themedValue)) meta.previewScaffold.push('pui-border');
    if (!/^radius-/.test(themedValue)) meta.previewScaffold.push('pui-radius-sm');
    if (/^(?:opacity-0|border-transparent|shadow-none)$/.test(themedValue)) meta.previewSafety = 'trace';
    return finalize(meta);
  }

  if (/^object-/.test(value)) {
    meta.previewKind = 'object';
    meta.previewTarget = 'media';
  } else if (/^(?:col-|row-|order-|self-|flex-(?:1|auto|initial|none)|grow|shrink|basis-)/.test(value)) {
    meta.previewKind = /^(?:col-|row-)/.test(value) ? 'grid-item' : 'flex-item';
    meta.previewTarget = 'item';
    meta.previewScaffold = /^col-|^row-/.test(value) ? ['pui-grid-layout', 'pui-grid-cols-3'] : ['pui-flex'];
    meta.previewScaffoldTarget = 'layout';
  } else if (/^(?:absolute|fixed|sticky|static|relative)$/.test(value) || /^(?:inset|top-|right-|bottom-|left-|z-)/.test(value)) {
    meta.previewKind = 'position';
    meta.previewTarget = 'item';
    meta.previewSafety = /^(?:fixed|sticky)$/.test(value) ? 'position-contained' : 'bounded';
    if (/^(?:inset|top-|right-|bottom-|left-|z-)/.test(value)) {
      meta.previewScaffold = ['pui-absolute'];
      meta.previewScaffoldTarget = 'item';
    } else {
      meta.previewScaffold = ['pui-relative'];
      meta.previewScaffoldTarget = 'layout';
    }
  } else if (/^overflow-/.test(value)) {
    meta.previewKind = 'overflow';
    meta.previewTarget = 'layout';
    meta.previewSafety = 'trace';
  } else if (/^(?:hidden|visible|invisible|sr-only)$/.test(value)) {
    meta.previewKind = 'visibility';
    meta.previewTarget = 'target';
    meta.previewSafety = 'trace';
  } else if (/^(?:pointer-events|select-)/.test(value)) {
    meta.previewKind = 'interaction';
    meta.previewTarget = 'target';
    meta.previewSafety = 'state';
  } else if (/^(?:transition|duration-)/.test(value)) {
    meta.previewKind = 'motion';
    meta.previewTarget = 'target';
    meta.previewSafety = 'state';
  } else if (/^(?:grid-cols|grid-rows|grid-flow|auto-cols|auto-rows|place-)/.test(value)) {
    meta.previewKind = 'grid';
    meta.previewTarget = 'layout';
    meta.previewScaffold = ['pui-grid-layout'];
  } else if (/^(?:justify|items|content)-/.test(value)) {
    meta.previewKind = 'alignment';
    meta.previewTarget = 'layout';
    meta.previewScaffold = ['pui-flex'];
  } else if (/^(?:flex-row|flex-col|flex-wrap|flex-nowrap|flex-wrap-reverse)/.test(value)) {
    meta.previewKind = 'flex';
    meta.previewTarget = 'layout';
    meta.previewScaffold = ['pui-flex'];
  } else if (/^(?:block|inline|inline-block|flex$|inline-flex|grid-layout)$/.test(value)) {
    meta.previewKind = 'display';
    meta.previewTarget = 'layout';
  } else if (/^(?:box-border|box-content)$/.test(value)) {
    meta.previewKind = 'box-sizing';
    meta.previewTarget = 'target';
  }

  if (/-safe$/.test(value)) meta.previewSafety = 'safe-area';
  return finalize(meta);
}

module.exports = {
  previewMeta: previewMeta
};
