const ORGAN_NAMES = [
  'Brain',
  'Lungs',
  'Heart',
  'Liver',
  'Kidneys',
  'Stomach',
  'Intestines',
  'Skin',
  'Bloodstream',
  'Bones'
];

const PATHOGENS = {
  virus: {
    name: 'Virus',
    color: '#ff5f6d',
    spread: 1.5,
    mutation: 1.2,
    aggressiveness: 1.2,
    immuneResistance: 1.1,
    description: 'Fast, stealthy, and deadly once it reaches the nervous and respiratory systems.'
  },
  bacteria: {
    name: 'Bacteria',
    color: '#ffd166',
    spread: 1.25,
    mutation: 1.1,
    aggressiveness: 1.4,
    immuneResistance: 1.0,
    description: 'Resilient and destructive. Strong at attacking organs and blood flow.'
  },
  fungus: {
    name: 'Fungus',
    color: '#8ecae6',
    spread: 1.1,
    mutation: 1.35,
    aggressiveness: 1.15,
    immuneResistance: 1.25,
    description: 'Slow but dangerous; thrives in humid, weakened environments.'
  },
  parasite: {
    name: 'Parasite',
    color: '#7bd389',
    spread: 1.35,
    mutation: 1.25,
    aggressiveness: 1.5,
    immuneResistance: 1.2,
    description: 'Highly invasive. Focuses on blood, organs, and brain tissue.'
  }
};

const ROUTES = {
  airborne: { label: 'Airborne', bonus: ['Lungs', 'Brain'], multiplier: 1.2 },
  water: { label: 'Waterborne', bonus: ['Bloodstream', 'Stomach', 'Intestines'], multiplier: 1.35 },
  insect: { label: 'Insect', bonus: ['Bloodstream', 'Skin'], multiplier: 1.4 },
  contact: { label: 'Direct Contact', bonus: ['Skin', 'Bloodstream'], multiplier: 1.25 },
  food: { label: 'Food / ingestion', bonus: ['Stomach', 'Intestines', 'Liver'], multiplier: 1.3 },
  blood: { label: 'Bloodstream', bonus: ['Heart', 'Brain', 'Liver', 'Kidneys'], multiplier: 1.5 }
};

const STAGES = [
  { name: 'Asymptomatic', threshold: 0 },
  { name: 'Mild', threshold: 10 },
  { name: 'Moderate', threshold: 25 },
  { name: 'Severe', threshold: 45 },
  { name: 'Critical', threshold: 65 },
  { name: 'Biohazard', threshold: 80 },
  { name: 'Death / Outbreak', threshold: 100 }
];

const organs = {
  Brain: { x: 430, y: 110, radius: 46, type: 'brain', health: 100, infected: 0, connected: ['Lungs', 'Heart', 'Bloodstream'] },
  Lungs: { x: 415, y: 250, radius: 62, type: 'respiratory', health: 100, infected: 0, connected: ['Brain', 'Heart', 'Bloodstream', 'Skin'] },
  Heart: { x: 505, y: 280, radius: 50, type: 'cardio', health: 100, infected: 0, connected: ['Brain', 'Lungs', 'Bloodstream', 'Liver'] },
  Liver: { x: 355, y: 385, radius: 52, type: 'digestive', health: 100, infected: 0, connected: ['Bloodstream', 'Stomach', 'Intestines', 'Heart'] },
  Kidneys: { x: 500, y: 430, radius: 46, type: 'renal', health: 100, infected: 0, connected: ['Bloodstream', 'Liver', 'Bones'] },
  Stomach: { x: 285, y: 355, radius: 46, type: 'digestive', health: 100, infected: 0, connected: ['Intestines', 'Liver', 'Bloodstream'] },
  Intestines: { x: 310, y: 515, radius: 58, type: 'digestive', health: 100, infected: 0, connected: ['Stomach', 'Liver', 'Kidneys', 'Bloodstream'] },
  Skin: { x: 200, y: 260, radius: 38, type: 'barrier', health: 100, infected: 0, connected: ['Bloodstream', 'Lungs'] },
  Bloodstream: { x: 645, y: 320, radius: 54, type: 'blood', health: 100, infected: 0, connected: ['Heart', 'Brain', 'Liver', 'Kidneys', 'Lungs'] },
  Bones: { x: 660, y: 510, radius: 44, type: 'skeleton', health: 100, infected: 0, connected: ['Kidneys', 'Bloodstream', 'Lungs'] }
};

