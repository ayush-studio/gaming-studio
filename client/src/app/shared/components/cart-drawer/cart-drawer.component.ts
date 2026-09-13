import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-cart-drawer',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, RouterLink],
  template: `
    @if (cart.isOpen()) {
      <!-- Overlay -->
      <div class="cart-overlay" (click)="cart.closeCart()"></div>

      <!-- Drawer -->
      <div class="cart-drawer">
        <!-- Header -->
        <div class="flex items-center justify-between p-6 border-b border-white/10">
          <div>
            <h2 class="font-orbitron font-bold text-lg text-white">Your Cart</h2>
            <p class="text-xs text-gray-500 mt-0.5 font-rajdhani">
              {{ cart.itemCount() }} {{ cart.itemCount() === 1 ? 'item' : 'items' }}
            </p>
          </div>
          <button
            (click)="cart.closeCart()"
            class="w-9 h-9 flex items-center justify-center rounded-lg border border-white/10 text-gray-400 hover:text-white hover:border-white/30 transition-all"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
            </svg>
          </button>
        </div>

        <!-- Items -->
        <div class="flex-1 overflow-y-auto p-4 space-y-3">
          @if (cart.items().length === 0) {
            <div class="flex flex-col items-center justify-center h-full gap-4 py-16">
              <div class="w-20 h-20 rounded-full border border-cyan-500/20 flex items-center justify-center">
                <svg class="w-10 h-10 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div class="text-center">
                <p class="font-orbitron text-sm text-gray-500">No games yet</p>
                <p class="text-xs text-gray-600 mt-1">Browse the catalog to add games</p>
              </div>
              <a
                routerLink="/games"
                (click)="cart.closeCart()"
                class="btn-outline-cyan text-sm px-6 py-2"
              >Browse Games</a>
            </div>
          }

          @for (item of cart.items(); track item.game.id) {
            <div class="glass-card p-3 flex gap-3 group">
              <img
                [src]="item.game.thumbnail_url"
                [alt]="item.game.title"
                class="w-16 h-16 object-cover rounded-lg flex-shrink-0"
              />
              <div class="flex-1 min-w-0">
                <h4 class="font-rajdhani font-semibold text-sm text-white truncate">{{ item.game.title }}</h4>
                <p class="text-xs text-gray-500">{{ item.game.genre }}</p>

                <div class="flex items-center justify-between mt-2">
                  <!-- Quantity Controls -->
                  <div class="flex items-center gap-1">
                    <button
                      (click)="cart.updateQuantity(item.game.id, item.quantity - 1)"
                      class="w-6 h-6 rounded border border-white/10 text-gray-400 hover:text-white hover:border-white/30 text-xs flex items-center justify-center transition-all"
                    >−</button>
                    <span class="w-6 text-center text-sm text-white font-rajdhani">{{ item.quantity }}</span>
                    <button
                      (click)="cart.updateQuantity(item.game.id, item.quantity + 1)"
                      class="w-6 h-6 rounded border border-white/10 text-gray-400 hover:text-white hover:border-white/30 text-xs flex items-center justify-center transition-all"
                    >+</button>
                  </div>

                  <!-- Price -->
                  <span class="price-tag text-sm">
                    {{ getItemPrice(item) | currency }}
                  </span>
                </div>
              </div>

              <!-- Remove -->
              <button
                (click)="cart.removeItem(item.game.id)"
                class="w-7 h-7 flex items-center justify-center text-gray-600 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
              >
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"/>
                </svg>
              </button>
            </div>
          }
        </div>

        <!-- Footer -->
        @if (cart.items().length > 0) {
          <div class="border-t border-white/10 p-6 space-y-4">
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-gray-400 font-rajdhani">Subtotal</span>
                <span class="text-white font-rajdhani">{{ cart.subtotal() | currency }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-gray-400 font-rajdhani">Tax (10%)</span>
                <span class="text-white font-rajdhani">{{ cart.tax() | currency }}</span>
              </div>
              <div class="flex justify-between border-t border-white/10 pt-2">
                <span class="font-orbitron text-sm text-white">Total</span>
                <span class="price-tag font-orbitron font-bold text-lg">{{ cart.total() | currency }}</span>
              </div>
            </div>

            <a
              routerLink="/checkout"
              (click)="cart.closeCart()"
              class="btn-primary w-full text-center block py-3 rounded-lg font-orbitron text-sm"
            >
              Proceed to Checkout →
            </a>

            <button
              (click)="cart.clearCart()"
              class="w-full text-xs text-gray-600 hover:text-red-400 transition-colors font-rajdhani"
            >
              Clear Cart
            </button>
          </div>
        }
      </div>
    }
  `
})
export class CartDrawerComponent {
  cart = inject(CartService);

  getItemPrice(item: { game: any; quantity: number }): number {
    const price = item.game.discount_percent > 0
      ? item.game.price * (1 - item.game.discount_percent / 100)
      : item.game.price;
    return price * item.quantity;
  }
}
