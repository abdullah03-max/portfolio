import { lazy, Suspense, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link, useNavigate } from 'react-router-dom';
import ParticlesBackground from './components/ParticlesBackground';

gsap.registerPlugin(ScrollTrigger);

const SEQ_FRAME_COUNT = 120;
const FRAME_SCROLL_SPEED_MULTIPLIER = 1.0;
const seqFramePath = (i) =>
  `/sequence/frame_${String(i).padStart(3, '0')}_delay-0.066s.png`;

function drawSeqFrame(ctx, canvas, img) {
  if (!img || !img.complete) return;
  const cw = canvas.width; const ch = canvas.height;
  const iw = img.naturalWidth || img.width;
  const ih = img.naturalHeight || img.height;
  const cr = cw / ch; const ir = iw / ih;
  let rw, rh, x, y;
  if (cr > ir) { rw = cw; rh = cw / ir; x = 0; y = (ch - rh) / 2; }
  else { rh = ch; rw = ch * ir; x = (cw - rw) / 2; y = 0; }
  ctx.clearRect(0, 0, cw, ch);
  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, cw, ch);
  ctx.drawImage(img, x, y, rw, rh);
}

const WorkspaceScene = lazy(() => import('./components/WorkspaceScene'));

const navItems = [
  { id: 'hero', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'skills', label: 'Skills' },
  { id: 'projects', label: 'Projects' },
  { id: 'experience', label: 'Experience' },
  { id: 'education', label: 'Education' },
  { id: 'languages', label: 'Languages' },
  { id: 'contact', label: 'Contact' }
];

const skills = [
  'React',
  'JavaScript',
  'Python',
  'Flutter',
  'C++',
  'C#'
];

const skillsBadges = [
  'React.js',
  'Flutter',
  'JavaScript',
  'Node.js',
  'MongoDB',
  'Python',
  'C++',
  'C#',
  'REST API',
  'JWT Auth',
  'DSA',
  'HTML & CSS'
];

const skillsPanels = [
  {
    title: 'Frontend Development',
    placement: 'frontend',
    items: [
      { name: 'HTML & CSS', level: 90 },
      { name: 'JavaScript', level: 85 },
      { name: 'React.js', level: 85 },
      { name: 'Flutter', level: 80 },
      { name: 'Responsive UI', level: 88 }
    ]
  },
  {
    title: 'Backend Development',
    placement: 'backend',
    items: [
      { name: 'Node.js', level: 75 },
      { name: 'REST API', level: 80 },
      { name: 'JWT Auth', level: 78 }
    ]
  },
  {
    title: 'Database & Tools',
    placement: 'database',
    items: [
      { name: 'MongoDB', level: 75 },
      { name: 'C++ / DSA', level: 75 },
      { name: 'Python', level: 70 }
    ]
  }
];

const projects = [
  {
    title: 'Hotel Management System',
    description:
      'A full-stack MERN application with room booking, check-in/check-out, billing, room service workflows, and role-based staff dashboards powered by JWT authentication and REST APIs.',
    tech: ['MongoDB', 'Express', 'React', 'Node.js', 'JWT', 'REST API'],
    github: 'https://github.com/abdullah03-max/hotel-management-system'
  },
  {
    title: 'AllInOne Marketplace',
    description:
      'An OLX-like classified marketplace featuring store registration, ad posting, buyer-seller chat, Cloudinary image uploads, advanced search/filtering, and user review systems.',
    tech: ['React.js', 'Node.js', 'JWT', 'Cloudinary', 'REST API']
  },
  {
    title: 'Weather App',
    description:
      'A Flutter weather application with live API integration for real-time temperature and forecasts, enhanced with smooth animations and reliable state management.',
    tech: ['Flutter', 'Dart', 'Weather API', 'State Management']
  },
  {
    title: 'Dice Roller',
    description:
      'A two-player Flutter dice game featuring animated dice rolls, random roll logic, score tracking, and polished state handling for responsive gameplay.',
    tech: ['Flutter', 'Dart', 'Animations', 'Game Logic']
  }
];

const experiences = [
  {
    company: 'Developer Hub Corporation',
    role: 'Web Developer Intern',
    period: '2026-Present',
    details:
      'Built responsive websites using the MERN stack, worked extensively with React.js, and contributed to complete full-stack feature development.'
  },
  {
    company: 'Deloitte',
    role: 'Data Analytics Intern',
    period: '2025-2026',
    details:
      'Completed a data analytics simulation, analyzed and visualized data sets, and strengthened practical skills using modern analytics tools.'
  }
];

const education = [
  {
    institute: 'COMSATS University Islamabad',
    degree: 'BSc Computer Science',
    period: '2023-2026'
  },
  {
    institute: 'GOVT College',
    degree: 'Intermediate',
    period: '2020-2022'
  }
];

const languages = [
  { name: 'Urdu', level: 'Fluent', value: 95 },
  { name: 'English', level: 'Good', value: 75 }
];

