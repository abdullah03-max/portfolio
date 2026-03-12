import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const tagColors = {
  React: 0x61dafb,
  'Node.js': 0x6cc24a,
  Flutter: 0x42a5f5,
  MongoDB: 0x4caf50,
  JavaScript: 0xf7df1e,
  Git: 0xf1502f
};

function Workspace3D({ activeTag, onReady }) {
  const mountRef = useRef(null);
  const activeTagRef = useRef(activeTag);

  useEffect(() => {
    activeTagRef.current = activeTag;
  }, [activeTag]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) {
      return undefined;
    }

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0b0d12, 6, 16);

    const camera = new THREE.PerspectiveCamera(43, mount.clientWidth / mount.clientHeight, 0.1, 100);
    camera.position.set(0, 1.45, 5.8);

    const group = new THREE.Group();
    scene.add(group);

    const ambient = new THREE.AmbientLight(0x7082a1, 1.1);
    const warmLight = new THREE.PointLight(0xf5c542, 7.6, 15, 1.7);
    warmLight.position.set(2.2, 2.4, 1.8);
    const fillLight = new THREE.PointLight(0x678aff, 1.7, 16, 2);
    fillLight.position.set(-2.6, 1.5, -2.2);
    scene.add(ambient, warmLight, fillLight);

    const floor = new THREE.Mesh(
      new THREE.CircleGeometry(3.4, 56),
      new THREE.MeshStandardMaterial({ color: 0x121620, roughness: 0.78, metalness: 0.25 })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -1.18;
    group.add(floor);

    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(2.25, 0.04, 20, 110),
      new THREE.MeshStandardMaterial({
        color: 0xf5c542,
        emissive: 0xf5c542,
        emissiveIntensity: 0.38,
        transparent: true,
        opacity: 0.82
      })
    );
    halo.rotation.x = Math.PI / 2;
    halo.position.y = -1.1;
    group.add(halo);

    const fallbackWorkspace = () => {
      const body = new THREE.Mesh(
        new THREE.BoxGeometry(2.6, 0.18, 1.85),
        new THREE.MeshPhysicalMaterial({ color: 0x1a2232, roughness: 0.38, metalness: 0.86 })
      );
      body.position.y = -0.35;

      const monitorGroup = new THREE.Group();
      monitorGroup.position.set(0, -0.28, -0.86);
      monitorGroup.rotation.x = -1.08;

      const monitor = new THREE.Mesh(
        new THREE.BoxGeometry(2.45, 1.45, 0.07),
        new THREE.MeshStandardMaterial({ color: 0x0d121b })
      );
      monitorGroup.add(monitor);

      group.add(body, monitorGroup);
      return monitorGroup;
    };

    const loader = new GLTFLoader();
    let monitorTarget = null;

    loader.load(
      '/assets/workspace.glb',
      (gltf) => {
        const model = gltf.scene;
        model.scale.set(1.18, 1.18, 1.18);
        model.position.y = -0.95;
        model.traverse((obj) => {
          if (obj.isMesh && obj.material) {
            obj.material.roughness = Math.min(obj.material.roughness ?? 0.6, 0.65);
            obj.material.metalness = Math.max(obj.material.metalness ?? 0.25, 0.25);
          }
          if (obj.name.toLowerCase().includes('screen') || obj.name.toLowerCase().includes('monitor')) {
            monitorTarget = obj;
          }
        });
        group.add(model);
      },
      undefined,
      () => {
        monitorTarget = fallbackWorkspace();
      }
    );

    if (!monitorTarget) {
      monitorTarget = fallbackWorkspace();
    }

    const shader = {
      uniforms: {
        uTime: { value: 0 },
        uAccent: { value: new THREE.Color(0xf5c542) }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float uTime;
        uniform vec3 uAccent;
        varying vec2 vUv;

        float lines(vec2 uv, float offset) {
          return smoothstep(0.72, 1.0, sin((uv.y + offset) * 80.0) * 0.5 + 0.5);
        }

        void main() {
          vec2 uv = vUv;
          float wave = sin(uv.x * 10.0 + uTime * 1.4) * 0.03;
          float flow = lines(uv + vec2(0.0, wave), uTime * 0.12);
          vec3 base = vec3(0.04, 0.08, 0.14);
          vec3 glow = mix(base, uAccent, flow * 0.75);
          float vignette = smoothstep(1.2, 0.2, distance(uv, vec2(0.5)));
          gl_FragColor = vec4(glow * vignette, 1.0);
        }
      `
    };

    const screenMaterial = new THREE.ShaderMaterial(shader);
    const screenMesh = new THREE.Mesh(new THREE.PlaneGeometry(2.2, 1.2), screenMaterial);
    screenMesh.position.set(0, 0.05, 0.045);

    const particlesGeometry = new THREE.BufferGeometry();
    const particleCount = 240;
    const particlePositions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i += 1) {
      particlePositions[i * 3] = (Math.random() - 0.5) * 7;
      particlePositions[i * 3 + 1] = Math.random() * 3 - 1;
      particlePositions[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }

    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    const particles = new THREE.Points(
      particlesGeometry,
      new THREE.PointsMaterial({
        color: 0xf5c542,
        size: 0.035,
        transparent: true,
        opacity: 0.75,
        blending: THREE.AdditiveBlending,
        depthWrite: false
      })
    );
    group.add(particles);

    const floatingA = new THREE.Mesh(
      new THREE.OctahedronGeometry(0.18),
      new THREE.MeshStandardMaterial({ color: 0xf5c542, emissive: 0xf5c542, emissiveIntensity: 0.26 })
    );
    floatingA.position.set(-1.4, 0.95, -0.8);

    const floatingB = new THREE.Mesh(
      new THREE.TorusKnotGeometry(0.12, 0.03, 64, 10),
      new THREE.MeshStandardMaterial({ color: 0x84a9ff, emissive: 0x678aff, emissiveIntensity: 0.2 })
    );
    floatingB.position.set(1.4, 0.65, 0.8);

    group.add(floatingA, floatingB);

    const pointerTarget = { x: 0, y: 0 };
    const pointer = { x: 0, y: 0 };
    let hoverBoost = 1;

    const onMove = (event) => {
      const rect = mount.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width;
      const y = (event.clientY - rect.top) / rect.height;
      pointerTarget.x = (x - 0.5) * 0.65;
      pointerTarget.y = (y - 0.5) * 0.45;
    };

    const onEnter = () => {
      hoverBoost = 1.8;
    };

    const onLeave = () => {
      hoverBoost = 1;
      pointerTarget.x = 0;
      pointerTarget.y = 0;
    };

    mount.addEventListener('mousemove', onMove);
    mount.addEventListener('mouseenter', onEnter);
    mount.addEventListener('mouseleave', onLeave);

    const resizeObserver = new ResizeObserver(() => {
      const width = Math.max(mount.clientWidth, 1);
      const height = Math.max(mount.clientHeight, 1);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    });
    resizeObserver.observe(mount);

    const clock = new THREE.Clock();
    let rafId = 0;
    let didReady = false;

    const tick = () => {
      const t = clock.getElapsedTime();

      pointer.x += (pointerTarget.x - pointer.x) * 0.06;
      pointer.y += (pointerTarget.y - pointer.y) * 0.06;

      group.position.x = pointer.x * 0.22;
      group.position.y = pointer.y * 0.18 + Math.sin(t * 1.25) * 0.06;

      halo.rotation.z += 0.003;
      floatingA.rotation.x += 0.01;
      floatingA.rotation.y += 0.013;
      floatingB.rotation.x += 0.011;
      floatingB.rotation.z += 0.009;

      floatingA.position.y = 0.95 + Math.sin(t * 1.8) * 0.15;
      floatingB.position.y = 0.65 + Math.cos(t * 1.6) * 0.12;

      screenMaterial.uniforms.uTime.value = t;

      if (monitorTarget && monitorTarget.children && !monitorTarget.children.includes(screenMesh)) {
        monitorTarget.add(screenMesh);
      }

      if (monitorTarget && monitorTarget.rotation) {
        monitorTarget.rotation.z += 0.001 * hoverBoost;
      }

      const orbit = t * 0.22;
      const radius = 5.65;
      camera.position.x = Math.cos(orbit) * radius + pointer.x * 0.4;
      camera.position.z = Math.sin(orbit) * radius + pointer.y * 0.35;
      camera.position.y = 1.28 + pointer.y * 0.32;
      camera.lookAt(group.position.x * 0.35, -0.08, 0);

      const accent = tagColors[activeTagRef.current] || 0xf5c542;
      screenMaterial.uniforms.uAccent.value.setHex(accent);
      warmLight.color.setHex(accent);

      renderer.render(scene, camera);

      if (!didReady && typeof onReady === 'function') {
        didReady = true;
        onReady();
      }

      rafId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      mount.removeEventListener('mousemove', onMove);
      mount.removeEventListener('mouseenter', onEnter);
      mount.removeEventListener('mouseleave', onLeave);
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj.geometry) {
          obj.geometry.dispose();
        }
        if (obj.material) {
          if (Array.isArray(obj.material)) {
            obj.material.forEach((mat) => mat.dispose());
          } else {
            obj.material.dispose();
          }
        }
      });
      particlesGeometry.dispose();
      if (mount.contains(renderer.domElement)) {
        mount.removeChild(renderer.domElement);
      }
    };
  }, [onReady]);

  return <div ref={mountRef} className="absolute inset-0" aria-hidden="true" />;
}

export default Workspace3D;
