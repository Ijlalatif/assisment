import {NavigatorScreenParams} from '@react-navigation/native';

export type TabParamList = {
  Dashboard: undefined;
  Watch: undefined;
  MediaLibrary: undefined;
  More: undefined;
};

export type RootStackParamList = {
  Tabs: NavigatorScreenParams<TabParamList> | undefined;
  MovieDetail: {movieId: number};
  Trailer: {videoKey: string; title: string};
  Showtimes: {movieId: number; title: string; releaseDate: string};
  SeatMap: {
    movieId: number;
    title: string;
    dateLabel: string;
    time: string;
    hall: string;
  };
};
