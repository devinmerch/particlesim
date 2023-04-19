// const vars
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer();
const particleSizeInput = document.getElementById('particleSize');
const randomizeColorsBtn = document.getElementById('randomizeColors');
const particleSpeedInput = document.getElementById('particleSpeed');
const disturbParticlesBtn = document.getElementById('disturbParticles');
const center = new THREE.Vector3(); 
let isShaking = false;


// renderer setup
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// particle system setup
const particleCount = 10000;
const particles = new Float32Array(particleCount * 3); 
const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(particles, 3));

const particleMaterial = new THREE.PointsMaterial({
  color: 0xffffff,
  size: 5
});

const particleSystem = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particleSystem);

for (let i = 0; i < particleCount; i++) {
  particles[i * 3] = Math.random() * 800 - 400; 
  particles[i * 3 + 1] = Math.random() * 800 - 400; 
  particles[i * 3 + 2] = Math.random() * 800 - 400; 
}

// camera setup
camera.position.z = 700;

// orbitControls documentation setup
const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 1;
controls.screenSpacePanning = false;
controls.minDistance = 100;
controls.maxDistance = 1000;

// event listeners
particleSizeInput.addEventListener('input', () => {
  particleMaterial.size = particleSizeInput.value;
});

randomizeColorsBtn.addEventListener('click', () => {
  particleMaterial.color.setHex(randomColor());
});

particleSpeedInput.addEventListener('input', () => {
  const particleSpeed = particleSpeedInput.value;
});

resetBtn.addEventListener('click', () => {
  camera.position.set(0, 4.2862637970157365e-14, 700);
  const center = new THREE.Vector3(); 
  camera.lookAt(center); 
  particleMaterial.color.setHex(0xFFFFFF);
  particleSpeedInput.value = 1;
  particleMaterial.size = 5;
  isShaking = false;
  document.getElementById('cameraPosition').textContent = 'Camera Position:';
  document.getElementById('cameraDirection').textContent = 'Camera Direction:';
});

disturbParticlesBtn.addEventListener('click', () => {
  isShaking = !isShaking;
});

findPos.addEventListener('click', () => {
  logCameraInfo();
});

goCorner.addEventListener('click', () => {
  camera.position.set(641.2415139523109, 412.3037600993364, -644.0006646400423);
  const corner = new THREE.Vector3(-0.7122038752394171, -0.41230376009933634, 0.568129606253631);
  camera.lookAt(corner); 

});

goSide.addEventListener('click', () => {
  camera.position.set(-913.6237907900412, 406.3384098339813, 13.44119027560101);
  const side = new THREE.Vector3(0.913623790790042, -0.4063384098339816, -0.0134411902756012);
  camera.lookAt(side); 
});

goTop.addEventListener('click', () => {
  camera.position.set(-79.33010388607386, 996.7726204975664, -1.491329978669366);
  const top = new THREE.Vector3(0.07933600883024333, -0.9968468153666705, 0.0014914409859647648);
  camera.lookAt(top); 
});


// rando helper function
function randomColor() {
  return Math.floor(Math.random() * 16777215);
}

function logCameraInfo() {
  const pos = camera.position;
  const dir = new THREE.Vector3(0, 0, -1).applyQuaternion(camera.quaternion);

  const posElem = document.querySelectorAll('p')[0];
  posElem.textContent = `Camera Position: (${pos.x.toFixed(2)}, ${pos.y.toFixed(2)}, ${pos.z.toFixed(2)})`;

  const dirElem = document.querySelectorAll('p')[1];
  dirElem.textContent = `Camera Direction: (${dir.x.toFixed(2)}, ${dir.y.toFixed(2)}, ${dir.z.toFixed(2)})`;
}


// Main Function
function animate() {
  requestAnimationFrame(animate);

  // move particles down
  const particleSpeed = particleSpeedInput.value; // gets current particle speed
  const positions = particleGeometry.attributes.position.array;

  const shakingAmplitude = 1; // the amount of shaking 
  const shakingFrequency = 0.1; // the speed of shaking 

  for (let i = 0; i < particleCount * 3; i += 3) {
    positions[i + 1] -= particleSpeed * Math.random();

    // reset pos of particle if it falls below screen
    if (positions[i + 1] < -250) {
      positions[i + 1] = 499;
    }

    // check and apply horizontal shaking
    if (isShaking) {
      positions[i] += Math.sin(positions[i + 1] * shakingFrequency) * shakingAmplitude;
    }
  }
  
  particleGeometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}
animate();
