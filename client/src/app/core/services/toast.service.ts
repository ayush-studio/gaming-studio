import { Injectable, signal } from '@angular/core';

export interface Toast {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
  icon: string;
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  toasts = signal<Toast[]>([]);

  show(message: string, type: 'success' | 'error' | 'info' = 'success', duration = 3000): void {
    const id = Math.random().toString(36).slice(2);
    const icons = { success: '✓', error: '✗', info: 'ℹ' };
    const toast: Toast = { id, message, type, icon: icons[type] };

    this.toasts.update(t => [...t, toast]);

    setTimeout(() => {
      this.toasts.update(t => t.filter(x => x.id !== id));
    }, duration);
  }

  success(message: string): void { this.show(message, 'success'); }
  error(message: string): void { this.show(message, 'error'); }
  info(message: string): void { this.show(message, 'info'); }

  dismiss(id: string): void {
    this.toasts.update(t => t.filter(x => x.id !== id));
  }
}
