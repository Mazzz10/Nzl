export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
}

export interface Review {
  id: string;
  author: string;
  avatar: string;
  rating: number;
  comment: string;
  date: string;
}

export interface RoomType {
  id: string;
  name: string;
  bedType: string;
  maxGuests: number;
  pricePerNight: number;
  image: string;
  description: string;
  amenities: string[];
}

export interface Hotel {
  id: string;
  name: string;
  location: string;
  stars: number;
  pricePerNight: number;
  originalPricePerNight?: number;
  description: string;
  amenities: string[];
  reviewCount: number;
  rating: number;
  images: string[];
  roomTypes: RoomType[];
  reviews: Review[];
}

export interface Booking {
  id: string;
  hotelId: string;
  hotelName: string;
  checkIn: string;
  checkOut: string;
  roomName: string;
  guests: number;
  totalAmount: number;
  status: 'Confirmed' | 'Completed' | 'Cancelled';
  bookingDate: string;
  image: string;
}

export interface SearchParams {
  destination: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  adults?: number;
  children?: number;
  rooms?: number;
}

export interface AddOn {
  id: string;
  name: string;
  price: number;
  type: 'per_night' | 'per_stay';
}