const state = {
  selectedPathogen: 'virus',
  selectedRoute: 'airborne',
  target: 'Bloodstream',
  turn: 1,
  bodyHealth: 100,
  immuneSystem: 100,
  outbreak: 0,
  stage: 0,
  infectionCount: 0,
  log: [],
  ended: false,
  mutationLevel: 0,
  pathogenPower: 1,
  lastOutcome: 'System stable'
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const pathogenSelect = document.getElementById('pathogenSelect');
const routeSelect = document.getElementById('routeSelect');
const spreadBtn = document.getElementById('spreadBtn');
const mutateBtn = document.getElementById('mutateBtn');
const immuneBtn = document.getElementById('immuneBtn');
const advanceBtn = document.getElementById('advanceBtn');
const stageValue = document.getElementById('stageValue');
const outbreakValue = document.getElementById('outbreakValue');
const bodyHealthValue = document.getElementById('bodyHealthValue');
const immuneValue = document.getElementById('immuneValue');
const turnValue = document.getElementById('turnValue');
const selectedOrganText = document.getElementById('selectedOrganText');
const statusText = document.getElementById('statusText');
const logList = document.getElementById('logList');

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function logMessage(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 8);
  renderLog();
}

function renderLog() {
  logList.innerHTML = '';
  state.log.forEach((message) => {
    const item = document.createElement('li');
    item.textContent = message;
    logList.appendChild(item);
  });
}

function updateSelectedOrganText() {
  selectedOrganText.textContent = state.target;
}

function calculateStage() {
  const infectedOrganAverage = Object.values(organs).reduce((sum, organ) => sum + organ.infected, 0) / Object.keys(organs).length;
  const outbreakScore = clamp(Math.round((infectedOrganAverage * 1.4) + (state.turn * 1.2)), 0, 100);
  state.outbreak = outbreakScore;

  let index = 0;
  for (let i = STAGES.length - 1; i >= 0; i--) {
    if (outbreakScore >= STAGES[i].threshold) {
      index = i;
      break;
    }
  }

  state.stage = index;
  stageValue.textContent = STAGES[index].name;
  outbreakValue.textContent = `${state.outbreak}%`;
}

function updateStats() {
  bodyHealthValue.textContent = `${Math.round(state.bodyHealth)}`;
  immuneValue.textContent = `${Math.round(state.immuneSystem)}`;
  turnValue.textContent = `${state.turn}`;
  statusText.textContent = state.lastOutcome;
  updateSelectedOrganText();
  calculateStage();
}

function getPathogen() {
  return PATHOGENS[state.selectedPathogen];
}

function getRoute() {
  return ROUTES[state.selectedRoute];
}

function getOrgan(name) {
  return organs[name];
}

function infectOrgan(name, amount) {
  const organ = getOrgan(name);
  if (!organ) return;
  organ.infected = clamp(organ.infected + amount, 0, 100);
  if (organ.infected > 0) {
    organ.health = clamp(organ.health - amount * 0.5, 0, 100);
  }
  if (organ.health <= 0) {
    state.lastOutcome = `${name} is failing.`;
  }
}

