import { lazy, Suspense, useState } from 'react';
import { motion } from 'framer-motion';
import BioText from './BioText';
import SkillTags from './SkillTags';
import use3DCapability from '../../hooks/use3DCapability';

const Workspace3D = lazy(() => import('./Workspace3D'));

function HeroSection({ onViewWork, onContact }) {
  const [activeTag, setActiveTag] = useState(null);
  const [sceneReady, setSceneReady] = useState(false);
  const { canRender3D, fallbackReason } = use3DCapability();

  return (
    <section id="hero" className="section-block hero pt-10 md:pt-14" aria-label="Hero section">
      <div className="hero-bg-orb orb-one" />
      <div className="hero-bg-orb orb-two" />

      <div className="grid gap-6 lg:grid-cols-[1.08fr_1fr] lg:items-center">
        <div className="relative z-10">
          <BioText />
          <SkillTags onTagFocus={setActiveTag} />

          <div className="hero-actions mt-6">
            <button type="button" className="btn-primary" onClick={onViewWork} aria-label="Scroll to projects section">
              View My Work
            </button>
            <button type="button" className="btn-outline" onClick={onContact} aria-label="Scroll to contact section">
              Contact Me
            </button>
            <a className="btn-ghost" href="/assets/Blue and Yellow Modern Resume_2.pdf" download aria-label="Download CV PDF">
              Download CV
            </a>
          </div>

          <figure className="profile-card mt-5">
            <img src="/assets/profile.png" alt="Portrait of Abdullah Aftab" className="profile-image" />
          </figure>
        </div>

        <motion.div
          initial={{ y: 14 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="relative h-[470px] overflow-hidden rounded-2xl border border-gold-500/30 bg-[#0f0f0f] shadow-glowGold"
        >
          {canRender3D ? (
            <Suspense fallback={<div className="scene-loading">Preparing interactive workspace...</div>}>
              <Workspace3D activeTag={activeTag} onReady={() => setSceneReady(true)} />
            </Suspense>
          ) : (
            <div className="scene-mobile-note" role="status" aria-live="polite">
              <div className="glass-card mx-4 w-[calc(100%-2rem)] p-4 text-left">
                <p className="text-xs uppercase tracking-[0.12em] text-gold-300">Performance Fallback</p>
                <h4 className="mt-1 text-xl font-semibold text-gold-100">2D Workspace Preview</h4>
                <p className="mt-2 text-sm leading-6 text-zinc-300">{fallbackReason}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-xs text-gold-200">
                  <span className="rounded-full border border-gold-500/40 px-2 py-1">React</span>
                  <span className="rounded-full border border-gold-500/40 px-2 py-1">Node.js</span>
                  <span className="rounded-full border border-gold-500/40 px-2 py-1">Flutter</span>
                </div>
              </div>
            </div>
          )}

          {canRender3D && !sceneReady ? <div className="scene-shimmer" aria-hidden="true" /> : null}

          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(245,197,66,0.18),transparent_38%),radial-gradient(circle_at_86%_84%,rgba(103,138,255,0.17),transparent_35%),linear-gradient(to_top,rgba(8,10,14,0.82),transparent_46%)]" />
          <div className="scene-caption">Interactive Workspace 3D</div>
        </motion.div>
      </div>
    </section>
  );
}

export default HeroSection;
