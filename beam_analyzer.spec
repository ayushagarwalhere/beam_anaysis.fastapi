# -*- mode: python ; coding: utf-8 -*-

import os
from PyInstaller.utils.hooks import collect_all

block_cipher = None

# Path to include frontend/dist directory inside the exe
frontend_dist = os.path.join('frontend', 'dist')

a = Analysis(
    ['server.py'],
    pathex=[],
    binaries=[],
    datas=[
        (frontend_dist, 'frontend/dist'),  # Include all frontend build files
    ],
    hiddenimports=[
        'uvicorn',
        'uvicorn.protocols.http',
        'uvicorn.protocols.http.h11_impl',
        'uvicorn.protocols.websockets',
        'uvicorn.protocols.websockets.wsproto_impl',
        'uvicorn.logging',
        'uvicorn.loops',
        'uvicorn.loops.auto',
        'uvicorn.lifespan',
        'uvicorn.lifespan.on',
        'numpy',
        'matplotlib',
        'matplotlib.backends.backend_agg',
        'matplotlib.figure',
        'matplotlib.pyplot',
        'fastapi',
        'pydantic',
        'pydantic_core',
        'io',
        'base64',
        'threading',
        'time',
        'webbrowser',
    ],
    hookspath=[],
    hooksconfig={},
    runtime_hooks=[],
    excludes=[],
    win_no_prefer_redirects=False,
    win_private_assemblies=False,
    cipher=block_cipher,
    noarchive=False,
)

# Note: matplotlib dependencies are handled by PyInstaller hooks automatically

pyz = PYZ(a.pure, a.zipped_data, cipher=block_cipher)

# Create a single-file executable for maximum compatibility
exe = EXE(
    pyz,
    a.scripts,
    a.binaries,
    a.zipfiles,
    a.datas,
    [],
    name='beam_analyzer',
    debug=False,
    bootloader_ignore_signals=False,
    strip=False,
    upx=True,
    upx_exclude=[],
    console=True,
    disable_windowed_traceback=False,
    target_arch=None,
    codesign_identity=None,
    entitlements_file=None,
)


