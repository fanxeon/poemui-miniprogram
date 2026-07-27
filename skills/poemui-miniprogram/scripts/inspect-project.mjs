#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const PACKAGE_NAME = 'poemui-miniprogram';
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

function findProjectRoot(start) {
  const candidates = [
    start,
    path.join(start, 'miniprogram'),
  ];
  for (const candidate of candidates) {
    if (exists(path.join(candidate, 'project.config.json'))) return candidate;
  }
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
  if (exists(path.join(projectRoot, 'miniprogram', 'app.json'))) {
    return path.join(projectRoot, 'miniprogram');
  }
  return projectRoot;
}

function findPackageRoot(projectRoot, miniRoot) {
  const candidates = [
    path.join(projectRoot, 'node_modules', PACKAGE_NAME),
    path.join(miniRoot, 'node_modules', PACKAGE_NAME),
    inputRoot,
  ];
  return candidates.find((candidate) => {
    const packageJson = readJson(path.join(candidate, 'package.json'));
    return packageJson?.name === PACKAGE_NAME;
  }) || null;
}

function allPages(appJson) {
  const pages = Array.isArray(appJson?.pages) ? [...appJson.pages] : [];
  for (const group of appJson?.subpackages || appJson?.subPackages || []) {
    const root = typeof group?.root === 'string' ? group.root.replace(/\/+$/, '') : '';
    for (const page of group?.pages || []) pages.push(root ? `${root}/${page}` : page);
  }
  return [...new Set(pages)];
}

function pageComponentRefs(miniRoot, appJson) {
  const refs = [];
  for (const page of allPages(appJson)) {
    const jsonFile = path.join(miniRoot, `${page}.json`);
    const pageJson = readJson(jsonFile);
    for (const [alias, value] of Object.entries(pageJson?.usingComponents || {})) {
      if (typeof value !== 'string' || !value.includes(PACKAGE_NAME)) continue;
      refs.push({ page, alias, path: value });
    }
  }
  return refs;
}

function copiedSourceDirectories(miniRoot) {
  const sourceNames = ['button', 'cell', 'icon', 'loading', 'empty', 'popup', 'toast'];
  const roots = [
    path.join(miniRoot, 'components'),
    path.join(miniRoot, 'poemui'),
    path.join(miniRoot, 'pui'),
  ];
  const matches = [];
  for (const root of roots) {
    for (const name of sourceNames) {
      const candidate = path.join(root, name);
      if (exists(path.join(candidate, `${name}.wxml`)) || exists(path.join(candidate, 'index.wxml'))) {
        matches.push(path.relative(projectRoot, candidate));
      }
    }
  }
  return matches;
}

const projectRoot = findProjectRoot(inputRoot);
const projectConfigFile = path.join(projectRoot, 'project.config.json');
const projectConfig = readJson(projectConfigFile);
const miniRoot = resolveMiniRoot(projectRoot, projectConfig);
const appJsonFile = path.join(miniRoot, 'app.json');
const appJson = readJson(appJsonFile);
const packageRoot = findPackageRoot(projectRoot, miniRoot);
const packageJson = packageRoot ? readJson(path.join(packageRoot, 'package.json')) : null;
const refs = appJson ? pageComponentRefs(miniRoot, appJson) : [];
const npmBuildCandidates = [
  path.join(miniRoot, 'miniprogram_npm', PACKAGE_NAME),
  path.join(projectRoot, 'miniprogram_npm', PACKAGE_NAME),
];
const npmBuildRoot = npmBuildCandidates.find(exists) || null;
const copiedSources = copiedSourceDirectories(miniRoot);

const warnings = [];
if (!projectConfig) warnings.push('未找到或无法解析 project.config.json。');
if (!appJson) warnings.push('未找到或无法解析小程序 app.json。');
if (!packageRoot) warnings.push('未找到 poemui-miniprogram 安装包或当前源码包。');
if (packageRoot && !npmBuildRoot) warnings.push('已找到 npm 包，但未找到 miniprogram_npm 构建产物。');
if (copiedSources.length) warnings.push('发现可能与 npm 包并行的手写 PUI 源码，请人工确认是否为重复实现。');

const report = {
  projectRoot,
  projectConfig: projectConfig ? projectConfigFile : null,
  miniprogramRoot: miniRoot,
  appJson: appJson ? appJsonFile : null,
  pageCount: appJson ? allPages(appJson).length : 0,
  package: packageJson ? {
    root: packageRoot,
    name: packageJson.name,
    version: packageJson.version,
    miniprogram: packageJson.miniprogram || null,
  } : null,
  puiPageReferences: refs,
  miniprogramNpmRoot: npmBuildRoot,
  possibleCopiedSources: copiedSources,
  warnings,
};

console.log(JSON.stringify(report, null, 2));
process.exitCode = appJson && packageRoot ? 0 : 2;
