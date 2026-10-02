const PATHOGENS = {
  covid: {
    name: 'SARS-CoV-2',
    type: 'virus',
    color: '#ff5f6d',
    spread: 1.9,
    mutation: 1.4,
    aggressiveness: 1.6,
    immuneResistance: 1.5,
    description: 'Respiratory virus with rapid spread, systemic inflammation, and strong neurological effects.',
    routeBonus: ['airborne', 'blood', 'contact'],
    symptoms: ['Fever', 'Cough', 'Shortness of breath', 'Pneumonia', 'Cytokine storm']
  },
  influenza: {
    name: 'Influenza',
    type: 'virus',
    color: '#ffb703',
    spread: 1.65,
    mutation: 1.35,
    aggressiveness: 1.5,
    immuneResistance: 1.2,
    description: 'A fast-mutating respiratory pathogen that damages lungs and can trigger severe systemic failure.',
    routeBonus: ['airborne', 'contact', 'food'],
    symptoms: ['Fever', 'Body ache', 'Chest pain', 'Pneumonia', 'Respiratory collapse']
  },
  tuberculosis: {
    name: 'Tuberculosis',
    type: 'bacteria',
    color: '#ffd166',
    spread: 1.25,
    mutation: 1.2,
    aggressiveness: 1.7,
    immuneResistance: 1.8,
    description: 'Persistent bacterial infection that survives in the lungs and slowly eats through tissue and immunity.',
    routeBonus: ['airborne', 'blood', 'food'],
    symptoms: ['Chronic cough', 'Night sweats', 'Weight loss', 'Lung destruction', 'Granuloma']
  },
  ecoli: {
    name: 'E. coli',
    type: 'bacteria',
    color: '#f4a261',
    spread: 1.55,
    mutation: 1.1,
    aggressiveness: 1.8,
    immuneResistance: 1.3,
    description: 'Aggressive intestinal pathogen that attacks the gut, bloodstream, and urinary tract.',
    routeBonus: ['food', 'water', 'contact'],
    symptoms: ['Diarrhea', 'Stomach cramps', 'Sepsis', 'Kidney damage', 'Toxin shock']
  },
  candida: {
    name: 'Candida',
    type: 'fungus',
    color: '#8ecae6',
    spread: 1.2,
    mutation: 1.5,
    aggressiveness: 1.4,
    immuneResistance: 1.7,
    description: 'Opportunistic fungal infection that thrives when immunity is weakened and spreads through tissue.',
    routeBonus: ['contact', 'blood', 'water'],
    symptoms: ['Oral lesions', 'Skin infection', 'Systemic yeast', 'Thrush', 'Fungal sepsis']
  },
  naegleria: {
    name: 'Naegleria fowleri',
    type: 'parasite',
    color: '#7bd389',
    spread: 1.7,
    mutation: 1.4,
    aggressiveness: 2.1,
    immuneResistance: 1.9,
    description: 'The brain-eating amoeba. Extremely destructive, enters through the nose and attacks the central nervous system.',
    routeBonus: ['water', 'blood', 'contact'],
    symptoms: ['Headache', 'Confusion', 'Seizure', 'Brain swelling', 'Coma']
  },
  malaria: {
    name: 'Plasmodium',
    type: 'parasite',
    color: '#80ed99',
    spread: 1.5,
    mutation: 1.3,
    aggressiveness: 1.9,
    immuneResistance: 1.7,
    description: 'Blood parasite that invades red cells, damages organs, and triggers repeated systemic collapse.',
    routeBonus: ['insect', 'blood', 'water'],
    symptoms: ['Fever cycle', 'Anemia', 'Chills', 'Organ damage', 'Hemolysis']
  }
};

const ROUTES = {
  airborne: { label: 'Airborne', bonus: ['Lungs', 'Brain', 'Nasal cavity'], multiplier: 1.35 },
  water: { label: 'Waterborne', bonus: ['Stomach', 'Intestines', 'Bloodstream', 'Brain'], multiplier: 1.55 },
  insect: { label: 'Insect bite', bonus: ['Skin', 'Bloodstream', 'Liver'], multiplier: 1.6 },
  contact: { label: 'Direct contact', bonus: ['Skin', 'Bloodstream', 'Mouth'], multiplier: 1.3 },
  food: { label: 'Food / ingestion', bonus: ['Stomach', 'Intestines', 'Liver'], multiplier: 1.45 },
  blood: { label: 'Bloodstream', bonus: ['Heart', 'Brain', 'Liver', 'Kidneys'], multiplier: 1.75 }
};

