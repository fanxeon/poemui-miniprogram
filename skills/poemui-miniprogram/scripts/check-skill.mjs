#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

const skillRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const skillFile = path.join(skillRoot, 'SKILL.md');
const agentFile = path.join(skillRoot, 'agents', 'openai.yaml');
const qualityGatesFile = path.join(skillRoot, 'references', 'quality-gates.md');
const requiredSkillMarkers = [
  '消费工程',
  '组件库本体',
  'UI battle',
  'visualConfig',
  'miniprogram_npm',
  'wx:else',
  'feedback:list',
  '未验证',
];
const requiredGateMarkers = [
  'API 准入',
  '默认态质量',
  '组件职责与状态资格',
  '单一 Surface',
  '删除闭环',
  '证据必须与结论匹配',
];

function read(file) {
  if (!fs.existsSync(file)) throw new Error(`缺少文件：${file}`);
  return fs.readFileSync(file, 'utf8');
}

function ensure(condition, message) {
  if (!condition) throw new Error(message);
}

try {
  const skill = read(skillFile);
  const agent = read(agentFile);
  const qualityGates = read(qualityGatesFile);
  const frontmatter = skill.match(/^---\n([\s\S]*?)\n---\n/);
  ensure(frontmatter, 'SKILL.md 缺少 YAML frontmatter');
  ensure(/^name:\s*poemui-miniprogram$/m.test(frontmatter[1]), 'Skill name 必须为 poemui-miniprogram');
  ensure(/^description:\s*\S/m.test(frontmatter[1]), 'Skill description 不能为空');
  ensure(skill.split('\n').length <= 500, 'SKILL.md 超过 500 行，应继续拆分 references');
  for (const marker of requiredSkillMarkers) {
    ensure(skill.includes(marker) || fs.readdirSync(path.join(skillRoot, 'references')).some((file) => read(path.join(skillRoot, 'references', file)).includes(marker)), `缺少治理入口：${marker}`);
  }
  ensure(skill.includes('references/quality-gates.md'), 'SKILL.md 必须直接引用质量准入门禁');
  for (const marker of requiredGateMarkers) {
    ensure(qualityGates.includes(marker), `质量准入门禁缺少：${marker}`);
  }
  const references = [...skill.matchAll(/\]\((references\/[^)#]+\.md)\)/g)].map((match) => match[1]);
  for (const reference of references) {
    ensure(fs.existsSync(path.join(skillRoot, reference)), `缺少引用资料：${reference}`);
  }
  ensure(agent.includes('display_name:'), 'agents/openai.yaml 缺少 display_name');
  ensure(agent.includes('short_description:'), 'agents/openai.yaml 缺少 short_description');
  ensure(agent.includes('$poemui-miniprogram'), 'agents/openai.yaml 的 default_prompt 必须显式调用本 Skill');
  console.log(JSON.stringify({
    skillRoot,
    skillLines: skill.split('\n').length,
    references: [...new Set(references)],
    skillMarkers: requiredSkillMarkers,
    gateMarkers: requiredGateMarkers,
    status: 'ok',
  }, null, 2));
} catch (error) {
  console.error(`PoemUI Skill 校验失败：${error.message}`);
  process.exitCode = 1;
}
