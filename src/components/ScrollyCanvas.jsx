import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FRAME_COUNT = 120;
const FRAME_PATH = (i) =>
  `/sequence/frame_${String(i).padStart(3, '0')}_delay-0.066s.png`;

const OVERLAYS = [
  { from: 0, to: 18, text: 'Abdullah Aftab', sub: 'Full-Stack & Flutter Developer' },
  { from: 35, to: 58, text: 'MERN Stack', sub: 'Building scalable web experiences' },
  { from: 72, to: 95, text: 'Flutter & Dart', sub: 'Cross-platform mobile apps' },
  { from: 100, to: 119, text: 'Let\'s Build Together', sub: 'Scroll down to explore my work' }
];

function drawFrame(ctx, canvas, img) {
  if (!img || !img.complete) return;
  const cw = canvas.width;
  const ch = canvas.height;
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const cr = cw / ch;
  const ir = iw / ih;
  let rw, rh, x, y;
  if (cr > ir) {
    rw = cw; rh = cw / ir; x = 0; y = (ch - rh) / 2;
  } else {
    rh = ch; rw = ch * ir; x = (cw - rw) / 2; y = 0;
  }
  ctx.clearRect(0, 0, cw, ch);
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, x, y, rw, rh);
}

export default function ScrollyCanvas() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const frameRef = useRef(0);
  const rafRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [activeOverlay, setActiveOverlay] = useState(0);

  // Preload all frames
  useEffect(() => {
    let loadedCount = 0;
    const imgs = [];

    for (let i = 0; i < FRAME_COUNT; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loadedCount++;
        setLoadProgress(Math.round((loadedCount / FRAME_COUNT) * 100));
        if (loadedCount === FRAME_COUNT) {
          imagesRef.current = imgs;
          setLoaded(true);
          // draw first frame
          const canvas = canvasRef.current;
          if (canvas) {
            const ctx = canvas.getContext('2d');
            drawFrame(ctx, canvas, imgs[0]);
          }
        }
      };
      imgs.push(img);
    }
    imagesRef.current = imgs;
  }, []);

  // Resize canvas
  useEffect(() => {
    const resize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      const imgs = imagesRef.current;
      if (imgs[frameRef.current]) {
        const ctx = canvas.getContext('2d');
        drawFrame(ctx, canvas, imgs[frameRef.current]);
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // GSAP ScrollTrigger for frame scrubbing
  useEffect(() => {
    if (!loaded) return;

    const ctx = canvasRef.current?.getContext('2d');
    const canvas = canvasRef.current;
    if (!ctx || !canvas) return;

    const state = { frame: 0 };

    const trigger = ScrollTrigger.create({
      trigger: containerRef.current,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1.2,
      onUpdate: (self) => {
        const newFrame = Math.min(
          FRAME_COUNT - 1,
          Math.max(0, Math.floor(self.progress * (FRAME_COUNT - 1)))
        );

        if (newFrame !== state.frame) {
          state.frame = newFrame;
          frameRef.current = newFrame;

          // update overlay
          const overlayIndex = OVERLAYS.findIndex(
            (o) => newFrame >= o.from && newFrame <= o.to
          );
          setActiveOverlay(overlayIndex);

          if (rafRef.current) cancelAnimationFrame(rafRef.current);
          rafRef.current = requestAnimationFrame(() => {
            const img = imagesRef.current[newFrame];
            if (img) drawFrame(ctx, canvas, img);
          });
        }
      }
    });

    return () => {
      trigger.kill();
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [loaded]);

  const overlay = activeOverlay >= 0 ? OVERLAYS[activeOverlay] : null;

  return (
    <div ref={containerRef} className="scrolly-container">
      <div className="scrolly-sticky">
        {/* Canvas */}
        <canvas ref={canvasRef} className="scrolly-canvas" />

        {/* Gold vignette overlay */}
        <div className="scrolly-vignette" />

        {/* Loading screen */}
        {!loaded && (
          <div className="scrolly-loader">
            <div className="scrolly-loader-inner">
              <div className="scrolly-spinner" />
              <p className="scrolly-loader-text">Loading animation... {loadProgress}%</p>
              <div className="scrolly-loader-bar">
                <div
                  className="scrolly-loader-fill"
                  style={{ width: `${loadProgress}%` }}
                />
              </div>
            </div>
          </div>
        )}

        {/* Text overlays that appear at specific frames */}
        {loaded && overlay && (
          <div className="scrolly-overlay" key={activeOverlay}>
            <div className="scrolly-overlay-content">
              <p className="scrolly-overlay-sub">{overlay.sub}</p>
              <h2 className="scrolly-overlay-title">{overlay.text}</h2>
            </div>
          </div>
        )}

        {/* Scroll hint at start */}
        {loaded && (
          <div className="scrolly-hint">
            <span>Scroll to animate</span>
            <div className="scrolly-hint-arrow" />
          </div>
        )}

        {/* Frame counter */}
        {loaded && (
          <div className="scrolly-counter" aria-hidden="true">
            <span id="scrolly-frame-display">01 / 120</span>
          </div>
        )}
      </div>
    </div>
  );
}