function spreadInfection() {
  const route = getRoute();
  const pathogen = getPathogen();

  const infectedNames = Object.keys(organs).filter((name) => organs[name].infected > 0);
  if (infectedNames.length === 0) {
    logMessage('No active infection yet. The pathogen is looking for a route into the body.');
    return;
  }

  infectedNames.forEach((sourceName) => {
    const source = organs[sourceName];
    source.connected.forEach((targetName) => {
      const target = organs[targetName];
      let bonus = 0.6;
      if (route.bonus.includes(targetName)) bonus += 0.5;
      if (targetName === 'Bloodstream') bonus += 0.4;
      if (sourceName === 'Bloodstream') bonus += 0.2;

      const chance = clamp((source.infected / 100) * pathogen.spread * (route.multiplier + state.mutationLevel * 0.15) * bonus, 0.12, 0.96);
      if (Math.random() < chance) {
        infectOrgan(targetName, 8 + pathogen.aggressiveness * 5 + state.mutationLevel * 2);
      }
    });
  });

  const totalInfected = Object.values(organs).reduce((total, organ) => total + organ.infected, 0);
  state.infectionCount = totalInfected;
  state.bodyHealth = clamp(state.bodyHealth - totalInfected * 0.055 + (state.immuneSystem * 0.04), 0, 100);
  state.immuneSystem = clamp(state.immuneSystem - (pathogen.immuneResistance * 4) + (state.mutationLevel * 1.7), 0, 100);

  if (state.bodyHealth <= 0) {
    state.lastOutcome = 'The body has collapsed. You win.';
    state.ended = true;
    logMessage('The host is dead. Outbreak complete.');
  }

  if (state.immuneSystem <= 0) {
    state.lastOutcome = 'Immune system destroyed. Total takeover.';
    state.ended = true;
    logMessage('Antibodies are gone. The body is yours.');
  }

  updateStats();
  render();
}

function applyRouteStart() {
  const route = getRoute();
  const pathogen = getPathogen();
  const startingTargets = route.bonus.length ? route.bonus : ['Bloodstream'];
  const firstTarget = startingTargets[Math.floor(Math.random() * startingTargets.length)];

  infectOrgan(firstTarget, 20 + pathogen.aggressiveness * 8);
  logMessage(`${pathogen.name} entered through ${route.label.toLowerCase()} and seeded the ${firstTarget}.`);
  state.lastOutcome = `${pathogen.name} has entered the body.`;
  updateStats();
  render();
}

function mutatePathogen() {
  const pathogen = getPathogen();
  state.mutationLevel += 1;
  state.pathogenPower = 1 + state.mutationLevel * 0.18;
  state.immuneSystem = clamp(state.immuneSystem - 6, 0, 100);
  logMessage(`${pathogen.name} mutated. Resistance increased. Genetic adaptation successful.`);
  state.lastOutcome = `${pathogen.name} is adapting.`;
  updateStats();
  render();
}

function attackImmuneSystem() {
  const pathogen = getPathogen();
  const attackAmount = 8 + pathogen.aggressiveness * 6 + state.mutationLevel * 2;
  state.immuneSystem = clamp(state.immuneSystem - attackAmount, 0, 100);
  infectOrgan(state.target, 10 + pathogen.aggressiveness * 4);
  logMessage(`${pathogen.name} attacked the immune response and targeted the ${state.target}.`);
  state.lastOutcome = 'Immune response is under pressure.';
  updateStats();
  render();
}

function endTurn() {
  if (state.ended) return;
  state.turn += 1;

  const avgInfection = Object.values(organs).reduce((total, organ) => total + organ.infected, 0) / Object.keys(organs).length;
  const immunePressure = clamp((100 - state.immuneSystem) * 0.22, 0, 18);
  state.bodyHealth = clamp(state.bodyHealth - avgInfection * 0.04 - immunePressure, 0, 100);
  state.immuneSystem = clamp(state.immuneSystem + 4 - state.mutationLevel * 0.7, 0, 100);

  const infectedNames = Object.keys(organs).filter((name) => organs[name].infected > 0);
  if (infectedNames.length > 0) {
    const slashed = infectedNames[Math.floor(Math.random() * infectedNames.length)];
    const decay = 2 + state.mutationLevel;
    organs[slashed].infected = clamp(organs[slashed].infected - decay, 0, 100);
  }

  if (state.bodyHealth <= 0) {
    state.lastOutcome = 'The host died. Victory achieved.';
    state.ended = true;
    logMessage('The body is dead and the outbreak has become global.');
  }

  if (state.outbreak >= 80 && state.immuneSystem <= 25) {
    state.lastOutcome = 'The immune response is collapsing.';
    logMessage('Critical collapse: antibodies are failing across major systems.');
  }

  updateStats();
  render();
}

