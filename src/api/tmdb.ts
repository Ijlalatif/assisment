import {TMDB_API_KEY, TMDB_BASE_URL, TMDB_IMAGE_BASE} from '../config/tmdb';
import {Movie, MovieDetails, MovieImage, MovieVideo, Paged} from '../types';

type ErrorBody = {status_message?: string};

async function request<T>(
  path: string,
  params: Record<string, string> = {},
): Promise<T> {
  const query = new URLSearchParams({api_key: TMDB_API_KEY, ...params});
  const response = await fetch(`${TMDB_BASE_URL}${path}?${query.toString()}`);
  const json = (await response.json()) as T & ErrorBody;
  if (!response.ok) {
    throw new Error(json.status_message || 'Could not reach The Movie Database.');
  }
  return json;
}

export function imageUrl(path: string | null, size = 'w500') {
  if (!path) {
    return null;
  }
  return `${TMDB_IMAGE_BASE}/${size}${path}`;
}

export function getUpcoming(page = 1) {
  return request<Paged<Movie>>('/movie/upcoming', {page: String(page)});
}

export function searchMovies(query: string, page = 1) {
  return request<Paged<Movie>>('/search/movie', {
    query,
    page: String(page),
    include_adult: 'false',
  });
}

export function discoverByGenre(genreId: number, page = 1) {
  return request<Paged<Movie>>('/discover/movie', {
    with_genres: String(genreId),
    sort_by: 'popularity.desc',
    page: String(page),
  });
}

export function getMovie(id: number) {
  return request<MovieDetails>(`/movie/${id}`);
}

export function getImages(id: number) {
  return request<{backdrops: MovieImage[]; posters: MovieImage[]}>(
    `/movie/${id}/images`,
  );
}

export function getVideos(id: number) {
  return request<{results: MovieVideo[]}>(`/movie/${id}/videos`);
}

export function pickTrailer(videos: MovieVideo[]) {
  const youtube = videos.filter(video => video.site === 'YouTube' && video.key);
  return (
    youtube.find(video => video.type === 'Trailer' && video.official) ??
    youtube.find(video => video.type === 'Trailer') ??
    youtube[0] ??
    null
  );
}
