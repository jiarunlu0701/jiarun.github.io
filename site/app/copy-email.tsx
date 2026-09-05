'use client';

import { useEffect, useRef, useState } from 'react';
import { Check, Clipboard } from 'lucide-react';

const email = 'jiarunlu@usc.edu';

export default function CopyEmail() {
  const [status, setStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const reset = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => () => { if (reset.current) clearTimeout(reset.current); }, []);

  const copy = async () => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(email);
      copied = true;
    } catch {
      // Support browsers that restrict the modern clipboard API in embedded tabs.
      const focused = document.activeElement as HTMLElement | null;
      const field = document.createElement('textarea');
      field.value = email;
      field.readOnly = true;
      field.style.cssText = 'position:fixed;left:0;top:0;opacity:0;pointer-events:none';
      document.body.appendChild(field);
      field.select();
      try { copied = document.execCommand('copy'); } catch { copied = false; }
      finally { field.remove(); focused?.focus({ preventScroll: true }); }
    }
    setStatus(copied ? 'copied' : 'error');
    if (reset.current) clearTimeout(reset.current);
    reset.current = setTimeout(() => setStatus('idle'), 2400);
  };

  return (
    <span className="email-copy">
      <span className="email-address">{email}</span>
      <button type="button" onClick={copy} aria-label={status === 'copied' ? 'Email address copied' : `Copy email address ${email}`} title={status === 'copied' ? 'Copied' : 'Copy email address'}>
        {status === 'copied' ? <Check size={17} /> : <Clipboard size={17} />}
      </button>
      <span className="copy-feedback" role="status">{status === 'copied' ? 'Copied' : status === 'error' ? 'Select the address to copy' : ''}</span>
    </span>
  );
}
