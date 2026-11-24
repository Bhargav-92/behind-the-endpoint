import {
  AmbientLight, BoxGeometry, BufferGeometry, ConeGeometry, CylinderGeometry, DirectionalLight,
  Group, Mesh, MeshBasicMaterial, MeshLambertMaterial,
  SphereGeometry, TubeGeometry, WebGLRenderer, OrthographicCamera, QuadraticBezierCurve3, Scene, Vector3,
  type Material,
} from "three";

function component(name: string, color: string, screenColor: string) {
  const group = new Group();
  const surface = new MeshLambertMaterial({ color });
  function part(geometry: BufferGeometry, x: number, y: number, z: number, material: Material = surface) {
    const mesh = new Mesh(geometry, material);
    mesh.position.set(x, y, z);
    group.add(mesh);
  }
  if (/database|table|store|cache|index|permissions/i.test(name)) {
    for (const y of [-0.48, 0, 0.48]) part(new CylinderGeometry(.79, .79, .38, 24), 0, y, 0);
  } else if (/browser|client|reader|test runner/i.test(name)) {
    part(new BoxGeometry(1.75, 1.22, .15), 0, .21, 0);
    part(new BoxGeometry(1.52, .93, .03), 0, .23, .1, new MeshBasicMaterial({ color: screenColor }));
    part(new BoxGeometry(1.29, .065, .025), 0, .53, .14);
    part(new BoxGeometry(.66, .045, .025), -.31, .28, .14);
    part(new BoxGeometry(.96, .045, .025), -.16, .12, .14);
    part(new BoxGeometry(.23, .32, .18), 0, -.54, 0);
    part(new BoxGeometry(1.07, .1, .64), 0, -.73, 0);
  } else if (/queue/i.test(name)) {
    for (const x of [-.58, 0, .58]) part(new BoxGeometry(.28, 1.15, 1.02), x, 0, 0);
  } else {
    for (const y of [-.56, 0, .56]) {
      part(new BoxGeometry(1.7, .28, .88), 0, y, 0);
      part(new BoxGeometry(.64, .065, .03), -.26, y, .465, new MeshBasicMaterial({ color: screenColor }));
    }
  }
  group.rotation.set(.18, -.28, 0);
  return group;
}

export function mountTrace(host: HTMLElement, names: string[], from: number, to: number) {
  const css = getComputedStyle(host);
  const token = (key: string) => css.getPropertyValue(key).trim();
  const scene = new Scene();
  const renderer = new WebGLRenderer({ alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
  renderer.domElement.setAttribute("aria-hidden", "true");
  host.append(renderer.domElement);
  const camera = new OrthographicCamera(-6, 6, 2, -2, .1, 40);
  camera.position.z = 12;
  scene.add(new AmbientLight(0xffffff, 1.1));
  const keyLight = new DirectionalLight(0xffffff, 1.4);
  keyLight.position.set(-4, 6, 7);
  scene.add(keyLight);

  const centers = [-4, 0, 4];
  names.forEach((name, i) => {
    const color = token(i === from ? "--node-blue" : i === to ? "--node-violet" : "--node-idle");
    const model = component(name, color, token("--board"));
    model.position.x = centers[i];
    scene.add(model);
  });
  // A subdued wire keeps the full architecture visible on every step.
  for (let i = 0; i < centers.length - 1; i++) {
    const left = centers[i] + 1.02;
    const right = centers[i + 1] - 1.02;
    for (let x = left; x < right; x += .21) {
      const length = Math.min(.09, right - x);
      const dash = new Mesh(new BoxGeometry(length, .025, .025), new MeshBasicMaterial({ color: token("--wire") }));
      dash.position.set(x + length / 2, 0, -.1);
      scene.add(dash);
    }
  }
  const direction = Math.sign(to - from);
  const detour = Math.abs(to - from) === 2;
  const start = new Vector3(centers[from] + direction * 1.01, detour ? .45 : 0, 0);
  const end = new Vector3(centers[to] - direction * 1.11, start.y, 0);
  const middle = start.clone().lerp(end, .5);
  if (detour) middle.y = 2.12;
  const path = new QuadraticBezierCurve3(start, middle, end);
  const route = new Mesh(new TubeGeometry(path, 40, .027, 8, false), new MeshBasicMaterial({color: token("--node-violet")}));
  scene.add(route);
  const arrow = new Mesh(new ConeGeometry(.145, .25, 16), new MeshBasicMaterial({color: token("--node-violet")}));
  arrow.position.copy(end);
  arrow.quaternion.setFromUnitVectors(new Vector3(0, 1, 0), path.getTangent(1).normalize());
  scene.add(arrow);
  const packet = new Mesh(new SphereGeometry(.105, 16, 12), new MeshBasicMaterial({color: token("--node-blue")}));
  scene.add(packet);

  const motion = matchMedia("(prefers-reduced-motion: reduce)");
  let frame = 0, elapsed = 650, previous = 0, paused = true, visible = false;
  function draw() {
    path.getPointAt((elapsed % 2300) / 2300, packet.position);
    renderer.render(scene, camera);

  }
  function tick(now: number) {
    if (previous) elapsed += Math.min(80, now - previous);
    previous = now;
    draw();
    frame = requestAnimationFrame(tick);
  }
  function update() {
    cancelAnimationFrame(frame);
    previous = 0;
    draw();
    if (visible && !paused && !motion.matches && !document.hidden) frame = requestAnimationFrame(tick);
  }
  function resize() {
    const { width, height } = host.getBoundingClientRect();
    if (!width || !height) return;
    // Keep each component centered over its column as the viewport changes.
    const halfHeight = 6 * height / width;
    camera.top = halfHeight;
    camera.bottom = -halfHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
    draw();
  }
  const sizing = new ResizeObserver(resize);
  sizing.observe(host);
  const visibility = new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; update(); });
  visibility.observe(host);
  motion.addEventListener("change", update);
  document.addEventListener("visibilitychange", update);
  resize();
  return {
    pause(value: boolean) { paused = value; update(); },
    dispose() {
      sizing.disconnect(); visibility.disconnect(); cancelAnimationFrame(frame);
      motion.removeEventListener("change", update);
      document.removeEventListener("visibilitychange", update);
      const materials = new Set<Material>();
      scene.traverse(object => {
        if (object instanceof Mesh) {
          object.geometry.dispose();
          for (const material of [object.material].flat()) materials.add(material);
        }
      });
      materials.forEach(material => material.dispose());
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
    },
  };
}
