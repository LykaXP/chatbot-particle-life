// Configuration
const numTypes = 6;
const colorStep = 360 / numTypes;
const numParticles = 500;
const canvasWidth = 1200;
const canvasHeight = 600;

// Global variables
let canvas, ctx;
let swarm = [];
let forces = [];
let minDistances = [];
let radii = [];
let isPaused = false;
let animationId;

// Initialize
function setup() {
    canvas = document.getElementById('canvas');
    ctx = canvas.getContext('2d');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;

    // Create particles
    for (let i = 0; i < numParticles; i++) {
        swarm.push(new Particle(canvasWidth, canvasHeight, numTypes));
    }

    // Initialize matrices
    forces = Array(numTypes).fill(0).map(() => Array(numTypes).fill(0));
    minDistances = Array(numTypes).fill(0).map(() => Array(numTypes).fill(0));
    radii = Array(numTypes).fill(0).map(() => Array(numTypes).fill(0));

    setParameters();
    draw();

    // Event listeners
    document.getElementById('randomize').addEventListener('click', setParameters);
    document.getElementById('pause').addEventListener('click', togglePause);
    document.getElementById('fullscreen').addEventListener('click', toggleFullscreen);
    
    document.addEventListener('keydown', (e) => {
        if (e.key.toLowerCase() === 'r') {
            setParameters();
        } else if (e.key === ' ') {
            e.preventDefault();
            togglePause();
        } else if (e.key.toLowerCase() === 'f') {
            e.preventDefault();
            toggleFullscreen();
        }
    });
}

function draw() {
    if (!isPaused) {
        // Clear canvas
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvasWidth, canvasHeight);

        // Update and display particles
        for (let p of swarm) {
            p.update(swarm, forces, minDistances, radii);
            p.display(ctx, colorStep);
        }
    }

    animationId = requestAnimationFrame(draw);
}

function setParameters() {
    for (let i = 0; i < numTypes; i++) {
        for (let j = 0; j < numTypes; j++) {
            forces[i][j] = Math.random() * (1.0 - 0.3) + 0.3;
            if (Math.random() < 0.5) {
                forces[i][j] *= -1;
            }
            minDistances[i][j] = Math.random() * (50 - 30) + 30;
            radii[i][j] = Math.random() * (250 - 70) + 70;
        }
    }
    printParameters();
}

function printParameters() {
    console.log('\n=== Parameters Updated ===');
    console.log('Number of types:', numTypes);
    console.log('Number of particles:', numParticles);
    console.log('K (force multiplier):', K);
    console.log('Friction:', friction);
    
    console.log('\nForces matrix:');
    for (let i = 0; i < numTypes; i++) {
        console.log(`Type ${i}:`, forces[i].map(f => f.toFixed(2)).join(' '));
    }
    
    console.log('\nMinimum distances matrix:');
    for (let i = 0; i < numTypes; i++) {
        console.log(`Type ${i}:`, minDistances[i].map(d => d.toFixed(1)).join(' '));
    }
    
    console.log('\nRadii matrix:');
    for (let i = 0; i < numTypes; i++) {
        console.log(`Type ${i}:`, radii[i].map(r => r.toFixed(1)).join(' '));
    }
    
    console.log('========================\n');
}

function togglePause() {
    isPaused = !isPaused;
    const button = document.getElementById('pause');
    button.textContent = isPaused ? 'Resume (Space)' : 'Pause/Resume (Space)';
}

function toggleFullscreen() {
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().catch(err => {
            console.log(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}

// Start the simulation when page loads
window.addEventListener('load', setup);
