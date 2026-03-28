/**
 * Stable Browser Fingerprint - Prioritizes stability over minor volatility
 * Works across phones, desktops, tablets. Survives cache clear + most browser updates.
 */

export interface FingerprintResult {
  fingerprint: string;
  components: Record<string, string>;
  stabilityNote?: string;
}

/** SHA-256 helper */
async function sha256(input: string): Promise<string> {
  const buffer = new TextEncoder().encode(input);
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/** Canvas - very stable on same hardware */
function getCanvasFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 300;
    canvas.height = 80;
    const ctx = canvas.getContext('2d', { alpha: false }) as CanvasRenderingContext2D;

    if (!ctx) return 'no-canvas';

    ctx.fillStyle = '#f60';
    ctx.fillRect(0, 0, 300, 80);

    ctx.fillStyle = '#069';
    ctx.font = 'bold 20px Arial';
    ctx.textBaseline = 'middle';
    ctx.fillText('Stable Fingerprint Test 2026', 20, 45);

    ctx.fillStyle = 'rgba(0, 120, 200, 0.8)';
    ctx.font = '16px serif';
    ctx.fillText('abcdefghijklmnopqrstuvwxyz0123456789', 15, 65);

    return canvas.toDataURL('image/png', 0.9); // slightly lower quality for consistency
  } catch {
    return 'canvas-error';
  }
}

/** WebGL - best for hardware distinction (phone vs desktop, different GPUs) */
function getWebGLFingerprint(): string {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null;

    if (!gl) return 'no-webgl';

    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info') as WEBGL_debug_renderer_info | null;
    if (!debugInfo) return 'no-debug-info';

    const vendor = (gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || 'unknown-vendor').trim();
    const renderer = (gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || 'unknown-renderer').trim();
    const version = (gl.getParameter(gl.VERSION) || 'unknown').trim();

    return `${vendor}|${renderer}|${version}`;
  } catch {
    return 'webgl-error';
  }
}

/** AudioContext - stable waveform characteristics */
async function getAudioFingerprint(): Promise<string> {
  try {
    const AudioContext = window.OfflineAudioContext || (window as any).webkitOfflineAudioContext;
    if (!AudioContext) return 'no-audio';

    const context = new (AudioContext as any)(1, 44100, 44100);
    const oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 1000;

    const compressor = context.createDynamicsCompressor();
    oscillator.connect(compressor);
    compressor.connect(context.destination);
    oscillator.start(0);

    const rendered = await context.startRendering();
    const data = rendered.getChannelData(0);

    // Simple stable hash from waveform samples
    let sum = 0;
    for (let i = 0; i < data.length; i += 150) {
      sum += Math.abs(data[i]) * 1000;
    }
    return Math.floor(sum).toString(36);
  } catch {
    return 'audio-error';
  }
}

export async function generateBrowserFingerprint(): Promise<FingerprintResult> {
  if (typeof window === 'undefined') {
    throw new Error('This package only works in browser environments');
  }

  const components: Record<string, string> = {
    platform: navigator.platform || '',
    vendor: navigator.vendor || '',
    hardwareConcurrency: navigator.hardwareConcurrency?.toString() || '0',
    deviceMemory: (navigator as any).deviceMemory?.toString() || '0',
    maxTouchPoints: navigator.maxTouchPoints?.toString() || '0',
    screen: `${screen.width}x${screen.height}x${screen.colorDepth}`,
    // Removed: full userAgent, languages, timezone (for better stability)
  };

  // Core stable fingerprinting signals
  components.canvas = getCanvasFingerprint();
  components.webgl = getWebGLFingerprint();
  components.audio = await getAudioFingerprint();

  // Combine and hash
  const dataToHash = Object.entries(components)
    .sort(([a], [b]) => a.localeCompare(b)) // consistent order
    .map(([key, value]) => `${key}:${value}`)
    .join('||');

  const fingerprint = await sha256(dataToHash);

  return {
    fingerprint,
    components,
    stabilityNote: 'This version prioritizes stability. It may be less unique than versions that include userAgent/timezone.'
  };
}