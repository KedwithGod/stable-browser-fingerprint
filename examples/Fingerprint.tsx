import React, { useState, useEffect } from 'react';
import { generateBrowserFingerprint, FingerprintResult } from 'browser-fingerprint';

export default function BrowserFingerprint() {
  const [result, setResult] = useState<FingerprintResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFingerprint() {
      try {
        const data = await generateBrowserFingerprint();
        setResult(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchFingerprint();
  }, []);

  if (loading) return <p>Generating stable browser fingerprint...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Your Browser Fingerprint</h2>
      <p><strong>Fingerprint:</strong> {result?.fingerprint}</p>
      
      <details>
        <summary>View All Components</summary>
        <pre>{JSON.stringify(result?.components, null, 2)}</pre>
      </details>

      <small>
        This fingerprint remains stable even after clearing cache.
      </small>
    </div>
  );
}