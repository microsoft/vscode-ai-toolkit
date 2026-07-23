#!/usr/bin/env node

import {
  cpSync,
  existsSync,
  readFileSync,
  rmSync,
  statSync,
  writeFileSync,
} from "node:fs";
import { join, resolve } from "node:path";

const [sourceArg, targetArg, pluginManifestArg, nextVersion] =
  process.argv.slice(2);

if (!sourceArg || !targetArg || !pluginManifestArg) {
  throw new Error(
    "Usage: sync_foundry_agent_canvas.mjs <source-package> <target-extension> <plugin-manifest> [version]",
  );
}

const sourceRoot = resolve(sourceArg);
const targetRoot = resolve(targetArg);
const pluginManifestPath = resolve(pluginManifestArg);
const extensionManifestPath = join(targetRoot, "package.json");
const payload = [
  { path: "extension.mjs", type: "file" },
  { path: "public", type: "directory" },
  { path: "inspector-ui", type: "directory" },
];

function parseVersion(value, label) {
  const match = /^(\d+)\.(\d+)\.(\d+)$/.exec(value);
  if (!match) {
    throw new Error(`${label} must use stable X.Y.Z semantic versioning`);
  }

  return match.slice(1).map(Number);
}

function compareVersions(left, right) {
  for (let index = 0; index < left.length; index += 1) {
    if (left[index] !== right[index]) {
      return left[index] - right[index];
    }
  }

  return 0;
}

for (const entry of payload) {
  const sourcePath = join(sourceRoot, entry.path);
  if (!existsSync(sourcePath)) {
    throw new Error(`Missing packaged payload: ${sourcePath}`);
  }

  const sourceStat = statSync(sourcePath);
  if (
    (entry.type === "file" && !sourceStat.isFile()) ||
    (entry.type === "directory" && !sourceStat.isDirectory())
  ) {
    throw new Error(`Packaged payload has the wrong type: ${sourcePath}`);
  }
}

const pluginManifest = JSON.parse(readFileSync(pluginManifestPath, "utf8"));
if (pluginManifest.name !== "foundry-agent-canvas") {
  throw new Error(`Unexpected plugin name: ${pluginManifest.name}`);
}

const extensionManifest = JSON.parse(
  readFileSync(extensionManifestPath, "utf8"),
);
if (extensionManifest.name !== "foundry-agent-canvas") {
  throw new Error(`Unexpected extension name: ${extensionManifest.name}`);
}

if (nextVersion) {
  const currentParsedVersion = parseVersion(
    pluginManifest.version,
    "Current plugin version",
  );
  const nextParsedVersion = parseVersion(
    nextVersion,
    "Requested plugin version",
  );
  if (compareVersions(nextParsedVersion, currentParsedVersion) <= 0) {
    throw new Error(
      `Requested plugin version ${nextVersion} must be newer than ${pluginManifest.version}`,
    );
  }
}

for (const entry of payload) {
  const sourcePath = join(sourceRoot, entry.path);
  const targetPath = join(targetRoot, entry.path);

  rmSync(targetPath, { recursive: true, force: true });
  cpSync(sourcePath, targetPath, {
    recursive: entry.type === "directory",
    force: true,
  });
}

if (nextVersion) {
  pluginManifest.version = nextVersion;
  writeFileSync(
    pluginManifestPath,
    `${JSON.stringify(pluginManifest, null, 2)}\n`,
  );
  console.log(
    `Synced foundry-agent-canvas payload and updated plugin version to ${nextVersion}`,
  );
} else {
  console.log(
    `Synced foundry-agent-canvas payload and preserved plugin version ${pluginManifest.version}`,
  );
}
