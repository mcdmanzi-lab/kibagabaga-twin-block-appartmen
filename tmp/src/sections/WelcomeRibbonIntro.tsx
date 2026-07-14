import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { ParametricGeometry } from 'three/addons/geometries/ParametricGeometry.js';
import gsap from 'gsap';

const SHARED_VERTEX_SHADER = `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uWaveSpeed;
  uniform float uWaveAmplitude;
  uniform float uTextureOffset;

  void main() {
    vec3 pos = position;
    vec3 worldPos = (modelMatrix * vec4(position, 1.0)).xyz;
    pos.z += sin(worldPos.x * 0.30 + uTime * uWaveSpeed) * uWaveAmplitude;
    pos.z += sin(worldPos.y * 0.15 + uTime * uWaveSpeed * 0.5) * (uWaveAmplitude * 0.5);
    pos.z += uTextureOffset;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
    vUv = uv;
  }
`;

const SHARED_FRAGMENT_SHADER = `
  varying vec2 vUv;
  uniform sampler2D uTexture;
  uniform vec4 uLetterUvs;
  uniform vec3 uInkColor;
  uniform float uRoughness;
  uniform float uTransparency;
  uniform float uFilmThickness;
  uniform vec3 uBaseColor;

  vec3 thinFilmIridescence(float thickness, float cosTheta) {
    float eta = 0.1;
    float d = thickness * sqrt(1.0 - eta * eta * (1.0 - cosTheta * cosTheta));
    float phi = 6.283185307179586 * d / 550.0;
    float r = 0.5 + 0.5 * cos(phi);
    float g = 0.5 + 0.5 * cos(phi - 2.094);
    float b = 0.5 + 0.5 * cos(phi - 4.188);
    return vec3(r, g, b);
  }

  void main() {
    vec4 texColor = texture2D(uTexture, vUv);
    vec2 letterUV = vec2(mix(uLetterUvs.x, uLetterUvs.z, vUv.x), mix(uLetterUvs.y, uLetterUvs.w, vUv.y));
    vec4 letterTex = texture2D(uTexture, letterUV);
    vec3 color = uBaseColor;
    color += vec3(1.0) * texColor.r * 0.2;
    vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
    vec3 normal = normalize(vec3(dFdx(letterTex.a), dFdy(letterTex.a), 1.0 / max(letterTex.a, 0.01)));
    float NdotV = max(dot(normal, viewDir), 0.0);
    vec3 irid = thinFilmIridescence(uFilmThickness, NdotV);
    float inkMask = smoothstep(0.3, 0.6, letterTex.r);
    color += (uInkColor * irid * 0.5) * inkMask;
    color += vec3(1.0, 1.0, 1.0) * pow(irid.r, 3.0) * inkMask * 0.4;
    color -= vec3(0.05) * (1.0 - inkMask);
    float alpha = 1.0 - uTransparency;
    gl_FragColor = vec4(color, alpha);
  }
`;

interface WelcomeRibbonIntroProps {
  onComplete: () => void;
}

