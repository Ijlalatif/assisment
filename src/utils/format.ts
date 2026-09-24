import {Movie} from '../types';

const GENRES: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
};

export function genreName(movie: Movie) {
  const id = movie.genre_ids?.[0];
  if (!id) {
    return 'Movie';
  }
  return GENRES[id] ?? 'Movie';
}

export function formatLongDate(iso: string) {
  if (!iso) {
    return 'Coming soon';
  }
  const date = new Date(`${iso}T00:00:00`);
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatShortDate(date: Date) {
  const day = date.getDate();
  const month = date.toLocaleDateString('en-US', {month: 'short'});
  return `${day} ${month}`;
}

export function formatSeatDate(date: Date) {
  return date.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export function runtimeLabel(minutes: number | null) {
  if (!minutes) {
    return '';
  }
  const hours = Math.floor(minutes / 60);
  const rest = minutes % 60;
  if (!hours) {
    return `${rest}m`;
  }
  return `${hours}h ${rest}m`;
}
