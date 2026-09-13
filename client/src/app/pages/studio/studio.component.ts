import { Component, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

interface TimelineEvent {
  year: string;
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  highlight?: string;
}

interface TeamMember {
  name: string;
  role: string;
  bio: string;
  avatar: string;
  specialty: string;
  favoriteGame: string;
}

@Component({
  selector: 'app-studio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="min-h-screen pt-20 pb-24 relative overflow-hidden">
      
      <!-- Ambient Lights & Grid -->
      <div class="absolute top-1/4 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute top-2/3 right-10 w-[600px] h-[300px] bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute inset-0 cyber-grid-bg opacity-25 pointer-events-none"></div>

      <!-- Hero Header -->
      <section class="relative py-20 text-center px-4 sm:px-6 lg:px-8">
        <div class="max-w-4xl mx-auto space-y-6 animate-fade-in-up">
          <div class="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 font-rajdhani font-semibold text-xs tracking-widest uppercase">
            <span>⚡ THE NEXUS FORGE STORY</span>
          </div>

          <h1 class="font-orbitron font-black text-5xl sm:text-6xl lg:text-7xl text-white leading-none">
            Forged in <span class="gradient-text">Code</span>. Driven by <span class="neon-text-cyan">Passion</span>.
          </h1>

          <p class="text-gray-400 text-lg sm:text-xl font-inter leading-relaxed max-w-2xl mx-auto">
            From a tiny 3-person garage studio in 2019 to an independent powerhouse of 24 creators. 
            We build non-formulaic, high-octane digital worlds without corporate compromise.
          </p>

          <!-- Quick Stats Grid -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 pt-8">
            <div class="glass-card p-5 text-center">
              <div class="font-orbitron font-black text-3xl text-cyan-400">2019</div>
              <div class="text-xs text-gray-500 font-rajdhani uppercase tracking-widest mt-1">Founded</div>
            </div>
            <div class="glass-card p-5 text-center">
              <div class="font-orbitron font-black text-3xl text-purple-400">12</div>
              <div class="text-xs text-gray-500 font-rajdhani uppercase tracking-widest mt-1">Released Games</div>
            </div>
            <div class="glass-card p-5 text-center">
              <div class="font-orbitron font-black text-3xl text-green-400">500K+</div>
              <div class="text-xs text-gray-500 font-rajdhani uppercase tracking-widest mt-1">Global Players</div>
            </div>
            <div class="glass-card p-5 text-center">
              <div class="font-orbitron font-black text-3xl text-pink-400">0%</div>
              <div class="text-xs text-gray-500 font-rajdhani uppercase tracking-widest mt-1">Crunch Culture</div>
            </div>
          </div>
        </div>
      </section>

      <!-- Origin Story Narrative -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="glass-card p-8 sm:p-12 relative overflow-hidden">
          <div class="absolute -right-20 -bottom-20 w-80 h-80 bg-cyan-500/5 rounded-full blur-3xl"></div>
          
          <div class="grid lg:grid-cols-2 gap-12 items-center relative z-10">
            <div class="space-y-6">
              <p class="text-cyan-400 font-rajdhani font-semibold uppercase tracking-widest text-sm">// OUR ORIGIN</p>
              <h2 class="font-orbitron font-bold text-3xl sm:text-4xl text-white">
                How Nexus Forge Came to Be
              </h2>
              <p class="text-gray-300 leading-relaxed font-inter">
                In late 2019, three graphics programmers and synthwave music enthusiasts met at a regional game jam. Frustrated by copy-paste AAA game design and predatory microtransactions, we founded Nexus Forge with a simple manifesto: <strong class="text-white">Build games we genuinely burn to play.</strong>
              </p>
              <p class="text-gray-400 leading-relaxed font-inter">
                Our first title, <span class="text-cyan-400 font-semibold font-rajdhani">Apex Drifter 2D</span>, was coded in 90 sleepless nights over neon light fixtures and synth albums. The overwhelming player response proved there was a hungry audience for dark sci-fi aesthetic combined with razor-sharp mechanics.
              </p>
              <p class="text-gray-400 leading-relaxed font-inter">
                Five years later, our team has grown to 24 designers, shader programmers, audio composers, and community specialists—maintaining 100% creative independence and zero crunch.
              </p>
            </div>

            <div class="space-y-4">
              <div class="glass-card p-5 border-l-4 border-l-cyan-400 bg-white/5">
                <h4 class="font-orbitron text-white text-base font-bold mb-1">Shader & Engine Mastery</h4>
                <p class="text-xs text-gray-400 font-inter">We write our own custom procedural generation, GPU particle solvers, and audio-reactive pipelines in C++ and WebGPU.</p>
              </div>
              <div class="glass-card p-5 border-l-4 border-l-purple-400 bg-white/5">
                <h4 class="font-orbitron text-white text-base font-bold mb-1">True DRM-Free Ownership</h4>
                <p class="text-xs text-gray-400 font-inter">Every game you purchase delivers a clean digital activation key. No always-online DRM or forced launcher clients.</p>
              </div>
              <div class="glass-card p-5 border-l-4 border-l-pink-400 bg-white/5">
                <h4 class="font-orbitron text-white text-base font-bold mb-1">Audio-Visual Harmony</h4>
                <p class="text-xs text-gray-400 font-inter">Our music tracks are composed alongside level architecture so every beam, pulse, and explosion feels sonically locked in.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Interactive Timeline -->
      <section class="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-16">
          <p class="text-cyan-400 font-rajdhani font-semibold uppercase tracking-widest text-sm mb-2">// MILESTONES</p>
          <h2 class="font-orbitron font-black text-3xl sm:text-4xl text-white">The Evolution Timeline</h2>
        </div>

        <div class="relative border-l-2 border-cyan-500/20 ml-4 sm:ml-32 space-y-12">
          @for (event of timeline(); track event.year) {
            <div class="relative pl-8 sm:pl-10 group">
              
              <!-- Year Pill on Desktop -->
              <div class="hidden sm:flex absolute -left-32 top-0 w-24 justify-end">
                <span class="font-orbitron font-bold text-sm text-cyan-400 bg-cyan-500/10 px-3 py-1 rounded-full border border-cyan-500/30">
                  {{ event.year }}
                </span>
              </div>

              <!-- Node Dot -->
              <div class="absolute -left-[9px] top-1.5 w-4 h-4 rounded-full bg-cyber-black border-2 border-cyan-400 group-hover:scale-125 group-hover:bg-cyan-400 transition-all duration-300 shadow-[0_0_10px_rgba(0,245,255,0.6)]"></div>

              <!-- Content Card -->
              <div class="glass-card p-6 group-hover:border-cyan-500/40 transition-all">
                <div class="flex items-center gap-3 mb-2">
                  <span class="sm:hidden font-orbitron font-bold text-xs text-cyan-400 bg-cyan-500/10 px-2.5 py-0.5 rounded-full border border-cyan-500/30">
                    {{ event.year }}
                  </span>
                  <span class="text-xl">{{ event.icon }}</span>
                  <h3 class="font-orbitron font-bold text-lg text-white group-hover:text-cyan-400 transition-colors">
                    {{ event.title }}
                  </h3>
                </div>
                <p class="text-xs font-rajdhani font-semibold text-purple-400 mb-3 uppercase tracking-wider">
                  {{ event.subtitle }}
                </p>
                <p class="text-sm text-gray-400 font-inter leading-relaxed">
                  {{ event.description }}
                </p>
                @if (event.highlight) {
                  <div class="mt-3 inline-block text-xs text-green-400 font-rajdhani font-semibold bg-green-500/10 px-3 py-1 rounded-md border border-green-500/20">
                    ✓ {{ event.highlight }}
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Technology Stack Spotlight -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="glass-card p-8 sm:p-12">
          <div class="text-center max-w-2xl mx-auto mb-12">
            <p class="text-purple-400 font-rajdhani font-semibold uppercase tracking-widest text-sm mb-2">// IN-HOUSE TECH</p>
            <h2 class="font-orbitron font-black text-3xl sm:text-4xl text-white">Our Proprietary Engine Tech</h2>
            <p class="text-gray-400 text-sm mt-2">Built from scratch to deliver sub-millisecond input responsiveness and glowing neon aesthetics.</p>
          </div>

          <div class="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div class="glass-card p-6 border-cyan-500/10 hover:border-cyan-500/30 transition-all">
              <div class="text-3xl mb-3">🎨</div>
              <h3 class="font-orbitron text-base text-white font-bold mb-2">ShaderForge 4.0</h3>
              <p class="text-xs text-gray-400 font-inter leading-relaxed">Custom HLSL/GLSL shader pipeline powering volumetric lighting, glassmorphic reflections, and dynamic bloom without degrading performance.</p>
            </div>
            <div class="glass-card p-6 border-purple-500/10 hover:border-purple-500/30 transition-all">
              <div class="text-3xl mb-3">🔊</div>
              <h3 class="font-orbitron text-base text-white font-bold mb-2">Pulsar Audio DSP</h3>
              <p class="text-xs text-gray-400 font-inter leading-relaxed">Real-time dynamic synthesis engine that parses live gameplay metrics and modulates synth basslines and percussion in 120Hz sync.</p>
            </div>
            <div class="glass-card p-6 border-pink-500/10 hover:border-pink-500/30 transition-all">
              <div class="text-3xl mb-3">📐</div>
              <h3 class="font-orbitron text-base text-white font-bold mb-2">ForgeGrid Solver</h3>
              <p class="text-xs text-gray-400 font-inter leading-relaxed">High-performance 2D/3D spatial hash collision system capable of processing 50,000 active particles and rigid bodies simultaneously.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- Team Spotlight -->
      <section class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center mb-12">
          <p class="text-cyan-400 font-rajdhani font-semibold uppercase tracking-widest text-sm mb-2">// THE ARCHITECTS</p>
          <h2 class="font-orbitron font-black text-3xl sm:text-4xl text-white">Meet Studio Leadership</h2>
        </div>

        <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          @for (member of team(); track member.name) {
            <div class="glass-card p-6 text-center group hover:border-cyan-500/30 transition-all">
              <img
                [src]="member.avatar"
                [alt]="member.name"
                class="w-24 h-24 rounded-full mx-auto mb-4 object-cover border-2 border-cyan-500/30 group-hover:scale-105 transition-transform"
              />
              <h3 class="font-orbitron font-bold text-white text-base group-hover:text-cyan-400 transition-colors">
                {{ member.name }}
              </h3>
              <p class="text-xs font-rajdhani text-purple-400 font-semibold uppercase tracking-wider mb-2">
                {{ member.role }}
              </p>
              <p class="text-xs text-gray-400 font-inter mb-4 line-clamp-3">
                {{ member.bio }}
              </p>
              <div class="pt-3 border-t border-white/5 text-left text-xs space-y-1 font-rajdhani">
                <p class="text-gray-500">Focus: <span class="text-gray-300 font-semibold">{{ member.specialty }}</span></p>
                <p class="text-gray-500">Fav Game: <span class="text-cyan-400 font-semibold">{{ member.favoriteGame }}</span></p>
              </div>
            </div>
          }
        </div>
      </section>

      <!-- Call to Action -->
      <section class="max-w-4xl mx-auto px-4 text-center py-12">
        <div class="glass-card p-10 relative overflow-hidden">
          <h2 class="font-orbitron font-bold text-3xl text-white mb-4">Experience Our Games Firsthand</h2>
          <p class="text-gray-400 font-inter text-sm mb-8 max-w-xl mx-auto">
            Ready to dive into our 12 unique titles? Explore devlogs or test-drive our full game catalog.
          </p>
          <div class="flex flex-wrap justify-center gap-4">
            <a routerLink="/games" class="btn-primary px-8 py-3">Explore Catalog</a>
            <a routerLink="/blog" class="btn-outline-cyan px-8 py-3">Read Game Devlogs</a>
          </div>
        </div>
      </section>

    </div>
  `
})
export class StudioComponent {
  timeline = signal<TimelineEvent[]>([
    {
      year: '2019',
      title: 'The Garage Genesis',
      subtitle: 'Founding & Prototype Engine',
      description: 'Three graphics engineers formed Nexus Forge in a garage studio. Built ShaderForge 1.0 and laid down the first lines of code for Apex Drifter 2D.',
      icon: '🚀',
      highlight: 'First 2D vector physics engine compiled'
    },
    {
      year: '2020',
      title: 'Apex Drifter Breakthrough',
      subtitle: 'First Commercial Release',
      description: 'Launched Apex Drifter 2D on PC. Reached 50,000 active racers in month one with rave reviews for its procedural track generation and synth soundtrack.',
      icon: '🏎️',
      highlight: 'Surpassed 100K downloads'
    },
    {
      year: '2021',
      title: 'Tactical Expansion',
      subtitle: 'Expanding to Strategy & Cyberpunk',
      description: 'Expanded studio to 10 creators. Released Protocol: Agents, introducing tactical stealth AI systems and branching espionage story arcs.',
      icon: '🕵️‍♂️',
      highlight: 'Nominated for Best Indie Tactical AI'
    },
    {
      year: '2022',
      title: 'The Rhythm & Void Era',
      subtitle: 'Audio-Visual Harmony & Space Sim',
      description: 'Pioneered audio-driven combat in CyberPulse 2099 and deep space atmospheric survival in Void Horizons. Team grew to 16 full-time artisans.',
      icon: '⚡',
      highlight: 'Won Indie Audio of the Year'
    },
    {
      year: '2023',
      title: 'Roguelike & Racing Supremacy',
      subtitle: 'Multi-Genre Mastery',
      description: 'Released Mythic Runes (deck-building roguelike) and Neon Overdrive (900 km/h anti-gravity hover racer), cementing Nexus Forge as a multi-genre powerhouse.',
      icon: '🔥',
      highlight: 'Surpassed 350K global players'
    },
    {
      year: '2024',
      title: '12-Game Benchmark',
      subtitle: 'Full Catalog Realized',
      description: 'Completed our initial 12-game roadmap with Aetheria, Bio-Hazard Protocol, and Subzero Odyssey. Over 500,000 total players across all titles.',
      icon: '👑',
      highlight: '99% Positive Player Rating'
    }
  ]);

  team = signal<TeamMember[]>([
    {
      name: 'Alex Mercer',
      role: 'Founder & Lead Technologist',
      bio: 'Former senior shader architect. Passionate about procedural track generation, WebGPU, and 80s arcade drift physics.',
      avatar: 'https://picsum.photos/seed/alexmercer/300/300',
      specialty: 'C++ / GPU Shaders',
      favoriteGame: 'Apex Drifter 2D'
    },
    {
      name: 'Dr. Elena Vance',
      role: 'Lead Systems Architect',
      bio: 'Ph.D. in Computer Science & Emergent AI. Architected the turn-based espionage logic in Protocol: Agents.',
      avatar: 'https://picsum.photos/seed/elenavance/300/300',
      specialty: 'Tactical AI & Spatial Math',
      favoriteGame: 'Protocol: Agents'
    },
    {
      name: 'Kai Sorenson',
      role: 'Audio Director & Composer',
      bio: 'Synthwave producer and DSP specialist behind CyberPulse 2099 soundscape and dynamic audio reactivity engines.',
      avatar: 'https://picsum.photos/seed/kaisorenson/300/300',
      specialty: 'DSP Synthesis & Modular Audio',
      favoriteGame: 'CyberPulse 2099'
    },
    {
      name: 'Marcus Thorne',
      role: 'Art Director & Shader Wizard',
      bio: 'Master of neon aesthetic, dark fantasy iconography, and glassmorphism UI design systems across all studio titles.',
      avatar: 'https://picsum.photos/seed/marcusthorne/300/300',
      specialty: 'Lighting & Visual FX',
      favoriteGame: 'Shadow Realm: Origins'
    }
  ]);
}
