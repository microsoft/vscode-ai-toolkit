import { readFile, writeFile } from "node:fs/promises";

const [, , caskPath, targetVersion, armSha, intelSha] = process.argv;

if (!caskPath || !targetVersion || !armSha || !intelSha) {
  throw new Error(
    "Usage: update_devpack_cask.mjs <cask-path> <version> <arm-sha256> <intel-sha256>",
  );
}

const versionPattern = /^  version "([0-9]+\.[0-9]+\.[0-9]+)"$/m;
const armPattern = /^  sha256 arm:   "[0-9a-fA-F]{64}",$/m;
const intelPattern = /^         intel: "[0-9a-fA-F]{64}"$/m;

if (!/^[0-9]+\.[0-9]+\.[0-9]+$/.test(targetVersion)) {
  throw new Error(`Invalid stable version: ${targetVersion}`);
}
for (const [name, value] of [
  ["ARM64", armSha],
  ["Intel", intelSha],
]) {
  if (!/^[0-9a-fA-F]{64}$/.test(value)) {
    throw new Error(`Invalid ${name} SHA-256: ${value}`);
  }
}

const original = await readFile(caskPath, "utf8");
const versionMatch = original.match(versionPattern);
if (!versionMatch) {
  throw new Error("Could not find one stable cask version");
}

const parseVersion = (value) => value.split(".").map(Number);
const compareVersions = (left, right) => {
  const leftParts = parseVersion(left);
  const rightParts = parseVersion(right);
  for (let index = 0; index < leftParts.length; index += 1) {
    if (leftParts[index] !== rightParts[index]) {
      return leftParts[index] - rightParts[index];
    }
  }
  return 0;
};

const currentVersion = versionMatch[1];
const comparison = compareVersions(targetVersion, currentVersion);
if (comparison < 0) {
  throw new Error(`Refusing to downgrade cask from ${currentVersion} to ${targetVersion}`);
}

const replaceExactlyOnce = (text, pattern, replacement) => {
  const flags = pattern.flags.includes("g") ? pattern.flags : `${pattern.flags}g`;
  const matches = [...text.matchAll(new RegExp(pattern.source, flags))];
  if (matches.length !== 1) {
    throw new Error(`Expected exactly one cask line matching ${pattern}`);
  }
  return text.replace(pattern, replacement);
};

let updated = original;
updated = replaceExactlyOnce(updated, versionPattern, `  version "${targetVersion}"`);
updated = replaceExactlyOnce(
  updated,
  armPattern,
  `  sha256 arm:   "${armSha.toLowerCase()}",`,
);
updated = replaceExactlyOnce(
  updated,
  intelPattern,
  `         intel: "${intelSha.toLowerCase()}"`,
);

if (comparison === 0 && updated !== original) {
  throw new Error(
    `Cask ${targetVersion} already exists with different checksums; investigate release immutability`,
  );
}

if (updated !== original) {
  await writeFile(caskPath, updated, "utf8");
  console.log(`Updated DevPack cask from ${currentVersion} to ${targetVersion}.`);
} else {
  console.log(`DevPack cask already matches ${targetVersion}.`);
}