const ATTACK_MODES = {
  organ: { label: 'Organ', power: 1.0 },
  veins: { label: 'Veins', power: 1.25 },
  arteries: { label: 'Arteries', power: 1.35 },
  brain: { label: 'Brain / nervous system', power: 1.55 },
  immune: { label: 'Immune system', power: 1.5 },
  systemic: { label: 'Whole body', power: 1.8 }
};

const STAGES = [
  { name: 'Asymptomatic', threshold: 0 },
  { name: 'Mild', threshold: 12 },
  { name: 'Moderate', threshold: 28 },
  { name: 'Severe', threshold: 46 },
  { name: 'Critical', threshold: 68 },
  { name: 'Biohazard', threshold: 82 },
  { name: 'Death / Outbreak', threshold: 100 }
];

const organs = {
  Brain: { x: 430, y: 110, radius: 46, infected: 0, health: 100, connected: ['Lungs', 'Heart', 'Bloodstream', 'Nasal cavity'] },
  Lungs: { x: 415, y: 250, radius: 62, infected: 0, health: 100, connected: ['Brain', 'Heart', 'Bloodstream', 'Skin', 'Nasal cavity'] },
  Heart: { x: 505, y: 280, radius: 50, infected: 0, health: 100, connected: ['Brain', 'Lungs', 'Bloodstream', 'Liver', 'Arteries'] },
  Liver: { x: 355, y: 385, radius: 52, infected: 0, health: 100, connected: ['Bloodstream', 'Stomach', 'Intestines', 'Veins', 'Arteries'] },
  Kidneys: { x: 500, y: 430, radius: 46, infected: 0, health: 100, connected: ['Bloodstream', 'Liver', 'Veins', 'Arteries'] },
  Stomach: { x: 285, y: 355, radius: 46, infected: 0, health: 100, connected: ['Intestines', 'Liver', 'Bloodstream', 'Mouth'] },
  Intestines: { x: 310, y: 515, radius: 58, infected: 0, health: 100, connected: ['Stomach', 'Liver', 'Kidneys', 'Bloodstream', 'Mouth'] },
  Skin: { x: 200, y: 260, radius: 38, infected: 0, health: 100, connected: ['Bloodstream', 'Lungs', 'Veins'] },
  Bloodstream: { x: 645, y: 320, radius: 54, infected: 0, health: 100, connected: ['Heart', 'Brain', 'Liver', 'Kidneys', 'Lungs', 'Veins', 'Arteries'] },
  Bones: { x: 660, y: 510, radius: 44, infected: 0, health: 100, connected: ['Kidneys', 'Bloodstream', 'Lungs', 'Veins'] },
  Mouth: { x: 220, y: 500, radius: 26, infected: 0, health: 100, connected: ['Stomach', 'Intestines', 'Bloodstream'] },
  Nasal cavity: { x: 370, y: 170, radius: 24, infected: 0, health: 100, connected: ['Brain', 'Lungs', 'Bloodstream'] },
  Veins: { x: 205, y: 620, radius: 38, infected: 0, health: 100, connected: ['Bloodstream', 'Liver', 'Kidneys', 'Skin'] },
  Arteries: { x: 650, y: 180, radius: 38, infected: 0, health: 100, connected: ['Heart', 'Brain', 'Lungs', 'Bloodstream'] }
};

const state = {
  selectedPathogen: 'covid',
  selectedRoute: 'airborne',
  selectedAttackMode: 'organ',
  target: 'Bloodstream',
  turn: 1,
  bodyHealth: 100,
  immuneSystem: 100,
  outbreak: 0,
  stage: 0,
  mutationLevel: 0,
  log: [],
  ended: false,
  lastOutcome: 'System stable'
};

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const pathogenSelect = document.getElementById('pathogenSelect');
const routeSelect = document.getElementById('routeSelect');
const attackModeSelect = document.getElementById('attackModeSelect');
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
const attackModeText = document.getElementById('attackModeText');
const statusText = document.getElementById('statusText');
const pathogenDetail = document.getElementById('pathogenDetail');
const logList = document.getElementById('logList');

function clamp(v, min, max) {
  return Math.min(Math.max(v, min), max);
}

function getPathogen() {
  return PATHOGENS[state.selectedPathogen];
}

function getRoute() {
  return ROUTES[state.selectedRoute];
}

function getAttackMode() {
  return ATTACK_MODES[state.selectedAttackMode];
}

function logMessage(message) {
  state.log.unshift(message);
  state.log = state.log.slice(0, 9);
  renderLog();
}

function renderLog() {
  logList.innerHTML = '';
  state.log.forEach((msg) => {
    const li = document.createElement('li');
    li.textContent = msg;
    logList.appendChild(li);
  });
}

