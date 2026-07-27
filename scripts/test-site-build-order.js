const assert = require('assert');
const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const packageJson = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));
const command = packageJson.scripts['site:build'];
const brandIndex = command.indexOf('npm run brand:generate');
const distIndex = command.indexOf('npm run miniprogram:build');
const catalogIndex = command.indexOf('npm run catalog:generate');

assert(brandIndex >= 0, 'site:build must generate the standalone company mark');
assert(distIndex >= 0, 'site:build must build miniprogram_dist');
assert(catalogIndex >= 0, 'site:build must generate catalog artifacts');
assert(brandIndex < distIndex, 'site:build must generate the company mark before miniprogram_dist copies published assets');
assert(distIndex < catalogIndex, 'site:build must build miniprogram_dist before generating catalog artifacts that read public Props');

console.log('site:build ordering contract passed.');
