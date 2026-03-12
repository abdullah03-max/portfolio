import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const skillBallData = [
  { label: 'React', color: 0x61dafb },
  { label: 'Node', color: 0x6cc24a },
  { label: 'Flutter', color: 0x42a5f5 },
  { label: 'Mongo', color: 0x4caf50 },
  { label: 'JS', color: 0xf7df1e },
  { label: 'Git', color: 0xf1502f }
];

function createTextSprite(text) {
  const canvas = document.createElement('canvas');
  canvas.width = 220;
  canvas.height = 92;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return null;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = 'rgba(9, 11, 16, 0.85)';
  ctx.strokeStyle = 'rgba(245, 197, 66, 0.9)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(8, 8, 204, 76, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#f6e5b8';
  ctx.font = '700 30px Segoe UI';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;

  const sprite = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: texture,
      transparent: true,
      depthWrite: false
    })
  );
  sprite.scale.set(0.82, 0.34, 1);
  sprite.userData.texture = texture;
  return sprite;
}

function WorkspaceScene({ onReady, skillActionTick = 0 }) {
  const mountRef = useRef(null);
  const actionUntilRef = useRef(0);

  useEffect(() => {
    actionUntilRef.current = performance.now() + 3000;
  }, [skillActionTick]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) {
      return undefined;
    }

    const getContainerSize = () => {
      const rect = container.getBoundingClientRect();
      return {
        width: Math.max(Math.floor(rect.width || container.clientWidth || 1), 1),
        height: Math.max(Math.floor(rect.height || container.clientHeight || 420), 320)
      };
    };

    const initial = getContainerSize();

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(initial.width, initial.height);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0c0f16, 6, 15);

    const camera = new THREE.PerspectiveCamera(45, initial.width / initial.height, 0.1, 100);
    camera.position.set(0, 1.2, 6.2);

    const world = new THREE.Group();
    scene.add(world);

    const stage = new THREE.Mesh(
      new THREE.CylinderGeometry(3.2, 3.6, 0.2, 40),
      new THREE.MeshToonMaterial({ color: 0x1a2030 })
    );
    stage.position.y = -1.65;
    world.add(stage);

    const glowRing = new THREE.Mesh(
      new THREE.TorusGeometry(2.2, 0.05, 20, 120),
      new THREE.MeshToonMaterial({ color: 0xf5c542 })
    );
    glowRing.rotation.x = Math.PI / 2;
    glowRing.position.y = -1.53;
    world.add(glowRing);

    const mascotOrbitRoot = new THREE.Group();
    world.add(mascotOrbitRoot);

    const mascot = new THREE.Group();
    mascotOrbitRoot.add(mascot);

    const torso = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.9, 1.0, 8, 16),
      new THREE.MeshToonMaterial({ color: 0x243249 })
    );
    torso.position.y = -0.1;
    mascot.add(torso);

    const leftLeg = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.16, 0.58, 6, 12),
      new THREE.MeshToonMaterial({ color: 0x1e2a3d })
    );
    leftLeg.position.set(-0.24, -1.02, 0.05);
    mascot.add(leftLeg);

    const rightLeg = leftLeg.clone();
    rightLeg.position.x = 0.24;
    mascot.add(rightLeg);

    const leftFoot = new THREE.Mesh(
      new THREE.SphereGeometry(0.18, 18, 18),
      new THREE.MeshToonMaterial({ color: 0x111722 })
    );
    leftFoot.scale.set(1.2, 0.6, 1.6);
    leftFoot.position.set(-0.24, -1.45, 0.2);
    mascot.add(leftFoot);

    const rightFoot = leftFoot.clone();
    rightFoot.position.x = 0.24;
    mascot.add(rightFoot);

    const leftArmPivot = new THREE.Group();
    leftArmPivot.position.set(-0.74, 0.16, 0.12);
    mascot.add(leftArmPivot);

    const leftArm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.14, 0.6, 6, 10),
      new THREE.MeshToonMaterial({ color: 0x243249 })
    );
    leftArm.rotation.z = 0.44;
    leftArmPivot.add(leftArm);

    const leftHand = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshToonMaterial({ color: 0xf1c39a })
    );
    leftHand.position.set(-0.04, -0.58, 0.04);
    leftArmPivot.add(leftHand);

    const rightArmPivot = new THREE.Group();
    rightArmPivot.position.set(0.74, 0.2, 0.08);
    mascot.add(rightArmPivot);

    const rightArm = new THREE.Mesh(
      new THREE.CapsuleGeometry(0.14, 0.58, 6, 10),
      new THREE.MeshToonMaterial({ color: 0x243249 })
    );
    rightArm.position.y = -0.25;
    rightArm.rotation.z = -0.35;
    rightArmPivot.add(rightArm);

    const rightHand = new THREE.Mesh(
      new THREE.SphereGeometry(0.12, 16, 16),
      new THREE.MeshToonMaterial({ color: 0xf1c39a })
    );
    rightHand.position.set(0.04, -0.57, 0.04);
    rightArmPivot.add(rightHand);

    const head = new THREE.Mesh(
      new THREE.SphereGeometry(0.62, 32, 32),
      new THREE.MeshToonMaterial({ color: 0xf2c9a0 })
    );
    head.position.y = 1.05;
    mascot.add(head);

    const hair = new THREE.Mesh(
      new THREE.SphereGeometry(0.5, 24, 24),
      new THREE.MeshToonMaterial({ color: 0x1f140e })
    );
    hair.position.set(0, 1.26, 0.02);
    hair.scale.set(1, 0.72, 1);
    mascot.add(hair);

    const leftEye = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 16, 16),
      new THREE.MeshToonMaterial({ color: 0xffffff })
    );
    leftEye.scale.z = 0.65;
    leftEye.position.set(-0.17, 1.04, 0.55);
    mascot.add(leftEye);

    const rightEye = leftEye.clone();
    rightEye.position.x = 0.17;
    mascot.add(rightEye);

    const leftPupil = new THREE.Mesh(
      new THREE.SphereGeometry(0.042, 12, 12),
      new THREE.MeshToonMaterial({ color: 0x141414 })
    );
    leftPupil.scale.z = 0.65;
    leftPupil.position.set(-0.17, 1.04, 0.63);
    mascot.add(leftPupil);

    const rightPupil = leftPupil.clone();
    rightPupil.position.x = 0.17;
    mascot.add(rightPupil);

    const nose = new THREE.Mesh(
      new THREE.ConeGeometry(0.05, 0.14, 12),
      new THREE.MeshToonMaterial({ color: 0xeebd92 })
    );
    nose.rotation.x = Math.PI / 2;
    nose.position.set(0, 0.95, 0.62);
    mascot.add(nose);

    const smile = new THREE.Mesh(
      new THREE.TorusGeometry(0.11, 0.014, 8, 40, Math.PI),
      new THREE.MeshToonMaterial({ color: 0x663b33 })
    );
    smile.position.set(0, 0.84, 0.58);
    smile.rotation.z = Math.PI;
    mascot.add(smile);

    const laptop = new THREE.Group();
    laptop.position.set(0, -0.3, 0.65);
    mascot.add(laptop);

    const laptopBase = new THREE.Mesh(
      new THREE.BoxGeometry(1.55, 0.1, 1),
      new THREE.MeshToonMaterial({ color: 0x1b2334 })
    );
    laptop.add(laptopBase);

    const laptopScreen = new THREE.Mesh(
      new THREE.BoxGeometry(1.55, 0.9, 0.08),
      new THREE.MeshToonMaterial({ color: 0x101827, emissive: 0xf5c542, emissiveIntensity: 0.25 })
    );
    laptopScreen.position.set(0, 0.45, -0.45);
    laptopScreen.rotation.x = -0.9;
    laptop.add(laptopScreen);

    const skillBalls = new THREE.Group();
    world.add(skillBalls);

    skillBallData.forEach((item, index) => {
      const ballGroup = new THREE.Group();
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(0.18, 22, 22),
        new THREE.MeshToonMaterial({ color: item.color, emissive: item.color, emissiveIntensity: 0.25 })
      );
      ballGroup.add(sphere);

      const label = createTextSprite(item.label);
      if (label) {
        label.position.y = 0.33;
        ballGroup.add(label);
      }

      ballGroup.userData.baseAngle = (index / skillBallData.length) * Math.PI * 2;
      ballGroup.userData.baseRadius = 2.35 + (index % 2) * 0.2;
      ballGroup.userData.phase = index * 0.75;
      skillBalls.add(ballGroup);
    });

    const ambient = new THREE.AmbientLight(0x7486a8, 1.2);
    scene.add(ambient);

    const keyLight = new THREE.PointLight(0xf5c542, 9, 14, 1.8);
    keyLight.position.set(2.2, 2.7, 1.8);
    scene.add(keyLight);

    const rim = new THREE.PointLight(0x7ea8ff, 1.8, 12, 2);
    rim.position.set(-2.6, 1.6, -2);
    scene.add(rim);

    const topLight = new THREE.DirectionalLight(0xfff0d2, 0.8);
    topLight.position.set(0.5, 3, 2.8);
    scene.add(topLight);

    const pointer = { x: 0, y: 0 };
    const target = { x: 0, y: 0 };
    let isHover = false;
    let nextBlinkAt = 1.2;
    let blinkTimer = 0;
    let blinking = false;
    let actionMix = 0;

    const onMove = (event) => {
      const rect = container.getBoundingClientRect();
      const nx = (event.clientX - rect.left) / rect.width;
      const ny = (event.clientY - rect.top) / rect.height;
      target.x = (nx - 0.5) * 0.9;
      target.y = (ny - 0.5) * 0.65;
    };

    const onEnter = () => {
      isHover = true;
    };

    const onLeave = () => {
      isHover = false;
      target.x = 0;
      target.y = 0;
    };

    container.addEventListener('mousemove', onMove);
    container.addEventListener('mouseenter', onEnter);
    container.addEventListener('mouseleave', onLeave);

    const resizeObserver = new ResizeObserver(() => {
      const { width, height } = getContainerSize();
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    });
    resizeObserver.observe(container);

    const clock = new THREE.Clock();
    let rafId = 0;
    let didSignalReady = false;

    const renderLoop = () => {
      const delta = clock.getDelta();
      const t = clock.elapsedTime;

      pointer.x += (target.x - pointer.x) * 0.07;
      pointer.y += (target.y - pointer.y) * 0.07;

      const isActionActive = performance.now() < actionUntilRef.current;
      const actionTarget = isActionActive ? 1 : 0;
      actionMix += (actionTarget - actionMix) * 0.08;

      world.position.x = pointer.x * 0.22;
      world.position.y = pointer.y * 0.16;

      const spinSpeed = (isHover ? 1.8 : 1) + actionMix * 2.6;
      mascot.rotation.y += 0.005 * spinSpeed;
      mascot.rotation.x = Math.sin(t * 0.8) * 0.03;

      const jumpBase = Math.sin(t * 1.5) * 0.08;
      const jumpBurst = Math.abs(Math.sin(t * 8.8)) * 0.32 * actionMix;
      mascot.position.y = jumpBase + jumpBurst;

      const orbitRadius = 0.55 * actionMix;
      mascotOrbitRoot.position.x = Math.cos(t * 3.4) * orbitRadius;
      mascotOrbitRoot.position.z = Math.sin(t * 3.4) * orbitRadius;

      rightArmPivot.rotation.z = -0.22 + Math.sin(t * 2.4) * (0.18 + 0.2 * actionMix);
      rightArmPivot.rotation.x = -0.24 + Math.sin(t * 1.9) * (0.08 + 0.18 * actionMix);
      leftArmPivot.rotation.z = 0.24 + Math.cos(t * 2.2) * (0.16 + 0.16 * actionMix);
      leftArmPivot.rotation.x = -0.18 + Math.sin(t * 1.7) * (0.05 + 0.15 * actionMix);
      rightHand.rotation.y = Math.sin(t * 3.1) * 0.25;

      leftLeg.rotation.x = Math.sin(t * 3.8) * (0.1 + 0.25 * actionMix);
      rightLeg.rotation.x = Math.sin(t * 3.8 + Math.PI) * (0.1 + 0.25 * actionMix);

      if (!blinking && t > nextBlinkAt) {
        blinking = true;
        blinkTimer = 0;
        nextBlinkAt = t + 2.2 + Math.random() * 2.1;
      }

      if (blinking) {
        blinkTimer += delta * 9;
        const squeeze = Math.sin(Math.min(blinkTimer, 1) * Math.PI);
        const eyeScaleY = Math.max(0.08, 1 - squeeze * 0.95);
        leftEye.scale.y = eyeScaleY;
        rightEye.scale.y = eyeScaleY;
        leftPupil.scale.y = eyeScaleY;
        rightPupil.scale.y = eyeScaleY;

        if (blinkTimer >= 1) {
          blinking = false;
          leftEye.scale.y = 1;
          rightEye.scale.y = 1;
          leftPupil.scale.y = 1;
          rightPupil.scale.y = 1;
        }
      }

      laptopScreen.material.emissiveIntensity = 0.2 + Math.sin(t * 2.8) * 0.08;
      glowRing.rotation.z += 0.003 + actionMix * 0.015;

      skillBalls.children.forEach((ball) => {
        const speed = 0.35 + actionMix * 1.6;
        const angle = ball.userData.baseAngle + t * speed;
        const radius = ball.userData.baseRadius + Math.sin(t * 1.8 + ball.userData.phase) * 0.08 + actionMix * 0.2;
        ball.position.x = Math.cos(angle) * radius;
        ball.position.z = Math.sin(angle) * radius;
        ball.position.y = Math.sin(t * 1.6 + ball.userData.phase) * (0.24 + actionMix * 0.18);
        ball.rotation.y += 0.015 + actionMix * 0.035;
      });

      const orbitAngle = t * 0.23;
      const cameraRadius = 6;
      camera.position.x = Math.cos(orbitAngle) * cameraRadius + pointer.x * 0.45 + Math.sin(t * 1.7) * 0.03;
      camera.position.z = Math.sin(orbitAngle) * cameraRadius + pointer.y * 0.32 + Math.cos(t * 1.5) * 0.03;
      camera.position.y = 1.1 + pointer.y * 0.4 + Math.sin(t * 2.1) * 0.02;
      camera.lookAt(world.position.x * 0.25, 0.2, 0);

      renderer.render(scene, camera);

      if (!didSignalReady && typeof onReady === 'function') {
        didSignalReady = true;
        onReady();
      }

      rafId = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      cancelAnimationFrame(rafId);
      resizeObserver.disconnect();
      container.removeEventListener('mousemove', onMove);
      container.removeEventListener('mouseenter', onEnter);
      container.removeEventListener('mouseleave', onLeave);

      scene.traverse((object) => {
        if (object.geometry) {
          object.geometry.dispose();
        }
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => {
              if (material.map) {
                material.map.dispose();
              }
              material.dispose();
            });
          } else {
            if (object.material.map) {
              object.material.map.dispose();
            }
            object.material.dispose();
          }
        }
        if (object.userData.texture) {
          object.userData.texture.dispose();
        }
      });

      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onReady]);

  return (
    <div className="workspace-scene" ref={mountRef}>
      <div className="scene-overlay" aria-hidden="true" />
      <div className="scene-caption" aria-hidden="true">
        Cartoon Dev 3D
      </div>
    </div>
  );
}

export default WorkspaceScene;
