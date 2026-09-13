import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="toast-container">
      @for (toast of toastService.toasts(); track toast.id) {
        <div
          class="toast"
          [class.toast-success]="toast.type === 'success'"
          [class.toast-error]="toast.type === 'error'"
          [class.toast-info]="toast.type === 'info'"
        >
          <span class="toast-icon" [class.icon-success]="toast.type === 'success'" [class.icon-error]="toast.type === 'error'" [class.icon-info]="toast.type === 'info'">
            {{ toast.icon }}
          </span>
          <span class="text-sm font-rajdhani text-white font-medium">{{ toast.message }}</span>
          <button
            (click)="toastService.dismiss(toast.id)"
            class="ml-auto text-gray-500 hover:text-white transition-colors text-xs"
          >✕</button>
        </div>
      }
    </div>
  `,
  styles: [`
    .toast-success { border-color: rgba(0, 255, 136, 0.4) !important; }
    .toast-error { border-color: rgba(255, 0, 80, 0.4) !important; }
    .toast-info { border-color: rgba(0, 245, 255, 0.4) !important; }
    .toast-icon {
      width: 24px; height: 24px;
      border-radius: 50%;
      display: flex; align-items: center; justify-content: center;
      font-size: 0.75rem; font-weight: bold; flex-shrink: 0;
    }
    .icon-success { background: rgba(0,255,136,0.2); color: #00ff88; }
    .icon-error { background: rgba(255,0,80,0.2); color: #ff0050; }
    .icon-info { background: rgba(0,245,255,0.2); color: #00f5ff; }
  `]
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
