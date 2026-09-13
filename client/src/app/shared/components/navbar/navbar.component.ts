import { Component, inject, HostListener, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
  template: `
    <header
      class="fixed top-0 left-0 right-0 z-40 transition-all duration-300"
      [class.scrolled]="isScrolled()"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav class="flex items-center justify-between h-16">

          <!-- Logo -->
          <a routerLink="/" class="flex items-center gap-3 group">
            <div class="w-8 h-8 relative">
              <div class="absolute inset-0 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-lg rotate-45 group-hover:rotate-90 transition-transform duration-500"></div>
              <div class="absolute inset-1 bg-cyber-black rounded-sm rotate-45 flex items-center justify-center">
                <span class="text-neon-cyan text-xs font-orbitron font-bold -rotate-45">GS</span>
              </div>
            </div>
            <span class="font-orbitron font-bold text-lg gradient-text hidden sm:block">
              NEXUS FORGE
            </span>
          </a>

          <!-- Nav Links -->
          <div class="hidden md:flex items-center gap-1">
            <a
              routerLink="/"
              routerLinkActive="nav-link-active"
              [routerLinkActiveOptions]="{exact: true}"
              class="nav-link"
            >Home</a>
            <a
              routerLink="/games"
              routerLinkActive="nav-link-active"
              class="nav-link"
            >Games</a>
            <a
              routerLink="/studio"
              routerLinkActive="nav-link-active"
              class="nav-link"
            >Studio</a>
            <a
              routerLink="/blog"
              routerLinkActive="nav-link-active"
              class="nav-link"
            >Blog</a>
          </div>

          <!-- Cart Button -->
          <div class="flex items-center gap-3">
            <button
              (click)="cart.openCart()"
              class="relative flex items-center gap-2 px-4 py-2 rounded-lg border border-cyan-500/30 bg-cyan-500/5 text-cyan-400 hover:bg-cyan-500/10 hover:border-cyan-500/60 transition-all duration-300 group"
              id="cart-open-btn"
            >
              <!-- Cart Icon SVG -->
              <svg class="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
              <span class="font-rajdhani font-semibold text-sm hidden sm:block">Cart</span>
              @if (cart.itemCount() > 0) {
                <span class="absolute -top-2 -right-2 w-5 h-5 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-full text-black text-xs font-bold flex items-center justify-center animate-pulse-neon">
                  {{ cart.itemCount() }}
                </span>
              }
            </button>

            <!-- Mobile Menu Button -->
            <button
              (click)="toggleMobileMenu()"
              class="md:hidden text-gray-400 hover:text-white p-2"
            >
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  [attr.d]="mobileMenuOpen() ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'"
                />
              </svg>
            </button>
          </div>
        </nav>

        <!-- Mobile Menu -->
        @if (mobileMenuOpen()) {
          <div class="md:hidden glass-card mb-4 p-4 flex flex-col gap-2">
            <a routerLink="/" class="nav-link" (click)="mobileMenuOpen.set(false)">Home</a>
            <a routerLink="/games" class="nav-link" (click)="mobileMenuOpen.set(false)">Games</a>
            <a routerLink="/studio" class="nav-link" (click)="mobileMenuOpen.set(false)">Studio</a>
            <a routerLink="/blog" class="nav-link" (click)="mobileMenuOpen.set(false)">Blog</a>
          </div>
        }
      </div>
    </header>
  `,
  styles: [`
    header {
      background: transparent;
      &.scrolled {
        background: rgba(5, 5, 8, 0.9);
        backdrop-filter: blur(16px);
        border-bottom: 1px solid rgba(0, 245, 255, 0.1);
        box-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
      }
    }
    .nav-link {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 0.875rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #8892aa;
      padding: 0.5rem 1rem;
      border-radius: 6px;
      transition: all 0.2s ease;
      text-decoration: none;
      display: block;
      &:hover {
        color: #00f5ff;
        background: rgba(0, 245, 255, 0.05);
      }
    }
    .nav-link-active {
      color: #00f5ff !important;
      background: rgba(0, 245, 255, 0.08) !important;
      text-shadow: 0 0 8px rgba(0, 245, 255, 0.4);
    }
  `]
})
export class NavbarComponent {
  cart = inject(CartService);
  isScrolled = signal(false);
  mobileMenuOpen = signal(false);

  @HostListener('window:scroll')
  onScroll() {
    this.isScrolled.set(window.scrollY > 20);
  }

  toggleMobileMenu() {
    this.mobileMenuOpen.update(v => !v);
  }
}
