# @kedwithgod/browser-fingerprint

**Stable & lightweight browser fingerprinting for the modern web.**

Generate a **consistent, unique fingerprint** for a browser/device that persists even after clearing cache, cookies, and local storage.

[![npm version](https://img.shields.io/npm/v/@kedwithgod/browser-fingerprint.svg)](https://www.npmjs.com/package/@kedwithgod/browser-fingerprint)
[![license](https://img.shields.io/npm/l/@kedwithgod/browser-fingerprint.svg)](https://github.com/KedwithGod/stable-browser-fingerprint/blob/main/LICENSE)

## 🚀 Key Features

- **Persistence:** Works across private/incognito modes and survives cache clearing.
- **Stability:** Focuses on hardware and rendering characteristics (Canvas + WebGL + Audio) rather than volatile user-agent strings.
- **Privacy-Conscious:** Does not use any client-side storage (cookies, localStorage, indexedDB).
- **Fast & Light:** Zero dependencies, small bundle size (~2.8KB packed).
- **TypeScript Ready:** Full type definitions included.

## 📦 Installation

```bash
npm install @kedwithgod/browser-fingerprint
# or
yarn add @kedwithgod/browser-fingerprint
# or
pnpm add @kedwithgod/browser-fingerprint
```

## 🛠 Usage

### Standard JavaScript / TypeScript

```javascript
import { generateBrowserFingerprint } from '@kedwithgod/browser-fingerprint';

async function init() {
  const result = await generateBrowserFingerprint();
  
  console.log('Unique Fingerprint:', result.fingerprint);
  console.log('Hardware Components:', result.components);
}

init();
```

### React Example

```tsx
import React, { useState, useEffect } from 'react';
import { generateBrowserFingerprint, FingerprintResult } from '@kedwithgod/browser-fingerprint';

export default function App() {
  const [result, setResult] = useState<FingerprintResult | null>(null);

  useEffect(() => {
    generateBrowserFingerprint().then(setResult);
  }, []);

  if (!result) return <p>Identifying browser...</p>;

  return (
    <div>
      <h3>Device Fingerprint:</h3>
      <code>{result.fingerprint}</code>
    </div>
  );
}
```

### Plain HTML (via ESM)

```html
<script type="module">
  import { generateBrowserFingerprint } from 'https://cdn.jsdelivr.net/npm/@kedwithgod/browser-fingerprint/dist/index.js';

  generateBrowserFingerprint().then(res => {
    document.body.innerHTML += `<h1>ID: ${res.fingerprint}</h1>`;
  });
</script>
```

## 🔍 How it works

This library combines multiple entropy sources to create a stable identifier:
1. **Canvas Rendering:** Geometric shapes and text variations across OS/GPU.
2. **WebGL Signals:** GPU vendor, renderer, and hardware-specific capabilities.
3. **Audio Fingerprint:** Oscillator and compressor characteristics of the audio stack.
4. **Hardware signals:** Screen resolution, color depth, hardware concurrency, and device memory.

## ⚖️ Stability Note

This package prioritizes **stability** (staying the same on the same hardware) over extreme uniqueness (tracking every possible minor variation). This makes it ideal for security features like "Remember this device" and fraud prevention.

## 📄 License

MIT © [KedwithGod](https://github.com/KedwithGod)
