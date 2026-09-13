import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Game, ApiResponse } from '../models/game.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class GamesService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/games`;

  parseGame(game: Game): Game {
    return {
      ...game,
      screenshots: JSON.parse(game.screenshots_json || '[]'),
      systemReqs: JSON.parse(game.system_reqs_json || '{}'),
      tags: JSON.parse(game.tags_json || '[]'),
      discountedPrice: game.discount_percent > 0
        ? game.price * (1 - game.discount_percent / 100)
        : game.price,
    };
  }

  getGames(params?: {
    genre?: string;
    search?: string;
    sortBy?: string;
    badge?: string;
  }): Observable<Game[]> {
    let httpParams = new HttpParams();
    if (params?.genre && params.genre !== 'All') httpParams = httpParams.set('genre', params.genre);
    if (params?.search) httpParams = httpParams.set('search', params.search);
    if (params?.sortBy) httpParams = httpParams.set('sortBy', params.sortBy);
    if (params?.badge && params.badge !== 'All') httpParams = httpParams.set('badge', params.badge);

    return this.http
      .get<ApiResponse<Game[]>>(this.baseUrl, { params: httpParams })
      .pipe(map(res => res.data.map(g => this.parseGame(g))));
  }

  getGameBySlug(slug: string): Observable<Game> {
    return this.http
      .get<ApiResponse<Game>>(`${this.baseUrl}/${slug}`)
      .pipe(map(res => this.parseGame(res.data)));
  }
}
