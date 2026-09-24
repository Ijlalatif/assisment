export type Movie = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  genre_ids?: number[];
};

export type MovieDetails = {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  runtime: number | null;
  status: string;
  genres: {id: number; name: string}[];
};

export type MovieImage = {
  file_path: string;
  width: number;
  height: number;
};

export type MovieVideo = {
  key: string;
  site: string;
  type: string;
  official: boolean;
  name: string;
};

export type Paged<T> = {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
};

export type SeatStatus = 'regular' | 'vip' | 'taken';

export type Seat = {
  row: number;
  number: number;
  status: SeatStatus;
};

export type Showtime = {
  id: string;
  time: string;
  hall: string;
  price: number;
  bonus: number;
};

export type Booking = {
  id: string;
  movieId: number;
  title: string;
  dateLabel: string;
  time: string;
  hall: string;
  seats: string[];
  total: number;
};