function ensureInitialInfection() {
  const route = getRoute();
  const pathogen = getPathogen();
  const firstTarget = route.bonus[0] || 'Bloodstream';
  infectOrgan(firstTarget, 18 + pathogen.aggressiveness * 8);
  state.lastOutcome = `${pathogen.name} has entered the body.`;
  updateStats();
  render();
}

function drawBody() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#1a1322';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(20, 20);

  ctx.fillStyle = '#f5e3d3';
  ctx.beginPath();
  ctx.arc(360, 100, 60, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#f5e3d3';
  ctx.fillRect(315, 150, 90, 170);
  ctx.fillRect(300, 320, 120, 220);

  ctx.fillStyle = '#f7d8bb';
  ctx.fillRect(305, 315, 110, 220);

  ctx.restore();

  Object.entries(organs).forEach(([name, organ]) => {
    const infectionColor = organ.infected > 0 ? `rgba(255, 79, 100, ${0.2 + organ.infected / 120})` : 'rgba(74, 222, 128, 0.2)';
    ctx.beginPath();
    ctx.fillStyle = infectionColor;
    ctx.arc(organ.x, organ.y, organ.radius + 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = organ.infected > 0 ? '#ff4d6d' : '#4ecdc4';
    ctx.arc(organ.x, organ.y, organ.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(name, organ.x, organ.y + 4);

    ctx.fillStyle = '#1a1322';
    ctx.font = '10px Arial';
    ctx.fillText(`${Math.round(organ.infected)}%`, organ.x, organ.y + 18);
  });
}

function render() {
  drawBody();
  updateStats();
}

function setupEvents() {
  pathogenSelect.addEventListener('change', (event) => {
    state.selectedPathogen = event.target.value;
    logMessage(`${PATHOGENS[state.selectedPathogen].name} selected. ${PATHOGENS[state.selectedPathogen].description}`);
    state.lastOutcome = `${PATHOGENS[state.selectedPathogen].name} is active.`;
    render();
  });

  routeSelect.addEventListener('change', (event) => {
    state.selectedRoute = event.target.value;
    logMessage(`${ROUTES[state.selectedRoute].label} route selected.`);
    state.lastOutcome = `Transmission route: ${ROUTES[state.selectedRoute].label}.`;
    render();
  });

  spreadBtn.addEventListener('click', () => {
    if (state.ended) return;
    spreadInfection();
  });

  mutateBtn.addEventListener('click', () => {
    if (state.ended) return;
    mutatePathogen();
  });

  immuneBtn.addEventListener('click', () => {
    if (state.ended) return;
    attackImmuneSystem();
  });

  advanceBtn.addEventListener('click', () => {
    if (state.ended) return;
    endTurn();
  });

  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;

    let target = null;
    Object.entries(organs).forEach(([name, organ]) => {
      const dx = x - organ.x;
      const dy = y - organ.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      if (distance <= organ.radius + 8) {
        target = name;
      }
    });

    if (target) {
      state.target = target;
      logMessage(`${target} selected as the target zone.`);
      state.lastOutcome = `${target} has been selected.`;
      updateSelectedOrganText();
      render();
    }
  });
}

function startGame() {
  logMessage('The pathogen enters the body. The host is vulnerable.');
  logMessage(`${PATHOGENS[state.selectedPathogen].name} begins to spread through ${ROUTES[state.selectedRoute].label.toLowerCase()}.`);
  ensureInitialInfection();
  setupEvents();
  render();
}

startGame();
