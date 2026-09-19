export interface Game {
  id: number;
  slug: string;
  title: string;
  genre: string;
  tagline: string;
  description: string;
  price: number;
  discount_percent: number;
  rating: number;
  badge: string;
  thumbnail_url: string;
  trailer_url: string;
  screenshots_json?: string;
  system_reqs_json?: string;
  tags_json?: string;
  release_date: string;
  // Parsed helpers (populated on the client)
  screenshots?: string[];
  systemReqs?: SystemRequirements;
  tags?: string[];
  discountedPrice?: number;
}

export interface SystemRequirements {
  os: string;
  cpu: string;
  gpu: string;
  ram: string;
  storage: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}
