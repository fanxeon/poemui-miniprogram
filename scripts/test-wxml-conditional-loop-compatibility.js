'use strict';

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const ignoredDirectories = new Set([
  '.git',
  'node_modules',
  'miniprogram_dist',
  'miniprogram_npm',
  'dist',
]);

function collectWxml(directory, files = []) {
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && ignoredDirectories.has(entry.name)) continue;
    const absolute = path.join(directory, entry.name);
    if (entry.isDirectory()) collectWxml(absolute, files);
    if (entry.isFile() && entry.name.endsWith('.wxml')) files.push(absolute);
  }
  return files;
}

const invalid = [];
for (const file of collectWxml(root)) {
  const source = fs.readFileSync(file, 'utf8');
  const tags = source.match(/<[^!/?][^>]*>/g) || [];
  tags.forEach((tag) => {
    if (/\bwx:else\b/.test(tag) && /\bwx:for(?:-items)?\b/.test(tag)) {
      invalid.push(`${path.relative(root, file)}: ${tag.replace(/\s+/g, ' ').trim()}`);
    }
  });
}

assert.strictEqual(
  invalid.length,
  0,
  `WeChat WXML compiler rejects wx:else and wx:for on the same node:\n${invalid.join('\n')}`,
);

console.log('WXML conditional-loop compatibility tests passed.');
