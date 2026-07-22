#!/usr/bin/env bash
# Foundry DevPack installer bootstrap (Linux).
#
# This is the SOURCE TEMPLATE. The publish pipeline substitutes __VERSION__ and the per-arch
# __SHA256_*__ placeholders and uploads the RESOLVED copy as a release asset; that resolved copy
# is what users run (via the aka.ms short link). Running this raw template directly will fail the
# guard below on purpose.
set -euo pipefail

# --- release coordinates (resolved at publish time) ---
REPO="microsoft/foundry-toolkit"          # repo hosting the signed release assets
VERSION="__VERSION__"                       # e.g. 0.0.4
SHA256_LINUX_X64="__SHA256_LINUX_X64__"
SHA256_LINUX_ARM64="__SHA256_LINUX_ARM64__"

# Refuse to run the unresolved template (placeholders still present).
case "$VERSION$SHA256_LINUX_X64$SHA256_LINUX_ARM64" in
  *__*) echo "error: this is the unresolved install.sh template; run https://aka.ms/foundry-devpack.sh instead" >&2; exit 1 ;;
esac

TAG="devpack-installer-${VERSION}"

# --- detect architecture ---
uname_m="$(uname -m)"
case "$uname_m" in
  x86_64 | amd64)  rid="linux-x64";   sha="$SHA256_LINUX_X64" ;;
  aarch64 | arm64) rid="linux-arm64"; sha="$SHA256_LINUX_ARM64" ;;
  *) echo "error: unsupported architecture '$uname_m' (need x86_64 or aarch64)" >&2; exit 1 ;;
esac

asset="foundry-devpack-${rid}"
url="https://github.com/${REPO}/releases/download/${TAG}/${asset}"

# --- prerequisites ---
command -v curl >/dev/null 2>&1 || { echo "error: 'curl' is required" >&2; exit 1; }

# --- download ---
tmp="$(mktemp -d)"
trap 'rm -rf "$tmp"' EXIT
bin="${tmp}/foundry-devpack"
echo "Downloading ${asset} (${VERSION})..."
curl -fsSL "$url" -o "$bin"

# --- verify checksum (baked in, offline) ---
if command -v sha256sum >/dev/null 2>&1; then
  actual="$(sha256sum "$bin" | awk '{print $1}')"
elif command -v shasum >/dev/null 2>&1; then
  actual="$(shasum -a 256 "$bin" | awk '{print $1}')"
else
  echo "error: need 'sha256sum' or 'shasum' to verify the download" >&2; exit 1
fi
if [ "$actual" != "$sha" ]; then
  echo "error: checksum mismatch for ${asset}" >&2
  echo "  expected: $sha" >&2
  echo "  actual:   $actual" >&2
  exit 1
fi

# --- run (forwarding any extra args, e.g. --target ...) ---
chmod +x "$bin"
echo "Running the Foundry DevPack installer..."
exec "$bin" --channel curl "$@"
