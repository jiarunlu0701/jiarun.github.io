'use client';

import { useEffect, useRef, type MouseEvent } from 'react';

const ease = (value: number) => value * value * (3 - 2 * value);
const clamp = (value: number) => Math.max(0, Math.min(1, value));

export function useHeroNavigation(paused: boolean) {
  const active = useRef<{ cancel: () => void; finish: () => void } | null>(null);
  useEffect(() => () => active.current?.cancel(), []);
  useEffect(() => { if (paused) active.current?.finish(); }, [paused]);

  return (event: MouseEvent<HTMLElement>) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = (event.target as Element).closest<HTMLAnchorElement>('a[href^="#"]');
    if (!link || link.matches('.skip-link') || link.target || link.hasAttribute('download')) return;
    if (!link.closest('.navigation, .hero')) return;
    const destination = document.getElementById(link.hash.slice(1));
    const hero = document.querySelector<HTMLElement>('.hero');
    const stage = document.querySelector<HTMLElement>('.hero-stage');
    if (!destination || !hero || !stage || destination.id === 'top') return;
    const heroBounds = hero.getBoundingClientRect();
    const stageHeight = stage.getBoundingClientRect().height;
    const heroTop = window.scrollY + heroBounds.top;
    const travel = Math.max(0, heroBounds.height - stageHeight);
    if (window.scrollY > heroTop + travel + stageHeight * .06) return;

    event.preventDefault();
    active.current?.cancel();
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let raf = 0, ended = false;
    const destinationY = () => {
      const inset = parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;
      const top = window.scrollY + destination.getBoundingClientRect().top - inset;
      return Math.max(0, Math.min(top, document.documentElement.scrollHeight - window.innerHeight));
    };
    const cancel = () => {
      if (ended) return;
      ended = true;
      cancelAnimationFrame(raf);
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('pointerdown', cancel);
      window.removeEventListener('keydown', keydown);
      window.removeEventListener('resize', cancel);
      window.removeEventListener('popstate', cancel);
      document.removeEventListener('visibilitychange', visibility);
      media.removeEventListener('change', motionChange);
      active.current = null;
    };
    const finish = () => {
      if (ended) return;
      window.scrollTo({ top: destinationY(), behavior: 'instant' });
      if (window.location.hash !== link.hash) history.pushState(history.state, '', link.hash);
      destination.focus({ preventScroll: true });
      cancel();
    };
    const keydown = (input: KeyboardEvent) => {
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'PageUp', 'PageDown', 'Home', 'End', ' ', 'Escape', 'Tab'].includes(input.key)) cancel();
    };
    const visibility = () => { if (document.hidden) cancel(); };
    const motionChange = () => { if (media.matches) finish(); };
    active.current = { cancel, finish };
    if (paused || media.matches || travel < 1) { finish(); return; }

    // Finish the silhouette while the stage is still pinned, then reveal the section.
    const fromY = window.scrollY;
    const morphY = Math.max(fromY, heroTop + travel * .97);
    const remaining = clamp((morphY - fromY) / (travel * .97));
    const morphDuration = remaining > .01 ? Math.max(650, 1500 * remaining) : 0;
    const holdDuration = 500;
    const revealDuration = 480;
    let elapsed = 0, last = 0;
    const frame = (now: number) => {
      if (ended) return;
      // A delayed frame must not consume the whole transition in one jump.
      elapsed += last ? Math.min(now - last, 40) : 0;
      last = now;
      if (elapsed < morphDuration) {
        window.scrollTo({ top: fromY + (morphY - fromY) * ease(clamp(elapsed / morphDuration)), behavior: 'instant' });
      } else if (elapsed < morphDuration + holdDuration) {
        window.scrollTo({ top: morphY, behavior: 'instant' });
      } else {
        const progress = clamp((elapsed - morphDuration - holdDuration) / revealDuration);
        const reveal = 1 - Math.pow(1 - progress, 3);
        window.scrollTo({ top: morphY + (destinationY() - morphY) * reveal, behavior: 'instant' });
        if (progress === 1) { finish(); return; }
      }
      raf = requestAnimationFrame(frame);
    };
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('pointerdown', cancel, { passive: true });
    window.addEventListener('keydown', keydown);
    window.addEventListener('resize', cancel);
    window.addEventListener('popstate', cancel);
    document.addEventListener('visibilitychange', visibility);
    media.addEventListener('change', motionChange);
    raf = requestAnimationFrame(frame);
  };
}
