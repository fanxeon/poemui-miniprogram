const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const exampleRoot = path.join(root, '_example');
const cacheDir = path.join(exampleRoot, '.poemui-cache');
const packageJson = require(path.join(root, 'package.json'));
const installedPackage = path.join(exampleRoot, 'node_modules', packageJson.name);
const wechatInstalledPackage = path.join(exampleRoot, 'miniprogram', 'miniprogram_npm', packageJson.name);

fs.mkdirSync(cacheDir, { recursive: true });

const packed = JSON.parse(execFileSync('npm', [
  'pack',
  '--json',
  '--pack-destination',
  cacheDir,
], { cwd: root, encoding: 'utf8' }));

const tarball = path.join(cacheDir, packed[0].filename);
fs.rmSync(installedPackage, { recursive: true, force: true });
// WeChat build-npm overwrites package files but does not prune component
// directories removed by a newer package version. Clean only this generated
// package root so the rebuilt miniprogram_npm mirrors the installed tarball.
fs.rmSync(wechatInstalledPackage, { recursive: true, force: true });

execFileSync('npm', [
  'install',
  '--ignore-scripts',
  '--no-save',
  '--prefix',
  exampleRoot,
  tarball,
], { stdio: 'inherit' });

console.log(`Installed ${packageJson.name}@${packageJson.version} tarball into _example for WeChat npm build.`);
