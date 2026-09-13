import {
  Component, OnInit, inject, signal, computed
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { CartService } from '../../core/services/cart.service';
import { OrdersService } from '../../core/services/orders.service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [FormsModule, CurrencyPipe],
  template: `
    <div class="min-h-screen pt-24 pb-16">
      <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        <!-- Header -->
        <div class="text-center mb-12">
          <p class="text-cyan-400 font-rajdhani font-semibold uppercase tracking-widest text-sm mb-2">// SECURE CHECKOUT</p>
          <h1 class="font-orbitron font-black text-3xl sm:text-4xl text-white">Complete Your Order</h1>
        </div>

        <!-- Processing Modal -->
        @if (isProcessing()) {
          <div class="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center">
            <div class="glass-card p-10 max-w-md w-full mx-4 text-center">
              <div class="relative w-20 h-20 mx-auto mb-6">
                <div class="absolute inset-0 rounded-full border-2 border-cyan-500/20"></div>
                <div class="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin"></div>
                <div class="absolute inset-3 rounded-full border-t-2 border-purple-400 animate-spin" style="animation-direction: reverse; animation-duration: 1.5s"></div>
                <div class="absolute inset-6 rounded-full bg-cyan-500/10 flex items-center justify-center">
                  <span class="text-cyan-400 text-xs">🔒</span>
                </div>
              </div>
              <p class="font-orbitron text-white font-bold text-lg mb-2">Processing Payment</p>
              <p class="text-cyan-400 font-rajdhani text-sm animate-pulse">{{ processingMessage() }}</p>
              <div class="mt-6 flex gap-1 justify-center">
                @for (i of [1,2,3,4,5]; track i) {
                  <div
                    class="w-2 h-2 rounded-full bg-cyan-400"
                    [style.animation]="'pulse 1.4s ease-in-out ' + (i * 0.2) + 's infinite'"
                  ></div>
                }
              </div>
            </div>
          </div>
        }

        @if (cartService.items().length === 0) {
          <div class="text-center py-24">
            <div class="text-6xl mb-4">🛒</div>
            <p class="font-orbitron text-gray-500 text-lg">Your cart is empty</p>
            <a routerLink="/games" class="btn-primary mt-6 inline-block">Browse Games</a>
          </div>
        } @else {
          <div class="grid lg:grid-cols-[1fr_400px] gap-10">

            <!-- Left: Form -->
            <div class="space-y-8">

              <!-- Customer Info -->
              <div class="glass-card p-6">
                <h2 class="font-orbitron font-bold text-base text-white mb-5 flex items-center gap-2">
                  <span class="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-bold">1</span>
                  Customer Information
                </h2>
                <div class="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label class="text-xs text-gray-500 font-rajdhani uppercase tracking-widest block mb-2">Full Name</label>
                    <input
                      type="text"
                      [(ngModel)]="form.name"
                      placeholder="Alex Mercer"
                      class="cyber-input"
                      id="checkout-name"
                    />
                  </div>
                  <div>
                    <label class="text-xs text-gray-500 font-rajdhani uppercase tracking-widest block mb-2">Email Address</label>
                    <input
                      type="email"
                      [(ngModel)]="form.email"
                      placeholder="alex@nexusforge.io"
                      class="cyber-input"
                      id="checkout-email"
                    />
                  </div>
                </div>
              </div>

              <!-- Card Details -->
              <div class="glass-card p-6">
                <div class="flex items-center justify-between mb-5">
                  <h2 class="font-orbitron font-bold text-base text-white flex items-center gap-2">
                    <span class="w-6 h-6 rounded-full bg-cyan-500/20 text-cyan-400 text-xs flex items-center justify-center font-bold">2</span>
                    Payment Details
                  </h2>
                  <button
                    (click)="demoFill()"
                    class="btn-outline-cyan text-xs px-4 py-1.5"
                    id="demo-fill-btn"
                  >⚡ Demo Fill</button>
                </div>

                <!-- 3D Card Preview -->
                <div class="card-3d-container mb-6 flex justify-center">
                  <div class="credit-card card-3d" [class.flipped]="isCardFlipped()">
                    <!-- Card Front -->
                    <div class="card-face card-front credit-card-face">
                      <div class="flex items-start justify-between mb-8">
                        <div class="w-12 h-8 rounded-sm bg-gradient-to-br from-yellow-300/80 to-yellow-600/80 border border-yellow-400/20"></div>
                        <div class="text-right">
                          <div class="font-orbitron text-xs text-white/60">NEXUS</div>
                          <div class="font-orbitron text-xs text-white/60">FORGE</div>
                        </div>
                      </div>
                      <div class="font-orbitron text-lg text-white tracking-widest mb-4">
                        {{ formattedCardNumber() }}
                      </div>
                      <div class="flex justify-between">
                        <div>
                          <div class="text-xs text-white/40 font-rajdhani uppercase tracking-widest">Card Holder</div>
                          <div class="text-sm text-white font-rajdhani font-semibold">{{ form.name || 'FULL NAME' }}</div>
                        </div>
                        <div>
                          <div class="text-xs text-white/40 font-rajdhani uppercase tracking-widest">Expires</div>
                          <div class="text-sm text-white font-rajdhani font-semibold">{{ form.expiry || 'MM/YY' }}</div>
                        </div>
                      </div>
                    </div>

                    <!-- Card Back -->
                    <div class="card-face card-back credit-card-face">
                      <div class="h-10 bg-black/60 -mx-6 mt-4 mb-4"></div>
                      <div class="flex justify-end items-center gap-3">
                        <div class="flex-1 h-8 bg-white/10 rounded"></div>
                        <div class="w-16 h-8 bg-white rounded flex items-center justify-center">
                          <span class="text-black font-orbitron font-bold text-sm">{{ form.cvv || 'CVV' }}</span>
                        </div>
                      </div>
                      <div class="text-center text-xs text-white/30 font-rajdhani mt-4">AUTHORIZED SIGNATURE</div>
                    </div>
                  </div>
                </div>

                <!-- Card Inputs -->
                <div class="space-y-4">
                  <div>
                    <label class="text-xs text-gray-500 font-rajdhani uppercase tracking-widest block mb-2">Card Number</label>
                    <input
                      type="text"
                      [ngModel]="form.cardNumber"
                      (ngModelChange)="onCardNumberChange($event)"
                      placeholder="1234 5678 9012 3456"
                      maxlength="19"
                      class="cyber-input font-orbitron tracking-widest"
                      id="card-number"
                    />
                  </div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="text-xs text-gray-500 font-rajdhani uppercase tracking-widest block mb-2">Expiry Date</label>
                      <input
                        type="text"
                        [(ngModel)]="form.expiry"
                        (ngModelChange)="onExpiryChange($event)"
                        placeholder="MM/YY"
                        maxlength="5"
                        class="cyber-input font-orbitron"
                        id="card-expiry"
                      />
                    </div>
                    <div>
                      <label class="text-xs text-gray-500 font-rajdhani uppercase tracking-widest block mb-2">CVV</label>
                      <input
                        type="text"
                        [(ngModel)]="form.cvv"
                        placeholder="123"
                        maxlength="4"
                        (focus)="isCardFlipped.set(true)"
                        (blur)="isCardFlipped.set(false)"
                        class="cyber-input font-orbitron"
                        id="card-cvv"
                      />
                    </div>
                  </div>
                </div>

                <!-- Validation Errors -->
                @if (validationError()) {
                  <div class="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-sm font-rajdhani">
                    ⚠ {{ validationError() }}
                  </div>
                }
              </div>

              <!-- Submit -->
              <button
                (click)="submitOrder()"
                [disabled]="isProcessing()"
                class="btn-primary w-full py-4 text-base font-orbitron font-bold"
                id="place-order-btn"
              >
                🔒 Confirm & Pay {{ cartService.total() | currency }}
              </button>

              <p class="text-center text-xs text-gray-600 font-rajdhani">
                🛡️ Simulated checkout — no real payment processed · SSL Encrypted · Digital delivery
              </p>
            </div>

            <!-- Right: Order Summary -->
            <div class="space-y-4">
              <div class="glass-card p-6 sticky top-24">
                <h3 class="font-orbitron font-bold text-sm text-white mb-5">Order Summary</h3>

                <div class="space-y-3 mb-5">
                  @for (item of cartService.items(); track item.game.id) {
                    <div class="flex gap-3 items-center">
                      <img [src]="item.game.thumbnail_url" [alt]="item.game.title" class="w-12 h-12 object-cover rounded-lg flex-shrink-0" />
                      <div class="flex-1 min-w-0">
                        <p class="text-xs text-white font-rajdhani font-semibold truncate">{{ item.game.title }}</p>
                        <p class="text-xs text-gray-600">Qty: {{ item.quantity }}</p>
                      </div>
                      <span class="text-xs text-gray-300 font-rajdhani flex-shrink-0">
                        {{ getItemTotal(item) | currency }}
                      </span>
                    </div>
                  }
                </div>

                <div class="border-t border-white/10 pt-4 space-y-2">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500 font-rajdhani">Subtotal</span>
                    <span class="text-white font-rajdhani">{{ cartService.subtotal() | currency }}</span>
                  </div>
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-500 font-rajdhani">Tax (10%)</span>
                    <span class="text-white font-rajdhani">{{ cartService.tax() | currency }}</span>
                  </div>
                  <div class="flex justify-between font-bold pt-2 border-t border-white/10">
                    <span class="font-orbitron text-sm text-white">Total</span>
                    <span class="price-tag font-orbitron text-lg">{{ cartService.total() | currency }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .credit-card {
      width: 340px;
      height: 200px;
      max-width: 100%;
    }

    .credit-card-face {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 16px;
      padding: 24px;
      background: linear-gradient(135deg, #0d0d2b, #1a0a2e, #0d1a2b);
      border: 1px solid rgba(0,245,255,0.2);
      box-shadow: 0 20px 60px rgba(0,0,0,0.6), 0 0 30px rgba(0,245,255,0.05), inset 0 0 40px rgba(0,245,255,0.02);
      overflow: hidden;

      &::before {
        content: '';
        position: absolute;
        top: -50%;
        left: -50%;
        width: 200%;
        height: 200%;
        background: radial-gradient(circle at 30% 30%, rgba(0,245,255,0.06), transparent 60%),
                    radial-gradient(circle at 80% 80%, rgba(180,0,255,0.06), transparent 60%);
        pointer-events: none;
      }
    }

    :host ::ng-deep [routerLink] { text-decoration: none; }
  `]
})
export class CheckoutComponent {
  cartService = inject(CartService);
  private ordersService = inject(OrdersService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  isProcessing = signal(false);
  isCardFlipped = signal(false);
  validationError = signal('');
  processingMessage = signal('Encrypting transaction...');

  form = {
    name: '',
    email: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  };

  formattedCardNumber = computed(() => {
    const num = this.form.cardNumber.replace(/\D/g, '');
    return num.replace(/(\d{4})(?=\d)/g, '$1 ').trim() || '•••• •••• •••• ••••';
  });

  demoFill() {
    this.form.name = 'Alex Mercer';
    this.form.email = 'alex.mercer@nexusforge.io';
    this.form.cardNumber = '4242 4242 4242 4242';
    this.form.expiry = '12/28';
    this.form.cvv = '420';
    this.validationError.set('');
    this.toastService.info('Demo credentials filled!');
  }

  onCardNumberChange(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 16);
    this.form.cardNumber = digits.replace(/(\d{4})(?=\d)/g, '$1 ');
  }

