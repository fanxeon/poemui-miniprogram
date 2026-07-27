const assert = require('assert');
const fs = require('fs');
const path = require('path');

const {
  createIconBody,
  outlineStroke,
  shapeToPath,
  shouldPreserveCircleHole,
  splitSubpaths,
} = require('./generate-icons.js');

const root = path.resolve(__dirname, '..');
const manifest = JSON.parse(fs.readFileSync(path.join(root, 'assets/icons-src/manifest.json'), 'utf8'));

function parseAttributes(source) {
  return Object.fromEntries(
    [...String(source || '').matchAll(/([:\w-]+)="([^"]*)"/g)]
      .map((match) => [match[1], match[2]]),
  );
}

function parseTransform(body) {
  const source = String(body).match(/transform="([^"]+)"/)?.[1] || '';
  const scaleMatch = source.match(/scale\(\s*([.\d-]+)/);
  const translateMatch = source.match(/translate\(\s*([.\d-]+)(?:[\s,]+([.\d-]+))?/);
  return {
    scale: scaleMatch ? Number(scaleMatch[1]) : 1,
    translateX: translateMatch ? Number(translateMatch[1]) : 0,
    translateY: translateMatch ? Number(translateMatch[2] || 0) : 0,
  };
}

function sampledArea(pathData, SVGPathCommander) {
  const pathObject = new SVGPathCommander(pathData);
  const length = pathObject.getTotalLength();
  const sampleCount = Math.max(24, Math.min(256, Math.ceil(length / 8)));
  const first = pathObject.getPointAtLength(0);
  let previous = first;
  let area = 0;
  for (let index = 1; index <= sampleCount; index += 1) {
    const point = pathObject.getPointAtLength(length * index / sampleCount);
    area += previous.x * point.y - point.x * previous.y;
    previous = point;
  }
  area += previous.x * first.y - first.x * previous.y;
  return area / 2;
}

function drawableContourAreas(pathData, SVGPathCommander) {
  return splitSubpaths(pathData, SVGPathCommander)
    .filter((subpath) => SVGPathCommander.normalizePath(subpath).some((segment) => segment[0] !== 'M'))
    .map((subpath) => sampledArea(subpath, SVGPathCommander))
    .filter((area) => Math.abs(area) > 1);
}

async function main() {
  const commanderModule = await import('svg-path-commander');
  const SVGPathCommander = commanderModule.default;
  const hollowCircles = [];
  const solidDots = [];

  for (const item of manifest.icons) {
    const body = createIconBody(item.name);
    const groupMatch = body.match(/<g\s+([^>]*)>/);
    const groupAttributes = parseAttributes(groupMatch ? groupMatch[1] : '');
    const transform = parseTransform(body);
    const circlePattern = /<circle\s+([^>]*?)\/>/g;
    let match;
    while ((match = circlePattern.exec(body))) {
      const attributes = { ...groupAttributes, ...parseAttributes(match[1]) };
      if ((attributes.stroke || 'none') === 'none') continue;
      const strokeWidth = Number(attributes['stroke-width'] || 2.15);
      const preserveHole = shouldPreserveCircleHole('circle', attributes, strokeWidth);
      const outline = outlineStroke(
        shapeToPath('circle', attributes),
        strokeWidth,
        transform,
        SVGPathCommander,
        preserveHole,
      );
      const areas = drawableContourAreas(outline, SVGPathCommander);
      const windingDirections = new Set(areas.map((area) => Math.sign(area)));
      if (preserveHole) {
        assert(
          areas.length >= 2 && windingDirections.size >= 2,
          `${item.name} circle r=${attributes.r} lost its hollow center in the Icon Font outline`,
        );
        hollowCircles.push(`${item.name}:${attributes.r}`);
      } else {
        assert.strictEqual(
          windingDirections.size,
          1,
          `${item.name} semantic dot r=${attributes.r} must remain solid instead of gaining a pinhole`,
        );
        solidDots.push(`${item.name}:${attributes.r}`);
      }
    }
  }

  assert.strictEqual(hollowCircles.length, 59, 'current 218-icon catalog must preserve all 59 closed circle holes');
  assert.strictEqual(solidDots.length, 25, 'current 218-icon catalog must retain 25 intentional semantic dots');
  for (const representative of ['user:5', 'icon:3', 'orbit:3', 'orbit:2']) {
    assert(hollowCircles.includes(representative), `${representative} must be covered by the hollow-circle audit`);
  }
  for (const representative of ['more-horizontal:1', 'radio:1', 'popover:1']) {
    assert(solidDots.includes(representative), `${representative} must remain an intentional solid dot`);
  }

  process.stdout.write(`Icon Font outline topology passed: ${hollowCircles.length} hollow circles and ${solidDots.length} semantic dots.\n`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
