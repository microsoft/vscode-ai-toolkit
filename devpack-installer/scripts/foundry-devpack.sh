#!/usr/bin/env bash
set -euo pipefail

release_tag="__RELEASE_TAG__"
sha256_linux_x64="__SHA256_LINUX_X64__"
sha256_linux_arm64="__SHA256_LINUX_ARM64__"
sha256_osx_x64="__SHA256_OSX_X64__"
sha256_osx_arm64="__SHA256_OSX_ARM64__"

case "${release_tag}${sha256_linux_x64}${sha256_linux_arm64}${sha256_osx_x64}${sha256_osx_arm64}" in
  *__*) echo "error: this is an unresolved Foundry DevPack installer template" >&2; exit 1 ;;
esac

os="$(uname -s)"
architecture="$(uname -m)"

case "${os}/${architecture}" in
  Linux/x86_64 | Linux/amd64)
    asset="foundry-devpack-linux-x64"
    expected_hash="$sha256_linux_x64"
    archive="false"
    ;;
  Linux/aarch64 | Linux/arm64)
    asset="foundry-devpack-linux-arm64"
    expected_hash="$sha256_linux_arm64"
    archive="false"
    ;;
  Darwin/x86_64 | Darwin/amd64)
    asset="foundry-devpack-osx-x64.zip"
    expected_hash="$sha256_osx_x64"
    archive="true"
    ;;
  Darwin/arm64 | Darwin/aarch64)
    asset="foundry-devpack-osx-arm64.zip"
    expected_hash="$sha256_osx_arm64"
    archive="true"
    ;;
  *)
    echo "error: unsupported platform '${os}/${architecture}'" >&2
    exit 1
    ;;
esac

command -v curl >/dev/null 2>&1 || { echo "error: curl is required" >&2; exit 1; }

url="https://github.com/microsoft/foundry-toolkit/releases/download/${release_tag}/${asset}"
temp_directory="$(mktemp -d)"
trap 'rm -rf "$temp_directory"' EXIT

download="$temp_directory/$asset"
binary="$temp_directory/foundry-devpack"

echo "Downloading ${asset} (${release_tag})..."
curl -fsSL "$url" -o "$download"

if command -v sha256sum >/dev/null 2>&1; then
  actual_hash="$(sha256sum "$download" | awk '{print $1}')"
elif command -v shasum >/dev/null 2>&1; then
  actual_hash="$(shasum -a 256 "$download" | awk '{print $1}')"
else
  echo "error: sha256sum or shasum is required" >&2
  exit 1
fi

if [ "$(printf '%s' "$actual_hash" | tr '[:upper:]' '[:lower:]')" != "$(printf '%s' "$expected_hash" | tr '[:upper:]' '[:lower:]')" ]; then
  echo "error: SHA-256 mismatch for ${asset}" >&2
  exit 1
fi

if [ "$archive" = "true" ]; then
  if command -v unzip >/dev/null 2>&1; then
    unzip -q "$download" -d "$temp_directory"
  elif command -v ditto >/dev/null 2>&1; then
    ditto -x -k "$download" "$temp_directory"
  else
    echo "error: unzip or ditto is required" >&2
    exit 1
  fi
else
  mv "$download" "$binary"
fi

[ -f "$binary" ] || { echo "error: foundry-devpack was not found after extraction" >&2; exit 1; }
chmod +x "$binary"

echo "Running the Foundry DevPack installer..."
set +e
"$binary" install "$@"
exit_code=$?
set -e
exit "$exit_code"
