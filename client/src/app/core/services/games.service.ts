import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map, catchError, of } from 'rxjs';
import { Game, ApiResponse } from '../models/game.model';
import { environment } from '../../../environments/environment';

const MOCK_GAMES: Game[] = [
  {
    id: 1,
    slug: 'apex-drifter-2d',
    title: 'Apex Drifter 2D',
    genre: 'Racing',
    tagline: 'Race the neon grid. Drift or die.',
    description: 'A blazing top-down retro neon arcade racer featuring fully procedural track generation, deep vehicle tuning, and pulsating synthwave aesthetics.',
    price: 14.99,
    discount_percent: 20,
    rating: 4.6,
    badge: 'Trending',
    thumbnail_url: 'https://picsum.photos/seed/apexdrifter/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots: [
      'https://picsum.photos/seed/apexdrifter1/1280/720',
      'https://picsum.photos/seed/apexdrifter2/1280/720',
      'https://picsum.photos/seed/apexdrifter3/1280/720'
    ],
    systemReqs: {
      os: 'Windows 10 / macOS 12+',
      cpu: 'Intel Core i3-8100 / AMD Ryzen 3 1200',
      gpu: 'NVIDIA GTX 1050 / AMD RX 560',
      ram: '4 GB RAM',
      storage: '2 GB available space'
    },
    tags: ['Arcade', 'Racing', 'Retro', 'Neon', 'Procedural', 'Singleplayer'],
    release_date: '2024-03-15',
    discountedPrice: 11.99
  },
  {
    id: 2,
    slug: 'protocol-agents',
    title: 'Protocol: Agents',
    genre: 'Strategy',
    tagline: "Shadows don't lie. Agents do.",
    description: 'An intricate cyberpunk tactical turn-based espionage thriller set in a rain-soaked megacity. Command a squad of morally compromised super-agents.',
    price: 29.99,
    discount_percent: 0,
    rating: 4.8,
    badge: "Editor's Choice",
    thumbnail_url: 'https://picsum.photos/seed/protocolagents/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots: [
      'https://picsum.photos/seed/protocol1/1280/720',
      'https://picsum.photos/seed/protocol2/1280/720',
      'https://picsum.photos/seed/protocol3/1280/720'
    ],
    systemReqs: {
      os: 'Windows 10/11 / macOS 13+',
      cpu: 'Intel Core i5-8600K / AMD Ryzen 5 2600',
      gpu: 'NVIDIA GTX 1060 6GB / AMD RX 580',
      ram: '8 GB RAM',
      storage: '15 GB available space'
    },
    tags: ['Cyberpunk', 'Tactical', 'Turn-Based', 'Stealth', 'Espionage', 'Story-Rich'],
    release_date: '2024-06-01',
    discountedPrice: 29.99
  },
  {
    id: 3,
    slug: 'cyberpulse-2099',
    title: 'CyberPulse 2099',
    genre: 'Action',
    tagline: 'Beat the rhythm. Break the system.',
    description: 'A high-octane synthwave rhythm-action combat platformer where music is your weapon. Sync attacks to the beat, chain brutal combos timed to the drop.',
    price: 24.99,
    discount_percent: 10,
    rating: 4.7,
    badge: 'New Release',
    thumbnail_url: 'https://picsum.photos/seed/cyberpulse/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots: [
      'https://picsum.photos/seed/cyberpulse1/1280/720',
      'https://picsum.photos/seed/cyberpulse2/1280/720',
      'https://picsum.photos/seed/cyberpulse3/1280/720'
    ],
    systemReqs: {
      os: 'Windows 10/11 / macOS 12+',
      cpu: 'Intel Core i5-7400 / AMD Ryzen 5 1400',
      gpu: 'NVIDIA GTX 1060 / AMD RX 570',
      ram: '8 GB RAM',
      storage: '8 GB available space'
    },
    tags: ['Rhythm', 'Action', 'Platformer', 'Synthwave', 'Music', 'Combat'],
    release_date: '2024-09-20',
    discountedPrice: 22.49
  },
  {
    id: 4,
    slug: 'void-horizons',
    title: 'Void Horizons',
    genre: 'Simulation',
    tagline: 'The stars are silent. So is your crew.',
    description: 'A haunting deep-space survival and exploration simulation. Drift through derelict station graveyards, harvest exotic minerals from dying stars.',
    price: 34.99,
    discount_percent: 0,
    rating: 4.5,
    badge: "Editor's Choice",
    thumbnail_url: 'https://picsum.photos/seed/voidhorizons/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots: [
      'https://picsum.photos/seed/void1/1280/720',
      'https://picsum.photos/seed/void2/1280/720',
      'https://picsum.photos/seed/void3/1280/720'
    ],
    systemReqs: {
      os: 'Windows 10/11 / macOS 13+',
      cpu: 'Intel Core i7-7700 / AMD Ryzen 7 1700',
      gpu: 'NVIDIA GTX 1070 / AMD RX 5700',
      ram: '16 GB RAM',
      storage: '25 GB available space'
    },
    tags: ['Space', 'Survival', 'Exploration', 'Resource Management', 'Atmospheric', 'Sci-Fi'],
    release_date: '2024-01-28',
    discountedPrice: 34.99
  },
  {
    id: 5,
    slug: 'mythic-runes',
    title: 'Mythic Runes',
    genre: 'RPG',
    tagline: 'Shuffle fate. Cast the void.',
    description: 'A deep deck-building roguelike dungeon crawler where ancient runes hold catastrophic elemental power. Draft cards, forge spell combos.',
    price: 19.99,
    discount_percent: 25,
    rating: 4.9,
    badge: 'Trending',
    thumbnail_url: 'https://picsum.photos/seed/mythicrunes/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots: [
      'https://picsum.photos/seed/mythic1/1280/720',
      'https://picsum.photos/seed/mythic2/1280/720',
      'https://picsum.photos/seed/mythic3/1280/720'
    ],
    systemReqs: {
      os: 'Windows 10 / macOS 12+',
      cpu: 'Intel Core i3-6100 / AMD Ryzen 3 1200',
      gpu: 'NVIDIA GTX 960 / AMD RX 470',
      ram: '4 GB RAM',
      storage: '3 GB available space'
    },
    tags: ['Roguelike', 'Deck-Building', 'Dungeon Crawler', 'Fantasy', 'Strategy', 'RPG'],
    release_date: '2023-11-10',
    discountedPrice: 14.99
  },
  {
    id: 6,
    slug: 'chronoshift',
    title: 'ChronoShift',
    genre: 'Puzzle',
    tagline: "Time is a room you haven't left yet.",
    description: 'A first-person mind-bending spatial puzzle experience that lets you manipulate localized time loops within confined architectural spaces.',
    price: 22.99,
    discount_percent: 0,
    rating: 4.8,
    badge: "Editor's Choice",
    thumbnail_url: 'https://picsum.photos/seed/chronoshift/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots: [
      'https://picsum.photos/seed/chrono1/1280/720',
      'https://picsum.photos/seed/chrono2/1280/720',
      'https://picsum.photos/seed/chrono3/1280/720'
    ],
    systemReqs: {
      os: 'Windows 10/11 / macOS 13+',
      cpu: 'Intel Core i5-8400 / AMD Ryzen 5 2600',
      gpu: 'NVIDIA GTX 1070 / AMD RX 5700 XT',
      ram: '8 GB RAM',
      storage: '10 GB available space'
    },
    tags: ['Puzzle', 'First-Person', 'Time Manipulation', 'Atmospheric', 'Mind-Bending', 'Story-Rich'],
    release_date: '2024-04-05',
    discountedPrice: 22.99
  },
  {
    id: 7,
    slug: 'iron-siege',
    title: 'Iron Siege',
    genre: 'Strategy',
    tagline: 'Hex by hex. Mech by mech.',
    description: 'A brutal hex-grid multiplayer tower defense strategy experience featuring an arsenal of fully customizable mechs, dynamic weather warfare.',
    price: 27.99,
    discount_percent: 15,
    rating: 4.4,
    badge: 'Trending',
    thumbnail_url: 'https://picsum.photos/seed/ironsiege/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots: [
      'https://picsum.photos/seed/iron1/1280/720',
      'https://picsum.photos/seed/iron2/1280/720',
      'https://picsum.photos/seed/iron3/1280/720'
    ],
    systemReqs: {
      os: 'Windows 10/11',
      cpu: 'Intel Core i5-8600 / AMD Ryzen 5 2600X',
      gpu: 'NVIDIA GTX 1060 6GB / AMD RX 580',
      ram: '8 GB RAM',
      storage: '12 GB available space'
    },
    tags: ['Tower Defense', 'Strategy', 'Multiplayer', 'Mechs', 'Hex-Grid', 'Online'],
    release_date: '2024-02-14',
    discountedPrice: 23.79
  },
  {
    id: 8,
    slug: 'shadow-realm-origins',
    title: 'Shadow Realm: Origins',
    genre: 'RPG',
    tagline: 'From darkness, a legend is carved.',
    description: 'An isometric dark-fantasy hack-and-slash action RPG with emergent faction warfare, a branching 40-hour narrative, and soul-crushing combat.',
    price: 39.99,
    discount_percent: 0,
    rating: 4.7,
    badge: 'New Release',
    thumbnail_url: 'https://picsum.photos/seed/shadowrealm/800/450',
    trailer_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    screenshots: [
      'https://picsum.photos/seed/shadow1/1280/720',
      'https://picsum.photos/seed/shadow2/1280/720',
      'https://picsum.photos/seed/shadow3/1280/720'
    ],
    systemReqs: {
      os: 'Windows 10/11 / macOS 13+',
      cpu: 'Intel Core i7-8700K / AMD Ryzen 7 2700X',
      gpu: 'NVIDIA GTX 1080 / AMD RX 5700 XT',
      ram: '16 GB RAM',
      storage: '40 GB available space'
    },
    tags: ['Dark Fantasy', 'Action RPG', 'Hack and Slash', 'Isometric', 'Story-Rich', 'Gothic'],
    release_date: '2024-07-22',
    discountedPrice: 39.99
  }
];

