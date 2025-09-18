
import React, { useRef, useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function AdvancedAnimations() {
  const containerRef = useRef(null);
  const tlRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const reducedMotion = useReducedMotion();

  const features = [
    { id: 1, title: 'Smooth Entrance', text: 'Hero and card entrances using Framer Motion.' },
    { id: 2, title: 'Hover Interactions', text: 'Motion-driven hover and focus states accessible by keyboard.' },
    { id: 3, title: 'Scroll Timeline', text: 'GSAP timeline controlled by ScrollTrigger and controls.' },
  ];

  useEffect(() => {
    // If user prefers reduced motion, don't build the heavy timeline.
    if (reducedMotion) return;

    // Scope GSAP to the container for safe React usage
    const ctx = gsap.context(() => {
      tlRef.current = gsap.timeline({ defaults: { duration: 0.8, ease: 'power3.out' } });

      tlRef.current
        .from('.hero-heading', { y: 30, opacity: 0 })
        .from('.hero-sub', { y: 20, opacity: 0 }, '-=0.5')
        .from('.decor-shape', { scale: 0, opacity: 0, stagger: 0.08 }, '-=0.4')
        .from('.feature-card', { y: 40, opacity: 0, stagger: 0.12 }, '-=0.4');

      // ScrollTrigger ties the timeline to the scroll position of this section
      ScrollTrigger.create({
        animation: tlRef.current,
        trigger: containerRef.current,
        start: 'top center',
      });
    }, containerRef);

    return () => {
      if (tlRef.current) tlRef.current.kill();
      ScrollTrigger.getAll().forEach(st => st.kill());
      ctx.revert();
    };
  }, [reducedMotion]);

  const handlePlayPause = () => {
    if (!tlRef.current) return;
    if (tlRef.current.paused()) {
      tlRef.current.play();
      setPlaying(true);
    } else {
      tlRef.current.pause();
      setPlaying(false);
    }
  };

  const cardVariant = {
    initial: { opacity: 0, y: 20 },
    enter: { opacity: 1, y: 0, transition: { duration: 0.6 } },
    hover: { y: -8, scale: 1.03 },
    tap: { scale: 0.98 },
  };

  return (
    <section ref={containerRef} className="min-h-screen py-20 px-6 bg-gradient-to-b from-indigo-900 via-slate-900 to-gray-900 text-slate-100">
      <nav className="max-w-6xl mx-auto flex items-center justify-between mb-12">
        <div className="text-xl font-semibold">MotionTask</div>
        <ul className="flex gap-4 items-center">
          <li className="hidden sm:block text-sm">Docs</li>
          <li className="text-sm">Examples</li>
          <li>
            <button className="text-sm bg-indigo-600 px-3 py-1 rounded-md hover:underline focus:outline-none focus:ring-2 focus:ring-indigo-400">Get Started</button>
          </li>
        </ul>
      </nav>

      {/* Hero Class */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      <motion.div initial={reducedMotion ? {} : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="space-y-6">
          <h1 className="hero-heading text-4xl sm:text-5xl font-extrabold leading-tight">Advanced Animations Smooth, Accessible, Performant</h1>
          <p className="hero-sub text-lg text-slate-300 max-w-xl">A small demo combining Framer Motion for interactive micro interactions and GSAP for timeline, scroll-driven choreography. Includes reduced-motion support and keyboard accessibility.</p>

          <div className="flex gap-4 items-center mt-4">
            <button aria-label="Primary action" className="px-5 py-2 rounded-md bg-gradient-to-r from-indigo-500 to-purple-500 shadow-lg transform-gpu hover:scale-[1.02] focus:outline-none focus:ring-4 focus:ring-indigo-400">Try the Demo</button>
            <button onClick={handlePlayPause} aria-pressed={!playing} className="px-4 py-2 rounded-md bg-slate-800 border border-slate-700 focus:outline-none focus:ring-4 focus:ring-indigo-400">
              {playing ? 'Pause' : 'Play'}
            </button>
          </div>
        </motion.div>

        {/* Shapes */}
        <div aria-hidden className="relative h-64 sm:h-80 rounded-xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="decor-shape w-32 h-32 rounded-full bg-gradient-to-br from-pink-500 to-yellow-400 opacity-60 blur-2xl transform-gpu" />
            <div className="decor-shape w-24 h-24 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 opacity-50 blur-lg transform-gpu absolute left-6 top-8" />
            <div className="decor-shape w-20 h-20 rounded-full bg-gradient-to-br from-lime-300 to-emerald-400 opacity-40 blur-md transform-gpu absolute right-8 bottom-10" />
          </div>
        </div>
      </div>
    {/* Cards */}

      <div className="max-w-6xl mx-auto mt-12 grid grid-cols-1 sm:grid-cols-3 gap-6">
        {features.map(f => (
          <motion.article
            key={f.id}
            className="feature-card bg-white/5 p-6 rounded-2xl backdrop-blur-sm border border-white/6 shadow-md transform-gpu"
            initial="initial"
            animate="enter"
            whileHover="hover"
            whileTap="tap"
            variants={cardVariant}
            tabIndex={0}
            role="button"
            aria-label={`${f.title} — ${f.text}`}
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.currentTarget.click(); } }}
          >
            <h3 className="text-xl font-semibold mb-2">{f.title}</h3>
            <p className="text-slate-300">{f.text}</p>
            <div className="mt-4 flex items-center gap-2">
              <span className="text-indigo-400 text-sm">Learn more</span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" /></svg>
            </div>
          </motion.article>
        ))}
      </div>
      {/* GSAP Section */}
      <div className="max-w-6xl mx-auto mt-20 p-6 bg-white/3 rounded-2xl border border-white/6">
        <h2 className="text-2xl font-bold mb-4">Timeline Choreography (GSAP + ScrollTrigger)</h2>
        <p className="text-slate-300 mb-6">This panel shows a timeline sequence and scroll based trigger. Use Play/Pause above to control it. If you prefer reduced motion, the animation is disabled.</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-6 rounded-xl feature-panel bg-gradient-to-br from-indigo-700 to-indigo-500 text-white transform-gpu">
            <h4 className="font-semibold mb-2">Stage A</h4>
            <p className="text-sm text-indigo-100/90">Entry animation from below, part of the timeline.</p>
          </div>
          <div className="p-6 rounded-xl feature-panel bg-gradient-to-br from-emerald-600 to-teal-500 text-white transform-gpu">
            <h4 className="font-semibold mb-2">Stage B</h4>
            <p className="text-sm text-teal-100/90">Scaling and rotation the timeline coordinates.</p>
          </div>
          <div className="p-6 rounded-xl feature-panel bg-gradient-to-br from-pink-500 to-rose-400 text-white transform-gpu">
            <h4 className="font-semibold mb-2">Stage C</h4>
            <p className="text-sm text-pink-50/90">Final flourish with subtle motion and fade out.</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="max-w-6xl mx-auto mt-12 text-slate-300">
        <h3 className="font-semibold mb-2">Accessibility & Performance</h3>
        <ul className="list-disc ml-5 space-y-1">
          <li>Respects <code>prefers-reduced-motion</code> heavy timelines are disabled when this is set.</li>
          <li>Animations use transform and opacity only (no layout thrashing).</li>
          <li>Keyboard navigable interactive elements (tabindex, focus styles, Enter/Space handlers).</li>
          <li>Use <code>will-change: transform</code> and <code>transform-gpu</code> utility classes for smoother motion.</li>
        </ul>
      </footer>
    </section>
  );
}
