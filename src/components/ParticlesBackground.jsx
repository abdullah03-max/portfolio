import { useEffect, useMemo, useRef, useState } from 'react';
import Particles, { initParticlesEngine } from '@tsparticles/react';
import { loadSlim } from '@tsparticles/slim';

const MOBILE_BREAKPOINT = 768;
const PARALLAX_SPEED = 0.3;

function ParticlesBackground() {
  const [isReady, setIsReady] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < MOBILE_BREAKPOINT);
  const [renderOffset, setRenderOffset] = useState(0);
  const scrollStateRef = useRef({
    currentOffset: 0,
    targetOffset: 0,
    lastScrollY: window.scrollY,
    velocity: 0,
    rafId: null
  });

  useEffect(() => {
    initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    }).then(() => {
      setIsReady(true);
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    let lastTimestamp = performance.now();

    const handleScroll = () => {
      const state = scrollStateRef.current;
      const nextScrollY = window.scrollY;
      state.velocity = nextScrollY - state.lastScrollY;
      state.lastScrollY = nextScrollY;
      state.targetOffset = nextScrollY * PARALLAX_SPEED;

      if (!state.rafId) {
        state.rafId = requestAnimationFrame(animate);
      }
    };

    const animate = (timestamp) => {
      const state = scrollStateRef.current;
      const elapsed = Math.max(16, timestamp - lastTimestamp);
      lastTimestamp = timestamp;

      const smoothing = Math.min(0.2, elapsed / 120);
      const velocityBoost = Math.min(0.18, Math.abs(state.velocity) / 1200);
      const easing = smoothing + velocityBoost;

      state.currentOffset += (state.targetOffset - state.currentOffset) * easing;
      state.velocity *= 0.9;
      setRenderOffset(state.currentOffset);

      if (Math.abs(state.targetOffset - state.currentOffset) > 0.1 || Math.abs(state.velocity) > 0.1) {
        state.rafId = requestAnimationFrame(animate);
        return;
      }

      state.currentOffset = state.targetOffset;
      setRenderOffset(state.targetOffset);
      state.rafId = null;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollStateRef.current.rafId) {
        cancelAnimationFrame(scrollStateRef.current.rafId);
      }
    };
  }, []);

  const options = useMemo(
    () => ({
      background: {
        color: 'transparent'
      },
      fullScreen: {
        enable: false
      },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: {
          value: isMobile ? 40 : 80,
          density: {
            enable: true,
            area: 900
          }
        },
        color: {
          value: ['#c9a84c', '#ffffff']
        },
        links: {
          enable: true,
          color: 'rgba(201,168,76,0.2)',
          distance: 150,
          opacity: 0.2,
          width: 1
        },
        move: {
          enable: true,
          direction: 'none',
          outModes: {
            default: 'out'
          },
          random: true,
          speed: 0.4,
          straight: false
        },
        opacity: {
          value: { min: 0.4, max: 0.6 }
        },
        size: {
          value: { min: 1, max: 3 }
        }
      },
      interactivity: {
        events: {
          onHover: {
            enable: false
          },
          onClick: {
            enable: false
          },
          resize: {
            enable: true
          }
        }
      }
    }),
    [isMobile]
  );

  if (!isReady) {
    return null;
  }

  return (
    <div
      className="particles-background"
      aria-hidden="true"
      style={{ transform: `translate3d(0, ${renderOffset}px, 0)` }}
    >
      <Particles className="particles-canvas" id="portfolio-particles" options={options} />
    </div>
  );
}

export default ParticlesBackground;