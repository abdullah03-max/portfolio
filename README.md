# Abdullah Aftab Portfolio

A modern React portfolio with an interactive Three.js hero scene, animated text, and responsive fallbacks.

## Tech stack

- React + Vite
- Framer Motion (UI animation)
- Three.js (3D workspace scene)
- Tailwind CSS + custom theme

## Hero architecture

```text
src/
	components/
		hero/
			HeroSection.jsx
			Workspace3D.jsx
			SkillTags.jsx
			BioText.jsx
	hooks/
		use3DCapability.js
		useTypewriter.js
	utils/
		deviceCapability.js
```

## Setup

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm run preview
```

## Notes

- `HeroSection` lazy-loads `Workspace3D` for better startup performance.
- `use3DCapability` handles device checks and falls back to a 2D hero panel on low-end/no-WebGL devices.
- `Workspace3D` supports optional GLTF loading from `/public/assets/workspace.glb` and uses a shader-based monitor screen.
- Tailwind custom theme is configured in `tailwind.config.js` with gold-focused palette.
