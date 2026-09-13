import { Component, signal, computed } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

export interface BlogPost {
  id: string;
  gameSlug: string;
  gameTitle: string;
  category: 'Devlog' | 'Postmortem' | 'Technical' | 'Art & Sound';
  title: string;
  subtitle: string;
  author: string;
  authorRole: string;
  date: string;
  readTime: string;
  thumbnail: string;
  summary: string;
  contentHtml: string;
  tags: string[];
}

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DatePipe],
  template: `
    <div class="min-h-screen pt-20 pb-24 relative overflow-hidden">
      
      <!-- Background Glows -->
      <div class="absolute top-10 left-1/4 w-[700px] h-[350px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute top-1/2 right-1/4 w-[600px] h-[300px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none"></div>

      <!-- Header -->
      <div class="relative py-16 text-center px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto space-y-4 animate-fade-in-up">
          <p class="text-cyan-400 font-rajdhani font-semibold uppercase tracking-widest text-sm">// DEVLOGS & POSTMORTEMS</p>
          <h1 class="font-orbitron font-black text-4xl sm:text-5xl lg:text-6xl text-white">
            The <span class="gradient-text">Development Stories</span>
          </h1>
          <p class="text-gray-400 font-inter text-lg max-w-2xl mx-auto">
            Deep technical breakdowns, postmortems, and shader magic behind all 12 of our indie titles.
          </p>
        </div>
      </div>

      <!-- Main Container -->
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <!-- Controls Bar -->
        <div class="flex flex-col md:flex-row items-center justify-between gap-4 mb-10">
          
          <!-- Search input -->
          <div class="w-full md:w-96 relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              placeholder="Search devlogs, games, shaders..."
              class="cyber-input pl-10"
              id="blog-search"
            />
          </div>

          <!-- Category Chips -->
          <div class="flex flex-wrap items-center gap-2 w-full md:w-auto">
            @for (cat of categories; track cat) {
              <button
                (click)="selectedCategory.set(cat)"
                class="px-4 py-2 rounded-lg text-xs font-rajdhani font-semibold transition-all"
                [class.active-cat]="selectedCategory() === cat"
                [class.inactive-cat]="selectedCategory() !== cat"
              >
                {{ cat }}
              </button>
            }
          </div>
        </div>

        <!-- Featured Post Spotlight -->
        @if (featuredPost() && !searchQuery && selectedCategory() === 'All') {
          <div class="glass-card p-6 sm:p-8 mb-12 relative overflow-hidden group">
            <div class="grid lg:grid-cols-2 gap-8 items-center">
              <div class="relative aspect-video rounded-xl overflow-hidden border border-cyan-500/20">
                <img
                  [src]="featuredPost()!.thumbnail"
                  [alt]="featuredPost()!.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div class="absolute top-3 left-3">
                  <span class="badge badge-trending">★ FEATURED DEVLOG</span>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex items-center gap-3">
                  <span class="text-xs text-cyan-400 font-rajdhani font-semibold bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                    {{ featuredPost()!.gameTitle }}
                  </span>
                  <span class="text-xs text-gray-500 font-rajdhani">{{ featuredPost()!.readTime }} read</span>
                  <span class="text-xs text-gray-600">·</span>
                  <span class="text-xs text-gray-500 font-rajdhani">{{ featuredPost()!.date }}</span>
                </div>

                <h2 class="font-orbitron font-bold text-2xl sm:text-3xl text-white group-hover:text-cyan-400 transition-colors">
                  {{ featuredPost()!.title }}
                </h2>

                <p class="text-gray-400 text-sm font-inter leading-relaxed line-clamp-3">
                  {{ featuredPost()!.summary }}
                </p>

                <div class="flex items-center justify-between pt-4 border-t border-white/10">
                  <div class="flex items-center gap-3">
                    <div class="w-8 h-8 rounded-full bg-purple-500/20 border border-purple-400/40 flex items-center justify-center font-orbitron font-bold text-xs text-purple-300">
                      {{ featuredPost()!.author[0] }}
                    </div>
                    <div>
                      <p class="text-xs text-white font-rajdhani font-semibold">{{ featuredPost()!.author }}</p>
                      <p class="text-[10px] text-gray-500 font-inter">{{ featuredPost()!.authorRole }}</p>
                    </div>
                  </div>

                  <button
                    (click)="openPostModal(featuredPost()!)"
                    class="btn-primary text-xs px-5 py-2"
                  >
                    Read Full Story →
                  </button>
                </div>
              </div>
            </div>
          </div>
        }

        <!-- Articles Grid (All 12 Games) -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          @for (post of filteredPosts(); track post.id) {
            <div class="glass-card flex flex-col justify-between group hover:border-cyan-500/40 transition-all duration-300">
              
              <div>
                <!-- Image Header -->
                <div class="relative aspect-video rounded-t-xl overflow-hidden">
                  <img
                    [src]="post.thumbnail"
                    [alt]="post.title"
                    class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    loading="lazy"
                  />
                  <div class="absolute top-3 left-3">
                    <span class="badge" [class]="getCategoryBadgeClass(post.category)">
                      {{ post.category }}
                    </span>
                  </div>
                  <div class="absolute bottom-3 right-3">
                    <span class="text-[11px] text-gray-300 font-rajdhani bg-black/60 px-2 py-0.5 rounded backdrop-blur">
                      {{ post.gameTitle }}
                    </span>
                  </div>
                </div>

                <!-- Body -->
                <div class="p-5 space-y-3">
                  <div class="flex items-center justify-between text-xs text-gray-500 font-rajdhani">
                    <span>By {{ post.author }}</span>
                    <span>{{ post.readTime }}</span>
                  </div>

                  <h3 class="font-orbitron font-bold text-base text-white group-hover:text-cyan-400 transition-colors line-clamp-2">
                    {{ post.title }}
                  </h3>

                  <p class="text-xs text-gray-400 font-inter leading-relaxed line-clamp-3">
                    {{ post.summary }}
                  </p>

                  <div class="flex flex-wrap gap-1 pt-2">
                    @for (tag of post.tags.slice(0, 3); track tag) {
                      <span class="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded font-rajdhani">#{{ tag }}</span>
                    }
                  </div>
                </div>
              </div>

              <!-- Footer -->
              <div class="p-5 pt-0 flex items-center justify-between border-t border-white/5 mt-4">
                <a
                  [routerLink]="['/games', post.gameSlug]"
                  class="text-xs text-cyan-400 hover:underline font-rajdhani font-semibold"
                >
                  🎮 View Game
                </a>
                <button
                  (click)="openPostModal(post)"
                  class="btn-outline-cyan text-xs px-3 py-1.5"
                >
                  Read Post →
                </button>
              </div>

            </div>
          }
        </div>

        @if (filteredPosts().length === 0) {
          <div class="text-center py-20">
            <div class="text-5xl mb-3">📑</div>
            <p class="font-orbitron text-gray-400">No devlogs matching your search</p>
            <button (click)="resetSearch()" class="btn-outline-cyan mt-4 text-xs">Reset Search</button>
          </div>
        }

      </div>

      <!-- Article Reading Modal -->
      @if (activePost()) {
        <div class="lightbox-overlay" (click)="closePostModal()">
          <div
            class="relative w-full max-w-4xl max-h-[90vh] glass-card p-6 sm:p-10 overflow-y-auto my-8 mx-4 border border-cyan-500/30"
            (click)="$event.stopPropagation()"
          >
            <!-- Close Button -->
            <button
              (click)="closePostModal()"
              class="absolute top-6 right-6 text-gray-400 hover:text-white font-rajdhani font-bold text-sm"
            >✕ CLOSE</button>

            <!-- Modal Header -->
            <div class="space-y-4 border-b border-white/10 pb-6 mb-6">
              <div class="flex flex-wrap items-center gap-3">
                <span class="badge" [class]="getCategoryBadgeClass(activePost()!.category)">
                  {{ activePost()!.category }}
                </span>
                <a [routerLink]="['/games', activePost()!.gameSlug]" (click)="closePostModal()" class="text-xs text-cyan-400 font-rajdhani font-bold hover:underline">
                  🎮 Game: {{ activePost()!.gameTitle }}
                </a>
                <span class="text-xs text-gray-500 font-rajdhani">· {{ activePost()!.readTime }} read</span>
              </div>

              <h1 class="font-orbitron font-bold text-2xl sm:text-4xl text-white">
                {{ activePost()!.title }}
              </h1>

              <p class="text-base text-gray-300 font-rajdhani italic">
                "{{ activePost()!.subtitle }}"
              </p>

              <div class="flex items-center gap-3 pt-2">
                <div class="w-10 h-10 rounded-full bg-cyan-500/20 border border-cyan-400/40 flex items-center justify-center font-orbitron font-bold text-sm text-cyan-300">
                  {{ activePost()!.author[0] }}
                </div>
                <div>
                  <p class="text-sm text-white font-rajdhani font-semibold">{{ activePost()!.author }}</p>
                  <p class="text-xs text-gray-500 font-inter">{{ activePost()!.authorRole }} · Published {{ activePost()!.date }}</p>
                </div>
              </div>
            </div>

            <!-- Modal Image Header -->
            <div class="aspect-video rounded-xl overflow-hidden mb-8 border border-white/10">
              <img [src]="activePost()!.thumbnail" [alt]="activePost()!.title" class="w-full h-full object-cover" />
            </div>

            <!-- HTML Content -->
            <div
              class="prose prose-invert max-w-none space-y-6 text-gray-300 font-inter leading-relaxed text-sm sm:text-base"
              [innerHTML]="activePost()!.contentHtml"
            ></div>

            <!-- Footer Conversion Call -->
            <div class="mt-12 p-6 glass-card border-cyan-500/30 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h4 class="font-orbitron font-bold text-white text-base">Inspired by this development story?</h4>
                <p class="text-xs text-gray-400 font-inter mt-1">Play {{ activePost()!.gameTitle }} today with instant digital delivery.</p>
              </div>
              <a
                [routerLink]="['/games', activePost()!.gameSlug]"
                (click)="closePostModal()"
                class="btn-primary text-xs px-6 py-3 whitespace-nowrap"
              >
                Buy {{ activePost()!.gameTitle }} →
              </a>
            </div>

          </div>
        </div>
      }

    </div>
  `,
  styles: [`
    .active-cat {
      background: rgba(0, 245, 255, 0.15);
      color: #00f5ff;
      border: 1px solid rgba(0, 245, 255, 0.4);
    }
    .inactive-cat {
      background: rgba(255, 255, 255, 0.03);
      color: #8892aa;
      border: 1px solid rgba(255, 255, 255, 0.08);
      &:hover {
        color: #fff;
        border-color: rgba(255, 255, 255, 0.2);
      }
    }
    .prose code {
      background: rgba(0, 245, 255, 0.08);
      color: #00f5ff;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.85em;
    }
    .prose blockquote {
      border-left: 4px solid #00f5ff;
      padding-left: 1rem;
      color: #9ca3af;
      font-style: italic;
    }
  `]
})
export class BlogComponent {
  categories = ['All', 'Devlog', 'Postmortem', 'Technical', 'Art & Sound'];
  selectedCategory = signal<string>('All');
  searchQuery = '';
  activePost = signal<BlogPost | null>(null);

