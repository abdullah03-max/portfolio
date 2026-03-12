import { useEffect, useState } from 'react';
import { canUse3DScene } from '../utils/deviceCapability';

function use3DCapability(minDesktopWidth = 980) {
  const [isDesktop, setIsDesktop] = useState(() => window.innerWidth >= minDesktopWidth);
  const [supports3D, setSupports3D] = useState(() => canUse3DScene());

  useEffect(() => {
    const onResize = () => {
      setIsDesktop(window.innerWidth >= minDesktopWidth);
    };

    const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const onPreferenceChange = () => {
      setSupports3D(canUse3DScene());
    };

    window.addEventListener('resize', onResize);
    reduceMotionQuery.addEventListener('change', onPreferenceChange);

    return () => {
      window.removeEventListener('resize', onResize);
      reduceMotionQuery.removeEventListener('change', onPreferenceChange);
    };
  }, [minDesktopWidth]);

  return {
    isDesktop,
    canRender3D: isDesktop && supports3D,
    fallbackReason: isDesktop ? 'Performance mode enabled.' : '3D scene available on desktop devices.'
  };
}

export default use3DCapability;
