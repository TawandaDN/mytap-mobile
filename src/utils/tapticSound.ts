import { createAudioPlayer } from 'expo-audio';
import * as FileSystem from 'expo-file-system/legacy';

/**
 * Acoustic taptic payment sound — an authentic Apple-Pay-style double-click
 * sequence synthesized as a WAV at runtime and played through expo-audio.
 * Two short clicks ~50ms apart with a low-frequency thump, matching a
 * physical contactless transaction. Works in Expo Go (no native build).
 */

const SAMPLE_RATE = 44100;

/** Synthesize a short double-pop WAV (PCM 16-bit mono) as a base64 string. */
function synthesizeDoublePop(): string {
  const duration = 0.18; // seconds
  const n = Math.floor(SAMPLE_RATE * duration);
  const dataSize = n * 2;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  // --- WAV header ---
  const writeStr = (offset: number, s: string) => {
    for (let i = 0; i < s.length; i++) view.setUint8(offset + i, s.charCodeAt(i));
  };
  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true); // PCM chunk size
  view.setUint16(20, 1, true); // PCM format
  view.setUint16(22, 1, true); // mono
  view.setUint32(24, SAMPLE_RATE, true);
  view.setUint32(28, SAMPLE_RATE * 2, true); // byte rate
  view.setUint16(32, 2, true); // block align
  view.setUint16(34, 16, true); // bits per sample
  writeStr(36, 'data');
  view.setUint32(40, dataSize, true);

  // --- PCM samples ---
  const t0 = 0.0; // low thump
  const t1 = 0.02; // first click
  const t2 = 0.07; // second click (~50ms after first)

  for (let i = 0; i < n; i++) {
    const t = i / SAMPLE_RATE;
    let sample = 0;

    // Low-frequency thump (physical contact)
    if (t >= t0 && t < t0 + 0.09) {
      const dt = t - t0;
      const env = Math.exp(-dt * 45);
      sample += Math.sin(2 * Math.PI * 120 * dt) * env * 0.5;
    }
    // First click (short high burst)
    if (t >= t1 && t < t1 + 0.03) {
      const dt = t - t1;
      const env = Math.exp(-dt * 160);
      sample += Math.sin(2 * Math.PI * 1800 * dt) * env * 0.18;
    }
    // Second click ~50ms later
    if (t >= t2 && t < t2 + 0.03) {
      const dt = t - t2;
      const env = Math.exp(-dt * 160);
      sample += Math.sin(2 * Math.PI * 2200 * dt) * env * 0.16;
    }

    // Soft clip + normalize
    sample = Math.max(-1, Math.min(1, sample));
    const int = sample < 0 ? sample * 0x8000 : sample * 0x7fff;
    view.setInt16(44 + i * 2, int, true);
  }

  // base64 encode
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode.apply(null, Array.from(bytes.subarray(i, i + chunk)));
  }
  return btoa(binary);
}

let cachedUri: string | null = null;

async function ensureWav(): Promise<string | null> {
  if (cachedUri) return cachedUri;
  try {
    const b64 = synthesizeDoublePop();
    const dir = FileSystem.cacheDirectory || FileSystem.documentDirectory;
    if (!dir) return null;
    const uri = `${dir}mytap-taptic.wav`;
    await FileSystem.writeAsStringAsync(uri, b64, { encoding: FileSystem.EncodingType.Base64 });
    cachedUri = uri;
    return uri;
  } catch {
    return null;
  }
}

/**
 * Play the acoustic taptic double-pop sequence.
 * Two short clicks ~50ms apart with a low-frequency thump.
 */
export async function playTapticPayment() {
  try {
    const uri = await ensureWav();
    if (!uri) return;
    const player = createAudioPlayer(uri);
    player.play();
    // Pause after playback so the player is not left running
    setTimeout(() => {
      try {
        player.pause();
      } catch {
        /* noop */
      }
    }, 400);
  } catch {
    /* noop */
  }
}

/** Convenience hook wrapper. */
export function useTapticPlayer() {
  return { play: playTapticPayment };
}