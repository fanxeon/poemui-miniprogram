#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const PACKAGE_NAME = 'poemui-miniprogram';
const MIN_VERSION = [0, 1, 0];
const inputRoot = path.resolve(process.argv[2] || process.cwd());

function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (error) {
    return null;
  }
}

function exists(file) {
  return fs.existsSync(file);
}

function parseVersion(version) {
  const match = String(version || '').match(/^(\d+)\.(\d+)\.(\d+)/);
  return match ? match.slice(1).map(Number) : null;
}

function versionAtLeast(version, minimum) {
  const parsed = parseVersion(version);
  if (!parsed) return false;
  for (let index = 0; index < minimum.length; index += 1) {
    if (parsed[index] > minimum[index]) return true;
    if (parsed[index] < minimum[index]) return false;
  }
  return true;
}

function findProjectRoot(start) {
  const direct = [start, path.join(start, 'miniprogram')];
  const matched = direct.find((candidate) => exists(path.join(candidate, 'project.config.json')));
  if (matched) return matched;
  let cursor = start;
  while (cursor !== path.dirname(cursor)) {
    if (exists(path.join(cursor, 'project.config.json'))) return cursor;
    cursor = path.dirname(cursor);
  }
  return start;
}

function resolveMiniRoot(projectRoot, projectConfig) {
  const configured = typeof projectConfig?.miniprogramRoot === 'string'
    ? projectConfig.miniprogramRoot.trim()
    : '';
  if (configured) return path.resolve(projectRoot, configured);
  if (exists(path.join(projectRoot, 'app.json'))) return projectRoot;
  if (exists(path.join(projectRoot, 'miniprogram', 'app.json'))) return path.join(projectRoot, 'miniprogram');
  return projectRoot;
}

function findPackageRoot(projectRoot, miniRoot) {
  const candidates = [
    path.join(projectRoot, 'node_modules', PACKAGE_NAME),
    path.join(miniRoot, 'node_modules', PACKAGE_NAME),
    inputRoot,
  ];
  return candidates.find((candidate) => readJson(path.join(candidate, 'package.json'))?.name === PACKAGE_NAME) || null;
}

function allPages(appJson) {
  const pages = Array.isArray(appJson?.pages) ? [...appJson.pages] : [];
  for (const group of appJson?.subpackages || appJson?.subPackages || []) {
    const root = typeof group?.root === 'string' ? group.root.replace(/\/+$/, '') : '';
    for (const page of group?.pages || []) pages.push(root ? `${root}/${page}` : page);
  }
  return [...new Set(pages)];
}

const projectRoot = findProjectRoot(inputRoot);
const projectConfig = readJson(path.join(projectRoot, 'project.config.json'));
const miniRoot = resolveMiniRoot(projectRoot, projectConfig);
const appJson = readJson(path.join(miniRoot, 'app.json'));
const packageRoot = findPackageRoot(projectRoot, miniRoot);
const packageJson = packageRoot ? readJson(path.join(packageRoot, 'package.json')) : null;
const distRoot = packageRoot
  ? path.join(packageRoot, packageJson?.miniprogram || 'miniprogram_dist')
  : null;

const checks = [];
function check(name, passed, detail) {
  checks.push({ name, passed: Boolean(passed), detail });
}

check('微信小程序 app.json', appJson, path.join(miniRoot, 'app.json'));
check('PoemUI 包', packageJson?.name === PACKAGE_NAME, packageRoot || '未找到');
check('版本不低于 0.1.0', packageJson && versionAtLeast(packageJson.version, MIN_VERSION), packageJson?.version || '未知');
check('公开入口', distRoot && exists(path.join(distRoot, 'index.js')), distRoot ? path.join(distRoot, 'index.js') : '未找到');
check('Theme', distRoot && exists(path.join(distRoot, 'theme', 'theme.wxss')), 'theme/theme.wxss');
check('Style Utilities', distRoot && exists(path.join(distRoot, 'theme', 'utilities.wxss')), 'theme/utilities.wxss');

for (const component of ['button', 'cell', 'icon', 'loading', 'empty', 'popup', 'toast']) {
  check(
    `组件 ${component}`,
    distRoot
      && exists(path.join(distRoot, component, `${component}.js`))
      && exists(path.join(distRoot, component, `${component}.json`))
      && exists(path.join(distRoot, component, `${component}.wxml`))
      && exists(path.join(distRoot, component, `${component}.wxss`)),
    `${component}/{js,json,wxml,wxss}`,
  );
}

const invalidReferences = [];
if (appJson && distRoot) {
  for (const page of allPages(appJson)) {
    const pageJson = readJson(path.join(miniRoot, `${page}.json`));
    for (const [alias, value] of Object.entries(pageJson?.usingComponents || {})) {
      if (typeof value !== 'string' || !value.startsWith(`${PACKAGE_NAME}/`)) continue;
      const relative = value.slice(PACKAGE_NAME.length + 1);
      const candidates = [
        path.join(distRoot, `${relative}.js`),
        path.join(distRoot, relative),
      ];
      if (!candidates.some(exists)) invalidReferences.push({ page, alias, path: value });
    }
  }
}
check('页面 usingComponents 路径', invalidReferences.length === 0, invalidReferences.length ? invalidReferences : '已引用路径可解析');

const builtRoot = [
  path.join(miniRoot, 'miniprogram_npm', PACKAGE_NAME),
  path.join(projectRoot, 'miniprogram_npm', PACKAGE_NAME),
].find(exists);
check('微信 build-npm 产物', builtRoot, builtRoot || '未找到；需要在开发者工具构建 npm');

const failed = checks.filter((item) => !item.passed);
console.log(JSON.stringify({
  projectRoot,
  miniprogramRoot: miniRoot,
  packageRoot,
  version: packageJson?.version || null,
  checks,
  ok: failed.length === 0,
}, null, 2));

if (failed.length) {
  console.error(`PoemUI 安装验证失败：${failed.map((item) => item.name).join('、')}`);
  process.exitCode = 1;
}