export default function WelcomeRibbonIntro({ onComplete }: WelcomeRibbonIntroProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(true);
  const [fading, setFading] = useState(false);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const frameRef = useRef<number>(0);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    const bgColor = new THREE.Color('#DEDEDE');
    scene.background = bgColor;
    scene.fog = new THREE.Fog(bgColor, 8, 25);

    const camera = new THREE.PerspectiveCamera(
      45,
      window.innerWidth / window.innerHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Build atlas
    const atlasCanvas = document.createElement('canvas');
    atlasCanvas.width = 1024;
    atlasCanvas.height = 1024;
    const ctx = atlasCanvas.getContext('2d')!;
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, 1024, 1024);
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = 'bold 100px "DM Serif Display", serif';

    const grid = 8;
    const step = 1024 / 8;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'.split('');
    const uvMap: Record<string, { u0: number; v0: number; u1: number; v1: number }> = {};

    for (let i = 0; i < chars.length; i++) {
      const col = i % grid;
      const row = Math.floor(i / grid);
      const x = col * step + step / 2;
      const y = row * step + step / 2;
      ctx.fillText(chars[i], x, y);
      const metrics = ctx.measureText(chars[i]);
      uvMap[chars[i]] = {
        u0: (x - metrics.width / 2) / 1024,
        v0: (y - 50) / 1024,
        u1: (x + metrics.width / 2) / 1024,
        v1: (y + 50) / 1024,
      };
    }

    const atlasTexture = new THREE.CanvasTexture(atlasCanvas);
    atlasTexture.anisotropy = 4;

    // Create ribbons
    const ribbonConfigs = [
      { inkColor: '#C8A96E', filmThickness: 100.0 }, // Gold
      { inkColor: '#FFFFFF', filmThickness: 50.0 },  // White/Cream
      { inkColor: '#8B7355', filmThickness: 200.0 }, // Taupe
      { inkColor: '#D4B896', filmThickness: 150.0 }, // Pale gold
    ];

    const ribbons: THREE.Mesh[] = [];
    const materials: THREE.ShaderMaterial[] = [];

    ribbonConfigs.forEach((config, index) => {
      const ribbonFunc = (u: number, v: number, target: THREE.Vector3) => {
        const uRad = u * 6.283185307179586;
        const x = Math.sin(uRad) * 1.2;
        const z = Math.cos(uRad) * 3.0;
        const y = (v - 0.5) * 1.0;
        target.set(x, y, z);
      };

      const geo = new ParametricGeometry(ribbonFunc, 120, 12);
      const mat = new THREE.ShaderMaterial({
        side: THREE.DoubleSide,
        uniforms: {
          uTime: { value: 0 },
          uTexture: { value: atlasTexture },
          uLetterUvs: { value: new THREE.Vector4(uvMap['W'].u0, uvMap['W'].v0, uvMap['W'].u1, uvMap['W'].v1) },
          uWaveSpeed: { value: 1.5 },
          uWaveAmplitude: { value: 0.8 },
          uTextureOffset: { value: 0.0 },
          uInkColor: { value: new THREE.Color(config.inkColor) },
          uRoughness: { value: 0.6 },
          uTransparency: { value: 0.0 },
          uFilmThickness: { value: config.filmThickness },
          uBaseColor: { value: new THREE.Color('#F4F1EA') },
        },
        vertexShader: SHARED_VERTEX_SHADER,
        fragmentShader: SHARED_FRAGMENT_SHADER,
        transparent: true,
      });

      const mesh = new THREE.Mesh(geo, mat);
      mesh.position.set(0, (index - 1.5) * 0.6, 0);
      mesh.rotation.y = index * 0.3;
      scene.add(mesh);
      ribbons.push(mesh);
      materials.push(mat);
    });

    // Letter cycling
    const welcomeLetters = ['W', 'E', 'L', 'C', 'O', 'M', 'E'];
    const kibagaLetters = ['K', 'I', 'B', 'A', 'G', 'A', 'B', 'A', 'G', 'A'];
    let letterIndex = 0;
    let showingWelcome = true;

    const setLetters = (word: string) => {
      letterIndex = 0;
      showingWelcome = word === 'WELCOME';
    };

    const cycleLetters = () => {
      const letters = showingWelcome ? welcomeLetters : kibagaLetters;
      const letter = letters[letterIndex % letters.length];
      if (letter && uvMap[letter]) {
        const uv = uvMap[letter];
        materials.forEach((mat) => {
          mat.uniforms.uLetterUvs.value.set(uv.u0, uv.v0, uv.u1, uv.v1);
        });
      }
      letterIndex++;
    };

    const letterInterval = setInterval(cycleLetters, 500);

    // Camera animation
    const tl = gsap.timeline({
      ease: 'none',
      onComplete: () => {
        setFading(true);
        setTimeout(() => {
          setVisible(false);
          onComplete();
        }, 1200);
      },
    });
    timelineRef.current = tl;

    tl.call(() => setLetters('WELCOME'));
    tl.to(camera.position, { x: 0, y: 0, z: 8, duration: 1.5 }, 'flyin');
    tl.to(ribbons[0].position, { x: 0, y: 0, z: 0, duration: 1.5 }, 'flyin');
    tl.to(ribbons[0].rotation, { x: 0, y: 0, z: 0, duration: 1.5 }, 'flyin');
    tl.call(() => setLetters('KIBAGABAGA'));
    tl.to(camera.position, { x: 2, y: 1, z: 4, duration: 2 }, 'zoom');
    tl.to(ribbons[0].rotation, { y: 1.5, duration: 2 }, 'zoom');
    tl.to(ribbons[0].rotation, { x: 0.5, y: 3.5, duration: 2 }, 'rotate');
    tl.to(ribbons[0].position, { x: -2, duration: 2 }, 'rotate');
    tl.call(() => setLetters('WELCOME'));
    tl.to(camera.position, { x: -1, y: -1, z: 5, duration: 2 }, 'pullback');
    tl.to(ribbons[0].rotation, { x: 0, y: 6.5, duration: 2 }, 'pullback');

    // Animate other ribbons
    ribbons.forEach((ribbon, i) => {
      if (i === 0) return;
      gsap.to(ribbon.rotation, {
        y: `+=${(i % 2 === 0 ? 1 : -1) * 2}`,
        duration: 4 + i,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
      });
    });

    // Animation loop
    const clock = new THREE.Clock();
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();
      materials.forEach((mat) => {
        mat.uniforms.uTime.value = elapsed;
      });
      renderer.render(scene, camera);
    };
    animate();

    // Resize handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(frameRef.current);
      clearInterval(letterInterval);
      tl.kill();
      renderer.dispose();
      materials.forEach((m) => m.dispose());
      ribbons.forEach((r) => r.geometry.dispose());
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      className={`fixed inset-0 z-[100] transition-opacity duration-[1200ms] ${
        fading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
      style={{
        transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div ref={containerRef} className="w-full h-full" />
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
        <p className="font-body text-xs uppercase tracking-[0.2em] text-charcoal/50 animate-pulse">
          Loading Experience
        </p>
      </div>
    </div>
  );
}
