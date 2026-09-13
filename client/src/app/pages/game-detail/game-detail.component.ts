import {
  Component, OnInit, inject, signal
} from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { GamesService } from '../../core/services/games.service';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { Game } from '../../core/models/game.model';

@Component({
  selector: 'app-game-detail',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    @if (isLoading()) {
      <div class="min-h-screen flex items-center justify-center pt-16">
        <div class="text-center">
          <div class="cyber-spinner mx-auto mb-4"></div>
          <p class="text-gray-500 font-rajdhani">Loading game data...</p>
        </div>
      </div>
    }

    @if (!isLoading() && game()) {
      <div class="min-h-screen pt-16">

        <!-- Full-width Hero Art -->
        <div class="relative h-[70vh] overflow-hidden">
          <img
            [src]="game()!.thumbnail_url"
            [alt]="game()!.title"
            class="w-full h-full object-cover"
          />
          <div class="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent"></div>
          <div class="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/30"></div>

          <!-- Back Button -->
          <div class="absolute top-8 left-6 sm:left-12">
            <a routerLink="/games" class="flex items-center gap-2 text-gray-400 hover:text-white transition-colors font-rajdhani text-sm">
              ← Back to Catalog
            </a>
          </div>

          <!-- Hero Content -->
          <div class="absolute bottom-0 left-0 right-0 p-6 sm:p-12">
            <div class="max-w-7xl mx-auto">
              <div class="flex flex-col lg:flex-row gap-8 items-end">

                <!-- Game Info -->
                <div class="flex-1">
                  <div class="flex items-center gap-3 mb-4">
                    @if (game()!.badge) {
                      <span class="badge" [class]="getBadgeClass(game()!.badge)">{{ game()!.badge }}</span>
                    }
                    <span class="text-gray-500 font-rajdhani text-sm">{{ game()!.genre }}</span>
                    <span class="text-gray-700">·</span>
                    <span class="text-gray-500 font-rajdhani text-sm">{{ game()!.release_date }}</span>
                  </div>

                  <h1 class="font-orbitron font-black text-4xl sm:text-5xl lg:text-6xl text-white mb-3 leading-tight">
                    {{ game()!.title }}
                  </h1>

                  <p class="text-gray-400 text-lg font-rajdhani italic max-w-2xl">
                    "{{ game()!.tagline }}"
                  </p>

                  <!-- Tags -->
                  <div class="flex flex-wrap gap-2 mt-4">
                    @for (tag of game()!.tags; track tag) {
                      <span class="text-xs text-gray-400 bg-white/5 px-3 py-1 rounded-full font-rajdhani border border-white/10">
                        {{ tag }}
                      </span>
                    }
                  </div>
                </div>

                <!-- Buy Box (glassmorphism) -->
                <div class="glass-card p-6 min-w-[280px] max-w-xs w-full lg:w-auto">
                  <div class="mb-4">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="text-yellow-400">★★★★★</span>
                      <span class="text-gray-300 font-rajdhani font-semibold">{{ game()!.rating }}</span>
                    </div>

                    @if (game()!.discount_percent > 0) {
                      <div class="flex items-baseline gap-3">
                        <span class="price-tag text-3xl font-orbitron font-black">
                          {{ getDiscountedPrice() | currency }}
                        </span>
                        <span class="price-tag-original text-base">{{ game()!.price | currency }}</span>
                        <span class="badge badge-new">-{{ game()!.discount_percent }}%</span>
                      </div>
                    } @else {
                      <span class="price-tag text-3xl font-orbitron font-black">{{ game()!.price | currency }}</span>
                    }
                  </div>

                  <button
                    (click)="addToCart()"
                    class="w-full py-3 rounded-lg font-orbitron font-bold text-sm transition-all"
                    [class.btn-primary]="!isInCart()"
                    [class.in-cart-btn]="isInCart()"
                    [id]="'detail-add-cart-' + game()!.id"
                  >
                    {{ isInCart() ? '✓ In Cart — View Cart' : 'Add to Cart' }}
                  </button>

                  @if (isInCart()) {
                    <a
                      routerLink="/checkout"
                      class="btn-outline-cyan w-full mt-2 text-center block py-2 text-sm"
                    >Proceed to Checkout →</a>
                  }

                  <p class="text-xs text-gray-600 text-center mt-3 font-rajdhani">
                    🔒 Instant digital delivery · License key emailed
                  </p>
                </div>

              </div>
            </div>
          </div>
        </div>

        <!-- Content Tabs -->
        <div class="bg-cyber-dark border-b border-white/10 sticky top-16 z-30">
          <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div class="flex">
              @for (tab of tabs; track tab.id) {
                <button
                  (click)="activeTab.set(tab.id)"
                  class="cyber-tab"
                  [class.active]="activeTab() === tab.id"
                  [id]="'tab-' + tab.id"
                >{{ tab.label }}</button>
              }
            </div>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">

          <!-- Overview Tab -->
          @if (activeTab() === 'overview') {
            <div class="grid lg:grid-cols-3 gap-12 animate-fade-in-up">
              <div class="lg:col-span-2 space-y-8">
                <div>
                  <h2 class="font-orbitron font-bold text-xl text-white mb-4">About This Game</h2>
                  <p class="text-gray-400 leading-relaxed">{{ game()!.description }}</p>
                </div>

                <!-- Screenshots Lightbox -->
                @if ((game()!.screenshots || []).length > 0) {
                  <div>
                    <h3 class="font-orbitron font-bold text-base text-white mb-4">Screenshots</h3>
                    <div class="grid grid-cols-3 gap-3">
                      @for (ss of game()!.screenshots; track ss; let i = $index) {
                        <div
                          class="aspect-video overflow-hidden rounded-lg cursor-pointer group border border-white/5 hover:border-cyan-500/30 transition-all"
                          (click)="openLightbox(i)"
                        >
                          <img
                            [src]="ss"
                            [alt]="'Screenshot ' + (i+1)"
                            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                          />
                        </div>
                      }
                    </div>
                  </div>
                }
              </div>

              <!-- Sidebar -->
              <div class="space-y-4">
                <div class="glass-card p-5">
                  <h4 class="font-rajdhani font-semibold text-gray-400 uppercase text-xs tracking-widest mb-3">Game Info</h4>
                  <div class="space-y-3">
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-gray-500 font-rajdhani">Genre</span>
                      <span class="text-xs text-white font-rajdhani">{{ game()!.genre }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-gray-500 font-rajdhani">Release Date</span>
                      <span class="text-xs text-white font-rajdhani">{{ game()!.release_date }}</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-gray-500 font-rajdhani">Rating</span>
                      <span class="text-xs text-yellow-400 font-rajdhani font-semibold">★ {{ game()!.rating }} / 5.0</span>
                    </div>
                    <div class="flex justify-between items-center">
                      <span class="text-xs text-gray-500 font-rajdhani">Platform</span>
                      <span class="text-xs text-white font-rajdhani">PC / Mac</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          }

          <!-- System Requirements Tab -->
          @if (activeTab() === 'sysreqs') {
            <div class="animate-fade-in-up max-w-2xl">
              <h2 class="font-orbitron font-bold text-xl text-white mb-6">System Requirements</h2>
              @if (game()!.systemReqs) {
                <div class="glass-card p-6 space-y-4">
                  @for (req of getReqEntries(); track req.key) {
                    <div class="flex gap-4 items-start border-b border-white/5 pb-4 last:border-0 last:pb-0">
                      <span class="text-gray-500 font-rajdhani text-xs uppercase tracking-widest w-20 flex-shrink-0 pt-0.5">{{ req.key }}</span>
                      <span class="text-gray-300 font-inter text-sm">{{ req.value }}</span>
                    </div>
                  }
                </div>
              }
            </div>
          }

          <!-- Patch Notes Tab -->
          @if (activeTab() === 'patch') {
            <div class="animate-fade-in-up max-w-2xl">
              <h2 class="font-orbitron font-bold text-xl text-white mb-6">Patch Notes</h2>
              <div class="space-y-4">
                @for (patch of patchNotes; track patch.version) {
                  <div class="glass-card p-5">
                    <div class="flex items-center justify-between mb-3">
                      <span class="font-orbitron font-bold text-sm neon-text-cyan">v{{ patch.version }}</span>
                      <span class="text-xs text-gray-600 font-rajdhani">{{ patch.date }}</span>
                    </div>
                    <ul class="space-y-1.5">
                      @for (note of patch.notes; track note) {
                        <li class="text-sm text-gray-400 font-inter flex gap-2">
                          <span class="text-cyan-600 flex-shrink-0">›</span>
                          <span>{{ note }}</span>
                        </li>
                      }
                    </ul>
                  </div>
                }
              </div>
            </div>
          }
        </div>
      </div>
    }

    <!-- Lightbox -->
    @if (lightboxIndex() >= 0) {
      <div class="lightbox-overlay" (click)="closeLightbox()">
        <div class="relative w-full max-w-5xl mx-4" (click)="$event.stopPropagation()">
          <button (click)="closeLightbox()" class="absolute -top-10 right-0 text-gray-400 hover:text-white font-rajdhani text-sm">✕ CLOSE</button>
          <img
            [src]="game()!.screenshots![lightboxIndex()]"
            alt="Screenshot"
            class="w-full rounded-xl shadow-2xl border border-white/10"
          />
          <div class="flex justify-center gap-3 mt-4">
            @for (ss of game()!.screenshots; track ss; let i = $index) {
              <button
                (click)="setLightboxIndex(i)"
                class="w-3 h-3 rounded-full transition-all"
                [style.background]="lightboxIndex() === i ? '#00f5ff' : 'rgba(255,255,255,0.2)'"
              ></button>
            }
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .in-cart-btn {
      background: linear-gradient(135deg, #00ff88, #00cc66);
      color: #000;
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
    }
  `]
})
export class GameDetailComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private gamesService = inject(GamesService);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  game = signal<Game | null>(null);
  isLoading = signal(true);
  activeTab = signal('overview');
  lightboxIndex = signal(-1);

  tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'sysreqs', label: 'System Requirements' },
    { id: 'patch', label: 'Patch Notes' },
  ];

  patchNotes = [
    { version: '1.2.0', date: '2024-08-01', notes: ['New game mode added', 'Performance improvements', 'Fixed rare crash on startup', 'Balance tweaks based on community feedback'] },
    { version: '1.1.0', date: '2024-06-15', notes: ['Multiplayer mode beta launched', 'New map: Sector 7', 'UI overhaul for inventory system'] },
    { version: '1.0.1', date: '2024-05-01', notes: ['Launch day hotfix', 'Audio desync issue resolved', 'Controller support added'] },
  ];

  ngOnInit() {
    const slug = this.route.snapshot.paramMap.get('slug')!;
    this.gamesService.getGameBySlug(slug).subscribe({
      next: game => {
        this.game.set(game);
        this.isLoading.set(false);
      },
      error: () => {
        this.router.navigate(['/games']);
      }
    });
  }

  addToCart() {
    const game = this.game();
    if (!game) return;
    if (this.isInCart()) {
      this.cartService.openCart();
    } else {
      this.cartService.addItem(game);
      this.toastService.success(`${game.title} added to cart!`);
    }
  }

  isInCart(): boolean {
    const game = this.game();
    return game ? this.cartService.isInCart(game.id) : false;
  }

  getDiscountedPrice(): number {
    const game = this.game()!;
    return game.price * (1 - game.discount_percent / 100);
  }

  getBadgeClass(badge: string): string {
    if (badge === 'Trending') return 'badge-trending';
    if (badge === 'New Release') return 'badge-new';
    if (badge === "Editor's Choice") return 'badge-editors';
    return '';
  }

  getReqEntries(): { key: string; value: string }[] {
    const reqs = this.game()!.systemReqs;
    if (!reqs) return [];
    return Object.entries(reqs).map(([key, value]) => ({ key, value: value as string }));
  }

  openLightbox(index: number) {
    this.lightboxIndex.set(index);
  }

  setLightboxIndex(index: number) {
    this.lightboxIndex.set(index);
  }

  closeLightbox() {
    this.lightboxIndex.set(-1);
  }
}
