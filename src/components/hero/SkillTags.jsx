import { motion } from 'framer-motion';

const tags = ['React', 'Node.js', 'Flutter', 'MongoDB', 'JavaScript', 'Git'];

function SkillTags({ onTagFocus }) {
  return (
    <div className="mt-6 flex flex-wrap gap-2" role="list" aria-label="Technology stack tags">
      {tags.map((tag, index) => (
        <motion.button
          key={tag}
          type="button"
          role="listitem"
          onMouseEnter={() => onTagFocus(tag)}
          onMouseLeave={() => onTagFocus(null)}
          onFocus={() => onTagFocus(tag)}
          onBlur={() => onTagFocus(null)}
          initial={{ y: 12 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.08 * index, duration: 0.35 }}
          whileHover={{ y: -2, scale: 1.02 }}
          className="rounded-full border border-gold-500/40 bg-zinc-900/70 px-3 py-1.5 text-sm text-gold-200 shadow-[0_0_18px_rgba(245,197,66,0.15)] transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold-400"
          aria-label={`Highlight ${tag} in 3D scene`}
        >
          {tag}
        </motion.button>
      ))}
    </div>
  );
}

export default SkillTags;
