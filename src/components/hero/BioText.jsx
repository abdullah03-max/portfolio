import { motion } from 'framer-motion';
import useTypewriter from '../../hooks/useTypewriter';

const roleWords = ['Web Developer', 'Flutter Developer', 'Computer Science Student'];

function BioText() {
  const typedRole = useTypewriter(roleWords, 80, 1300);

  return (
    <motion.div
      initial={{ y: 30 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="space-y-4"
    >
      <p className="text-xs uppercase tracking-[0.18em] text-gold-300">Abdullah Aftab</p>
      <h1 className="text-4xl font-bold leading-tight text-gold-100 md:text-6xl">Crafting Modern Developer Experiences</h1>
      <p className="text-base leading-8 text-zinc-300 md:text-lg">
        I build <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">clean full-stack products</span>{' '}
        and <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">cross-platform apps</span>{' '}
        with performance, usability, and premium design in mind.
      </p>
      <p className="text-lg font-semibold text-zinc-200 md:text-xl" aria-live="polite">
        {typedRole}
        <span className="ml-1 inline-block h-5 w-[2px] animate-pulse bg-gold-400 align-middle" aria-hidden="true" />
      </p>
    </motion.div>
  );
}

export default BioText;
