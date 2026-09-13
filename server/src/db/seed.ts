import db from './database';
import { createSchema } from './schema';

createSchema();

const games = [
  {
    slug: 'apex-drifter-2d',
    title: 'Apex Drifter 2D',
    genre: 'Racing',
    tagline: 'Race the neon grid. Drift or die.',
    description: 'A blazing top-down retro neon arcade racer featuring fully procedural track generation, deep vehicle tuning, and pulsating synthwave aesthetics. Drift through hairpin corners, slipstream rivals, and upgrade your ride with over 200 unlockable mods. Every race is a new nightmare—or a new masterpiece.',
    price: 14.99,
    discount_percent: 20,
    rating: 4.6,
    badge: 'Trending',
    thumbnail_url: 'https://picsum.photos/seed/apexdrifter/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots_json: JSON.stringify([
      'https://picsum.photos/seed/apexdrifter1/1280/720',
      'https://picsum.photos/seed/apexdrifter2/1280/720',
      'https://picsum.photos/seed/apexdrifter3/1280/720'
    ]),
    system_reqs_json: JSON.stringify({
      os: 'Windows 10 / macOS 12+',
      cpu: 'Intel Core i3-8100 / AMD Ryzen 3 1200',
      gpu: 'NVIDIA GTX 1050 / AMD RX 560',
      ram: '4 GB RAM',
      storage: '2 GB available space'
    }),
    tags_json: JSON.stringify(['Arcade', 'Racing', 'Retro', 'Neon', 'Procedural', 'Singleplayer']),
    release_date: '2024-03-15'
  },
  {
    slug: 'protocol-agents',
    title: 'Protocol: Agents',
    genre: 'Strategy',
    tagline: 'Shadows don\'t lie. Agents do.',
    description: 'An intricate cyberpunk tactical turn-based espionage thriller set in a rain-soaked megacity. Command a squad of morally compromised super-agents, infiltrate corporate megastructures, and unravel a conspiracy that threatens to rewrite human consciousness. Every choice echoes.',
    price: 29.99,
    discount_percent: 0,
    rating: 4.8,
    badge: "Editor's Choice",
    thumbnail_url: 'https://picsum.photos/seed/protocolagents/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots_json: JSON.stringify([
      'https://picsum.photos/seed/protocol1/1280/720',
      'https://picsum.photos/seed/protocol2/1280/720',
      'https://picsum.photos/seed/protocol3/1280/720'
    ]),
    system_reqs_json: JSON.stringify({
      os: 'Windows 10/11 / macOS 13+',
      cpu: 'Intel Core i5-8600K / AMD Ryzen 5 2600',
      gpu: 'NVIDIA GTX 1060 6GB / AMD RX 580',
      ram: '8 GB RAM',
      storage: '15 GB available space'
    }),
    tags_json: JSON.stringify(['Cyberpunk', 'Tactical', 'Turn-Based', 'Stealth', 'Espionage', 'Story-Rich']),
    release_date: '2024-06-01'
  },
  {
    slug: 'cyberpulse-2099',
    title: 'CyberPulse 2099',
    genre: 'Action',
    tagline: 'Beat the rhythm. Break the system.',
    description: 'A high-octane synthwave rhythm-action combat platformer where music is your weapon. Sync attacks to the beat, chain brutal combos timed to the drop, and shred through neon dystopian megastructures. With a 90-track OST spanning acid house to drum and bass, every level is a concert and a warzone.',
    price: 24.99,
    discount_percent: 10,
    rating: 4.7,
    badge: 'New Release',
    thumbnail_url: 'https://picsum.photos/seed/cyberpulse/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots_json: JSON.stringify([
      'https://picsum.photos/seed/cyberpulse1/1280/720',
      'https://picsum.photos/seed/cyberpulse2/1280/720',
      'https://picsum.photos/seed/cyberpulse3/1280/720'
    ]),
    system_reqs_json: JSON.stringify({
      os: 'Windows 10/11 / macOS 12+',
      cpu: 'Intel Core i5-7400 / AMD Ryzen 5 1400',
      gpu: 'NVIDIA GTX 1060 / AMD RX 570',
      ram: '8 GB RAM',
      storage: '8 GB available space'
    }),
    tags_json: JSON.stringify(['Rhythm', 'Action', 'Platformer', 'Synthwave', 'Music', 'Combat']),
    release_date: '2024-09-20'
  },
  {
    slug: 'void-horizons',
    title: 'Void Horizons',
    genre: 'Simulation',
    tagline: 'The stars are silent. So is your crew.',
    description: 'A haunting deep-space survival and exploration simulation. Drift through derelict station graveyards, harvest exotic minerals from dying stars, manage a fragile crew on the edge of sanity, and piece together the tragedy of humanity\'s first extrasolar expedition. Breathe the silence of the void.',
    price: 34.99,
    discount_percent: 0,
    rating: 4.5,
    badge: "Editor's Choice",
    thumbnail_url: 'https://picsum.photos/seed/voidhorizons/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots_json: JSON.stringify([
      'https://picsum.photos/seed/void1/1280/720',
      'https://picsum.photos/seed/void2/1280/720',
      'https://picsum.photos/seed/void3/1280/720'
    ]),
    system_reqs_json: JSON.stringify({
      os: 'Windows 10/11 / macOS 13+',
      cpu: 'Intel Core i7-7700 / AMD Ryzen 7 1700',
      gpu: 'NVIDIA GTX 1070 / AMD RX 5700',
      ram: '16 GB RAM',
      storage: '25 GB available space'
    }),
    tags_json: JSON.stringify(['Space', 'Survival', 'Exploration', 'Resource Management', 'Atmospheric', 'Sci-Fi']),
    release_date: '2024-01-28'
  },
  {
    slug: 'mythic-runes',
    title: 'Mythic Runes',
    genre: 'RPG',
    tagline: 'Shuffle fate. Cast the void.',
    description: 'A deep deck-building roguelike dungeon crawler where ancient runes hold catastrophic elemental power. Draft cards, forge spell combos, and descend deeper into a procedurally generated underworld that reshapes itself with every death. With 500+ cards and 12 boss archetypes, no two runs are ever the same.',
    price: 19.99,
    discount_percent: 25,
    rating: 4.9,
    badge: 'Trending',
    thumbnail_url: 'https://picsum.photos/seed/mythicrunes/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots_json: JSON.stringify([
      'https://picsum.photos/seed/mythic1/1280/720',
      'https://picsum.photos/seed/mythic2/1280/720',
      'https://picsum.photos/seed/mythic3/1280/720'
    ]),
    system_reqs_json: JSON.stringify({
      os: 'Windows 10 / macOS 12+',
      cpu: 'Intel Core i3-6100 / AMD Ryzen 3 1200',
      gpu: 'NVIDIA GTX 960 / AMD RX 470',
      ram: '4 GB RAM',
      storage: '3 GB available space'
    }),
    tags_json: JSON.stringify(['Roguelike', 'Deck-Building', 'Dungeon Crawler', 'Fantasy', 'Strategy', 'RPG']),
    release_date: '2023-11-10'
  },
  {
    slug: 'chronoshift',
    title: 'ChronoShift',
    genre: 'Puzzle',
    tagline: 'Time is a room you haven\'t left yet.',
    description: 'A first-person mind-bending spatial puzzle experience that lets you manipulate localized time loops within confined architectural spaces. Rewind objects, fast-forward shadows, and collapse causality to escape impossible environments. Winner of 4 indie game design awards. Reality is the puzzle.',
    price: 22.99,
    discount_percent: 0,
    rating: 4.8,
    badge: "Editor's Choice",
    thumbnail_url: 'https://picsum.photos/seed/chronoshift/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots_json: JSON.stringify([
      'https://picsum.photos/seed/chrono1/1280/720',
      'https://picsum.photos/seed/chrono2/1280/720',
      'https://picsum.photos/seed/chrono3/1280/720'
    ]),
    system_reqs_json: JSON.stringify({
      os: 'Windows 10/11 / macOS 13+',
      cpu: 'Intel Core i5-8400 / AMD Ryzen 5 2600',
      gpu: 'NVIDIA GTX 1070 / AMD RX 5700 XT',
      ram: '8 GB RAM',
      storage: '10 GB available space'
    }),
    tags_json: JSON.stringify(['Puzzle', 'First-Person', 'Time Manipulation', 'Atmospheric', 'Mind-Bending', 'Story-Rich']),
    release_date: '2024-04-05'
  },
  {
    slug: 'iron-siege',
    title: 'Iron Siege',
    genre: 'Strategy',
    tagline: 'Hex by hex. Mech by mech.',
    description: 'A brutal hex-grid multiplayer tower defense strategy experience featuring an arsenal of fully customizable mechs, dynamic weather warfare, and cross-faction alliance systems. Defend your citadel, launch devastating counteroffensives, and crush your rivals in 8-player online skirmish battles.',
    price: 27.99,
    discount_percent: 15,
    rating: 4.4,
    badge: 'Trending',
    thumbnail_url: 'https://picsum.photos/seed/ironsiege/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots_json: JSON.stringify([
      'https://picsum.photos/seed/iron1/1280/720',
      'https://picsum.photos/seed/iron2/1280/720',
      'https://picsum.photos/seed/iron3/1280/720'
    ]),
    system_reqs_json: JSON.stringify({
      os: 'Windows 10/11',
      cpu: 'Intel Core i5-8600 / AMD Ryzen 5 2600X',
      gpu: 'NVIDIA GTX 1060 6GB / AMD RX 580',
      ram: '8 GB RAM',
      storage: '12 GB available space'
    }),
    tags_json: JSON.stringify(['Tower Defense', 'Strategy', 'Multiplayer', 'Mechs', 'Hex-Grid', 'Online']),
    release_date: '2024-02-14'
  },
  {
    slug: 'shadow-realm-origins',
    title: 'Shadow Realm: Origins',
    genre: 'RPG',
    tagline: 'From darkness, a legend is carved.',
    description: 'An isometric dark-fantasy hack-and-slash action RPG with emergent faction warfare, a branching 40-hour narrative, and soul-crushing combat that rewards mastery. Choose from 6 fallen warrior archetypes, bind the power of cursed relics, and descend into a world where gods are dead and monsters reign.',
    price: 39.99,
    discount_percent: 0,
    rating: 4.7,
    badge: 'New Release',
    thumbnail_url: 'https://picsum.photos/seed/shadowrealm/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots_json: JSON.stringify([
      'https://picsum.photos/seed/shadow1/1280/720',
      'https://picsum.photos/seed/shadow2/1280/720',
      'https://picsum.photos/seed/shadow3/1280/720'
    ]),
    system_reqs_json: JSON.stringify({
      os: 'Windows 10/11 / macOS 13+',
      cpu: 'Intel Core i7-8700K / AMD Ryzen 7 2700X',
      gpu: 'NVIDIA GTX 1080 / AMD RX 5700 XT',
      ram: '16 GB RAM',
      storage: '40 GB available space'
    }),
    tags_json: JSON.stringify(['Dark Fantasy', 'Action RPG', 'Hack and Slash', 'Isometric', 'Story-Rich', 'Gothic']),
    release_date: '2024-07-22'
  },
  {
    slug: 'neon-overdrive',
    title: 'Neon Overdrive',
    genre: 'Racing',
    tagline: 'Gravity is optional. Speed is mandatory.',
    description: 'A blistering anti-gravity hover combat racing game inspired by the golden era of Wipeout. Pilot cutting-edge magnetic hulls through vertiginous loop tracks at 900 km/h, fire plasma weapons at competitors, and chase championship glory across 24 uniquely designed circuits on 8 hostile planets.',
    price: 21.99,
    discount_percent: 30,
    rating: 4.6,
    badge: 'Trending',
    thumbnail_url: 'https://picsum.photos/seed/neonoverdrive/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots_json: JSON.stringify([
      'https://picsum.photos/seed/neon1/1280/720',
      'https://picsum.photos/seed/neon2/1280/720',
      'https://picsum.photos/seed/neon3/1280/720'
    ]),
    system_reqs_json: JSON.stringify({
      os: 'Windows 10/11 / macOS 12+',
      cpu: 'Intel Core i5-9600K / AMD Ryzen 5 3600',
      gpu: 'NVIDIA RTX 2060 / AMD RX 5700 XT',
      ram: '8 GB RAM',
      storage: '18 GB available space'
    }),
    tags_json: JSON.stringify(['Anti-Gravity', 'Racing', 'Combat', 'Sci-Fi', 'Fast-Paced', 'Competitive']),
    release_date: '2023-12-01'
  },
  {
    slug: 'aetheria-sky-islands',
    title: 'Aetheria: Sky Islands',
    genre: 'Simulation',
    tagline: 'Build your sky. Trade your dreams.',
    description: 'A cozy open-world floating island builder and airship trading simulation where creativity meets commerce among the clouds. Terraform sky archipelagos, cultivate exotic aerial crops, build soaring merchant fleets, and forge alliances with whimsical sky civilizations. Peace was never this profitable.',
    price: 26.99,
    discount_percent: 0,
    rating: 4.5,
    badge: 'New Release',
    thumbnail_url: 'https://picsum.photos/seed/aetheria/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots_json: JSON.stringify([
      'https://picsum.photos/seed/aetheria1/1280/720',
      'https://picsum.photos/seed/aetheria2/1280/720',
      'https://picsum.photos/seed/aetheria3/1280/720'
    ]),
    system_reqs_json: JSON.stringify({
      os: 'Windows 10 / macOS 12+',
      cpu: 'Intel Core i5-7600 / AMD Ryzen 5 1600',
      gpu: 'NVIDIA GTX 1060 / AMD RX 570',
      ram: '8 GB RAM',
      storage: '6 GB available space'
    }),
    tags_json: JSON.stringify(['Cozy', 'Builder', 'Simulation', 'Open World', 'Trading', 'Fantasy']),
    release_date: '2024-08-05'
  },
  {
    slug: 'bio-hazard-protocol',
    title: 'Bio-Hazard Protocol',
    genre: 'Horror',
    tagline: 'The dark breathes. You blink.',
    description: 'An isometric survival horror experience built around light mechanics and brutally scarce ammunition. Navigate a contaminated research facility swarming with adaptive bio-mutants that hunt by sound and light. Every bullet counts. Every shadow hides something worse. Will you find the cure—or become it?',
    price: 17.99,
    discount_percent: 0,
    rating: 4.3,
    badge: 'Trending',
    thumbnail_url: 'https://picsum.photos/seed/biohazard/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots_json: JSON.stringify([
      'https://picsum.photos/seed/bio1/1280/720',
      'https://picsum.photos/seed/bio2/1280/720',
      'https://picsum.photos/seed/bio3/1280/720'
    ]),
    system_reqs_json: JSON.stringify({
      os: 'Windows 10/11 / macOS 12+',
      cpu: 'Intel Core i5-6600K / AMD Ryzen 5 1600',
      gpu: 'NVIDIA GTX 970 / AMD RX 480',
      ram: '8 GB RAM',
      storage: '8 GB available space'
    }),
    tags_json: JSON.stringify(['Horror', 'Survival', 'Isometric', 'Stealth', 'Atmospheric', 'Psychological']),
    release_date: '2024-10-31'
  },
  {
    slug: 'subzero-odyssey',
    title: 'Subzero Odyssey',
    genre: 'Adventure',
    tagline: 'The cold doesn\'t kill you. The truth does.',
    description: 'A narrative-driven arctic survival exploration game set in a world locked in perpetual blizzard after a geomagnetic catastrophe. Survive brutal whiteout conditions, forge makeshift tools from debris, and unravel the devastating story of the last research outpost through recovered voice logs, murals, and impossible choices.',
    price: 32.99,
    discount_percent: 10,
    rating: 4.8,
    badge: "Editor's Choice",
    thumbnail_url: 'https://picsum.photos/seed/subzero/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots_json: JSON.stringify([
      'https://picsum.photos/seed/subzero1/1280/720',
      'https://picsum.photos/seed/subzero2/1280/720',
      'https://picsum.photos/seed/subzero3/1280/720'
    ]),
    system_reqs_json: JSON.stringify({
      os: 'Windows 10/11 / macOS 13+',
      cpu: 'Intel Core i7-7700K / AMD Ryzen 7 1700X',
      gpu: 'NVIDIA GTX 1080 / AMD RX Vega 64',
      ram: '12 GB RAM',
      storage: '20 GB available space'
    }),
    tags_json: JSON.stringify(['Survival', 'Narrative', 'Adventure', 'Exploration', 'Atmospheric', 'Story-Rich']),
    release_date: '2024-05-18'
  }
];

const insertGame = db.prepare(`
  INSERT OR IGNORE INTO games (
    slug, title, genre, tagline, description, price, discount_percent,
    rating, badge, thumbnail_url, trailer_url, screenshots_json,
    system_reqs_json, tags_json, release_date
  ) VALUES (
    @slug, @title, @genre, @tagline, @description, @price, @discount_percent,
    @rating, @badge, @thumbnail_url, @trailer_url, @screenshots_json,
    @system_reqs_json, @tags_json, @release_date
  )
`);

const seedAll = db.transaction(() => {
  for (const game of games) {
    insertGame.run(game);
  }
});

seedAll();
console.log(`✅ Seeded ${games.length} games into the database.`);
