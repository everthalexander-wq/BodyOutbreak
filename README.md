# Body Outbreak - Pandemic Simulation Game

A strategic 2D body invasion game where you play as a pathogen and must overcome the immune system, destroy organs, and trigger a full outbreak.

## 🎮 Play Now

**[▶️ Click here to play Body Outbreak](https://everthalexander-wq.github.io/BodyOutbreak/)**

Or open `index.html` in a browser locally.

## 🦠 Game Features

### Pathogens
- **SARS-CoV-2** - Fast-spreading respiratory virus with systemic effects
- **Influenza** - Highly mutable respiratory pathogen
- **Tuberculosis** - Persistent bacterial infection with high immunity resistance
- **E. coli** - Aggressive gut pathogen with sepsis potential
- **Candida** - Opportunistic fungus that thrives in immunocompromised states
- **Naegleria fowleri** - The brain-eating amoeba with devastating neurological damage
- **Plasmodium** - Malaria parasite with cyclic fever and multi-organ damage

### Routes of Transmission
- 🌬️ **Airborne** - Via lungs and respiratory system
- 💧 **Waterborne** - Through stomach and intestines
- 🦟 **Insect bite** - Direct bloodstream invasion
- 🤝 **Direct contact** - Skin to bloodstream
- 🍽️ **Food/ingestion** - Digestive tract invasion
- 🩸 **Bloodstream** - Systemic circulation

### Attack Modes
- **Organ** - Standard tissue damage
- **Veins** - Target blood circulation
- **Arteries** - High-impact vascular damage
- **Brain** - Neurological system assault
- **Immune System** - Direct antibody destruction
- **Whole Body** - Systemic outbreak

### Body Systems
- 🧠 Brain
- 💨 Lungs & Respiratory
- ❤️ Heart & Cardio
- 🩸 Bloodstream & Circulation
- 🫀 Veins & Arteries
- 🫘 Liver & Digestive
- 🫔 Kidneys & Renal
- 🦴 Bones & Skeleton
- 🦷 Mouth & Teeth
- 👃 Nasal Cavity
- 🫀 Stomach & Intestines
- 🫀 Skin Barrier

### Infection Stages
1. **Asymptomatic** - Silent infection spreading
2. **Mild** - Symptoms begin to appear
3. **Moderate** - Body systems showing stress
4. **Severe** - Multiple organ involvement
5. **Critical** - Systemic collapse imminent
6. **Biohazard** - Outbreak threshold reached
7. **Death / Outbreak** - Host collapse, global infection

### Gameplay Mechanics
- **Spread** - Infect connected organs and tissues
- **Mutate** - Evolve to resist immunity
- **Attack Immune** - Directly assault antibodies and white blood cells
- **End Turn** - Let the body's defenses react

### Win Conditions
- ✅ Destroy the immune system completely
- ✅ Reduce body health to 0
- ✅ Achieve 100% outbreak level
- ✅ Trigger biohazard status with immune collapse

## 🎯 Strategy Tips

1. **Early game**: Spread through connected organs before immunity builds up
2. **Mid game**: Mutate when immunity gets strong to evade defenses
3. **Late game**: Attack the immune system directly to achieve total takeover
4. **Choose your route**: Different routes give different bonuses to specific organs
5. **Brain is key**: Infecting the brain creates massive cascading damage
6. **Bloodstream is critical**: It connects to everything - use it as a highway

## 📊 Stats Explained

- **Stage** - Current progression (Asymptomatic → Death/Outbreak)
- **Outbreak** - Overall infection percentage across all organs
- **Body** - Host health (0 = death)
- **Immunity** - Immune system strength (0 = no defense)
- **Turn** - Game turn counter

## 🛠️ Technical

Built with:
- **HTML5** - Structure
- **CSS3** - Styling with gradients and animations
- **JavaScript (ES6)** - Game logic and canvas rendering
- **Canvas API** - Real-time 2D graphics

## 📁 Project Structure

```
BodyOutbreak/
├── index.html      # Main game interface
├── style.css       # Styling and theme
├── game.js         # Core game logic
└── README.md       # This file
```

## 🚀 How to Run Locally

1. Clone or download the repository:
   ```bash
   git clone https://github.com/everthalexander-wq/BodyOutbreak.git
   cd BodyOutbreak
   ```

2. Start a simple HTTP server:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   
   # Node.js
   npx http-server
   ```

3. Open your browser to `http://localhost:8000`

## 🎓 Educational Value

This game demonstrates:
- Real pathogenic behavior and transmission
- Immune system responses
- Organ system interconnectivity
- Infection progression stages
- Evolutionary mutation mechanics
- Strategic decision-making under pressure

## 📈 Future Enhancements

- [ ] Sound effects and music
- [ ] More realistic body anatomy
- [ ] Antibody visualization and combat
- [ ] Symptom progression UI
- [ ] Difficulty levels
- [ ] Leaderboard system
- [ ] Multiple outbreak scenarios
- [ ] Save/load game states
- [ ] Mobile optimization

## ⚠️ Disclaimer

This is a game for educational and entertainment purposes. It uses simplified mechanics to represent complex biological processes. Real infections are far more complex and should be studied through proper medical and scientific resources.

---

**Play now:** https://everthalexander-wq.github.io/BodyOutbreak/