function updatePathogenDetail() {
  const p = getPathogen();
  pathogenDetail.innerHTML = `
    <strong>${p.name}</strong><br>
    Type: ${p.type}<br>
    Route bonus: ${p.routeBonus.join(', ')}<br>
    Symptoms: ${p.symptoms.join(', ')}<br>
    ${p.description}
  `;
}

function calculateStage() {
  const infectedAverage = Object.values(organs).reduce((sum, organ) => sum + organ.infected, 0) / Object.keys(organs).length;
  const outbreakScore = clamp(Math.round((infectedAverage * 1.5) + state.turn * 1.5), 0, 100);
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
  selectedOrganText.textContent = state.target;
  attackModeText.textContent = getAttackMode().label;
  statusText.textContent = state.lastOutcome;
  calculateStage();
}

function infectOrgan(name, amount) {
  const org = organs[name];
  if (!org) return;
  org.infected = clamp(org.infected + amount, 0, 100);
  org.health = clamp(org.health - amount * 0.45, 0, 100);
  if (org.infected > 70) {
    state.lastOutcome = `${name} is critically compromised.`;
  }
}

function spreadInfection() {
  if (state.ended) return;
  const p = getPathogen();
  const route = getRoute();

  let didSpread = false;
  Object.entries(organs).forEach(([name, org]) => {
    if (org.infected <= 0) return;

    org.connected.forEach((targetName) => {
      const target = organs[targetName];
      if (!target) return;

      let bonus = 1;
      if (route.bonus.includes(targetName)) bonus += 0.5;
      if (targetName === 'Bloodstream') bonus += 0.3;
      if (targetName === 'Brain') bonus += 0.2;
      if (targetName === 'Veins' || targetName === 'Arteries') bonus += 0.4;

      const probability = clamp((org.infected / 100) * p.spread * route.multiplier * bonus * (1 + state.mutationLevel * 0.15), 0.1, 0.96);

      if (Math.random() < probability) {
        infectOrgan(targetName, 8 + p.aggressiveness * 4 + state.mutationLevel * 2);
        didSpread = true;
      }
    });
  });

  if (!didSpread) {
    logMessage(`${p.name} is trying to spread but the body is resisting.`);
  } else {
    logMessage(`${p.name} spread through connected tissue and blood routes.`);
  }

  const totalInfected = Object.values(organs).reduce((sum, organ) => sum + organ.infected, 0);
  state.bodyHealth = clamp(state.bodyHealth - totalInfected * 0.04, 0, 100);
  state.immuneSystem = clamp(state.immuneSystem - p.immuneResistance * 4 + state.mutationLevel * 1.2, 0, 100);

  if (state.bodyHealth <= 0 || state.immuneSystem <= 0) {
    state.ended = true;
    state.lastOutcome = 'Host collapse. You win.';
    logMessage('The body has fallen. Outbreak is complete.');
  }

  updateStats();
  render();
}

function mutatePathogen() {
  if (state.ended) return;
  const p = getPathogen();
  state.mutationLevel += 1;
  state.immuneSystem = clamp(state.immuneSystem - 6, 0, 100);
  logMessage(`${p.name} mutates. Genetic adaptation increased immunity evasion.`);
  state.lastOutcome = `${p.name} is adapting.`;
  updateStats();
  render();
}

function attackImmuneSystem() {
  if (state.ended) return;
  const p = getPathogen();
  const attack = 8 + p.aggressiveness * 6 + state.mutationLevel * 2;
  state.immuneSystem = clamp(state.immuneSystem - attack, 0, 100);
  infectOrgan(state.target, 12 + p.aggressiveness * 5);
  logMessage(`${p.name} attacks the immune system and targets ${state.target}.`);
  state.lastOutcome = 'Cytokines and immune signals are failing.';

  if (state.immuneSystem <= 0) {
    state.ended = true;
    state.lastOutcome = 'Immune system destroyed. Total takeover.';
    logMessage('No immunity remains. The body is lost.');
  }

  updateStats();
  render();
}

