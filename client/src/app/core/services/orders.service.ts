import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Order, CheckoutPayload } from '../models/order.model';
import { ApiResponse } from '../models/game.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OrdersService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/orders`;

  checkout(payload: CheckoutPayload): Observable<Order> {
    return this.http
      .post<ApiResponse<Order>>(`${this.baseUrl}/checkout`, payload)
      .pipe(map(res => res.data));
  }

  getOrder(orderNumber: string): Observable<Order> {
    return this.http
      .get<ApiResponse<Order>>(`${this.baseUrl}/${orderNumber}`)
      .pipe(map(res => {
        const data = res.data as any;
        return {
          ...data,
          items: typeof data.items_json === 'string'
            ? JSON.parse(data.items_json)
            : (data.items || [])
        } as Order;
      }));
  }
}
