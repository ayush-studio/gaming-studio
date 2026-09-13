import {
  Component, OnInit, inject, signal
} from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CurrencyPipe, DatePipe } from '@angular/common';
import { OrdersService } from '../../core/services/orders.service';
import { Order } from '../../core/models/order.model';

@Component({
  selector: 'app-order-success',
  standalone: true,
  imports: [RouterLink, CurrencyPipe, DatePipe],
  template: `
    <div class="min-h-screen pt-24 pb-16 relative overflow-hidden">

      <!-- Ambient effects -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-green-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div class="absolute inset-0 cyber-grid-bg opacity-20 pointer-events-none"></div>

      @if (isLoading()) {
        <div class="flex items-center justify-center min-h-[60vh]">
          <div class="cyber-spinner"></div>
        </div>
      }

      @if (!isLoading() && order()) {
        <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-fade-in-up">

          <!-- Success Header -->
          <div class="text-center mb-12">
            <div class="w-20 h-20 mx-auto mb-6 relative">
              <div class="absolute inset-0 rounded-full border-2 border-green-400/30 animate-ping"></div>
              <div class="w-20 h-20 rounded-full bg-green-500/10 border border-green-400/40 flex items-center justify-center">
                <svg class="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
                </svg>
              </div>
            </div>
            <p class="text-green-400 font-rajdhani font-semibold uppercase tracking-widest text-sm mb-2">// ORDER COMPLETE</p>
            <h1 class="font-orbitron font-black text-4xl sm:text-5xl text-white mb-3">
              Payment <span class="neon-text-green">Confirmed!</span>
            </h1>
            <p class="text-gray-400 font-inter">
              Your games are ready. License keys are below.
            </p>
          </div>

          <!-- Order Details Card -->
          <div class="glass-card p-8 mb-8">
            <div class="flex flex-wrap items-start justify-between gap-6 mb-8">
              <div>
                <p class="text-xs text-gray-500 font-rajdhani uppercase tracking-widest mb-1">Order Number</p>
                <p class="font-orbitron font-bold text-lg neon-text-cyan">{{ order()!.order_number }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-rajdhani uppercase tracking-widest mb-1">Customer</p>
                <p class="text-white font-rajdhani font-semibold">{{ order()!.customer_name }}</p>
                <p class="text-gray-500 text-sm font-inter">{{ order()!.customer_email }}</p>
              </div>
              <div>
                <p class="text-xs text-gray-500 font-rajdhani uppercase tracking-widest mb-1">Date</p>
                <p class="text-white font-rajdhani">{{ (order()!.created_at || order()!.createdAt) | date:'mediumDate' }}</p>
              </div>
              <div class="text-right">
                <p class="text-xs text-gray-500 font-rajdhani uppercase tracking-widest mb-1">Total Paid</p>
                <p class="price-tag font-orbitron font-black text-2xl">{{ order()!.total_amount || order()!.total | currency }}</p>
              </div>
            </div>

            <!-- Purchased Games + License Keys -->
            <div>
              <h3 class="font-orbitron font-bold text-sm text-white mb-5 pb-3 border-b border-white/10">
                🎮 Your Games & License Keys
              </h3>

              <div class="space-y-4">
                @for (item of order()!.items; track item.id; let i = $index) {
                  <div class="glass-card p-5">
                    <div class="flex items-start justify-between gap-4">
                      <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                          <h4 class="font-rajdhani font-bold text-white">{{ item.title }}</h4>
                          <span class="text-xs text-gray-600 font-rajdhani">× {{ item.quantity }}</span>
                        </div>
                        <p class="text-xs text-gray-500 font-inter">{{ item.price | currency }} each</p>
                      </div>
                      <span class="font-orbitron font-bold text-sm neon-text-green">
                        {{ (item.price * item.quantity) | currency }}
                      </span>
                    </div>

                    <!-- Scratch-off Key Reveal -->
                    @if (item.licenseKey) {
                      <div class="mt-4">
                        <p class="text-xs text-gray-600 font-rajdhani uppercase tracking-widest mb-2">License Key</p>
                        <div
                          class="scratch-card"
                          [class.revealed]="revealedKeys().has(i)"
                          (click)="revealKey(i)"
                          [id]="'key-card-' + i"
                        >
                          <div class="bg-black/40 border border-white/10 rounded-xl p-4">
                            <div class="key-content font-orbitron text-sm tracking-wider">
                              {{ revealedKeys().has(i) ? item.licenseKey : '████-████-████-████' }}
                            </div>
                          </div>

                          @if (!revealedKeys().has(i)) {
                            <div class="scratch-overlay rounded-xl">
                              <div class="text-center">
                                <div class="text-2xl mb-2">🎁</div>
                                <p class="text-xs text-gray-400 font-rajdhani">Tap to reveal key</p>
                              </div>
                            </div>
                          }

                          @if (revealedKeys().has(i)) {
                            <div class="flex gap-2 mt-2">
                              <button
                                (click)="copyKey(item.licenseKey!, i, $event)"
                                class="flex-1 text-xs py-2 rounded-lg bg-green-500/10 border border-green-500/30 text-green-400 font-rajdhani font-semibold hover:bg-green-500/20 transition-all"
                                [id]="'copy-key-' + i"
                              >
                                {{ copiedKeys().has(i) ? '✓ Copied!' : '📋 Copy Key' }}
                              </button>
                            </div>
                          }
                        </div>
                      </div>
                    }
                  </div>
                }
              </div>
            </div>

            <!-- Totals -->
            <div class="mt-6 pt-6 border-t border-white/10">
              <div class="max-w-xs ml-auto space-y-2">
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500 font-rajdhani">Subtotal</span>
                  <span class="text-white font-rajdhani">{{ getSubtotal() | currency }}</span>
                </div>
                <div class="flex justify-between text-sm">
                  <span class="text-gray-500 font-rajdhani">Tax (10%)</span>
                  <span class="text-white font-rajdhani">{{ getTax() | currency }}</span>
                </div>
                <div class="flex justify-between pt-2 border-t border-white/10">
                  <span class="font-orbitron font-bold text-sm text-white">Total</span>
                  <span class="price-tag font-orbitron font-bold text-lg">{{ order()!.total_amount || order()!.total | currency }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex flex-wrap gap-4 justify-center">
            <a routerLink="/games" class="btn-outline-cyan px-8 py-3">
              ← Continue Shopping
            </a>
            <button
              (click)="printReceipt()"
              class="btn-outline-purple px-8 py-3"
              id="print-receipt-btn"
            >
              🖨️ Print Receipt
            </button>
          </div>

          <!-- Tips -->
          <div class="mt-10 glass-card p-6 text-center">
            <p class="text-xs text-gray-500 font-rajdhani leading-relaxed">
              📧 A copy of this receipt has been sent to <span class="text-gray-300">{{ order()!.customer_email }}</span>
              <span class="text-gray-600 mx-2">·</span>
              🔑 Keep your license keys safe
              <span class="text-gray-600 mx-2">·</span>
              💬 Need help? Contact support&#64;nexusforge.io
            </p>
          </div>

        </div>
      }
    </div>
  `,
  styles: [`
    .scratch-card {
      position: relative;
      cursor: pointer;
    }
    .scratch-overlay {
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, #1a1a2e, #16213e, #0f3460);
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid rgba(0,245,255,0.1);
      transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
      cursor: pointer;
    }
    .scratch-card.revealed .scratch-overlay {
      transform: scale(0) rotate(15deg);
      opacity: 0;
    }
    .key-content {
      color: #00ff88;
      text-shadow: 0 0 10px rgba(0,255,136,0.5);
      letter-spacing: 0.15em;
    }
  `]
})
export class OrderSuccessComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private ordersService = inject(OrdersService);

  order = signal<Order | null>(null);
  isLoading = signal(true);
  revealedKeys = signal<Set<number>>(new Set());
  copiedKeys = signal<Set<number>>(new Set());

  ngOnInit() {
    const orderNumber = this.route.snapshot.paramMap.get('orderNumber')!;
    this.ordersService.getOrder(orderNumber).subscribe({
      next: (order) => {
        this.order.set(order);
        this.isLoading.set(false);
      },
      error: () => {
        this.isLoading.set(false);
      }
    });
  }

  revealKey(index: number) {
    const current = new Set(this.revealedKeys());
    current.add(index);
    this.revealedKeys.set(current);
  }

  copyKey(key: string, index: number, event: Event) {
    event.stopPropagation();
    navigator.clipboard.writeText(key).then(() => {
      const current = new Set(this.copiedKeys());
      current.add(index);
      this.copiedKeys.set(current);
      setTimeout(() => {
        const updated = new Set(this.copiedKeys());
        updated.delete(index);
        this.copiedKeys.set(updated);
      }, 2000);
    });
  }

  printReceipt() {
    window.print();
  }

  getSubtotal(): number {
    const order = this.order();
    if (!order) return 0;
    return order.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }

  getTax(): number {
    return this.getSubtotal() * 0.1;
  }
}