const sectionVariants = {
  hidden: { y: 36 },
  visible: {
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

const topDownSectionVariants = {
  hidden: { y: -72 },
  visible: {
    y: 0,
    transition: {
      duration: 0.6,
      ease: 'easeOut'
    }
  }
};

function App() {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('hero');
  const [menuOpen, setMenuOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(() => window.matchMedia('(min-width: 981px)').matches);
  const [sceneReady, setSceneReady] = useState(false);
  const [isSkillBurstActive, setIsSkillBurstActive] = useState(false);
  const [isSkillLoadingActive, setIsSkillLoadingActive] = useState(false);
  const [loadedSkills, setLoadedSkills] = useState([]);
  const heroKickerRef = useRef(null);
  const heroNameRef = useRef(null);
  const heroRoleRef = useRef(null);
  const heroTaglineRef = useRef(null);
  const heroActionsRef = useRef(null);
  const skillMarqueeRef = useRef(null);
  const skillsSectionRef = useRef(null);
  const skillBurstLayerRef = useRef(null);
  const mascotRef = useRef(null);
  const mascotEyeLeftRef = useRef(null);
  const mascotEyeRightRef = useRef(null);
  const mascotSmileRef = useRef(null);
  const mascotArmLeftRef = useRef(null);
  const mascotArmRightRef = useRef(null);
  const idleMascotRef = useRef(null);
  const idleMascotArmRef = useRef(null);
  const idleMascotEyeLeftRef = useRef(null);
  const idleMascotEyeRightRef = useRef(null);
  const skillBallRefs = useRef([]);
  const skillShotRefs = useRef([]);
  const skillTargetRefs = useRef([]);
  const sparkRefs = useRef([]);
  const skillBurstTimelineRef = useRef(null);
  const skillLoadTimelineRef = useRef(null);
  const sectionsWrapperRef = useRef(null);
  const aboutSkillsWrapperRef = useRef(null);
  const experienceWrapperRef = useRef(null);
  const eduLangWrapperRef = useRef(null);
  const bgCanvasRef = useRef(null);
  const seqImagesRef = useRef([]);
  const seqRafRef = useRef(null);
  const lastDrawnFrameRef = useRef(-1);
  const [seqLoaded, setSeqLoaded] = useState(false);
  const [seqLoadPct, setSeqLoadPct] = useState(0);
  const [skillsVisible, setSkillsVisible] = useState(false);
  const observerOptions = useMemo(
    () => ({
      threshold: [0.4, 0.6],
      rootMargin: '-10% 0px -35% 0px'
    }),
    []
  );

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));

    return () => observer.disconnect();
  }, [observerOptions]);

  useEffect(() => {
    const section = skillsSectionRef.current;
    if (!section) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setSkillsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.34, rootMargin: '-8% 0px -8% 0px' }
    );

    observer.observe(section);

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const timeline = gsap.timeline({ defaults: { ease: 'power3.out' } });

    timeline
      .fromTo(heroKickerRef.current, { y: 18 }, { y: 0, duration: 0.5 })
      .fromTo(
        heroNameRef.current,
        { y: 24, letterSpacing: '0.22em' },
        { y: 0, letterSpacing: '0.04em', duration: 0.8 },
        '-=0.2'
      )
      .fromTo(heroRoleRef.current, { y: 16 }, { y: 0, duration: 0.55 }, '-=0.34')
      .fromTo(heroTaglineRef.current, { y: 18 }, { y: 0, duration: 0.55 }, '-=0.26')
      .fromTo(heroActionsRef.current, { y: 12 }, { y: 0, duration: 0.45 }, '-=0.2');

    return () => timeline.kill();
  }, []);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 981px)');

    const handleMediaChange = (event) => {
      setIsDesktop(event.matches);
      setSceneReady(false);
    };

    mediaQuery.addEventListener('change', handleMediaChange);
    return () => mediaQuery.removeEventListener('change', handleMediaChange);
  }, []);

  useEffect(() => {
    return () => {
      if (skillBurstTimelineRef.current) skillBurstTimelineRef.current.kill();
      if (skillLoadTimelineRef.current) skillLoadTimelineRef.current.kill();
      if (seqRafRef.current) cancelAnimationFrame(seqRafRef.current);
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  // Preload sequence frames
  useEffect(() => {
    let done = 0;
    const imgs = [];
    for (let i = 0; i < SEQ_FRAME_COUNT; i++) {
      const img = new Image();
      img.src = seqFramePath(i);
      img.onload = () => {
        done++;
        setSeqLoadPct(Math.round((done / SEQ_FRAME_COUNT) * 100));
        if (done === SEQ_FRAME_COUNT) {
          seqImagesRef.current = imgs;
          setSeqLoaded(true);
          const canvas = bgCanvasRef.current;
          if (canvas) {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            drawSeqFrame(canvas.getContext('2d'), canvas, imgs[0]);
          }
        }
      };
      imgs.push(img);
    }
    seqImagesRef.current = imgs;
  }, []);

  // Canvas resize
  useEffect(() => {
    const resize = () => {
      const canvas = bgCanvasRef.current;
      if (!canvas) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  // GSAP ScrollTrigger: drive canvas from sections wrapper scroll
  useEffect(() => {
    if (!seqLoaded) return;
    const wrapper = sectionsWrapperRef.current;
    const canvas = bgCanvasRef.current;
    if (!wrapper || !canvas) return;

    const trigger = ScrollTrigger.create({
      trigger: wrapper,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.45,
      onUpdate: (self) => {
        const boostedProgress = Math.min(1, self.progress * FRAME_SCROLL_SPEED_MULTIPLIER);
        const frame = Math.min(
          SEQ_FRAME_COUNT - 1,
          Math.max(0, Math.floor(boostedProgress * (SEQ_FRAME_COUNT - 1)))
        );
        if (frame === lastDrawnFrameRef.current) return;
        lastDrawnFrameRef.current = frame;
        const imgs = seqImagesRef.current;
        if (!imgs[frame]) return;
        if (seqRafRef.current) cancelAnimationFrame(seqRafRef.current);
        seqRafRef.current = requestAnimationFrame(() => {
          drawSeqFrame(canvas.getContext('2d'), canvas, imgs[frame]);
        });
      }
    });

    return () => trigger.kill();
  }, [seqLoaded]);

  useEffect(() => {
    const idleMascot = idleMascotRef.current;
    const idleArm = idleMascotArmRef.current;
    const idleEyeLeft = idleMascotEyeLeftRef.current;
    const idleEyeRight = idleMascotEyeRightRef.current;

    if (!idleMascot || !idleArm || !idleEyeLeft || !idleEyeRight) {
      return undefined;
    }

    const idleTimeline = gsap.timeline({ repeat: -1, defaults: { ease: 'sine.inOut' } });

    idleTimeline
      .to(idleMascot, { y: -7, duration: 0.9 })
      .to(idleMascot, { y: 0, duration: 0.9 })
      .to(idleArm, { rotation: -24, duration: 0.25, transformOrigin: '50% 12%' }, 0.3)
      .to(idleArm, { rotation: 18, duration: 0.25, transformOrigin: '50% 12%' }, 0.55)
      .to(idleEyeLeft, { scaleY: 0.15, duration: 0.08, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 1.1)
      .to(idleEyeRight, { scaleY: 0.15, duration: 0.08, yoyo: true, repeat: 1, transformOrigin: '50% 50%' }, 1.1);

    return () => {
      idleTimeline.kill();
    };
  }, []);

  const handleScrollTo = (id) => {
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const fullFrameIds = new Set(['about', 'skills', 'projects', 'experience', 'education', 'languages', 'contact']);
      const nav = document.querySelector('.top-nav');
      const navOffset = (nav?.offsetHeight ?? 0) + 12;
      const offset = fullFrameIds.has(id) ? 0 : navOffset;
      const elementTop = element.getBoundingClientRect().top + window.scrollY;
      const targetTop = Math.max(0, elementTop - offset);

      window.scrollTo({ top: targetTop, behavior: 'smooth' });
    }
  };

  const handleProjectsBurstClick = (event) => {
    event.preventDefault();
    const button = event.currentTarget;
    const rect = button.getBoundingClientRect();
    const x = event.clientX ? event.clientX - rect.left : rect.width / 2;
    const y = event.clientY ? event.clientY - rect.top : rect.height / 2;
    const particleCount = 25;

    button.classList.add('is-pressed');

    for (let i = 0; i < particleCount; i += 1) {
      const particle = document.createElement('span');
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = Math.random() * 80 + 40;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      particle.className = 'projects-particle';
      particle.style.left = `${x}px`;
      particle.style.top = `${y}px`;
      particle.style.width = `${Math.random() * 3 + 3}px`;
      particle.style.height = particle.style.width;
      particle.style.background = Math.random() > 0.5 ? '#c9a84c' : '#ffffff';
      particle.style.setProperty('--tx', `${tx}px`);
      particle.style.setProperty('--ty', `${ty}px`);

      button.appendChild(particle);
      window.setTimeout(() => particle.remove(), 800);
    }

    window.setTimeout(() => {
      button.classList.remove('is-pressed');
      navigate('/projects');
    }, 140);
  };

  const triggerSkillBurst = () => {
    const marquee = skillMarqueeRef.current;
    const layer = skillBurstLayerRef.current;
    const mascot = mascotRef.current;
    const leftEye = mascotEyeLeftRef.current;
    const rightEye = mascotEyeRightRef.current;
    const smile = mascotSmileRef.current;
    const leftArm = mascotArmLeftRef.current;
    const rightArm = mascotArmRightRef.current;
    const balls = skillBallRefs.current.filter(Boolean);
    const sparks = sparkRefs.current.filter(Boolean);

    if (!marquee || !layer || !mascot || !leftEye || !rightEye || !smile || !leftArm || !rightArm || balls.length === 0) {
      return;
    }

    if (skillBurstTimelineRef.current) {
      skillBurstTimelineRef.current.kill();
    }

    setIsSkillBurstActive(true);

    gsap.set(layer, { autoAlpha: 1 });
    gsap.set(mascot, { x: 0, y: 0, rotation: 0, scale: 0.8, transformOrigin: '50% 75%' });
    gsap.set([leftEye, rightEye], { scaleY: 1, transformOrigin: '50% 50%' });
    gsap.set(smile, { scaleX: 1, scaleY: 1, transformOrigin: '50% 50%' });
    gsap.set(leftArm, { rotation: 22, transformOrigin: '50% 12%' });
    gsap.set(rightArm, { rotation: -22, transformOrigin: '50% 12%' });
    gsap.set(sparks, { x: 0, y: 0, scale: 0.2, autoAlpha: 0 });
    gsap.set(balls, {
      x: 0,
      y: 0,
      scale: 0.35,
      autoAlpha: 0,
      transformOrigin: '50% 50%'
    });

    const orbitState = { angle: 0, radius: 58 };
    const orbitStep = (Math.PI * 2) / balls.length;

    const timeline = gsap.timeline({
      onComplete: () => {
        setIsSkillBurstActive(false);
      }
    });

    timeline
      .to(mascot, { scale: 1, duration: 0.26, ease: 'back.out(1.7)' })
      .to([leftEye, rightEye], { scaleY: 0.15, duration: 0.08, yoyo: true, repeat: 1, ease: 'power1.inOut' }, '<')
      .to(smile, { scaleX: 1.14, scaleY: 0.82, duration: 0.14, yoyo: true, repeat: 1, ease: 'sine.inOut' }, '<')
      .to(
        leftArm,
        {
          keyframes: [
            { rotation: -36, duration: 0.2, ease: 'power1.inOut' },
            { rotation: 38, duration: 0.2, ease: 'power1.inOut' },
            { rotation: -20, duration: 0.2, ease: 'power1.inOut' }
          ]
        },
        '<'
      )
      .to(
        rightArm,
        {
          keyframes: [
            { rotation: 14, duration: 0.2, ease: 'power1.inOut' },
            { rotation: -30, duration: 0.2, ease: 'power1.inOut' },
            { rotation: -22, duration: 0.2, ease: 'power1.inOut' }
          ]
        },
        '<'
      )
      .to(
        [leftArm, rightArm],
        {
          keyframes: [
            { rotation: -60, duration: 0.14, ease: 'power1.inOut' },
            { rotation: 60, duration: 0.14, ease: 'power1.inOut' },
            { rotation: -18, duration: 0.12, ease: 'power1.inOut' }
          ],
          stagger: 0.02
        },
        '>-0.08'
      )
      .to(
        balls,
        {
          autoAlpha: 1,
          scale: 1,
          duration: 0.36,
          ease: 'power2.out',
          stagger: 0.04
        },
        '<'
      )
      .to(
        mascot,
        {
          keyframes: [
            { y: -84, rotation: 220, duration: 0.44, ease: 'power2.out' },
            { y: 0, rotation: 420, duration: 0.36, ease: 'bounce.out' },
            { y: -62, rotation: 610, duration: 0.36, ease: 'power2.out' },
            { y: 0, rotation: 820, duration: 0.44, ease: 'bounce.out' }
          ]
        },
        '>-0.02'
      )
      .to(
        orbitState,
        {
          angle: Math.PI * 4.8,
          radius: 132,
          duration: 1.85,
          ease: 'power2.inOut',
          onUpdate: () => {
            balls.forEach((ball, index) => {
              const currentAngle = orbitState.angle + orbitStep * index;
              const depth = (Math.sin(currentAngle) + 1) / 2;
              gsap.set(ball, {
                x: Math.cos(currentAngle) * orbitState.radius,
                y: Math.sin(currentAngle) * (orbitState.radius * 0.62),
                scale: 0.7 + depth * 0.5,
                zIndex: Math.round(depth * 10)
              });
            });
          }
        },
        '<'
      )
      .add(() => {
        sparks.forEach((spark, index) => {
          const angle = (Math.PI * 2 * index) / Math.max(sparks.length, 1);
          const radius = 38 + (index % 3) * 8;

          gsap.fromTo(
            spark,
            { x: 0, y: 0, scale: 0.35, autoAlpha: 0.95 },
            {
              x: Math.cos(angle) * radius,
              y: Math.sin(angle) * radius * 0.7,
              scale: 0,
              autoAlpha: 0,
              duration: 0.44,
              ease: 'power2.out'
            }
          );
        });
      }, '>-0.22')
      .to(
        balls,
        {
          x: 0,
          y: 0,
          scale: 0.45,
          autoAlpha: 0,
          duration: 0.55,
          ease: 'power2.inOut',
          stagger: { each: 0.03, from: 'end' }
        },
        '>-0.2'
      )
      .to(layer, { autoAlpha: 0, duration: 0.34, ease: 'power1.inOut' }, '<0.06');

    skillBurstTimelineRef.current = timeline;
  };

  const triggerMascotSkillLoad = (event) => {
    event.preventDefault();
    event.stopPropagation();

    const marquee = skillMarqueeRef.current;
    const sourceMascot = idleMascotRef.current;
    const targets = skillTargetRefs.current.filter(Boolean);
    const shots = skillShotRefs.current.filter(Boolean);

    if (!marquee || !sourceMascot || targets.length !== skills.length || shots.length !== skills.length) {
      return;
    }

    if (skillLoadTimelineRef.current) {
      skillLoadTimelineRef.current.kill();
    }

    setIsSkillLoadingActive(true);
    setLoadedSkills([]);

    const containerRect = marquee.getBoundingClientRect();
    const sourceRect = sourceMascot.getBoundingClientRect();
    const startX = sourceRect.left + sourceRect.width / 2 - containerRect.left;
    const startY = sourceRect.top + sourceRect.height * 0.6 - containerRect.top;

    gsap.set(shots, {
      autoAlpha: 0,
      x: startX,
      y: startY,
      scale: 0.35,
      transformOrigin: '50% 50%'
    });

    const timeline = gsap.timeline({
      defaults: { ease: 'power2.inOut' },
      onComplete: () => {
        setIsSkillLoadingActive(false);
      }
    });

    skills.forEach((skill, index) => {
      const targetRect = targets[index].getBoundingClientRect();
      const targetX = targetRect.left + targetRect.width / 2 - containerRect.left;
      const targetY = targetRect.top + targetRect.height / 2 - containerRect.top;
      const launchAt = index * 0.24;

      timeline
        .to(
          shots[index],
          {
            autoAlpha: 1,
            scale: 1,
            duration: 0.08,
            ease: 'power1.out'
          },
          launchAt
        )
        .to(
          shots[index],
          {
            x: targetX,
            y: targetY,
            duration: 0.52
          },
          launchAt + 0.02
        )
        .to(
          shots[index],
          {
            autoAlpha: 0,
            scale: 0.18,
            duration: 0.14,
            ease: 'power1.in'
          },
          launchAt + 0.42
        )
        .add(() => {
          setLoadedSkills((prev) => (prev.includes(skill) ? prev : [...prev, skill]));
        }, launchAt + 0.44);
    });

    skillLoadTimelineRef.current = timeline;
  };

  return (
    <AnimatePresence mode="wait">
      <ParticlesBackground />
      <motion.div
        key="portfolio-page"
        className="app-shell"
        initial={{ y: 12 }}
        animate={{ y: 0 }}
        exit={{ y: -10 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
      >
      <header className="top-nav">
        <div className="brand">Abdullah Aftab</div>
        <button
          type="button"
          className="menu-toggle"
          onClick={() => setMenuOpen((prev) => !prev)}
          aria-label="Toggle navigation"
        >
          <span />
          <span />
          <span />
        </button>

        <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
          {navItems.filter((item) => item.id !== 'contact').map((item) => (
            <button
              key={item.id}
              type="button"
              className={activeSection === item.id ? 'active' : ''}
              onClick={() => handleScrollTo(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <button
          type="button"
          className={`nav-contact-btn${activeSection === 'contact' ? ' active' : ''}`}
          onClick={() => handleScrollTo('contact')}
        >
          Contact
        </button>
      </header>

      <main>
        <section id="hero" className="hero section-block">
          <div className="hero-bg-orb orb-one" />
          <div className="hero-bg-orb orb-two" />
          <div className="hero-grid">
            <div className="hero-content">
              <p ref={heroKickerRef} className="kicker">
                Computer Science Student
              </p>
              <h1 ref={heroNameRef}>Abdullah Aftab</h1>
              <h2 ref={heroRoleRef}>Computer Science Student | Web Developer | Flutter Developer</h2>
              <p ref={heroTaglineRef} className="hero-tagline">
                Building modern web and mobile experiences that blend performance, usability, and visual storytelling.
              </p>
              <div ref={heroActionsRef} className="hero-actions">
                <button type="button" className="btn-primary" onClick={() => handleScrollTo('projects')}>
                  View My Work
                </button>
                <button type="button" className="btn-outline" onClick={() => handleScrollTo('contact')}>
                  Contact Me
                </button>
                <a className="btn-ghost" href="/assets/Blue and Yellow Modern Resume_2.pdf" download>
                  Download CV
                </a>
              </div>
              <figure className="profile-card">
                <img src="/assets/profile.png" alt="Abdullah Aftab profile" className="profile-image" />
              </figure>
            </div>

            <motion.div
              className="hero-visual"
              initial={{ x: 30 }}
              whileInView={{ x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
            >
              {isDesktop ? (
                <Suspense fallback={<div className="scene-loading">Loading 3D workspace...</div>}>
                  <WorkspaceScene onReady={() => setSceneReady(true)} />
                </Suspense>
              ) : (
                <div className="scene-mobile-note">3D scene is enabled on desktop for best performance.</div>
              )}
              {isDesktop && !sceneReady ? <div className="scene-shimmer" aria-hidden="true" /> : null}
            </motion.div>
          </div>
        </section>

        <div ref={sectionsWrapperRef} className="sections-canvas-wrapper">

          {/* Sticky background canvas */}
          <div className="sections-bg-stage">
            <canvas ref={bgCanvasRef} className="sections-bg-canvas image-frame" />
            <div className="sections-bg-vignette" />
          </div>

          {/* Sections scroll top-to-down on the sticky canvas */}
          <div className="sections-stack">
            <motion.section
              id="about"
              className="about-section scroll-stage-section"
              variants={topDownSectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="about-overlay" />
              <div className="about-stage-shell">
                <div className="about-overlay-content">
                  <p className="about-kicker">About Me</p>
                  <h2 className="about-headline">3+ Years<br />Experience.</h2>
                  <p className="about-sub">Specializing in MERN Stack, Flutter &amp; Scalable Applications.</p>
                  <div className="about-inline-stats">
                    <div><span>04+</span><p>Projects</p></div>
                    <div><span>02</span><p>Internships</p></div>
                    <div><span>COMSATS</span><p>University</p></div>
                  </div>
                  <div className="about-chip-list">
                    <span>MERN Stack</span>
                    <span>Flutter &amp; Dart</span>
                    <span>Clean Code</span>
                    <span>Responsive UI</span>
                    <span>API Integration</span>
                  </div>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="skills"
              ref={skillsSectionRef}
              className={`skills-pro-section scroll-stage-section ${skillsVisible ? 'is-visible' : ''}`}
              variants={topDownSectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="skills-pro-overlay" />
              <div className="skills-pro-wrap">
                <div className="skills-copy-col">
                  <p className="skills-pro-kicker skills-fade" style={{ '--skills-delay': '0.04s' }}>Technical Expertise</p>
                  <h3 className="skills-fade" style={{ '--skills-delay': '0.12s' }}>Core Skills.</h3>
                  <p className="skills-pro-sub skills-fade" style={{ '--skills-delay': '0.2s' }}>
                    Production-ready frontend, backend and mobile development skills.
                  </p>

                  <div className="skills-stats-row skills-fade" style={{ '--skills-delay': '0.28s' }}>
                    <div>
                      <strong>6+</strong>
                      <span>Technologies</span>
                    </div>
                    <div>
                      <strong>85%</strong>
                      <span>React.js</span>
                    </div>
                    <div>
                      <strong>80%</strong>
                      <span>Flutter</span>
                    </div>
                  </div>

                  <div className="skills-badges skills-fade" style={{ '--skills-delay': '0.36s' }}>
                    {skillsBadges.map((badge) => (
                      <span key={badge}>{badge}</span>
                    ))}
                  </div>
                </div>

                <div className="skills-cards-col">
                  {skillsPanels.map((panel, panelIndex) => (
                    <article
                      key={panel.title}
                      className={`skills-track-card skills-fade skills-card-${panel.placement}`}
                      style={{ '--skills-delay': `${0.18 + panelIndex * 0.1}s` }}
                    >
                      <header className="skills-track-head">
                        <h4>{panel.title}</h4>
                      </header>

                      <div className="skills-track-list">
                        {panel.items.map((item, itemIndex) => (
                          <div key={`${panel.title}-${item.name}`} className="skills-track-row">
                            <div className="skills-track-row-head">
                              <h5>{item.name}</h5>
                              <span>{item.level}%</span>
                            </div>
                            <div className="skills-track-bar" aria-hidden="true">
                              <span
                                style={{
                                  '--skills-level': `${item.level}%`,
                                  transitionDelay: `${0.26 + panelIndex * 0.08 + itemIndex * 0.06}s`
                                }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section
              id="projects"
              className="projects-stage-section scroll-stage-section"
              variants={topDownSectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="projects-stage-overlay" />
              <div className="projects-stage-shell">
                <div className="projects-stage-copy">
                  <p className="about-kicker">Selected Work</p>
                  <h3 className="projects-stage-title">Featured<br />Projects.</h3>
                  <p className="projects-stage-sub">
                    Real-world products across web and mobile, focused on practical UX, scalable code, and production-ready delivery.
                  </p>

                  <div className="about-inline-stats projects-stage-stats">
                    <div><span>{String(projects.length).padStart(2, '0')}+</span><p>Builds</p></div>
                    <div><span>MERN</span><p>Stack</p></div>
                    <div><span>Flutter</span><p>Apps</p></div>
                  </div>

                  <div className="about-chip-list projects-stage-chips">
                    <span>Full Stack Systems</span>
                    <span>Marketplace Flows</span>
                    <span>REST APIs</span>
                    <span>Cross-Platform Apps</span>
                  </div>
                </div>

                <div className="projects-stage-action">
                  <Link className="projects-view-btn" to="/projects" onClick={handleProjectsBurstClick}>
                    View Projects &rarr;
                  </Link>
                </div>
              </div>
            </motion.section>

            <motion.section
              id="experience"
              className="experience-stage-section scroll-stage-section"
              variants={topDownSectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="experience-stage-overlay" />
              <div className="experience-stage-shell">
                <div className="experience-stage-copy">
                  <p className="about-kicker">Work History</p>
                  <h3 className="experience-stage-title">Professional<br />Experience.</h3>
                  <p className="experience-stage-sub">
                    Hands-on internships in web development and data analytics, focused on shipping real features and solving practical problems.
                  </p>
                  <div className="about-inline-stats experience-stage-stats">
                    <div><span>02</span><p>Internships</p></div>
                    <div><span>3+</span><p>Years</p></div>
                    <div><span>MERN</span><p>Stack</p></div>
                  </div>
                </div>
                <div className="experience-stage-list">
                  {experiences.map((item, index) => (
                    <article className="experience-stage-card" key={`${item.company}-${item.role}`}>
                      <div className="experience-stage-card-head">
                        <h4>{item.company}</h4>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <p className="experience-stage-role">{item.role} · {item.period}</p>
                      <p>{item.details}</p>
                    </article>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section
              id="education"
              className="edu-lang-section edu-stage-section scroll-stage-section"
              variants={topDownSectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="edu-stage-overlay" />
              <div className="edu-stage-shell">
                <div className="edu-stage-copy">
                  <p className="about-kicker">Academic Journey</p>
                  <h3 className="edu-stage-title">Education.</h3>
                  <p className="edu-stage-sub">
                    Strong computer science foundation with focus on software engineering, problem solving, and real-world project execution.
                  </p>
                  <div className="about-inline-stats edu-stage-stats">
                    <div><span>{String(education.length).padStart(2, '0')}</span><p>Milestones</p></div>
                    <div><span>CS</span><p>Major</p></div>
                    <div><span>2026</span><p>Graduation</p></div>
                  </div>
                  <div className="about-chip-list edu-stage-chips">
                    <span>Computer Science</span>
                    <span>Software Engineering</span>
                    <span>Data Structures</span>
                    <span>Problem Solving</span>
                  </div>
                </div>

                <div className="edu-stage-list">
                  {education.map((item, index) => (
                    <article className="edu-stage-card" key={`${item.institute}-${item.degree}`}>
                      <div className="edu-stage-card-head">
                        <h4>{item.institute}</h4>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <p className="edu-stage-degree">{item.degree}</p>
                      <p>{item.period}</p>
                    </article>
                  ))}
                </div>
              </div>
            </motion.section>

            <motion.section
              id="languages"
              className="edu-lang-section lang-stage-section scroll-stage-section"
              variants={topDownSectionVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
            >
              <div className="lang-stage-overlay" />
              <div className="lang-stage-shell">
                <div className="lang-stage-copy">
                  <p className="about-kicker">Communication</p>
                  <h3 className="lang-stage-title">Languages.</h3>
                  <p className="lang-stage-sub">
                    Effective communication across multilingual environments for collaboration, documentation, and client-facing delivery.
                  </p>
                  <div className="about-inline-stats lang-stage-stats">
                    <div><span>{String(languages.length).padStart(2, '0')}</span><p>Languages</p></div>
                    <div><span>95%</span><p>Urdu</p></div>
                    <div><span>75%</span><p>English</p></div>
                  </div>
                </div>

                <div className="lang-stage-list">
                  {languages.map((item, index) => (
                    <article className="lang-stage-card" key={item.name}>
                      <div className="lang-stage-card-head">
                        <h4>{item.name}</h4>
                        <span>{String(index + 1).padStart(2, '0')}</span>
                      </div>
                      <p className="lang-stage-level">{item.level}</p>
                      <div className="progress-track lang-stage-track">
                        <div className="progress-fill" style={{ width: `${item.value}%` }} />
                      </div>
                      <p className="lang-stage-score">{item.value}% proficiency</p>
                    </article>
                  ))}
                </div>
              </div>
            </motion.section>
          </div>

        </div>{/* sections-canvas-wrapper */}

        <motion.section
          id="contact"
          className="contact-stage-section"
          variants={sectionVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
        >
          <div className="contact-stage-overlay" />
          <div className="contact-stage-shell">
            <div className="contact-stage-copy">
              <p className="about-kicker">Get In Touch</p>
              <h3 className="contact-stage-title">Contact.</h3>
              <p className="contact-stage-sub">
                Have a project idea, internship opportunity, or collaboration in mind? Let's connect and build something meaningful.
              </p>
              <div className="about-inline-stats contact-stage-stats">
                <div><span>24h</span><p>Reply Time</p></div>
                <div><span>Remote</span><p>Available</p></div>
                <div><span>Open</span><p>To Work</p></div>
              </div>
              <div className="about-chip-list contact-stage-chips">
                <span>Freelance Projects</span>
                <span>Internships</span>
                <span>Web Development</span>
                <span>Flutter Apps</span>
              </div>
            </div>

            <div className="contact-stage-panel">
              <div className="contact-stage-links" aria-label="Contact links">
                <a
                  className="contact-link-card"
                  href="mailto:abdullahaftab861@gmail.com"
                  aria-label="Email"
                  title="Email"
                >
                  <span className="contact-link-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="contact-link-svg">
                      <path fill="currentColor" d="M3 5.75A2.75 2.75 0 0 1 5.75 3h12.5A2.75 2.75 0 0 1 21 5.75v12.5A2.75 2.75 0 0 1 18.25 21H5.75A2.75 2.75 0 0 1 3 18.25V5.75Zm2.2-.55a.75.75 0 0 0-.5 1.31l6.82 6.03a.75.75 0 0 0 .96 0l6.82-6.03a.75.75 0 0 0-.5-1.31H5.2Zm14.3 3.16-6.03 5.33a2.25 2.25 0 0 1-2.96 0L4.5 8.36v9.89c0 .3.24.55.55.55h13.9c.3 0 .55-.24.55-.55V8.36Z" />
                    </svg>
                  </span>
                  <span className="contact-link-copy">
                    <span className="contact-link-label">Email</span>
                    <span className="contact-link-value">abdullahaftab861@gmail.com</span>
                  </span>
                </a>

                <a
                  className="contact-link-card"
                  href="tel:+923347605225"
                  aria-label="Phone"
                  title="Phone"
                >
                  <span className="contact-link-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="contact-link-svg">
                      <path fill="currentColor" d="M6.62 2.3a1.75 1.75 0 0 1 1.73.36l2.2 2.2a1.75 1.75 0 0 1 .44 1.73l-.72 2.87a1.2 1.2 0 0 0 .3 1.15l2.83 2.83a1.2 1.2 0 0 0 1.15.3l2.87-.72a1.75 1.75 0 0 1 1.73.44l2.2 2.2a1.75 1.75 0 0 1 .36 1.73l-.63 2.51a2.8 2.8 0 0 1-2.73 2.12c-9.05 0-16.4-7.35-16.4-16.4A2.8 2.8 0 0 1 4.1 2.92l2.51-.63ZM7.27 4l-2.51.63a1.3 1.3 0 0 0-.99 1.26c0 8.22 6.66 14.88 14.88 14.88a1.3 1.3 0 0 0 1.26-.99l.63-2.51a.25.25 0 0 0-.06-.25l-2.2-2.2a.25.25 0 0 0-.24-.06l-2.87.72a2.7 2.7 0 0 1-2.59-.67l-2.83-2.83a2.7 2.7 0 0 1-.67-2.59l.72-2.87a.25.25 0 0 0-.06-.24l-2.2-2.2A.25.25 0 0 0 7.27 4Z" />
                    </svg>
                  </span>
                  <span className="contact-link-copy">
                    <span className="contact-link-label">Phone</span>
                    <span className="contact-link-value">+92-334-7605225</span>
                  </span>
                </a>

                <a
                  className="contact-link-card"
                  href="https://www.linkedin.com/in/abdullah-aftab-1385683b0"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="LinkedIn"
                  title="LinkedIn"
                >
                  <span className="contact-link-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="contact-link-svg">
                      <path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.03-1.85-3.03-1.85 0-2.13 1.44-2.13 2.93v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77A1.77 1.77 0 0 0 0 1.77v20.46C0 23.2.8 24 1.77 24h20.46A1.77 1.77 0 0 0 24 22.23V1.77A1.77 1.77 0 0 0 22.23 0Z" />
                    </svg>
                  </span>
                  <span className="contact-link-copy">
                    <span className="contact-link-label">LinkedIn</span>
                    <span className="contact-link-value">Connect with me</span>
                  </span>
                </a>

                <a
                  className="contact-link-card"
                  href="https://github.com/abdullah03-max"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="GitHub"
                  title="GitHub"
                >
                  <span className="contact-link-icon" aria-hidden="true">
                    <svg viewBox="0 0 24 24" className="contact-link-svg">
                      <path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56 0-.27-.01-1.01-.02-1.98-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.28-1.7-1.28-1.7-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.71 1.25 3.37.96.1-.75.4-1.25.73-1.53-2.55-.29-5.24-1.27-5.24-5.67 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.17a11.1 11.1 0 0 1 5.77 0c2.2-1.48 3.17-1.17 3.17-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.41-2.7 5.37-5.27 5.66.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.67.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                    </svg>
                  </span>
                  <span className="contact-link-copy">
                    <span className="contact-link-label">GitHub</span>
                    <span className="contact-link-value contact-link-value-accent">@abdullah03-max</span>
                  </span>
                </a>
              </div>
            </div>
          </div>
        </motion.section>

        <footer className="site-footer" aria-label="Footer">
          <div className="site-footer-shell">
            <div className="site-footer-brand">
              <p className="site-footer-kicker">Professional Links</p>
              <h4>Abdullah Aftab</h4>
              <p className="site-footer-role">Web and Flutter Developer</p>
            </div>

            <div className="site-footer-socials" aria-label="Social links">
              <a
                className="site-footer-icon-link"
                href="https://www.linkedin.com/in/abdullah-aftab-1385683b0"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                title="LinkedIn"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="site-footer-icon">
                  <path fill="currentColor" d="M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.03-1.85-3.03-1.85 0-2.13 1.44-2.13 2.93v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.26 2.37 4.26 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.23 0H1.77A1.77 1.77 0 0 0 0 1.77v20.46C0 23.2.8 24 1.77 24h20.46A1.77 1.77 0 0 0 24 22.23V1.77A1.77 1.77 0 0 0 22.23 0Z" />
                </svg>
              </a>

              <a
                className="site-footer-icon-link"
                href="https://wa.me/923347605225"
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                title="WhatsApp"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="site-footer-icon whatsapp">
                  <path fill="currentColor" d="M19.05 4.91A9.82 9.82 0 0 0 12.07 2C6.65 2 2.23 6.41 2.23 11.84c0 1.74.46 3.43 1.33 4.91L2 22l5.4-1.42a9.85 9.85 0 0 0 4.67 1.19h.01c5.42 0 9.84-4.41 9.84-9.84a9.8 9.8 0 0 0-2.87-7.02Zm-6.98 15.2h-.01a8.2 8.2 0 0 1-4.17-1.14l-.3-.18-3.2.84.86-3.12-.2-.32a8.15 8.15 0 0 1-1.25-4.35c0-4.5 3.67-8.17 8.18-8.17 2.19 0 4.25.85 5.8 2.4a8.13 8.13 0 0 1 2.39 5.78c0 4.51-3.67 8.18-8.1 8.18Zm4.48-6.13c-.25-.12-1.49-.73-1.72-.81-.23-.08-.39-.12-.56.12-.16.25-.64.81-.78.98-.14.16-.29.18-.54.06-.25-.12-1.05-.39-2-1.25-.74-.66-1.24-1.48-1.39-1.73-.14-.24-.02-.38.11-.5.11-.11.25-.29.37-.44.12-.14.16-.25.25-.41.08-.16.04-.31-.02-.43-.06-.12-.56-1.35-.77-1.85-.2-.48-.4-.41-.56-.42h-.48c-.16 0-.43.06-.66.31-.23.25-.87.85-.87 2.07s.89 2.4 1.02 2.56c.12.16 1.74 2.66 4.22 3.73.59.26 1.06.41 1.42.52.59.19 1.12.16 1.54.1.47-.07 1.49-.61 1.7-1.2.21-.6.21-1.11.15-1.21-.06-.1-.23-.16-.48-.29Z" />
                </svg>
              </a>

              <a
                className="site-footer-icon-link"
                href="https://github.com/abdullah03-max"
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub"
                title="GitHub"
              >
                <svg viewBox="0 0 24 24" aria-hidden="true" className="site-footer-icon">
                  <path fill="currentColor" d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.38 7.86 10.9.58.1.79-.25.79-.56 0-.27-.01-1.01-.02-1.98-3.2.7-3.88-1.36-3.88-1.36-.53-1.34-1.28-1.7-1.28-1.7-1.05-.71.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.76 2.71 1.25 3.37.96.1-.75.4-1.25.73-1.53-2.55-.29-5.24-1.27-5.24-5.67 0-1.25.45-2.27 1.18-3.07-.12-.29-.51-1.46.11-3.04 0 0 .97-.31 3.17 1.17a11.1 11.1 0 0 1 5.77 0c2.2-1.48 3.17-1.17 3.17-1.17.62 1.58.23 2.75.11 3.04.74.8 1.18 1.82 1.18 3.07 0 4.41-2.7 5.37-5.27 5.66.41.36.78 1.06.78 2.14 0 1.54-.01 2.79-.01 3.17 0 .31.21.67.8.56A11.52 11.52 0 0 0 23.5 12C23.5 5.65 18.35.5 12 .5Z" />
                </svg>
              </a>
            </div>

            <p className="site-footer-copy">© {new Date().getFullYear()} Abdullah Aftab. All rights reserved.</p>
          </div>
        </footer>
      </main>
      </motion.div>
    </AnimatePresence>
  );
}

export default App;