  posts = signal<BlogPost[]>([
    {
      id: 'apex-drifter-devlog',
      gameSlug: 'apex-drifter-2d',
      gameTitle: 'Apex Drifter 2D',
      category: 'Technical',
      title: 'Building a Procedural Neon Grid: 60FPS Physics in 2D Space',
      subtitle: 'How we achieved sub-millisecond drift responsiveness using custom spatial partitioning and HLSL bloom filters.',
      author: 'Alex Mercer',
      authorRole: 'Founder & Lead Technologist',
      date: 'March 20, 2024',
      readTime: '6 min',
      thumbnail: 'https://picsum.photos/seed/apexdrifter/800/450',
      summary: 'When designing Apex Drifter 2D, traditional physics engines felt floaty. We built a custom 2D vector friction model that calculates tire slip, slipstream suction, and procedural track curvature at 120Hz.',
      tags: ['Physics', 'Procedural', 'WebGL', '2D'],
      contentHtml: `
        <p>When we embarked on <strong>Apex Drifter 2D</strong>, our goal was simple yet terrifying: recreate the visceral friction of 90s arcade racers while generating infinity tracks that never repeat.</p>
        
        <h3>The Tire Slip Problem</h3>
        <p>Standard rigid-body physics engines treat drift as simple velocity damping. To make drifting feel razor-sharp, we split tire forces into two distinct vectors: <code>ForwardTraction</code> and <code>LateralGrip</code>.</p>
        
        <blockquote>"If a player initiates a turn at over 140 km/h, the lateral grip breaks cleanly while generating particle trail coordinates mapped directly to our GPU bloom pipeline."</blockquote>

        <h3>Procedural Track Generation Algorithm</h3>
        <p>Tracks are calculated using continuous cubic Hermite splines. As the player drives forward, a background worker thread evaluates track elevation, hairpin angles, and neon barrier placements 300 meters ahead of the camera frustum.</p>

        <p>By pre-allocating memory pools for vertex buffers, frame drops were reduced to zero even on integrated laptop graphics.</p>
      `
    },
    {
      id: 'protocol-agents-devlog',
      gameSlug: 'protocol-agents',
      gameTitle: 'Protocol: Agents',
      category: 'Devlog',
      title: 'Designing Cyberpunk Stealth & Emergent Agent AI',
      subtitle: 'Inside the tactical decision tree systems that make corporate megastructures feel alive.',
      author: 'Dr. Elena Vance',
      authorRole: 'Lead Systems Architect',
      date: 'June 12, 2024',
      readTime: '8 min',
      thumbnail: 'https://picsum.photos/seed/protocolagents/800/450',
      summary: 'Protocol: Agents replaces traditional turn-based roll-to-hit RNG with deterministic vision cones, noise propagation radii, and dynamic hacking cover mechanics.',
      tags: ['Tactical AI', 'Stealth', 'Behavior Trees', 'Strategy'],
      contentHtml: `
        <p>Stealth games often suffer from two extremes: guard AI is either telepathically omniscient or comically oblivious. In <em>Protocol: Agents</em>, we implemented a 3-stage perception pipeline.</p>

        <h3>1. Ray-Cast Vision Cones</h3>
        <p>Enemies scan environment nodes using dual-angle vision frustums. Light levels dynamically modify line-of-sight threshold checks in real time.</p>

        <h3>2. Sound Wave Propagation</h3>
        <p>Footsteps, suppressed gunshots, and door overrides emit sound spheres that bounce off metallic surfaces. Guards investigate the sound origin vector before sounding full facility alarms.</p>

        <h3>3. Squad Mind Network</h3>
        <p>When an agent is spotted, guards don't automatically know where the rest of your squad is located—they flank toward the last known breach coordinates while calling for heavy mech reinforcement.</p>
      `
    },
    {
      id: 'cyberpulse-devlog',
      gameSlug: 'cyberpulse-2099',
      gameTitle: 'CyberPulse 2099',
      category: 'Art & Sound',
      title: 'Syncing Combat Attacks to 140 BPM Acid House Drops',
      subtitle: 'How we locked melee combo frames to audio waveform beats using web audio DSP analyzers.',
      author: 'Kai Sorenson',
      authorRole: 'Audio Director & Composer',
      date: 'September 25, 2024',
      readTime: '7 min',
      thumbnail: 'https://picsum.photos/seed/cyberpulse/800/450',
      summary: 'In CyberPulse 2099, every slash, dash, and parry is quantized to the underlying synthwave beat. Striking on the exact beat multiplier triples damage and triggers full-screen neon pulses.',
      tags: ['Audio DSP', 'Rhythm', 'Synthwave', 'VFX'],
      contentHtml: `
        <p>Creating a rhythm-combat hybrid meant the game engine had to treat audio as the master clock rather than rendering frames independently.</p>

        <h3>The Quantization Window</h3>
        <p>We established a <code>±45ms</code> hit window around beat intervals. When a player presses the attack key within this window, the animation frame snaps seamlessly to the audio transient pulse.</p>

        <h3>Dynamic Music Layering</h3>
        <p>As your combo multiplier rises from 1x to 10x, extra synthesizer stems (acid bass, industrial percussion, sub-bass drops) unmute dynamically without interrupting audio playback.</p>
      `
    },
    {
      id: 'void-horizons-devlog',
      gameSlug: 'void-horizons',
      gameTitle: 'Void Horizons',
      category: 'Technical',
      title: 'Simulating the Void: Atmospheric Oxygen & Derelict Graveyards',
      subtitle: 'Building a spatial survival engine that simulates pressure drops and crew sanity under isolation.',
      author: 'Alex Mercer',
      authorRole: 'Founder & Lead Technologist',
      date: 'February 10, 2024',
      readTime: '9 min',
      thumbnail: 'https://picsum.photos/seed/voidhorizons/800/450',
      summary: 'Exploring abandoned starships in Void Horizons requires balancing O2 levels, hull breach hazards, and crew morale. Here is how we engineered the atmospheric pressure simulation.',
      tags: ['Simulation', 'Space', 'Procedural', 'Survival'],
      contentHtml: `
        <p>Derelict exploration in <em>Void Horizons</em> is rooted in atmospheric physical simulation. Opening a door between a pressurized corridor and a breached cargo bay creates a violent decompression wave that pulls objects and crew members into space.</p>
        
        <h3>Grid-Based Gas Diffusion</h3>
        <p>Each ship interior is represented as a 3D voxel grid. Gas pressure, oxygen percentage, and toxic radiation diffuse across adjacent cells every 16 milliseconds.</p>

        <h3>Crew Morale Matrix</h3>
        <p>Crew members possess individual psychological traits. Prolonged darkness, silent radios, and low oxygen trigger hallucinations and unscripted operational panics.</p>
      `
    },
    {
      id: 'mythic-runes-devlog',
      gameSlug: 'mythic-runes',
      gameTitle: 'Mythic Runes',
      category: 'Postmortem',
      title: 'Deck-Building Balance: 500 Cards & Zero Infinite Loops',
      subtitle: 'How automated simulation bots ran 10,000,000 card combinations to eliminate game-breaking combos.',
      author: 'Dr. Elena Vance',
      authorRole: 'Lead Systems Architect',
      date: 'December 05, 2023',
      readTime: '5 min',
      thumbnail: 'https://picsum.photos/seed/mythicrunes/800/450',
      summary: 'Designing Mythic Runes meant balancing 500 elemental rune cards. We created automated Monte Carlo AI bots that played 10 million simulated games overnight to test card synergy math.',
      tags: ['Postmortem', 'Roguelike', 'Deckbuilding', 'Game Balance'],
      contentHtml: `
        <p>With 500 cards and multiplicative rune synergies, human playtesting alone could never uncover every infinite mana loop or turn-one kill combination.</p>

        <h3>Monte Carlo Simulation Bots</h3>
        <p>We wrote headless TypeScript simulation bots that executed random and greedy card plays against every boss archetype. Whenever a bot generated an infinite loop or dealt over 1,000 damage in turn one, the card combo was logged and flagged for rebalancing.</p>

        <h3>Elemental Synergy Triangle</h3>
        <p>Fire, Frost, Arcane, and Void runes interact via a rock-paper-scissors vulnerability system that keeps deck strategies dynamic across all 12 underworld floors.</p>
      `
    },
    {
      id: 'chronoshift-devlog',
      gameSlug: 'chronoshift',
      gameTitle: 'ChronoShift',
      category: 'Technical',
      title: 'Time Loop Engineering: First-Person Causality Rewind',
      subtitle: 'Recording transform state buffers for 1,000 interactive objects simultaneously in 60FPS.',
      author: 'Alex Mercer',
      authorRole: 'Founder & Lead Technologist',
      date: 'April 18, 2024',
      readTime: '8 min',
      thumbnail: 'https://picsum.photos/seed/chronoshift/800/450',
      summary: 'In ChronoShift, players manipulate local time loops. Achieving seamless timeline rewinds required ring-buffer state delta compression for all world geometry.',
      tags: ['Time Manipulation', 'First-Person', 'Engine Architecture', 'Puzzle'],
      contentHtml: `
        <p>Rewinding time in a first-person environment is notoriously heavy on RAM. Storing raw transform matrices for every object every frame quickly exhausts system memory.</p>

        <h3>Ring Buffer Delta Storage</h3>
        <p>Instead of saving full spatial matrices, ChronoShift records keyframes every 10 frames and interpolates positions using Hermite curves during timeline scrubbing.</p>

        <h3>Solving Causality Paradoxes</h3>
        <p>If a player rewinds an object while standing in the space it occupied 5 seconds ago, the engine applies spatial displacement force vectors to prevent player clipping.</p>
      `
    },
    {
      id: 'iron-siege-devlog',
      gameSlug: 'iron-siege',
      gameTitle: 'Iron Siege',
      category: 'Devlog',
      title: 'Hex-Grid Netcode: Synchronizing 8-Player Mech Warfare',
      subtitle: 'Deterministic lockstep networking for multiplayer hex-grid tower defense strategy.',
      author: 'Dr. Elena Vance',
      authorRole: 'Lead Systems Architect',
      date: 'March 02, 2024',
      readTime: '6 min',
      thumbnail: 'https://picsum.photos/seed/ironsiege/800/450',
      summary: 'Iron Siege pits 8 players against waves of enemy mechs on hex maps. We built a deterministic lockstep networking architecture with client-side prediction to eliminate lag.',
      tags: ['Netcode', 'Multiplayer', 'Hex-Grid', 'Strategy'],
      contentHtml: `
        <p>Multiplayer strategy games fail when players experience desyncs between local hex grid units and host server state.</p>

        <h3>Deterministic Simulation Loop</h3>
        <p>Both clients and host compute unit damage, missile trajectories, and shield collapses using identical fixed-step integer math functions.</p>

        <h3>Lag Compensation & Prediction</h3>
        <p>When a player commands a mech battalion to deploy hex barricades, the client renders the construction animation instantly while sending command frames to the server cluster.</p>
      `
    },
    {
      id: 'shadow-realm-devlog',
      gameSlug: 'shadow-realm-origins',
      gameTitle: 'Shadow Realm: Origins',
      category: 'Art & Sound',
      title: 'Dark Fantasy Shader Magic: Volumetric Fog & Relic FX',
      subtitle: 'Creating Gothic horror visual atmosphere using custom screen-space ambient occlusion shaders.',
      author: 'Marcus Thorne',
      authorRole: 'Art Director & Shader Wizard',
      date: 'August 10, 2024',
      readTime: '7 min',
      thumbnail: 'https://picsum.photos/seed/shadowrealm/800/450',
      summary: 'Shadow Realm: Origins demanded a oppressive dark fantasy mood. We crafted layered volumetric fog, flickering torch light attenuation, and glowing relic particle systems.',
      tags: ['Dark Fantasy', 'Shaders', 'Lighting', 'Art Direction'],
      contentHtml: `
        <p>Dark fantasy games live and die by their lighting contrast. In <em>Shadow Realm: Origins</em>, shadows aren't just empty darkness—they hide demonic visual cues.</p>

        <h3>Ray-Marched Volumetric Fog</h3>
        <p>Dungeon corridors feature height-decay fog that catches torch light and spell explosions, creating rich atmospheric depth.</p>

        <h3>Relic Activation Glow</h3>
        <p>Cursed relics feature rim-lighting shaders that intensify as player rage points fill up, offering instant visual feedback during hectic hack-and-slash combat.</p>
      `
    },
    {
      id: 'neon-overdrive-devlog',
      gameSlug: 'neon-overdrive',
      gameTitle: 'Neon Overdrive',
      category: 'Technical',
      title: '900 km/h Anti-Gravity Track Physics & Magnetic Hulls',
      subtitle: 'Simulating magnetic surface attraction and plasma weapon recoil at blistering velocities.',
      author: 'Alex Mercer',
      authorRole: 'Founder & Lead Technologist',
      date: 'January 15, 2024',
      readTime: '7 min',
      thumbnail: 'https://picsum.photos/seed/neonoverdrive/800/450',
      summary: 'Inspired by Wipeout, Neon Overdrive runs at 900 km/h. We designed magnetic hull vector snapping to keep hovercraft glued to inverted planetary loops.',
      tags: ['Anti-Gravity', 'Physics', 'Racing', 'Fast-Paced'],
      contentHtml: `
        <p>At 900 km/h, standard raycast hovercraft physics break down when entering 360-degree vertical loop tracks.</p>

        <h3>Magnetic Vector Snapping</h3>
        <p>Our physics solver projects 4 magnetic anchor rays from the hull floor to the track spline. The hovercraft aligns its pitch and roll vectors to match the track normal within 2 milliseconds.</p>

        <h3>Weapon Recoil Dynamics</h3>
        <p>Firing heavy plasma cannons at top speed pushes your hovercraft back, requiring active steering adjustments to maintain slipstream momentum.</p>
      `
    },
    {
      id: 'aetheria-devlog',
      gameSlug: 'aetheria-sky-islands',
      gameTitle: 'Aetheria: Sky Islands',
      category: 'Devlog',
      title: 'Procedural Sky Archipelagos & Airship Economy Models',
      subtitle: 'Building a relaxing floating island builder and airship trading simulation.',
      author: 'Kai Sorenson',
      authorRole: 'Audio Director & Composer',
      date: 'August 28, 2024',
      readTime: '6 min',
      thumbnail: 'https://picsum.photos/seed/aetheria/800/450',
      summary: 'Aetheria offers cozy floating island building paired with dynamic merchant airship trade routes. Learn how we generated procedural sky islands and market price fluctuations.',
      tags: ['Cozy', 'Simulation', 'Builder', 'Economy'],
      contentHtml: `
        <p>Aetheria was designed as a soothing counterpoint to our high-intensity titles. Floating islands form procedurally using 3D Perlin noise and erosion algorithms.</p>

        <h3>Dynamic Cloud Ecosystems</h3>
        <p>Airships travel between sky ports using wind corridor currents. Crop yields and trading prices shift based on seasonal wind directions and cloud moisture levels.</p>

        <h3>Acoustic Soundscapes</h3>
        <p>The soundtrack shifts seamlessly from gentle acoustic guitars during island building to majestic brass choruses as your merchant fleet sets sail across the clouds.</p>
      `
    },
    {
      id: 'bio-hazard-devlog',
      gameSlug: 'bio-hazard-protocol',
      gameTitle: 'Bio-Hazard Protocol',
      category: 'Art & Sound',
      title: 'Light as Ammunition: Psychological Tension in Horror',
      subtitle: 'Using directional shadows and audio cues to hunt sound-sensitive bio-mutants.',
      author: 'Marcus Thorne',
      authorRole: 'Art Director & Shader Wizard',
      date: 'November 05, 2024',
      readTime: '8 min',
      thumbnail: 'https://picsum.photos/seed/biohazard/800/450',
      summary: 'Ammonition is scarce in Bio-Hazard Protocol. Your flashlight battery is your most precious resource, but turning it on reveals your location to audio-reactive mutants.',
      tags: ['Horror', 'Survival', 'Stealth', 'Lighting'],
      contentHtml: `
        <p>True survival horror comes from vulnerability. In <em>Bio-Hazard Protocol</em>, mutational enemies are blind but possess hyper-sensitive directional hearing and light detection.</p>

        <h3>Dynamic Flashlight Cone Hazards</h3>
        <p>Illuminating dark corridors reveals key items and path codes, but casting your light beam across a mutant's path causes it to charge instantly.</p>

        <h3>3D Spatial Binaural Audio</h3>
        <p>Every scratch in the ventilation ducts and wet step on metal grates is rendered with HRTF spatial audio so players can pinpoint threats around corners using headphones.</p>
      `
    },
    {
      id: 'subzero-devlog',
      gameSlug: 'subzero-odyssey',
      gameTitle: 'Subzero Odyssey',
      category: 'Postmortem',
      title: 'Blizzard Shaders & Narrative: Survival Emotion at -40°C',
      subtitle: 'Rendering whiteout blizzards and frost accumulation on visor glass in a freezing apocalypse.',
      author: 'Alex Mercer',
      authorRole: 'Founder & Lead Technologist',
      date: 'May 22, 2024',
      readTime: '7 min',
      thumbnail: 'https://picsum.photos/seed/subzero/800/450',
      summary: 'Subzero Odyssey combines narrative arctic survival with whiteout environmental hazards. Here is how we engineered visor ice shaders and audio wind simulation.',
      tags: ['Survival', 'Narrative', 'Shaders', 'Postmortem'],
      contentHtml: `
        <p>Surviving a perpetual blizzard in <em>Subzero Odyssey</em> requires monitoring body temperature, wind chills, and frost buildup on your exploration suit helmet visor.</p>

        <h3>Visor Frost Accretion Shader</h3>
        <p>As the player stays outdoors in sub-zero temperatures, screen-space frost crystals creep inward from the visor edges, restricting visibility and heightening panic.</p>

        <h3>Environmental Audio Chills</h3>
        <p>Wind audio isn't a static loop; it calculates local terrain occlusion. Stepping behind a ruined arctic outpost muffles the gale to a gentle hum, providing psychological relief.</p>
      `
    }
  ]);

  featuredPost = computed(() => this.posts()[0] || null);

  filteredPosts = computed(() => {
    const query = this.searchQuery.toLowerCase().trim();
    const category = this.selectedCategory();

    return this.posts().filter(p => {
      const matchesCat = category === 'All' || p.category === category;
      const matchesSearch = !query
        || p.title.toLowerCase().includes(query)
        || p.gameTitle.toLowerCase().includes(query)
        || p.summary.toLowerCase().includes(query)
        || p.tags.some(t => t.toLowerCase().includes(query));

      return matchesCat && matchesSearch;
    });
  });

  openPostModal(post: BlogPost) {
    this.activePost.set(post);
  }

  closePostModal() {
    this.activePost.set(null);
  }

  resetSearch() {
    this.searchQuery = '';
    this.selectedCategory.set('All');
  }

  getCategoryBadgeClass(category: string): string {
    if (category === 'Devlog') return 'badge-new';
    if (category === 'Technical') return 'badge-trending';
    if (category === 'Art & Sound') return 'badge-editors';
    return 'badge-trending';
  }
}
