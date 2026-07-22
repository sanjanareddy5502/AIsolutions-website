const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const menuButton = document.querySelector('[data-menu-button]');
const mobileMenu = document.querySelector('[data-mobile-menu]');
if (menuButton && mobileMenu) {
  const label = menuButton.querySelector('.sr-only');
  const closeMenu = () => {
    menuButton.setAttribute('aria-expanded', 'false');
    mobileMenu.hidden = true;
    if (label) label.textContent = 'Open navigation menu';
  };
  menuButton.addEventListener('click', () => {
    const open = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!open));
    mobileMenu.hidden = open;
    if (label) label.textContent = open ? 'Open navigation menu' : 'Close navigation menu';
  });
  mobileMenu.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
      closeMenu();
      menuButton.focus();
    }
  });
}

const header = document.querySelector('[data-site-header]');
if (header) {
  let lastY = window.scrollY;
  let ticking = false;
  const updateHeader = () => {
    const currentY = window.scrollY;
    header.classList.toggle('is-scrolled', currentY > 20);
    header.classList.toggle('is-hidden', currentY > lastY && currentY > 180 && !mobileMenu?.hidden === false);
    if (currentY < 100 || currentY < lastY) header.classList.remove('is-hidden');
    lastY = currentY;
    ticking = false;
  };
  window.addEventListener('scroll', () => {
    if (!ticking) {
      window.requestAnimationFrame(updateHeader);
      ticking = true;
    }
  }, { passive: true });
}

const splitTitle = document.querySelector('[data-split-title]');
if (splitTitle) {
  const walk = node => {
    [...node.childNodes].forEach(child => {
      if (child.nodeType === Node.TEXT_NODE && child.textContent.trim()) {
        const fragment = document.createDocumentFragment();
        child.textContent.split(/(\s+)/).forEach(part => {
          if (/^\s+$/.test(part)) fragment.appendChild(document.createTextNode(part));
          else if (part) {
            const outer = document.createElement('span');
            const inner = document.createElement('span');
            outer.className = 'word-reveal';
            inner.textContent = part;
            outer.appendChild(inner);
            fragment.appendChild(outer);
          }
        });
        child.replaceWith(fragment);
      } else if (child.nodeType === Node.ELEMENT_NODE && child.tagName !== 'BR') {
        walk(child);
      }
    });
  };
  walk(splitTitle);
}

window.requestAnimationFrame(() => document.body.classList.add('page-ready'));

const revealItems = document.querySelectorAll('.reveal-up');
if (reducedMotion || !('IntersectionObserver' in window)) {
  revealItems.forEach(item => item.classList.add('in-view'));
} else {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -7% 0px' });
  revealItems.forEach((item, index) => {
    item.style.transitionDelay = `${Math.min(index % 4, 3) * 70}ms`;
    observer.observe(item);
  });
}

if (!reducedMotion) {
  document.querySelectorAll('.tilt-card').forEach(card => {
    card.addEventListener('pointermove', event => {
      const bounds = card.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      card.style.transform = `perspective(1000px) rotateX(${y * -4}deg) rotateY(${x * 5}deg) translateY(-3px)`;
    });
    card.addEventListener('pointerleave', () => { card.style.transform = ''; });
  });

  document.querySelectorAll('.magnetic').forEach(button => {
    button.addEventListener('pointermove', event => {
      const bounds = button.getBoundingClientRect();
      const x = event.clientX - bounds.left - bounds.width / 2;
      const y = event.clientY - bounds.top - bounds.height / 2;
      button.style.transform = `translate(${x * 0.08}px, ${y * 0.08}px) translateY(-2px)`;
    });
    button.addEventListener('pointerleave', () => { button.style.transform = ''; });
  });
}

