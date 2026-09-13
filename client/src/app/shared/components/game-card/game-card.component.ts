import {
  Component, Input, Output, EventEmitter, inject,
  ElementRef, HostListener, signal
} from '@angular/core';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { Game } from '../../../core/models/game.model';
import { CartService } from '../../../core/services/cart.service';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-game-card',
  standalone: true,
  imports: [RouterLink, CurrencyPipe],
  template: `
    <div
      class="game-card group"
      (mousemove)="onMouseMove($event)"
      (mouseleave)="onMouseLeave()"
      [style]="cardStyle()"
    >
      <!-- Thumbnail -->
      <div class="relative overflow-hidden rounded-t-2xl aspect-video">
        <img
          [src]="game.thumbnail_url"
          [alt]="game.title"
          class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          loading="lazy"
        />

        <!-- Gradient overlay -->
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

        <!-- Badge -->
        @if (game.badge) {
          <div class="absolute top-3 left-3">
            <span class="badge" [class]="getBadgeClass(game.badge)">{{ game.badge }}</span>
          </div>
        }

        <!-- Discount -->
        @if (game.discount_percent > 0) {
          <div class="absolute top-3 right-3">
            <span class="badge" style="background: rgba(0,255,136,0.2); color: #00ff88; border: 1px solid rgba(0,255,136,0.4);">
              -{{ game.discount_percent }}%
            </span>
          </div>
        }

        <!-- Rating -->
        <div class="absolute bottom-3 left-3 flex items-center gap-1">
          <span class="text-yellow-400 text-sm">★</span>
          <span class="text-xs text-gray-300 font-rajdhani font-semibold">{{ game.rating }}</span>
        </div>

        <!-- Genre tag -->
        <div class="absolute bottom-3 right-3">
          <span class="text-xs text-gray-400 font-rajdhani bg-black/50 px-2 py-0.5 rounded-full">{{ game.genre }}</span>
        </div>
      </div>

      <!-- Content -->
      <div class="p-4">
        <h3 class="font-orbitron font-bold text-sm text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
          {{ game.title }}
        </h3>
        <p class="text-xs text-gray-500 mt-1 line-clamp-2 font-inter leading-relaxed">
          {{ game.tagline }}
        </p>

        <!-- Tags -->
        <div class="flex flex-wrap gap-1 mt-3">
          @for (tag of (game.tags || []).slice(0, 3); track tag) {
            <span class="text-xs text-gray-600 bg-white/5 px-2 py-0.5 rounded font-rajdhani">{{ tag }}</span>
          }
        </div>

        <!-- Price + CTA -->
        <div class="flex items-center justify-between mt-4 pt-3 border-t border-white/5">
          <div>
            @if (game.discount_percent > 0) {
              <div class="flex items-baseline gap-2">
                <span class="price-tag text-base">{{ getDiscountedPrice() | currency }}</span>
                <span class="price-tag-original text-xs">{{ game.price | currency }}</span>
              </div>
            } @else {
              <span class="price-tag text-base">{{ game.price | currency }}</span>
            }
          </div>

          <div class="flex gap-2">
            <a
              [routerLink]="['/games', game.slug]"
              class="btn-outline-cyan text-xs px-3 py-1.5"
              (click)="$event.stopPropagation()"
            >Details</a>
            <button
              (click)="addToCart($event)"
              class="btn-primary text-xs px-3 py-1.5"
              [class.in-cart]="isInCart()"
              [id]="'add-to-cart-' + game.id"
            >
              {{ isInCart() ? '✓ Added' : '+ Cart' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Glow border effect -->
      <div class="card-glow-border"></div>
    </div>
  `,
  styles: [`
    .game-card {
      position: relative;
      background: rgba(14, 14, 26, 0.8);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      transform-style: preserve-3d;
      cursor: pointer;

      &:hover {
        border-color: rgba(0, 245, 255, 0.2);
        box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(0,245,255,0.05);
      }
    }

    .card-glow-border {
      position: absolute;
      inset: -1px;
      border-radius: 16px;
      background: linear-gradient(135deg, rgba(0,245,255,0.1), rgba(180,0,255,0.1));
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      z-index: -1;
    }

    .game-card:hover .card-glow-border {
      opacity: 1;
    }

    .in-cart {
      background: linear-gradient(135deg, #00ff88, #00cc66) !important;
      color: #000 !important;
    }

    .line-clamp-1 {
      display: -webkit-box;
      -webkit-line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
  `]
})
export class GameCardComponent {
  @Input() game!: Game;
  @Output() cartAdded = new EventEmitter<Game>();

  private el = inject(ElementRef);
  private cartService = inject(CartService);
  private toastService = inject(ToastService);

  cardStyle = signal('');

  onMouseMove(event: MouseEvent) {
    const rect = this.el.nativeElement.querySelector('.game-card').getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -8;
    const rotateY = ((x - centerX) / centerX) * 8;

    this.cardStyle.set(
      `transform: perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02);`
    );
  }

  onMouseLeave() {
    this.cardStyle.set('transform: perspective(1000px) rotateX(0) rotateY(0) scale3d(1,1,1);');
  }

  addToCart(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.cartService.addItem(this.game);
    this.toastService.success(`${this.game.title} added to cart!`);
    this.cartAdded.emit(this.game);
  }

  isInCart(): boolean {
    return this.cartService.isInCart(this.game.id);
  }

  getDiscountedPrice(): number {
    return this.game.price * (1 - this.game.discount_percent / 100);
  }

  getBadgeClass(badge: string): string {
    if (badge === 'Trending') return 'badge-trending';
    if (badge === 'New Release') return 'badge-new';
    if (badge === "Editor's Choice") return 'badge-editors';
    return '';
  }
}
