/**
 * Stable Browser Fingerprint - Prioritizes stability over minor volatility
 * Works across phones, desktops, tablets. Survives cache clear + most browser updates.
 */
export interface FingerprintResult {
    fingerprint: string;
    components: Record<string, string>;
    stabilityNote?: string;
}
export declare function generateBrowserFingerprint(): Promise<FingerprintResult>;
