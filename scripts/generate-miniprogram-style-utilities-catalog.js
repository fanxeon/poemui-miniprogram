'use strict';

var fs = require('fs');
var path = require('path');
var previewSchema = require('./style-utilities-preview-schema');

var root = path.resolve(__dirname, '..');
var sourcePath = path.join(root, 'common/style/utilities.wxss');
var outputPath = path.join(root, 'miniprogram/common/data/style-utilities-catalog.js');
var h5OutputPath = path.join(root, 'preview/style-utilities-data.js');
var h5CssOutputPath = path.join(root, 'preview/style-utilities.css');
var source = fs.readFileSync(sourcePath, 'utf8');
var names = Array.from(new Set((source.match(/\.pui-[a-z0-9_-]+/g) || []).map(function (token) {
  return token.slice(1);
}))).sort();

var GROUPS = [
  { key: 'layout', label: '布局', description: 'Display、Flex、Grid、对齐、定位、溢出与展示', icon: 'grid' },
  { key: 'size', label: '尺寸', description: '宽高、最小最大尺寸与比例', icon: 'aspect-ratio' },
  { key: 'spacing', label: '间距', description: 'Margin、Padding、Gap 与安全区留白', icon: 'rows' },
  { key: 'typography', label: '字体', description: '文字角色、颜色、行高、空白与裁切', icon: 'text' },
  { key: 'background', label: '背景', description: '背景渐变、边框、圆角、阴影、透明度与深色表面', icon: 'palette' }
];

function groupFor(name) {
  if (/^pui-(?:grid|col-|row-|auto-cols|auto-rows|place-|block$|inline|flex|grow|shrink|basis-|items-|self-|justify-|content-|order-|box-)/.test(name)) return 'layout';
  if (/^pui-(?:static$|relative$|absolute$|fixed$|sticky$|inset|top-|right-|bottom-|left-|z-)/.test(name)) return 'layout';
  if (/^pui-(?:w-|h-|min-|max-|full-|aspect-)/.test(name)) return 'size';
  if (/^pui-(?:m(?:[trblxy]|$|-)|p(?:[trblxy]|$|-)|gap)/.test(name)) return 'spacing';
  if (/^pui-dark-text/.test(name)) return 'typography';
  if (/^pui-(?:text-|font-|leading-|tracking-|uppercase$|lowercase$|capitalize$|normal-case$|underline$|line-through$|no-underline$|italic$|not-italic$|whitespace|tabular-nums)/.test(name)) return 'typography';
  if (/^pui-(?:bg-|border|radius|shadow|opacity|dark-(?:bg|border|shadow)|theme--dark)/.test(name)) return 'background';
  return 'layout';
}

function descriptionFor(name, group) {
  var labels = {
    layout: '布局、尺寸或定位工具',
    size: '尺寸工具',
    spacing: '间距工具',
    typography: '字体或内容工具',
    background: '背景或表面工具'
  };
  return labels[group];
}

var items = names.map(function (name) {
  var group = groupFor(name);
  return Object.assign({
    name: name,
    group: group,
    description: descriptionFor(name, group),
    keywords: (name + ' ' + group + ' ' + (GROUPS.filter(function (item) { return item.key === group; })[0].label)).toLowerCase()
  }, previewSchema.previewMeta(name, group));
});

var payload = { groups: GROUPS, items: items };

function pxFromRpx(css) {
  return css.replace(/(-?\d+(?:\.\d+)?)rpx\b/g, function (_, raw) {
    var value = Number(raw) / 2;
    return String(Number.isInteger(value) ? value : Number(value.toFixed(4))) + 'px';
  });
}

function matchingBrace(css, openIndex) {
  var depth = 0;
  for (var index = openIndex; index < css.length; index += 1) {
    if (css[index] === '{') depth += 1;
    if (css[index] === '}') {
      depth -= 1;
      if (depth === 0) return index;
    }
  }
  throw new Error('Unbalanced utility stylesheet block at ' + openIndex);
}

function scopedUtilityCss(css) {
  var output = '';
  var cursor = 0;
  while (cursor < css.length) {
    var commentStart = css.indexOf('/*', cursor);
    var open = css.indexOf('{', cursor);
    if (commentStart !== -1 && (open === -1 || commentStart < open)) {
      output += css.slice(cursor, commentStart);
      var commentEnd = css.indexOf('*/', commentStart + 2);
      if (commentEnd === -1) throw new Error('Unclosed utility stylesheet comment');
      output += css.slice(commentStart, commentEnd + 2);
      cursor = commentEnd + 2;
      continue;
    }
    if (open === -1) {
      output += css.slice(cursor);
      break;
    }
    var prelude = css.slice(cursor, open);
    var close = matchingBrace(css, open);
    var body = css.slice(open + 1, close);
    if (/^\s*@media\b/.test(prelude)) {
      output += prelude + '{' + scopedUtilityCss(body) + '}';
    } else if (/^\s*@/.test(prelude)) {
      output += prelude + '{' + body + '}';
    } else {
      var leading = (prelude.match(/^\s*/) || [''])[0];
      var selectorText = prelude.trim();
      var selectors = selectorText.split(',').map(function (selector) {
        return '.utility-doc ' + selector.trim();
      }).join(',\n');
      output += leading + selectors + ' {' + body + '}';
    }
    cursor = close + 1;
  }
  return output;
}

var h5CssSource = source.replace(/^\s*@import\s+["'][^"']+["'];\s*/m, '');
var h5Css = pxFromRpx(scopedUtilityCss(h5CssSource));
fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, "'use strict';\n\n// Generated from common/style/utilities.wxss. Do not edit by hand.\nmodule.exports = " + JSON.stringify(payload, null, 2) + ";\n");
fs.writeFileSync(h5OutputPath, "'use strict';\n\n// Generated from common/style/utilities.wxss. Do not edit by hand.\nwindow.POEMUI_STYLE_UTILITIES = " + JSON.stringify(payload, null, 2) + ";\n");
fs.writeFileSync(h5CssOutputPath, "/* Generated from common/style/utilities.wxss. Do not edit by hand. Scoped to the H5 Style Utilities document. */\n" + h5Css.trim() + "\n");
process.stdout.write('Generated miniprogram and H5 Style Utilities catalog with ' + items.length + ' classes.\n');