async function buildSculpture() {
  const canvas = document.querySelector('#hero-canvas');
  const stage = document.querySelector('[data-hero-art]');
  const fallback = document.querySelector('[data-sculpture-fallback]');
  if (!canvas || !stage || reducedMotion) return;

  try {
    const THREE = await import('https://cdn.jsdelivr.net/npm/three@0.179.1/build/three.module.js/+esm');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(35, 1, 0.1, 100);
    camera.position.set(0, 0, 8.4);

    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true, powerPreference: 'high-performance' });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.8));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;

    const group = new THREE.Group();
    scene.add(group);

    const coreMaterial = new THREE.MeshPhysicalMaterial({
      color: 0xd8d5cd,
      metalness: 0.68,
      roughness: 0.19,
      clearcoat: 1,
      clearcoatRoughness: 0.12,
      envMapIntensity: 1.2,
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(1.72, 8), coreMaterial);
    core.scale.set(1, 1.06, 1);
    group.add(core);

    const ringMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x8d8a83,
      metalness: 0.92,
      roughness: 0.16,
      clearcoat: 1,
      clearcoatRoughness: 0.08,
    });
    const ringGeometry = new THREE.TorusGeometry(2.22, 0.095, 36, 180);
    const ringA = new THREE.Mesh(ringGeometry, ringMaterial);
    ringA.rotation.set(1.12, 0.18, 0.45);
    group.add(ringA);
    const ringB = new THREE.Mesh(ringGeometry, ringMaterial.clone());
    ringB.material.color.setHex(0xc7c4bc);
    ringB.rotation.set(0.2, 1.2, -0.35);
    ringB.scale.setScalar(1.08);
    group.add(ringB);
    const ringC = new THREE.Mesh(new THREE.TorusGeometry(1.23, 0.065, 30, 140), ringMaterial.clone());
    ringC.material.color.setHex(0xf4f1e8);
    ringC.rotation.set(0.75, -0.65, 0.15);
    group.add(ringC);

    const pointGeometry = new THREE.BufferGeometry();
    const pointCount = 420;
    const positions = new Float32Array(pointCount * 3);
    for (let i = 0; i < pointCount; i += 1) {
      const radius = 2.7 + Math.random() * 1.7;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    pointGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const points = new THREE.Points(pointGeometry, new THREE.PointsMaterial({ color: 0x78756e, size: 0.015, transparent: true, opacity: 0.38 }));
    group.add(points);

    scene.add(new THREE.HemisphereLight(0xffffff, 0x77736b, 2.2));
    const keyLight = new THREE.DirectionalLight(0xffffff, 5.5);
    keyLight.position.set(-4, 5, 5);
    scene.add(keyLight);
    const rimLight = new THREE.PointLight(0x9eb3ff, 28, 15);
    rimLight.position.set(4, -1, 4);
    scene.add(rimLight);
    const warmLight = new THREE.PointLight(0xffead0, 18, 12);
    warmLight.position.set(-3, -4, 2);
    scene.add(warmLight);

    const pointer = { x: 0, y: 0 };
    stage.addEventListener('pointermove', event => {
      const bounds = stage.getBoundingClientRect();
      pointer.x = (event.clientX - bounds.left) / bounds.width - 0.5;
      pointer.y = (event.clientY - bounds.top) / bounds.height - 0.5;
    });
    stage.addEventListener('pointerleave', () => { pointer.x = 0; pointer.y = 0; });

    const resize = () => {
      const width = stage.clientWidth;
      const height = stage.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener('resize', resize, { passive: true });

    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      group.rotation.y += (pointer.x * 0.55 + elapsed * 0.12 - group.rotation.y) * 0.035;
      group.rotation.x += (-pointer.y * 0.3 + Math.sin(elapsed * 0.45) * 0.04 - group.rotation.x) * 0.04;
      ringA.rotation.z += 0.0025;
      ringB.rotation.z -= 0.0018;
      ringC.rotation.y += 0.0022;
      points.rotation.y = elapsed * -0.025;
      core.scale.setScalar(1 + Math.sin(elapsed * 0.8) * 0.012);
      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
    };
    animate();
    if (fallback) fallback.style.display = 'none';
  } catch (error) {
    console.warn('3D sculpture unavailable; using the CSS fallback.', error);
  }
}

buildSculpture();

const consultationForm = document.querySelector('[data-consultation-form]');
const formMessage = document.querySelector('[data-form-message]');
if (consultationForm && formMessage) {
  consultationForm.addEventListener('submit', event => {
    event.preventDefault();
    if (!consultationForm.checkValidity()) {
      consultationForm.reportValidity();
      return;
    }
    formMessage.textContent = 'Thanks—this preview did not send your information. Backend processing will be connected next.';
  });
}
