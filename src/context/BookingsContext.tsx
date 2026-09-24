import {createContext, useContext, useMemo, useState, ReactNode} from 'react';
import {Booking} from '../types';

type BookingsContextValue = {
  bookings: Booking[];
  addBooking: (booking: Booking) => void;
};

const BookingsContext = createContext<BookingsContextValue | null>(null);

export function BookingsProvider({children}: {children: ReactNode}) {
  const [bookings, setBookings] = useState<Booking[]>([]);

  const value = useMemo(
    () => ({
      bookings,
      addBooking: (booking: Booking) => {
        setBookings(current => [booking, ...current]);
      },
    }),
    [bookings],
  );

  return (
    <BookingsContext.Provider value={value}>{children}</BookingsContext.Provider>
  );
}

export function useBookings() {
  const value = useContext(BookingsContext);
  if (!value) {
    throw new Error('useBookings must be used within BookingsProvider');
  }
  return value;
}
