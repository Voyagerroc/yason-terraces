import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

console.log('--- YASON TERRACES INTEGRITY & SECURITY SUITE ---');

// 1. Verify index.html exists and is accessible
const indexPath = path.join(rootDir, 'index.html');
if (!fs.existsSync(indexPath)) {
  console.error('FAIL: index.html not found at root!');
  process.exit(1);
}
const html = fs.readFileSync(indexPath, 'utf-8');
console.log(`PASS: index.html found (${(html.length / 1024 / 1024).toFixed(2)} MB)`);

// 2. Stale branding scan: ASTERA / astera MUST NOT appear anywhere in index.html
const asteraMatches = html.match(/astera/gi);
if (asteraMatches && asteraMatches.length > 0) {
  console.error(`FAIL: Found ${asteraMatches.length} prohibited stale 'astera' references in index.html!`);
  process.exit(1);
}
console.log('PASS: Zero prohibited stale branding references found in index.html');

// 3. Confirm presence of active YASON TERRACES branding
if (!html.includes('YASON TERRACES')) {
  console.error('FAIL: YASON TERRACES branding missing from index.html!');
  process.exit(1);
}
console.log('PASS: YASON TERRACES brand name confirmed in index.html');

// 4. Validate manifest script JSON
const mTag = '<script type="__bundler/manifest">';
const mStart = html.indexOf(mTag);
if (mStart === -1) {
  console.error('FAIL: __bundler/manifest script tag missing!');
  process.exit(1);
}
const mEnd = html.indexOf('</script>', mStart);
const manifestRaw = html.substring(mStart + mTag.length, mEnd).trim();
try {
  const manifest = JSON.parse(manifestRaw);
  const keys = Object.keys(manifest);
  if (keys.length === 0) throw new Error('Manifest is empty');
  // Check that the logo asset exists and is non-empty
  const logoId = 'ed1a2874-85b0-43df-89aa-1ae36da2839a';
  if (!manifest[logoId] || !manifest[logoId].data || manifest[logoId].data.length < 1000) {
    throw new Error(`Logo asset ${logoId} is invalid or missing data`);
  }
  console.log(`PASS: Manifest is valid JSON with ${keys.length} assets (logo asset verified)`);
} catch (err) {
  console.error('FAIL: Error parsing manifest JSON:', err.message);
  process.exit(1);
}

// 5. Validate template script JSON
const tTag = '<script type="__bundler/template">';
const tStart = html.indexOf(tTag);
if (tStart === -1) {
  console.error('FAIL: __bundler/template script tag missing!');
  process.exit(1);
}
const tEnd = html.indexOf('</script>', tStart);
const templateRaw = html.substring(tStart + tTag.length, tEnd).trim();
try {
  const templateStr = JSON.parse(templateRaw);
  if (typeof templateStr !== 'string' || templateStr.length < 5000) {
    throw new Error('Template text is unexpectedly short or invalid');
  }
  if (!templateStr.includes('YASON TERRACES')) {
    throw new Error('Template string does not contain YASON TERRACES');
  }
  console.log(`PASS: Template is valid JSON (${(templateStr.length / 1024).toFixed(1)} KB unpacked template string)`);
} catch (err) {
  console.error('FAIL: Error parsing template JSON:', err.message);
  process.exit(1);
}

// 6. Validate Nginx Security Configuration
const nginxPath = path.join(rootDir, 'nginx.conf.template');
if (!fs.existsSync(nginxPath)) {
  console.error('FAIL: nginx.conf.template missing!');
  process.exit(1);
}
const nginxConf = fs.readFileSync(nginxPath, 'utf-8');
const requiredSecurityDirectives = [
  'server_tokens off',
  'X-Content-Type-Options "nosniff"',
  'X-Frame-Options "SAMEORIGIN"',
  'Referrer-Policy "strict-origin-when-cross-origin"',
  'Permissions-Policy',
  'Content-Security-Policy',
  'Strict-Transport-Security',
  'Cross-Origin-Opener-Policy',
  'Cross-Origin-Resource-Policy',
  'location ~ /\\.'
];

for (const directive of requiredSecurityDirectives) {
  if (!nginxConf.includes(directive)) {
    console.error(`FAIL: Nginx security directive missing: ${directive}`);
    process.exit(1);
  }
}
console.log('PASS: Nginx configuration verified with all required security headers & hardening rules');

// 7. Validate Dockerfile
const dockerPath = path.join(rootDir, 'Dockerfile');
if (!fs.existsSync(dockerPath)) {
  console.error('FAIL: Dockerfile missing!');
  process.exit(1);
}
const dockerfile = fs.readFileSync(dockerPath, 'utf-8');
if (!dockerfile.includes('FROM nginx:1.27-alpine') || !dockerfile.includes('HEALTHCHECK')) {
  console.error('FAIL: Dockerfile missing pinned base image (nginx:1.27-alpine) or HEALTHCHECK directive');
  process.exit(1);
}
console.log('PASS: Dockerfile verified with HEALTHCHECK and pinned Nginx 1.27 Alpine base');

// 8. Validate banner.svg branding
const bannerPath = path.join(rootDir, '.github', 'assets', 'banner.svg');
if (fs.existsSync(bannerPath)) {
  const bannerSvg = fs.readFileSync(bannerPath, 'utf-8');
  if (bannerSvg.includes('ASTERA')) {
    console.error('FAIL: Stale ASTERA branding still present in banner.svg!');
    process.exit(1);
  }
  if (!bannerSvg.includes('YASON TERRACES')) {
    console.error('FAIL: YASON TERRACES branding missing from banner.svg!');
    process.exit(1);
  }
  console.log('PASS: banner.svg verified with YASON TERRACES branding');
}

// 9. Validate LICENSE attribution
const licensePath = path.join(rootDir, 'LICENSE');
if (!fs.existsSync(licensePath)) {
  console.error('FAIL: LICENSE missing!');
  process.exit(1);
}
const license = fs.readFileSync(licensePath, 'utf-8');
if (!license.includes('Voyagerroc')) {
  console.error('FAIL: LICENSE missing Voyagerroc attribution!');
  process.exit(1);
}
console.log('PASS: LICENSE verified with Voyagerroc copyright attribution');

console.log('==================================================');
console.log('ALL INTEGRITY & SECURITY CHECKS PASSED (100% GREEN)');
console.log('==================================================');
