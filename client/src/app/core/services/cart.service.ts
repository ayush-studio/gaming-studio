import { Injectable, signal, computed, effect } from '@angular/core';
import { Game } from '../models/game.model';

export interface CartItem {
  game: Game;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly STORAGE_KEY = 'gaming_studio_cart';

  // ─── Signals ───
  private _items = signal<CartItem[]>(this._loadFromStorage());
  isOpen = signal<boolean>(false);

  // ─── Computed ───
  items = this._items.asReadonly();

  itemCount = computed(() =>
    this._items().reduce((sum, item) => sum + item.quantity, 0)
  );

  subtotal = computed(() =>
    this._items().reduce((sum, item) => {
      const price = item.game.discount_percent > 0
        ? item.game.price * (1 - item.game.discount_percent / 100)
        : item.game.price;
      return sum + price * item.quantity;
    }, 0)
  );

  tax = computed(() => this.subtotal() * 0.1);
  total = computed(() => this.subtotal() + this.tax());

  constructor() {
    // Persist cart to localStorage whenever it changes
    effect(() => {
      const items = this._items();
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(items));
    });
  }

  addItem(game: Game): void {
    const current = this._items();
    const existing = current.find(item => item.game.id === game.id);

    if (existing) {
      this._items.update(items =>
        items.map(item =>
          item.game.id === game.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      this._items.update(items => [...items, { game, quantity: 1 }]);
    }
  }

  removeItem(gameId: number): void {
    this._items.update(items => items.filter(item => item.game.id !== gameId));
  }

  updateQuantity(gameId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(gameId);
      return;
    }
    this._items.update(items =>
      items.map(item =>
        item.game.id === gameId ? { ...item, quantity } : item
      )
    );
  }

  clearCart(): void {
    this._items.set([]);
  }

  openCart(): void {
    this.isOpen.set(true);
  }

  closeCart(): void {
    this.isOpen.set(false);
  }

  toggleCart(): void {
    this.isOpen.update(v => !v);
  }

  isInCart(gameId: number): boolean {
    return this._items().some(item => item.game.id === gameId);
  }

  private _loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }
}
