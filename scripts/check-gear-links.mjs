import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const SRC_DIR = path.join(ROOT, "src");
const APP_DIR = path.join(SRC_DIR, "app");
const CONTENT_KITS = path.join(SRC_DIR, "lib", "content", "kits.ts");

function walk(dir, files = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === ".next" || entry.name === "node_modules") continue;
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(fullPath, files);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function routePathFromFile(filePath) {
  const relative = path.relative(APP_DIR, filePath).replace(/\\/g, "/");
  if (!/(^|\/)(page|route)\.tsx?$/.test(relative)) return null;
  const routePath = relative.replace(/(^|\/)(page|route)\.tsx?$/, "");
  return routePath ? `/${routePath}` : "/";
}

function extractPresetSlugs() {
  const content = fs.readFileSync(CONTENT_KITS, "utf8");
  const slugs = [...content.matchAll(/slug:\s*"([^"]+)"/g)].map((match) => match[1]);
  return new Set(slugs);
}

const routeFiles = walk(APP_DIR).filter((file) => /\/(page|route)\.tsx?$/.test(file));
const routes = new Set(routeFiles.map(routePathFromFile).filter(Boolean));
const presetSlugs = extractPresetSlugs();
const codeFiles = walk(SRC_DIR).filter((file) => /\.(ts|tsx|js|jsx)$/.test(file));
const issues = [];
const hrefPatterns = [
  /(?:href|redirect)\s*(?:=|\()\s*"(\/[^"]*)"/g,
  /(?:href|redirect)\s*(?:=|\()\s*'(\/[^']*)'/g,
  /(?:href|redirect)\s*(?:=|\()\s*`(\/[^`$]*)`/g,
];

for (const filePath of codeFiles) {
  const content = fs.readFileSync(filePath, "utf8");
  for (const pattern of hrefPatterns) {
    const matches = content.matchAll(pattern);

    for (const match of matches) {
      const ref = match[1];
      if (!ref || !ref.startsWith("/")) continue;
      if (ref.startsWith("/api/")) continue;

      if (ref.startsWith("/gear/kits#")) {
        issues.push(`${path.relative(ROOT, filePath)}: fragment-based /gear/kits link is not allowed (${ref})`);
        continue;
      }

      const [pathname, queryString] = ref.split("?");
      if (!routes.has(pathname)) {
        issues.push(`${path.relative(ROOT, filePath)}: missing internal route (${ref})`);
        continue;
      }

      if (pathname === "/gear/kits" && queryString) {
        const params = new URLSearchParams(queryString);
        const preset = params.get("preset");
        if (preset && !presetSlugs.has(preset)) {
          issues.push(`${path.relative(ROOT, filePath)}: unknown gear preset "${preset}"`);
        }
      }
    }
  }
}

if (issues.length > 0) {
  console.error("Gear link audit failed:");
  for (const issue of issues) {
    console.error(`- ${issue}`);
  }
  process.exit(1);
}

console.log(`Gear link audit passed for ${codeFiles.length} files and ${routes.size} routes.`);
