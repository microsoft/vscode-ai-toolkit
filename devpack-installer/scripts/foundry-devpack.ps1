#Requires -Version 5.1

$ErrorActionPreference = 'Stop'
$ProgressPreference = 'SilentlyContinue'

$releaseTag = '__RELEASE_TAG__'
$sha256X64 = '__SHA256_WIN_X64__'
$sha256Arm64 = '__SHA256_WIN_ARM64__'

if ("$releaseTag$sha256X64$sha256Arm64" -like '*__*') {
    throw 'This is an unresolved Foundry DevPack installer template.'
}

$architecture = if ($env:PROCESSOR_ARCHITEW6432) {
    $env:PROCESSOR_ARCHITEW6432
} else {
    $env:PROCESSOR_ARCHITECTURE
}

switch ($architecture.ToUpperInvariant()) {
    'AMD64' {
        $asset = 'foundry-devpack-win-x64.exe'
        $expectedHash = $sha256X64
    }
    'ARM64' {
        $asset = 'foundry-devpack-win-arm64.exe'
        $expectedHash = $sha256Arm64
    }
    default {
        throw "Unsupported Windows architecture: $architecture"
    }
}

$url = "https://github.com/microsoft/foundry-toolkit/releases/download/$releaseTag/$asset"
$tempDirectory = Join-Path ([IO.Path]::GetTempPath()) "foundry-devpack-$([guid]::NewGuid().ToString('N'))"
$executable = Join-Path $tempDirectory 'foundry-devpack.exe'

New-Item -ItemType Directory -Path $tempDirectory | Out-Null
try {
    [Net.ServicePointManager]::SecurityProtocol =
        [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12

    Write-Host "Downloading $asset ($releaseTag)..."
    Invoke-WebRequest -Uri $url -OutFile $executable -UseBasicParsing

    $actualHash = (Get-FileHash -Path $executable -Algorithm SHA256).Hash
    if (-not $actualHash.Equals($expectedHash, [StringComparison]::OrdinalIgnoreCase)) {
        throw "SHA-256 mismatch for $asset"
    }

    Write-Host 'Running the Foundry DevPack installer...'
    & $executable install @args
    $exitCode = $LASTEXITCODE
    if ($null -eq $exitCode) {
        $exitCode = 0
    }
    exit $exitCode
}
finally {
    Remove-Item -Path $tempDirectory -Recurse -Force -ErrorAction SilentlyContinue
}
