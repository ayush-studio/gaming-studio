import {
  Component, OnInit, AfterViewInit, ElementRef, ViewChild,
  inject, signal, OnDestroy
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { GamesService } from '../../core/services/games.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { Game } from '../../core/models/game.model';
import { GameCardComponent } from '../../shared/components/game-card/game-card.component';

interface Particle {
  x: number; y: number; vx: number; vy: number;
  size: number; opacity: number; color: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, GameCardComponent],
  template: `
    <!-- Particle Canvas Hero -->
    <section class="relative min-h-screen flex items-center overflow-hidden">
      <canvas #particleCanvas class="absolute inset-0 w-full h-full"></canvas>

      <!-- Ambient gradient blobs -->
      <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl animate-float pointer-events-none"></div>
      <div class="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-float pointer-events-none" style="animation-delay: -3s"></div>
      <div class="absolute top-1/2 left-1/2 w-64 h-64 bg-pink-500/5 rounded-full blur-3xl pointer-events-none"></div>

      <!-- Cyber grid -->
      <div class="absolute inset-0 cyber-grid-bg pointer-events-none opacity-30"></div>

      <!-- Scan line effect -->
      <div class="absolute inset-0 pointer-events-none overflow-hidden">
        <div class="scan-line"></div>
      </div>

      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 w-full">
        <div class="grid lg:grid-cols-2 gap-16 items-center">

          <!-- Left: Hero Copy -->
          <div class="space-y-8 animate-fade-in-up">
            <div class="flex items-center gap-3">
              <span class="badge badge-trending">★ FEATURED THIS MONTH</span>
            </div>

            <h1 class="font-orbitron font-black text-5xl sm:text-6xl lg:text-7xl leading-none">
              <span class="gradient-text">NEXUS</span>
              <br/>
              <span class="text-white">FORGE</span>
              <br/>
              <span class="text-2xl sm:text-3xl font-light text-gray-400 font-rajdhani">GAME STUDIO</span>
            </h1>

            <p class="text-gray-400 text-lg leading-relaxed max-w-lg font-inter">
              Crafting <span class="text-cyan-400">cinematic digital worlds</span> and boundary-pushing
              interactive experiences since 2019. Twelve titles. One vision.
            </p>

            <!-- Stats -->
            <div class="flex flex-wrap gap-8">
              @for (stat of stats(); track stat.label) {
                <div class="text-center">
                  <div class="font-orbitron font-black text-2xl sm:text-3xl gradient-text">{{ stat.value }}</div>
                  <div class="text-xs text-gray-500 font-rajdhani uppercase tracking-widest mt-1">{{ stat.label }}</div>
                </div>
              }
            </div>

            <!-- CTAs -->
            <div class="flex flex-wrap gap-4">
              <a routerLink="/games" class="btn-primary px-8 py-3 text-sm">
                Browse All Games →
              </a>
              @if (featuredGame()) {
                <button (click)="openTrailer()" class="btn-outline-cyan px-8 py-3 text-sm">
                  ▶ Watch Trailer
                </button>
              }
            </div>
          </div>

          <!-- Right: Featured Game Card -->
          @if (featuredGame(); as game) {
            <div class="relative animate-fade-in-up" style="animation-delay: 0.2s">
              <div class="featured-game-card animate-float">
                <!-- Game Art -->
                <div class="relative overflow-hidden rounded-2xl aspect-video">
                  <img
                    [src]="game.thumbnail_url"
                    [alt]="game.title"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent"></div>

                  <!-- Game Info Overlay -->
                  <div class="absolute bottom-0 left-0 right-0 p-6">
                    <div class="flex items-end justify-between">
                      <div>
                        <span class="badge badge-editors mb-2 inline-block">{{ game.badge }}</span>
                        <h3 class="font-orbitron font-bold text-xl text-white">{{ game.title }}</h3>
                        <p class="text-gray-400 text-sm mt-1 font-rajdhani">{{ game.tagline }}</p>
                      </div>
                      <div class="text-right">
                        <div class="price-tag text-2xl font-orbitron font-bold">{{ getGamePrice(game) | currency }}</div>
                        <button
                          (click)="addFeaturedToCart(game)"
                          class="btn-primary mt-2 px-4 py-1.5 text-xs block text-center"
                        >Add to Cart</button>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- Tags Row -->
                <div class="mt-3 flex flex-wrap gap-2 px-1">
                  @for (tag of (game.tags || []).slice(0, 4); track tag) {
                    <span class="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full font-rajdhani">{{ tag }}</span>
                  }
                </div>
              </div>

              <!-- Decorative Elements -->
              <div class="absolute -top-6 -right-6 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
              <div class="absolute -bottom-6 -left-6 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none"></div>
            </div>
          }
        </div>
      </div>

      <!-- Scroll indicator -->
      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
        <span class="text-xs text-gray-600 font-rajdhani uppercase tracking-widest">Scroll</span>
        <div class="w-px h-8 bg-gradient-to-b from-cyan-500/50 to-transparent"></div>
      </div>
    </section>

    <!-- Trailer Modal -->
    @if (showTrailer()) {
      <div class="lightbox-overlay" (click)="closeTrailer()">
        <div class="relative w-full max-w-4xl mx-4" (click)="$event.stopPropagation()">
          <button
            (click)="closeTrailer()"
            class="absolute -top-12 right-0 text-gray-400 hover:text-white font-rajdhani text-sm"
          >✕ CLOSE</button>
          <div class="aspect-video rounded-2xl overflow-hidden border border-cyan-500/20 shadow-2xl">
            @if (featuredGame()?.trailer_url) {
              <iframe
                [src]="getSafeUrl(featuredGame()!.trailer_url)"
                class="w-full h-full"
                frameborder="0"
                allow="autoplay; encrypted-media"
                allowfullscreen
              ></iframe>
            }
          </div>
        </div>
      </div>
    }

    <!-- Featured Games Grid -->
    <section class="py-24 bg-cyber-dark relative">
      <div class="absolute inset-0 cyber-grid-bg opacity-20"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-end justify-between mb-12">
          <div>
            <p class="text-cyan-400 font-rajdhani font-semibold uppercase tracking-widest text-sm mb-2">
              // TOP PICKS
            </p>
            <h2 class="font-orbitron font-bold text-3xl sm:text-4xl text-white">
              Popular Right Now
            </h2>
          </div>
          <a routerLink="/games" class="btn-outline-cyan text-sm hidden md:block">
            View All Games →
          </a>
        </div>

        @if (isLoading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (i of [1,2,3]; track i) {
              <div class="rounded-2xl h-80 bg-white/5 animate-pulse"></div>
            }
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            @for (game of popularGames(); track game.id) {
              <app-game-card [game]="game" />
            }
          </div>
        }

        <div class="text-center mt-12 md:hidden">
          <a routerLink="/games" class="btn-outline-cyan text-sm">View All 12 Games →</a>
        </div>
      </div>
    </section>

    <!-- Studio Banner -->
    <section class="py-24 relative overflow-hidden">
      <div class="absolute inset-0 bg-gradient-to-r from-cyan-500/5 via-purple-500/5 to-pink-500/5"></div>
      <div class="absolute inset-0 cyber-grid-bg opacity-20"></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative">
        <p class="text-gray-500 font-rajdhani uppercase tracking-widest text-sm mb-4">// THE STUDIO</p>
        <h2 class="font-orbitron font-black text-4xl sm:text-5xl text-white mb-6">
          Indie. Fearless. <span class="gradient-text">Limitless.</span>
        </h2>
        <p class="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed mb-10">
          We are a team of 24 passionate designers, engineers, and storytellers dedicated
          to forging worlds that transcend the boundary between reality and imagination.
        </p>
        <div class="flex flex-wrap justify-center gap-8 mb-12">
          @for (fact of studioFacts; track fact.label) {
            <div class="glass-card px-8 py-6 text-center min-w-[140px]">
              <div class="font-orbitron font-black text-3xl gradient-text">{{ fact.value }}</div>
              <div class="text-xs text-gray-500 font-rajdhani uppercase tracking-widest mt-2">{{ fact.label }}</div>
            </div>
          }
        </div>
        <a routerLink="/games" class="btn-primary px-10 py-3">Explore Our Games</a>
      </div>
    </section>
  `,
  styles: [`
    .featured-game-card {
      background: rgba(14,14,26,0.8);
      border: 1px solid rgba(0,245,255,0.15);
      border-radius: 24px;
      padding: 16px;
      backdrop-filter: blur(16px);
      box-shadow: 0 40px 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,245,255,0.05);
    }
    .scan-line {
      position: absolute;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(0,245,255,0.3), transparent);
      animation: scan-line 4s linear infinite;
      pointer-events: none;
    }
  `]
})
export class HomeComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('particleCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;

  private gamesService = inject(GamesService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  featuredGame = signal<Game | null>(null);
  popularGames = signal<Game[]>([]);
  isLoading = signal(true);
  showTrailer = signal(false);

  stats = signal([
    { value: '12', label: 'Games' },
    { value: '500K+', label: 'Players' },
    { value: '99%', label: 'Positive Reviews' },
    { value: '4', label: 'Awards' },
  ]);

  studioFacts = [
    { value: '5+', label: 'Years Active' },
    { value: '24', label: 'Team Members' },
    { value: '12', label: 'Titles' },
    { value: '6', label: 'Genres' },
  ];

  private animFrame: number = 0;
  private particles: Particle[] = [];
  private ctx!: CanvasRenderingContext2D;

  ngOnInit() {
    this.gamesService.getGames({ sortBy: 'rating' }).subscribe(games => {
      this.featuredGame.set(games[0] || null);
      this.popularGames.set(games.slice(0, 3));
      this.isLoading.set(false);
    });
  }

  ngAfterViewInit() {
    this.initParticles();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animFrame);
  }

  private initParticles() {
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    this.ctx = ctx;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    const colors = ['#00f5ff', '#b400ff', '#ff0080', '#00ff88'];
    this.particles = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      size: Math.random() * 2 + 0.5,
      opacity: Math.random() * 0.5 + 0.1,
      color: colors[Math.floor(Math.random() * colors.length)],
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of this.particles) {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();

        // Draw connections
        for (const q of this.particles) {
          const dist = Math.hypot(p.x - q.x, p.y - q.y);
          if (dist < 120 && dist > 0) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            ctx.strokeStyle = `rgba(0,245,255,${(1 - dist / 120) * 0.08})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }
      this.animFrame = requestAnimationFrame(animate);
    };
    animate();
  }

  addFeaturedToCart(game: Game) {
    this.cartService.addItem(game);
    this.toastService.success(`${game.title} added to cart!`);
  }

  openTrailer() { this.showTrailer.set(true); }
  closeTrailer() { this.showTrailer.set(false); }

  getGamePrice(game: Game): number {
    return game.discount_percent > 0
      ? game.price * (1 - game.discount_percent / 100)
      : game.price;
  }

  getSafeUrl(url: string): string {
    return url;
  }
}