function endTurn() {
  if (state.ended) return;
  state.turn += 1;

  const averageInfection = Object.values(organs).reduce((sum, organ) => sum + organ.infected, 0) / Object.keys(organs).length;
  const damage = averageInfection * 0.08 + (100 - state.immuneSystem) * 0.09;
  state.bodyHealth = clamp(state.bodyHealth - damage, 0, 100);
  state.immuneSystem = clamp(state.immuneSystem + 4 - state.mutationLevel * 0.7, 0, 100);

  Object.entries(organs).forEach(([name, organ]) => {
    if (organ.infected > 0) {
      organ.infected = clamp(organ.infected - 1 - state.mutationLevel * 0.6, 0, 100);
    }
  });

  if (state.bodyHealth <= 0) {
    state.lastOutcome = 'Host death. Infection becomes global.';
    state.ended = true;
    logMessage('The host is dead. The world is now contaminated.');
  }

  if (state.outbreak >= 80 && state.immuneSystem <= 25) {
    state.lastOutcome = 'Critical collapse. Body is failing rapidly.';
    logMessage('Biohazard threshold reached. Systemic collapse imminent.');
  }

  updateStats();
  render();
}

function drawBody() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = '#120d17';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.save();
  ctx.translate(20, 20);

  ctx.fillStyle = '#f3d9c1';
  ctx.beginPath();
  ctx.arc(350, 90, 60, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f3d9c1';
  ctx.fillRect(305, 150, 90, 170);
  ctx.fillRect(300, 320, 120, 220);

  ctx.fillStyle = '#ecd0aa';
  ctx.fillRect(305, 315, 110, 220);
  ctx.restore();

  Object.entries(organs).forEach(([name, organ]) => {
    const infectedAlpha = clamp(0.15 + organ.infected / 120, 0.15, 0.9);
    ctx.beginPath();
    ctx.fillStyle = organ.infected > 0 ? `rgba(255, 79, 100, ${infectedAlpha})` : 'rgba(74, 222, 128, 0.18)';
    ctx.arc(organ.x, organ.y, organ.radius + 10, 0, Math.PI * 2);
    ctx.fill();

    ctx.beginPath();
    ctx.fillStyle = organ.infected > 0 ? '#ff4d6d' : '#4ecdc4';
    ctx.arc(organ.x, organ.y, organ.radius, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#fff';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(name, organ.x, organ.y + 4);

    ctx.fillStyle = '#140e18';
    ctx.font = '10px Arial';
    ctx.fillText(`${Math.round(organ.infected)}%`, organ.x, organ.y + 18);
  });

  const pulse = 0.1 + (Math.sin(Date.now() / 300) + 1) * 0.08;
  if (state.outbreak > 40) {
    ctx.beginPath();
    ctx.fillStyle = `rgba(255, 70, 120, ${pulse})`;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function render() {
  drawBody();
  updateStats();
}

function initialSeed() {
  const p = getPathogen();
  const route = getRoute();
  const firstTarget = route.bonus[0] || 'Bloodstream';
  infectOrgan(firstTarget, 22 + p.aggressiveness * 8);
  logMessage(`${p.name} entered through ${route.label.toLowerCase()} and seeded the ${firstTarget}.`);
  state.lastOutcome = `${p.name} has entered the body.`;
  updateStats();
  render();
}

function setupEvents() {
  pathogenSelect.addEventListener('change', (event) => {
    state.selectedPathogen = event.target.value;
    updatePathogenDetail();
    logMessage(`${getPathogen().name} selected.`);
    state.lastOutcome = `${getPathogen().name} is active.`;
    render();
  });

  routeSelect.addEventListener('change', (event) => {
    state.selectedRoute = event.target.value;
    logMessage(`${getRoute().label} route selected.`);
    state.lastOutcome = `Transmission route: ${getRoute().label}.`;
    render();
  });

  attackModeSelect.addEventListener('change', (event) => {
    state.selectedAttackMode = event.target.value;
    logMessage(`Attack mode: ${getAttackMode().label}.`);
    state.lastOutcome = `Targeting ${getAttackMode().label}.`;
    render();
  });

  spreadBtn.addEventListener('click', () => spreadInfection());
  mutateBtn.addEventListener('click', () => mutatePathogen());
  immuneBtn.addEventListener('click', () => attackImmuneSystem());
  advanceBtn.addEventListener('click', () => endTurn());

  canvas.addEventListener('click', (event) => {
    const rect = canvas.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((event.clientY - rect.top) / rect.height) * canvas.height;

    let clicked = null;
    Object.entries(organs).forEach(([name, organ]) => {
      const dx = x - organ.x;
      const dy = y - organ.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist <= organ.radius + 10) {
        clicked = name;
      }
    });

    if (clicked) {
      state.target = clicked;
      logMessage(`${clicked} selected as the focus of attack.`);
      state.lastOutcome = `${clicked} is now the target.`;
      updateStats();
      render();
    }
  });
}

function startGame() {
  updatePathogenDetail();
  setupEvents();
  initialSeed();
  logMessage('The body enters a state of systemic vulnerability.');
  render();
}

startGame();
