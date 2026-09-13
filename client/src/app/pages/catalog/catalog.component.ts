import {
  Component, OnInit, inject, signal, computed, DestroyRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GamesService } from '../../core/services/games.service';
import { Game } from '../../core/models/game.model';
import { GameCardComponent } from '../../shared/components/game-card/game-card.component';
import { Subject, debounceTime, distinctUntilChanged } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

const GENRES = ['All', 'Racing', 'Strategy', 'Action', 'Simulation', 'RPG', 'Puzzle', 'Horror', 'Adventure'];
const BADGES = ['All', 'Trending', 'New Release', "Editor's Choice"];
const SORT_OPTIONS = [
  { value: 'rating', label: 'Top Rated' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'release', label: 'Latest First' },
];

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [FormsModule, GameCardComponent],
  template: `
    <div class="min-h-screen pt-20">

      <!-- Page Header -->
      <div class="relative py-16 overflow-hidden">
        <div class="absolute inset-0 bg-gradient-to-b from-black via-cyber-dark to-transparent"></div>
        <div class="absolute inset-0 cyber-grid-bg opacity-20"></div>
        <div class="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-32 bg-cyan-500/10 rounded-full blur-3xl"></div>

        <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p class="text-cyan-400 font-rajdhani font-semibold uppercase tracking-widest text-sm mb-3">// GAME CATALOG</p>
          <h1 class="font-orbitron font-black text-4xl sm:text-5xl text-white mb-4">
            All <span class="gradient-text">12 Games</span>
          </h1>
          <p class="text-gray-500 font-inter max-w-lg mx-auto">
            Browse our complete collection of indie titles spanning every genre.
          </p>
        </div>
      </div>

      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">

        <!-- Controls Row -->
        <div class="flex flex-col md:flex-row gap-4 mb-8">
          <!-- Search -->
          <div class="flex-1 relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
            </svg>
            <input
              type="text"
              [(ngModel)]="searchQuery"
              (ngModelChange)="onSearch($event)"
              placeholder="Search games, genres, tags..."
              class="cyber-input pl-10"
              id="catalog-search"
            />
          </div>

          <!-- Sort -->
          <select
            [(ngModel)]="selectedSort"
            (ngModelChange)="fetchGames()"
            class="cyber-input md:w-52 cursor-pointer"
            id="catalog-sort"
          >
            @for (opt of sortOptions; track opt.value) {
              <option [value]="opt.value">{{ opt.label }}</option>
            }
          </select>

          <!-- Filter Toggle -->
          <button
            (click)="toggleFilter()"
            class="btn-outline-cyan px-4 py-2 flex items-center gap-2 whitespace-nowrap"
            id="filter-toggle-btn"
          >
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 4a1 1 0 011-1h16a1 1 0 010 2H4a1 1 0 01-1-1zm3 6a1 1 0 011-1h10a1 1 0 010 2H7a1 1 0 01-1-1zm3 6a1 1 0 011-1h4a1 1 0 010 2h-4a1 1 0 01-1-1z"/>
            </svg>
            Filters
            @if (activeFilterCount() > 0) {
              <span class="w-5 h-5 bg-cyan-500 text-black rounded-full text-xs font-bold flex items-center justify-center">
                {{ activeFilterCount() }}
              </span>
            }
          </button>
        </div>

        <!-- Filter Drawer -->
        @if (filterOpen()) {
          <div class="glass-card p-6 mb-8 animate-fade-in-up">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">

              <!-- Genre Filter -->
              <div>
                <h4 class="font-rajdhani font-semibold text-sm text-gray-400 uppercase tracking-widest mb-3">Genre</h4>
                <div class="flex flex-wrap gap-2">
                  @for (genre of genres; track genre) {
                    <button
                      (click)="selectGenre(genre)"
                      class="px-3 py-1.5 rounded-lg text-xs font-rajdhani font-semibold transition-all"
                      [class.active-filter]="selectedGenre() === genre"
                      [class.inactive-filter]="selectedGenre() !== genre"
                    >{{ genre }}</button>
                  }
                </div>
              </div>

              <!-- Badge Filter -->
              <div>
                <h4 class="font-rajdhani font-semibold text-sm text-gray-400 uppercase tracking-widest mb-3">Badge</h4>
                <div class="flex flex-wrap gap-2">
                  @for (badge of badgeOptions; track badge) {
                    <button
                      (click)="selectBadge(badge)"
                      class="px-3 py-1.5 rounded-lg text-xs font-rajdhani font-semibold transition-all"
                      [class.active-filter]="selectedBadge() === badge"
                      [class.inactive-filter]="selectedBadge() !== badge"
                    >{{ badge }}</button>
                  }
                </div>
              </div>

              <!-- Price Range -->
              <div>
                <h4 class="font-rajdhani font-semibold text-sm text-gray-400 uppercase tracking-widest mb-3">
                  Max Price: <span class="text-cyan-400">{{ maxPrice() === 70 ? 'Any' : '$' + maxPrice() }}</span>
                </h4>
                <input
                  type="range"
                  [ngModel]="maxPrice()"
                  (ngModelChange)="onPriceChange($event)"
                  min="5" max="70" step="5"
                  class="w-full"
                />
                <div class="flex justify-between text-xs text-gray-600 mt-1 font-rajdhani">
                  <span>$5</span>
                  <span>$70+</span>
                </div>
              </div>
            </div>

            <!-- Reset -->
            <div class="mt-4 pt-4 border-t border-white/5 flex justify-end">
              <button (click)="resetFilters()" class="text-xs text-gray-500 hover:text-red-400 transition-colors font-rajdhani">
                ✕ Reset Filters
              </button>
            </div>
          </div>
        }

        <!-- Results Info -->
        <div class="flex items-center justify-between mb-6">
          <p class="text-gray-500 text-sm font-rajdhani">
            Showing <span class="text-white font-semibold">{{ filteredGames().length }}</span> games
          </p>
          @if (isLoading()) {
            <div class="cyber-spinner w-5 h-5 border-2"></div>
          }
        </div>

        <!-- Game Grid -->
        @if (isLoading()) {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (i of [1,2,3,4,5,6,7,8]; track i) {
              <div class="rounded-2xl bg-white/5 animate-pulse h-72"></div>
            }
          </div>
        } @else if (filteredGames().length === 0) {
          <div class="text-center py-24">
            <div class="text-6xl mb-4">🔍</div>
            <p class="font-orbitron text-gray-500">No games found</p>
            <p class="text-gray-600 text-sm mt-2">Try adjusting your filters</p>
            <button (click)="resetFilters()" class="btn-outline-cyan mt-6 text-sm">Clear Filters</button>
          </div>
        } @else {
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            @for (game of filteredGames(); track game.id) {
              <app-game-card [game]="game" />
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .active-filter {
      background: rgba(0,245,255,0.15);
      color: #00f5ff;
      border: 1px solid rgba(0,245,255,0.4);
    }
    .inactive-filter {
      background: rgba(255,255,255,0.03);
      color: #6b7280;
      border: 1px solid rgba(255,255,255,0.06);
      &:hover {
        color: #fff;
        border-color: rgba(255,255,255,0.15);
      }
    }
    select {
      background: rgba(255,255,255,0.05);
      option { background: #0a0a12; }
    }
  `]
})
export class CatalogComponent implements OnInit {
  private gamesService = inject(GamesService);
  private destroyRef = inject(DestroyRef);
  private searchSubject = new Subject<string>();

