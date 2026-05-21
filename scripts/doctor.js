#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = process.cwd();
const pkgPath = path.join(root, 'package.json');
const lockPath = path.join(root, 'package-lock.json');

function fail(message) {
  console.error(`❌ ${message}`);
  process.exitCode = 1;
}

function ok(message) {
  console.log(`✅ ${message}`);
}

if (!fs.existsSync(pkgPath)) {
  fail('package.json não encontrado.');
  process.exit();
}

const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
const deps = { ...(pkg.dependencies || {}), ...(pkg.devDependencies || {}) };

if (!fs.existsSync(lockPath)) {
  fail('package-lock.json não encontrado. Rode npm install para gerar o lockfile.');
  process.exit();
}

const lock = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
const locked = lock.packages?.[''] || {};
const lockedDeps = { ...(locked.dependencies || {}), ...(locked.devDependencies || {}) };

let hasError = false;
for (const [name, range] of Object.entries(deps)) {
  if (!lockedDeps[name]) {
    hasError = true;
    fail(`Dependência ausente no lockfile: ${name}@${range}`);
  }
}

if (!hasError) {
  ok('Dependências do package.json estão refletidas no package-lock.json.');
}

const requiredFiles = ['App.js', 'src/navigation/AppNavigator.js'];
for (const relPath of requiredFiles) {
  const fullPath = path.join(root, relPath);
  if (fs.existsSync(fullPath)) {
    ok(`Arquivo crítico encontrado: ${relPath}`);
  } else {
    hasError = true;
    fail(`Arquivo crítico ausente: ${relPath}`);
  }
}

if (!hasError) {
  ok('Checagem local concluída sem erros.');
}
