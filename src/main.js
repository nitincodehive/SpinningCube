import * as THREE from 'three';

// Initialize the scene
const scene = new THREE.Scene();

// Create a space background with stars
createSpaceBackground();

// Set up camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;

// Create renderer with antialiasing for smoother edges
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true; // Enable shadows
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Soft shadows
document.getElementById('app').appendChild(renderer.domElement);

// Create the cube
const cubeSize = 1.5;
const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
const cubeMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x00a2ff, // Neon blue
  metalness: 0.7,
  roughness: 0.2,
  emissive: 0x0066cc, // Slight glow effect
  emissiveIntensity: 0.4
});
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
cube.castShadow = true;
scene.add(cube);

// Add edge outline to the cube
const edges = new THREE.EdgesGeometry(cubeGeometry);
const lineMaterial = new THREE.LineBasicMaterial({ color: 0xffffff, linewidth: 2 });
const wireframe = new THREE.LineSegments(edges, lineMaterial);
cube.add(wireframe); // Add wireframe to cube

// Add lights
const ambientLight = new THREE.AmbientLight(0x111111, 1); // Dim ambient light
scene.add(ambientLight);

// Add point lights with different colors for dynamic lighting
const pointLight1 = new THREE.PointLight(0x00ffff, 1, 20); // Cyan
pointLight1.position.set(5, 3, 5);
pointLight1.castShadow = true;
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xff00ff, 1, 20); // Magenta
pointLight2.position.set(-5, -3, 5);
pointLight2.castShadow = true;
scene.add(pointLight2);

// Create an invisible plane to receive shadows
const planeGeometry = new THREE.PlaneGeometry(20, 20);
const planeMaterial = new THREE.MeshStandardMaterial({ 
  color: 0x000000,
  transparent: true,
  opacity: 0.1
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.z = -3;
plane.receiveShadow = true;
scene.add(plane);

// Function to create space background with stars and galaxies
function createSpaceBackground() {
  // Set background color to black
  scene.background = new THREE.Color(0x000000);
  
  // Create stars
  const starsGeometry = new THREE.BufferGeometry();
  const starsMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.1,
  });
  
  const starsVertices = [];
  for (let i = 0; i < 2000; i++) {
    const x = (Math.random() - 0.5) * 2000;
    const y = (Math.random() - 0.5) * 2000;
    const z = (Math.random() - 0.5) * 2000;
    starsVertices.push(x, y, z);
  }
  
  starsGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starsVertices, 3));
  const stars = new THREE.Points(starsGeometry, starsMaterial);
  scene.add(stars);
  
  // Add a few "galaxies" (particle systems with different colors)
  addGalaxy(0x9966ff, -30, 20, -100); // Purple galaxy
  addGalaxy(0x0099ff, 50, -40, -150); // Blue galaxy
}

// Function to add a galaxy-like particle system
function addGalaxy(color, x, y, z) {
  const particles = new THREE.BufferGeometry();
  const particleMaterial = new THREE.PointsMaterial({
    color: color,
    size: 0.2,
    transparent: true,
    opacity: 0.8
  });
  
  const particleVertices = [];
  const galaxySize = 20;
  for (let i = 0; i < 500; i++) {
    // Create spiral pattern
    const angle = Math.random() * Math.PI * 2;
    const radius = Math.random() * galaxySize;
    const xPos = Math.cos(angle) * radius;
    const yPos = Math.sin(angle) * radius;
    const zPos = (Math.random() - 0.5) * 5;
    
    particleVertices.push(xPos, yPos, zPos);
  }
  
  particles.setAttribute('position', new THREE.Float32BufferAttribute(particleVertices, 3));
  const galaxy = new THREE.Points(particles, particleMaterial);
  galaxy.position.set(x, y, z);
  scene.add(galaxy);
}

// Add orbit animation variables
let rotationSpeed = 0.01;
let pulseDirection = 1;
let time = 0;

// Handle window resize
window.addEventListener('resize', () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  
  renderer.setSize(width, height);
});

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  
  time += 0.01;
  
  // Rotate the cube
  cube.rotation.x += rotationSpeed;
  cube.rotation.y += rotationSpeed * 0.8;
  
  // Make lights move for dynamic effect
  pointLight1.position.x = Math.sin(time) * 8;
  pointLight1.position.y = Math.cos(time) * 8;
  
  pointLight2.position.x = Math.sin(time + Math.PI) * 8;
  pointLight2.position.y = Math.cos(time + Math.PI) * 8;
  
  // Pulse the cube slightly
  const pulseScale = 1 + 0.05 * Math.sin(time * 3);
  cube.scale.set(pulseScale, pulseScale, pulseScale);
  
  // Pulse the emissive intensity
  cube.material.emissiveIntensity = 0.2 + 0.3 * Math.abs(Math.sin(time * 2));
  
  renderer.render(scene, camera);
}

animate();