  onExpiryChange(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    this.form.expiry = digits.length > 2 ? `${digits.slice(0,2)}/${digits.slice(2)}` : digits;
  }

  validate(): boolean {
    if (!this.form.name.trim()) { this.validationError.set('Please enter your full name.'); return false; }
    if (!this.form.email.includes('@')) { this.validationError.set('Please enter a valid email address.'); return false; }
    if (this.form.cardNumber.replace(/\D/g,'').length < 16) { this.validationError.set('Please enter a valid 16-digit card number.'); return false; }
    if (!this.form.expiry.includes('/')) { this.validationError.set('Please enter card expiry (MM/YY).'); return false; }
    if (this.form.cvv.length < 3) { this.validationError.set('Please enter a valid CVV.'); return false; }
    this.validationError.set('');
    return true;
  }

  async submitOrder() {
    if (!this.validate()) return;

    this.isProcessing.set(true);

    const messages = [
      'Encrypting transaction...',
      'Verifying card details...',
      'Processing payment...',
      'Allocating license keys...',
      'Generating digital receipts...',
    ];

    let i = 0;
    const interval = setInterval(() => {
      if (i < messages.length - 1) {
        this.processingMessage.set(messages[++i]);
      }
    }, 800);

    setTimeout(() => {
      clearInterval(interval);

      const payload = {
        customerName: this.form.name,
        customerEmail: this.form.email,
        items: this.cartService.items().map(item => ({
          id: item.game.id,
          slug: item.game.slug,
          title: item.game.title,
          price: item.game.discount_percent > 0
            ? item.game.price * (1 - item.game.discount_percent / 100)
            : item.game.price,
          quantity: item.quantity,
        })),
      };

      this.ordersService.checkout(payload).subscribe({
        next: (order) => {
          this.cartService.clearCart();
          this.isProcessing.set(false);
          this.router.navigate(['/order-success', order.order_number]);
        },
        error: () => {
          this.isProcessing.set(false);
          this.toastService.error('Checkout failed. Please try again.');
        }
      });
    }, 4500);
  }

  getItemTotal(item: { game: any; quantity: number }): number {
    const price = item.game.discount_percent > 0
      ? item.game.price * (1 - item.game.discount_percent / 100)
      : item.game.price;
    return price * item.quantity;
  }
}
