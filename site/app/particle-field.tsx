'use client';

import { useEffect, useRef } from 'react';
import { binaryDance } from './binary-dance';
import { binaryGlyphs, createBinaryName, createBinaryAbout, morphToAbout } from './binary-lettering';

type Particle = { x: number; y: number; column: number; seed: number; columnSeed: number; digit: 0 | 1; alpha: number; sourceOpacity: number; targetOpacity: number; target: { x: number; y: number } };
const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const p = clamp(value); return p * p * (3 - 2 * p); };
const random = (index: number) => { const value = Math.sin(index * 127.1 + 311.7) * 43758.5453123; return value - Math.floor(value); };

export default function ParticleField({ paused }: { paused: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const pausedRef = useRef(paused);
  const syncRef = useRef<(() => void) | null>(null);
  useEffect(() => { pausedRef.current = paused; syncRef.current?.(); }, [paused]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const stage = canvas?.parentElement;
    const section = stage?.parentElement;
    const title = stage?.querySelector<HTMLHeadingElement>('h1');
    const ctx = canvas?.getContext('2d');
    if (!canvas || !stage || !section || !title || !ctx) return;
    const sprites = [document.createElement('canvas'), document.createElement('canvas')];
    let digitHeight = 0;
    const media = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reduced = media.matches, visible = true, destroyed = false;
    let width = 0, height = 0, raf = 0, time = 0, last = 0;
    let progress = 0, targetProgress = 0, initialized = false;
    let danceTime = 0, scrollEnergy = 0, lastScrollY = window.scrollY;
    let particles: Particle[] = [];
    const pointer = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
    let ripple: { x: number; y: number; start: number } | null = null;

    const readScroll = () => {
      const rect = section.getBoundingClientRect();
      targetProgress = clamp(-rect.top / Math.max(1, rect.height - height));
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = false;
      const scroll = reduced ? 0 : progress;
      const entry = reduced ? 1 : 1 - Math.pow(1 - clamp(time / 1700), 3);
      const cursorRadius = Math.min(320, Math.max(180, width * .25));
      stage.style.setProperty('--hero-progress', scroll.toFixed(4));
      stage.style.setProperty('--hero-copy-visibility', scroll > .34 ? 'hidden' : 'visible');
      // A quiet binary field stays behind the name-to-About morph.
      for (let i = 0; i < (width < 600 ? 55 : 115); i++) {
        const seed = random(i + 8300);
        const home = { x: random(i + 9100) * width, y: seed * height };
        const a = .08 + random(i + 4500) * .12;
        const dance = binaryDance(danceTime, seed, i % 2 as 0 | 1, 6, scrollEnergy, 0, reduced);
        ctx.globalAlpha = a * .55 * (1 - smooth(scroll) * .6) * dance.opacity;
        ctx.drawImage(sprites[dance.digit], home.x + dance.x, home.y + dance.y, 3.6, 6);
      }
      for (const p of particles) {
        const pose = morphToAbout(p, p.target, scroll);
        const x = pose.x;
        const introY = -height * (.08 + p.columnSeed * .16) * (1 - entry) * (1 - pose.amount);
        let y = pose.y + introY;
        // Keep the lettering readable while both words stay alive.
        if (!reduced) {
          const dx = x - pointer.x, dy = y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < cursorRadius && distance > .1) {
            const force = Math.pow(1 - distance / cursorRadius, 2) * 24;
            y += dy / distance * force * (1 - smooth(scroll / .12));
          }
          if (ripple) {
            const age = time - ripple.start;
            const distance = Math.hypot(x - ripple.x, y - ripple.y);
            const crest = Math.exp(-Math.pow((distance - age * .35) / 65, 2));
            y += crest * 16 * Math.max(0, 1 - age / 1800) * (1 - smooth(scroll / .12));
          }
        }
        const alpha = p.alpha * (.3 + entry * .7) * (p.sourceOpacity + (p.targetOpacity - p.sourceOpacity) * pose.amount);
        const currentHeight = digitHeight;
        const currentWidth = currentHeight * .72;
        const hover = Math.max(0, 1 - Math.hypot(x - pointer.x, y - pointer.y) / cursorRadius);
        const dance = binaryDance(danceTime, p.seed, p.digit, currentHeight, scrollEnergy, hover, reduced);
        ctx.globalAlpha = alpha * dance.opacity;
        ctx.drawImage(sprites[dance.digit], x + dance.x - currentWidth / 2, y + dance.y - currentHeight / 2, currentWidth, currentHeight);
      }
      ctx.globalAlpha = 1;
      if (ripple && time - ripple.start > 1800) ripple = null;
    };

    const active = () => !destroyed && visible && !document.hidden && !pausedRef.current && !reduced;
    const frame = (now: number) => {
      raf = 0;
      if (!active()) return;
      const delta = last ? Math.min(now - last, 40) : 16;
      last = now; time += delta;
      scrollEnergy *= Math.exp(-delta / 260);
      danceTime += delta * (1 + scrollEnergy * .18);
      const follow = 1 - Math.exp(-delta / 85);
      progress = targetProgress === 0 || targetProgress === 1 ? targetProgress : progress + (targetProgress - progress) * follow;
      pointer.x += (pointer.targetX - pointer.x) * follow;
      pointer.y += (pointer.targetY - pointer.y) * follow;
      draw(); raf = requestAnimationFrame(frame);
    };
    const sync = () => {
      if (active()) { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }
      else { cancelAnimationFrame(raf); raf = 0; last = 0; }
    };
    syncRef.current = sync;

    const resize = () => {
      if (destroyed) return;
      const bounds = canvas.getBoundingClientRect();
      if (bounds.width < 1 || bounds.height < 1) return;
      width = bounds.width; height = bounds.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr); canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const titleBounds = title.getBoundingClientRect();
      const centerY = titleBounds.top - bounds.top + titleBounds.height / 2;
      const name = createBinaryName(width, height, centerY);
      const about = createBinaryAbout(width, height, name.layout);
      digitHeight = name.digitHeight;
      sprites.forEach((sprite, digit) => {
        sprite.width = 3; sprite.height = 5;
        const spriteContext = sprite.getContext('2d')!;
        spriteContext.fillStyle = '#39414c';
        binaryGlyphs[digit].forEach((row, y) => Array.from(row).forEach((pixel, x) => {
          if (pixel === '1') spriteContext.fillRect(x, y, 1, 1);
        }));
      });
      const count = Math.max(name.points.length, about.points.length);
      let previousSource = -1, previousTarget = -1;
      particles = Array.from({ length: count }, (_, index) => {
        const sourceIndex = Math.floor(index * name.points.length / count);
        const targetIndex = Math.floor(index * about.points.length / count);
        const point = name.points[sourceIndex];
        const sourceOpacity = sourceIndex !== previousSource ? 1 : 0;
        const targetOpacity = targetIndex !== previousTarget ? 1 : 0;
        previousSource = sourceIndex; previousTarget = targetIndex;
        const seed = random(index + 1);
        return { ...point, seed, columnSeed: random(point.column + 701), alpha: .88 + seed * .12, sourceOpacity, targetOpacity, target: about.points[targetIndex] };
      });
      readScroll();
      if (!initialized) { progress = targetProgress; if (progress > .02) time = 1700; initialized = true; }
      if (particles.length) stage.dataset.particlesReady = 'true';
      draw(); sync();
    };
    const move = (event: PointerEvent) => {
      if (!active()) return;
      const bounds = canvas.getBoundingClientRect();
      pointer.targetX = event.clientX - bounds.left; pointer.targetY = event.clientY - bounds.top;
    };
    const leave = () => { pointer.targetX = -1000; pointer.targetY = -1000; };
    const click = (event: PointerEvent) => {
      if (!active() || (event.target as HTMLElement).closest('a,button')) return;
      const bounds = canvas.getBoundingClientRect();
      ripple = { x: event.clientX - bounds.left, y: event.clientY - bounds.top, start: time };
    };
    const motionChange = () => { reduced = media.matches; if (reduced) { progress = 0; scrollEnergy = 0; draw(); } else readScroll(); sync(); };
    const scroll = () => {
      const nextY = window.scrollY;
      if (active()) scrollEnergy = Math.min(1, scrollEnergy + Math.abs(nextY - lastScrollY) / 120);
      lastScrollY = nextY;
      readScroll();
    };
    const visibility = () => { lastScrollY = window.scrollY; readScroll(); sync(); };
    const sizeObserver = new ResizeObserver(resize); sizeObserver.observe(stage);
    const inViewObserver = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; readScroll(); sync(); }); inViewObserver.observe(stage);
    stage.addEventListener('pointermove', move, { passive: true });
    stage.addEventListener('pointerleave', leave);
    stage.addEventListener('pointerdown', click, { passive: true });
    window.addEventListener('scroll', scroll, { passive: true });
    document.addEventListener('visibilitychange', visibility);
    media.addEventListener('change', motionChange);
    resize();
    return () => {
      destroyed = true; syncRef.current = null;
      cancelAnimationFrame(raf); sizeObserver.disconnect(); inViewObserver.disconnect();
      stage.removeEventListener('pointermove', move); stage.removeEventListener('pointerleave', leave); stage.removeEventListener('pointerdown', click);
      window.removeEventListener('scroll', scroll); document.removeEventListener('visibilitychange', visibility); media.removeEventListener('change', motionChange);
      delete stage.dataset.particlesReady;
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" aria-hidden="true" />;
}