  genres = GENRES;
  badgeOptions = BADGES;
  sortOptions = SORT_OPTIONS;

  allGames = signal<Game[]>([]);
  isLoading = signal(true);
  filterOpen = signal(false);

  selectedGenre = signal('All');
  selectedBadge = signal('All');
  selectedSort = 'rating';
  maxPrice = signal(70);
  searchQuery = '';

  filteredGames = computed(() => {
    const games = this.allGames();
    const genre = this.selectedGenre();
    const badge = this.selectedBadge();
    const price = this.maxPrice();

    return games.filter(g => {
      const priceToCheck = g.discount_percent > 0
        ? g.price * (1 - g.discount_percent / 100)
        : g.price;
      return (genre === 'All' || g.genre === genre)
        && (badge === 'All' || g.badge === badge)
        && (price === 70 || priceToCheck <= price);
    });
  });

  activeFilterCount = computed(() => {
    let count = 0;
    if (this.selectedGenre() !== 'All') count++;
    if (this.selectedBadge() !== 'All') count++;
    if (this.maxPrice() < 70) count++;
    return count;
  });

  ngOnInit() {
    this.searchSubject.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(() => this.fetchGames());

    this.fetchGames();
  }

  fetchGames() {
    this.isLoading.set(true);
    this.gamesService.getGames({
      search: this.searchQuery || undefined,
      sortBy: this.selectedSort,
    }).subscribe(games => {
      this.allGames.set(games);
      this.isLoading.set(false);
    });
  }

  onSearch(value: string) {
    this.searchQuery = value;
    this.searchSubject.next(value);
  }

  selectGenre(genre: string) {
    this.selectedGenre.set(genre);
  }

  selectBadge(badge: string) {
    this.selectedBadge.set(badge);
  }

  onPriceChange(value: number) {
    this.maxPrice.set(Number(value));
  }

  resetFilters() {
    this.selectedGenre.set('All');
    this.selectedBadge.set('All');
    this.maxPrice.set(70);
    this.searchQuery = '';
    this.fetchGames();
  }

  toggleFilter() {
    this.filterOpen.update(v => !v);
  }
}
