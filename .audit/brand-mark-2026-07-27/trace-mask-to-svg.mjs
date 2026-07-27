import fs from 'node:fs';

const [, , inputPath, outputPath] = process.argv;
if (!inputPath || !outputPath) {
  throw new Error('Usage: node trace-mask-to-svg.mjs <mask.pbm> <output.svg>');
}

const tokens = fs
  .readFileSync(inputPath, 'utf8')
  .replace(/#[^\n]*/g, '')
  .trim()
  .split(/\s+/);

if (tokens.shift() !== 'P1') {
  throw new Error('Only plain PBM P1 masks are supported.');
}

const width = Number(tokens.shift());
const height = Number(tokens.shift());
const pixels = tokens.slice(0, width * height).map(Number);
if (pixels.length !== width * height) {
  throw new Error(`Expected ${width * height} pixels, received ${pixels.length}.`);
}

// PBM stores black as 1. The prepared mask uses white for the logo silhouette.
const filled = (x, y) => x >= 0
  && y >= 0
  && x < width
  && y < height
  && pixels[y * width + x] === 0;

const edgeMap = new Map();
const edgeKey = (a, b) => `${a[0]},${a[1]}>${b[0]},${b[1]}`;
const pointKey = (point) => `${point[0]},${point[1]}`;

function addEdge(a, b) {
  const key = edgeKey(a, b);
  const start = pointKey(a);
  const edge = { a, b, key };
  if (!edgeMap.has(start)) edgeMap.set(start, []);
  edgeMap.get(start).push(edge);
}

for (let y = 0; y < height; y += 1) {
  for (let x = 0; x < width; x += 1) {
    if (!filled(x, y)) continue;
    if (!filled(x, y - 1)) addEdge([x, y], [x + 1, y]);
    if (!filled(x + 1, y)) addEdge([x + 1, y], [x + 1, y + 1]);
    if (!filled(x, y + 1)) addEdge([x + 1, y + 1], [x, y + 1]);
    if (!filled(x - 1, y)) addEdge([x, y + 1], [x, y]);
  }
}

const unused = new Set(
  Array.from(edgeMap.values()).flat().map((edge) => edge.key),
);

function nextEdge(point) {
  return (edgeMap.get(pointKey(point)) || []).find((edge) => unused.has(edge.key));
}

const loops = [];
while (unused.size) {
  const firstKey = unused.values().next().value;
  const first = Array.from(edgeMap.values())
    .flat()
    .find((edge) => edge.key === firstKey);
  const points = [first.a];
  let edge = first;
  let guard = 0;
  while (edge && guard < width * height * 8) {
    unused.delete(edge.key);
    points.push(edge.b);
    if (pointKey(edge.b) === pointKey(first.a)) break;
    edge = nextEdge(edge.b);
    guard += 1;
  }
  if (points.length > 3 && pointKey(points.at(-1)) === pointKey(points[0])) {
    loops.push(points.slice(0, -1));
  }
}

function signedArea(points) {
  let area = 0;
  for (let index = 0; index < points.length; index += 1) {
    const current = points[index];
    const next = points[(index + 1) % points.length];
    area += current[0] * next[1] - next[0] * current[1];
  }
  return area / 2;
}

function perpendicularDistance(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (dx === 0 && dy === 0) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  return Math.abs(
    dy * point[0] - dx * point[1] + end[0] * start[1] - end[1] * start[0],
  ) / Math.hypot(dx, dy);
}

function rdp(points, epsilon) {
  if (points.length <= 2) return points;
  let maxDistance = 0;
  let splitIndex = 0;
  for (let index = 1; index < points.length - 1; index += 1) {
    const distance = perpendicularDistance(points[index], points[0], points.at(-1));
    if (distance > maxDistance) {
      maxDistance = distance;
      splitIndex = index;
    }
  }
  if (maxDistance <= epsilon) return [points[0], points.at(-1)];
  return [
    ...rdp(points.slice(0, splitIndex + 1), epsilon).slice(0, -1),
    ...rdp(points.slice(splitIndex), epsilon),
  ];
}

function simplifyClosed(points, epsilon) {
  let farthestIndex = 1;
  let farthestDistance = 0;
  for (let index = 1; index < points.length; index += 1) {
    const distance = Math.hypot(
      points[index][0] - points[0][0],
      points[index][1] - points[0][1],
    );
    if (distance > farthestDistance) {
      farthestDistance = distance;
      farthestIndex = index;
    }
  }
  const firstArc = rdp(points.slice(0, farthestIndex + 1), epsilon);
  const secondArc = rdp(
    [...points.slice(farthestIndex), points[0]],
    epsilon,
  );
  return [...firstArc.slice(0, -1), ...secondArc.slice(0, -1)];
}

const kept = loops
  .map((points) => ({ points, area: signedArea(points) }))
  .filter(({ area }) => Math.abs(area) >= 18)
  .sort((a, b) => Math.abs(b.area) - Math.abs(a.area));

const allPoints = kept.flatMap(({ points }) => points);
const minX = Math.min(...allPoints.map(([x]) => x));
const maxX = Math.max(...allPoints.map(([x]) => x));
const minY = Math.min(...allPoints.map(([, y]) => y));
const maxY = Math.max(...allPoints.map(([, y]) => y));
const sourceWidth = maxX - minX;
const sourceHeight = maxY - minY;
const scale = Math.min(20 / sourceWidth, 20 / sourceHeight);
const offsetX = (24 - sourceWidth * scale) / 2 - minX * scale;
const offsetY = (24 - sourceHeight * scale) / 2 - minY * scale;
const format = (value) => Number(value.toFixed(2));
const mapPoint = ([x, y]) => [
  format(x * scale + offsetX),
  format(y * scale + offsetY),
];

const paths = kept.map(({ points, area }) => {
  const simplified = simplifyClosed(points, 1.35).map(mapPoint);
  const commands = simplified.map(([x, y], index) => (
    `${index ? 'L' : 'M'}${x} ${y}`
  )).join(' ');
  return {
    area: format(area * scale * scale),
    points: simplified.length,
    d: `${commands}Z`,
  };
});

const pathData = paths.map(({ d }) => d).join(' ');
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none">
  <path fill="currentColor" fill-rule="nonzero" d="${pathData}"/>
</svg>
`;

fs.writeFileSync(outputPath, svg, 'utf8');
console.log(JSON.stringify({
  source: { width, height, minX, minY, maxX, maxY },
  loops: loops.length,
  keptLoops: paths.length,
  pathPoints: paths.reduce((sum, path) => sum + path.points, 0),
  paths: paths.map(({ area, points }) => ({ area, points })),
  pathData,
}, null, 2));