@Injectable({ providedIn: 'root' })
export class GamesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/games`;

  parseGame(game: Game): Game {
    if (!game) return {} as Game;

    let screenshots: string[] = [];
    let systemReqs: any = {};
    let tags: string[] = [];

    try {
      screenshots = typeof game.screenshots_json === 'string'
        ? JSON.parse(game.screenshots_json || '[]')
        : (game.screenshots || []);
    } catch (_) { screenshots = game.screenshots || []; }

    try {
      systemReqs = typeof game.system_reqs_json === 'string'
        ? JSON.parse(game.system_reqs_json || '{}')
        : (game.systemReqs || {});
    } catch (_) { systemReqs = game.systemReqs || {}; }

    try {
      tags = typeof game.tags_json === 'string'
        ? JSON.parse(game.tags_json || '[]')
        : (game.tags || []);
    } catch (_) { tags = game.tags || []; }

    const price = typeof game.price === 'number' ? game.price : parseFloat(game.price as any) || 0;
    const discount = typeof game.discount_percent === 'number' ? game.discount_percent : parseInt(game.discount_percent as any) || 0;

    return {
      ...game,
      price,
      discount_percent: discount,
      screenshots,
      systemReqs,
      tags,
      discountedPrice: discount > 0 ? price * (1 - discount / 100) : price,
    };
  }

  getGames(params?: {
    genre?: string;
    search?: string;
    sortBy?: string;
    badge?: string;
  }): Observable<Game[]> {
    let httpParams = new HttpParams();
    if (params?.genre && params.genre !== 'All') httpParams = httpParams.set('genre', params.genre);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params?.badge && params.badge !== 'All') httpParams = httpParams.set('badge', params.badge);

    return this.http
      .get<ApiResponse<Game[]>>(this.baseUrl, { params: httpParams })
      .pipe(
        map(res => {
          if (!res || !Array.isArray(res.data)) return MOCK_GAMES;
          return res.data.map(g => this.parseGame(g));
        }),
        catchError((err) => {
          console.warn('[GamesService] API fetch error, falling back to mock catalog:', err);
          return of(MOCK_GAMES);
        })
      );
  }

  getGameBySlug(slug: string): Observable<Game> {
    return this.http
      .get<ApiResponse<Game>>(`${this.baseUrl}/${slug}`)
      .pipe(
        map(res => this.parseGame(res.data)),
        catchError(() => {
          const fallback = MOCK_GAMES.find(g => g.slug === slug) || MOCK_GAMES[0];
          return of(fallback);
        })
      );
  }
}
