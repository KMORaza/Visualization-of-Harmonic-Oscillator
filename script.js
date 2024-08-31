const amplitudeInput = document.getElementById('amplitude');
const frequencyInput = document.getElementById('frequency');
const timeInput = document.getElementById('time');
const dampingInput = document.getElementById('damping');
const springConstantInput = document.getElementById('springConstant');
const updateButton = document.getElementById('updateButton');
const startButton = document.getElementById('startButton');
const pauseButton = document.getElementById('pauseButton');
const ctxOscillation = document.getElementById('oscillationChart').getContext('2d');
const ctxPhaseSpace = document.getElementById('phaseSpaceChart').getContext('2d');
const oscillationChart = new Chart(ctxOscillation, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Displacement vs Time',
            data: [],
            borderColor: 'rgba(75, 192, 192, 1)',
            backgroundColor: 'rgba(75, 192, 192, 0.2)',
            borderWidth: 1,
            fill: true
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Time (s)'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Displacement'
                }
            }
        }
    }
});
const phaseSpaceChart = new Chart(ctxPhaseSpace, {
    type: 'line',
    data: {
        labels: [],
        datasets: [{
            label: 'Phase Space (Displacement vs Velocity)',
            data: [],
            borderColor: 'rgba(255, 99, 132, 1)',
            backgroundColor: 'rgba(255, 99, 132, 0.2)',
            borderWidth: 1,
            fill: false
        }]
    },
    options: {
        responsive: true,
        scales: {
            x: {
                title: {
                    display: true,
                    text: 'Displacement'
                }
            },
            y: {
                title: {
                    display: true,
                    text: 'Velocity'
                }
            }
        }
    }
});
let amplitude = parseFloat(amplitudeInput.value);
let frequency = parseFloat(frequencyInput.value);
let maxTime = parseFloat(timeInput.value);
let damping = parseFloat(dampingInput.value);
let springConstant = parseFloat(springConstantInput.value);
let angularFrequency = 2 * Math.PI * frequency;
let dampingRatio = damping / (2 * Math.sqrt(springConstant));
let t = 0;
let numPoints = 100;
let animationFrameId;
let isAnimating = false;
function updateChartParams() {
    amplitude = parseFloat(amplitudeInput.value);
    frequency = parseFloat(frequencyInput.value);
    maxTime = parseFloat(timeInput.value);
    damping = parseFloat(dampingInput.value);
    springConstant = parseFloat(springConstantInput.value);
    if (isNaN(amplitude) || isNaN(frequency) || isNaN(maxTime) || isNaN(damping) || isNaN(springConstant) || amplitude <= 0 || frequency <= 0 || maxTime <= 0 || damping < 0 || springConstant <= 0) {
        alert('Please enter valid positive numbers for amplitude, frequency, time, damping factor, and spring constant.');
        return;
    }
    angularFrequency = 2 * Math.PI * frequency;
    dampingRatio = damping / (2 * Math.sqrt(springConstant));
    const labels = [];
    const data = [];
    for (let i = 0; i <= numPoints; i++) {
        const t = (i / numPoints) * maxTime;
        const displacement = amplitude * Math.exp(-dampingRatio * angularFrequency * t) * Math.sin(angularFrequency * t);
        labels.push(t.toFixed(2));
        data.push(displacement.toFixed(2));
    }
    oscillationChart.data.labels = labels;
    oscillationChart.data.datasets[0].data = data;
    oscillationChart.update();
    const phaseLabels = [];
    const phaseData = [];
    for (let i = 0; i <= numPoints; i++) {
        const t = (i / numPoints) * maxTime;
        const displacement = amplitude * Math.exp(-dampingRatio * angularFrequency * t) * Math.sin(angularFrequency * t);
        const velocity = -amplitude * Math.exp(-dampingRatio * angularFrequency * t) * (angularFrequency * Math.sin(angularFrequency * t) + dampingRatio * angularFrequency * Math.cos(angularFrequency * t));
        phaseLabels.push(displacement.toFixed(2));
        phaseData.push(velocity.toFixed(2));
    }
    phaseSpaceChart.data.labels = phaseLabels;
    phaseSpaceChart.data.datasets[0].data = phaseData;
    phaseSpaceChart.update();
}
function animateCharts() {
    const step = 0.1; 
    function update() {
        if (!isAnimating) return;
        if (t > maxTime) {
            t = 0;  
        }
        const displacement = amplitude * Math.exp(-dampingRatio * angularFrequency * t) * Math.sin(angularFrequency * t);
        const velocity = -amplitude * Math.exp(-dampingRatio * angularFrequency * t) * (angularFrequency * Math.sin(angularFrequency * t) + dampingRatio * angularFrequency * Math.cos(angularFrequency * t));
        const newOscillationLabels = oscillationChart.data.labels.slice();
        const newOscillationData = oscillationChart.data.datasets[0].data.slice();
        const newPhaseLabels = phaseSpaceChart.data.labels.slice();
        const newPhaseData = phaseSpaceChart.data.datasets[0].data.slice();
        newOscillationLabels.shift();
        newOscillationLabels.push((parseFloat(newOscillationLabels[newOscillationLabels.length - 1]) + step).toFixed(2));
        newOscillationData.shift();
        newOscillationData.push(displacement.toFixed(2));
        newPhaseLabels.shift();
        newPhaseLabels.push(displacement.toFixed(2));
        newPhaseData.shift();
        newPhaseData.push(velocity.toFixed(2));
        oscillationChart.data.labels = newOscillationLabels;
        oscillationChart.data.datasets[0].data = newOscillationData;
        phaseSpaceChart.data.labels = newPhaseLabels;
        phaseSpaceChart.data.datasets[0].data = newPhaseData;
        oscillationChart.update();
        phaseSpaceChart.update();
        t += step;
        animationFrameId = requestAnimationFrame(update);
    }
    if (!isAnimating) {
        isAnimating = true;
        update();
    }
}
updateButton.addEventListener('click', () => {
    updateChartParams();
    t = 0; 
    if (isAnimating) {
        cancelAnimationFrame(animationFrameId);
        isAnimating = false;
    }
});
startButton.addEventListener('click', () => {
    if (!isAnimating) {
        animateCharts();
    }
});
pauseButton.addEventListener('click', () => {
    if (isAnimating) {
        cancelAnimationFrame(animationFrameId);
        isAnimating = false;
    }
});
updateChartParams();
