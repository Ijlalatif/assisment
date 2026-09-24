import {Seat, Showtime} from '../types';

const SEATS_PER_SIDE = [6, 7, 8, 8, 8, 8, 8, 8, 8, 7];

export const REGULAR_PRICE = 50;
export const VIP_PRICE = 150;

export const SHOWTIMES: Showtime[] = [
  {id: '1230-h1', time: '12:30', hall: 'Cinetech + Hall 1', price: 50, bonus: 2500},
  {id: '1330-h1', time: '13:30', hall: 'Cinetech', price: 75, bonus: 3000},
  {id: '1500-h2', time: '15:00', hall: 'Cinetech + Hall 2', price: 50, bonus: 2000},
];

export function buildSeatRows(): Seat[][] {
  return SEATS_PER_SIDE.map((count, index) => {
    const row = index + 1;
    const seats: Seat[] = [];
    const vip = row >= 8;
    for (let number = 1; number <= count * 2; number += 1) {
      const taken = !vip && (row * 3 + number * 5) % 11 === 0;
      seats.push({
        row,
        number,
        status: taken ? 'taken' : vip ? 'vip' : 'regular',
      });
    }
    return seats;
  });
}

export function seatPrice(status: Seat['status']) {
  return status === 'vip' ? VIP_PRICE : REGULAR_PRICE;
}

export function nextDates(count = 6) {
  return Array.from({length: count}, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() + index);
    return date;
  });
}
