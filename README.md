# Body Outbreak

A minimal browser strategy game where you play as a pathogen and try to destroy the host body by spreading infection across organs, blood, immunity, and nervous tissue.

## How to play

1. Open `index.html` in a browser.
2. Select a pathogen: Virus, Bacteria, Fungus, or Parasite.
3. Choose a transmission route: airborne, water, insect, contact, food, or blood.
4. Click organs on the body to target them.
5. Use these actions:
   - Spread: infect connected organs.
   - Mutate: increase spread and resistance.
   - Attack immune: directly destroy the immune response.
   - End turn: allow the body and immune system to react.
6. Win by bringing the outbreak to critical levels and collapsing immunity.
7. If the host body collapses before you win, the game ends.

## Project structure

- `index.html` — main interface
- `style.css` — styling
- `game.js` — gameplay logic and rendering

## Game concept

This build focuses on a simple but playable body map with:

- Multiple pathogen types
- Multiple routes of transmission
- Infection spread across connected organs
- Immune response pressure
- Outbreak stage tracker
- Organ-targeting and turn-based play

## Notes

This is a prototype built for quick play and iteration. It can be expanded with:

- more advanced organ systems
- sound effects and animations
- enemy AI and antibodies
- battle mechanics by organ
- save systems and difficulty modes
- richer progression and win/lose screens

