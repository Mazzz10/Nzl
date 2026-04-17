import { Hotel, Destination, Booking } from '../types';

export const trendingDestinations: Destination[] = [
  { id: '1', name: 'Paris', country: 'France', image: 'bg-gradient-to-tr from-blue-900 to-amber-200' },
  { id: '2', name: 'Bali', country: 'Indonesia', image: 'bg-gradient-to-tr from-emerald-800 to-teal-400' },
  { id: '3', name: 'Tokyo', country: 'Japan', image: 'bg-gradient-to-tr from-rose-700 to-orange-300' },
  { id: '4', name: 'Santorini', country: 'Greece', image: 'bg-gradient-to-tr from-sky-600 to-indigo-900' },
  { id: '5', name: 'New York', country: 'USA', image: 'bg-gradient-to-tr from-slate-700 to-slate-400' },
  { id: '6', name: 'Dubai', country: 'UAE', image: 'bg-gradient-to-tr from-yellow-700 to-amber-500' },
];

export const sampleHotels: Hotel[] = [
  {
    id: 'h1',
    name: 'Le Meurice',
    location: 'Paris, France',
    stars: 5,
    pricePerNight: 850,
    description: 'A magical, calm, and elegant sanctuary in the heart of Paris. Le Meurice stands as a jewel of French palace hotels, blending 18th-century opulence with contemporary chic.',
    amenities: ['Spa', 'Restaurant', 'Gym', 'Free WiFi', 'Pet Friendly'],
    reviewCount: 342,
    rating: 4.9,
    images: [
      'bg-gradient-to-br from-stone-800 to-stone-400',
      'bg-gradient-to-br from-amber-700 to-amber-300',
      'bg-gradient-to-br from-blue-900 to-blue-500'
    ],
    roomTypes: [
      {
        id: 'r1',
        name: 'Superior Room',
        bedType: 'Queen Bed',
        maxGuests: 2,
        pricePerNight: 850,
        image: 'bg-gradient-to-r from-stone-400 to-stone-300',
        description: 'Elegant room with courtyard views.',
        amenities: ['Marble bathroom', 'Minibar', 'City view']
      },
      {
        id: 'r2',
        name: 'Deluxe Room',
        bedType: 'King Bed',
        maxGuests: 3,
        pricePerNight: 1200,
        image: 'bg-gradient-to-r from-stone-500 to-stone-400',
        description: 'Spacious room with classic Parisian decor.',
        amenities: ['Marble bathroom', 'Sitting area', 'Street view']
      },
      {
        id: 'r3',
        name: 'Prestige Suite',
        bedType: 'King Bed',
        maxGuests: 4,
        pricePerNight: 2500,
        image: 'bg-gradient-to-r from-stone-600 to-stone-500',
        description: 'Luxurious suite with separate living area and Tuileries Garden views.',
        amenities: ['Separate living room', 'Garden view', 'Butler service']
      }
    ],
    reviews: [
      {
        id: 'rev1',
        author: 'Eleanor R.',
        avatar: 'ER',
        rating: 5,
        comment: 'Absolutely breathtaking experience. The attention to detail is unmatched.',
        date: 'Oct 2023'
      },
      {
        id: 'rev2',
        author: 'James C.',
        avatar: 'JC',
        rating: 5,
        comment: 'A true Parisian palace. The restaurant is exceptional.',
        date: 'Sep 2023'
      },
      {
        id: 'rev3',
        author: 'Sophia M.',
        avatar: 'SM',
        rating: 4.8,
        comment: 'Beautiful rooms, perfect location right next to the Tuileries.',
        date: 'Aug 2023'
      }
    ]
  },
  {
    id: 'h2',
    name: 'Aman Tokyo',
    location: 'Tokyo, Japan',
    stars: 5,
    pricePerNight: 1100,
    description: 'A monument to the modern Japanese capital, Aman Tokyo is a place of serene immersion high above the city dynamic.',
    amenities: ['Pool', 'Spa', 'Gym', 'Restaurant', 'Free WiFi'],
    reviewCount: 289,
    rating: 4.95,
    images: [
      'bg-gradient-to-br from-slate-800 to-slate-600',
      'bg-gradient-to-br from-neutral-800 to-neutral-600',
      'bg-gradient-to-br from-zinc-800 to-zinc-600'
    ],
    roomTypes: [
      {
        id: 'r4',
        name: 'Deluxe Room',
        bedType: 'King Bed',
        maxGuests: 2,
        pricePerNight: 1100,
        image: 'bg-gradient-to-r from-slate-600 to-slate-500',
        description: 'Spacious room with traditional Japanese aesthetics.',
        amenities: ['Furo deep soaking tub', 'City view', 'Minibar']
      },
      {
        id: 'r5',
        name: 'Premier Room',
        bedType: 'King Bed',
        maxGuests: 3,
        pricePerNight: 1400,
        image: 'bg-gradient-to-r from-slate-700 to-slate-600',
        description: 'Corner room with expansive city skyline views.',
        amenities: ['Furo deep soaking tub', 'Panoramic view', 'Sitting area']
      },
      {
        id: 'r6',
        name: 'Aman Suite',
        bedType: 'King Bed',
        maxGuests: 4,
        pricePerNight: 3200,
        image: 'bg-gradient-to-r from-slate-800 to-slate-700',
        description: 'Expansive suite offering the ultimate in urban sanctuary living.',
        amenities: ['Separate living/dining', 'Panoramic view', 'Wine cellar']
      }
    ],
    reviews: [
      {
        id: 'rev4',
        author: 'Michael T.',
        avatar: 'MT',
        rating: 5,
        comment: 'The architectural design is simply stunning. A true oasis in Tokyo.',
        date: 'Nov 2023'
      },
      {
        id: 'rev5',
        author: 'Sarah L.',
        avatar: 'SL',
        rating: 5,
        comment: 'Impeccable service and the pool is out of this world.',
        date: 'Oct 2023'
      }
    ]
  },
  {
    id: 'h3',
    name: 'Capella Ubud',
    location: 'Bali, Indonesia',
    stars: 5,
    pricePerNight: 950,
    description: 'Nestled in the heart of lush green forests, our unique tented camp sits in harmony with the surrounding nature.',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Free WiFi'],
    reviewCount: 156,
    rating: 4.8,
    images: [
      'bg-gradient-to-br from-emerald-900 to-emerald-600',
      'bg-gradient-to-br from-green-900 to-green-600',
      'bg-gradient-to-br from-teal-900 to-teal-600'
    ],
    roomTypes: [
      {
        id: 'r7',
        name: 'Terrace Tent',
        bedType: 'King Bed',
        maxGuests: 2,
        pricePerNight: 950,
        image: 'bg-gradient-to-r from-emerald-700 to-emerald-500',
        description: 'Luxurious tent with private deck overlooking the jungle.',
        amenities: ['Private plunge pool', 'Outdoor deck', 'Jungle view']
      },
      {
        id: 'r8',
        name: 'River Tent',
        bedType: 'King Bed',
        maxGuests: 2,
        pricePerNight: 1250,
        image: 'bg-gradient-to-r from-emerald-800 to-emerald-600',
        description: 'Spacious tent situated closer to the Wos River.',
        amenities: ['Private plunge pool', 'River sounds', 'Outdoor deck']
      },
      {
        id: 'r9',
        name: 'The Lodge',
        bedType: 'Two King Beds',
        maxGuests: 4,
        pricePerNight: 2800,
        image: 'bg-gradient-to-r from-emerald-900 to-emerald-700',
        description: 'Two-bedroom lodge ideal for families or friends.',
        amenities: ['Large private pool', 'Two bedrooms', 'Living area']
      }
    ],
    reviews: []
  },
  {
    id: 'h4',
    name: 'Canaves Oia',
    location: 'Santorini, Greece',
    stars: 5,
    pricePerNight: 720,
    description: 'Carved into the cliffside, Canaves Oia offers elegant suites with plunge pools and mesmerizing caldera views.',
    amenities: ['Pool', 'Spa', 'Restaurant', 'Free WiFi'],
    reviewCount: 412,
    rating: 4.9,
    images: [
      'bg-gradient-to-br from-sky-900 to-sky-400',
      'bg-gradient-to-br from-blue-900 to-blue-400',
      'bg-gradient-to-br from-indigo-900 to-indigo-400'
    ],
    roomTypes: [
      {
        id: 'r10',
        name: 'Classic Suite',
        bedType: 'Queen Bed',
        maxGuests: 2,
        pricePerNight: 720,
        image: 'bg-gradient-to-r from-sky-500 to-sky-300',
        description: 'Minimalist suite with Aegean Sea views.',
        amenities: ['Sea view', 'Veranda', 'Minibar']
      },
      {
        id: 'r11',
        name: 'Plunge Pool Suite',
        bedType: 'King Bed',
        maxGuests: 2,
        pricePerNight: 1050,
        image: 'bg-gradient-to-r from-sky-600 to-sky-400',
        description: 'Suite featuring a private plunge pool on the terrace.',
        amenities: ['Private plunge pool', 'Caldera view', 'Spacious veranda']
      },
      {
        id: 'r12',
        name: 'River Pool Suite',
        bedType: 'King Bed',
        maxGuests: 3,
        pricePerNight: 1600,
        image: 'bg-gradient-to-r from-sky-700 to-sky-500',
        description: 'Signature suite with a unique river-like cave pool.',
        amenities: ['Cave river pool', 'Caldera view', 'Separate living area']
      }
    ],
    reviews: []
  },
  {
    id: 'h5',
    name: 'The Greenwich',
    location: 'New York, USA',
    stars: 5,
    pricePerNight: 650,
    description: 'A luxurious oasis in Tribeca, offering unmatched privacy, bespoke furnishings, and a serene underground spa.',
    amenities: ['Spa', 'Gym', 'Restaurant', 'Pet Friendly', 'Free WiFi'],
    reviewCount: 215,
    rating: 4.7,
    images: [
      'bg-gradient-to-br from-amber-900 to-amber-700',
      'bg-gradient-to-br from-orange-900 to-orange-700',
      'bg-gradient-to-br from-red-900 to-red-700'
    ],
    roomTypes: [
      {
        id: 'r13',
        name: 'Courtyard Room',
        bedType: 'Queen Bed',
        maxGuests: 2,
        pricePerNight: 650,
        image: 'bg-gradient-to-r from-amber-700 to-amber-500',
        description: 'Quiet room facing the lush inner courtyard.',
        amenities: ['Courtyard view', 'Oak floors', 'Soaking tub']
      },
      {
        id: 'r14',
        name: 'Tribeca Suite',
        bedType: 'King Bed',
        maxGuests: 3,
        pricePerNight: 1100,
        image: 'bg-gradient-to-r from-amber-800 to-amber-600',
        description: 'Spacious suite with neighborhood views and sitting area.',
        amenities: ['City view', 'Sitting area', 'Working fireplace']
      },
      {
        id: 'r15',
        name: 'Penthouse',
        bedType: 'King Bed',
        maxGuests: 4,
        pricePerNight: 4500,
        image: 'bg-gradient-to-r from-amber-900 to-amber-700',
        description: 'Stunning penthouse with private terrace and skyline views.',
        amenities: ['Private terrace', 'Skyline view', 'Full kitchen']
      }
    ],
    reviews: []
  }
];

export const sampleBookings: Booking[] = [
  {
    id: 'b1',
    hotelId: 'h2',
    hotelName: 'Aman Tokyo',
    checkIn: '2023-10-15',
    checkOut: '2023-10-20',
    roomName: 'Deluxe Room',
    guests: 2,
    totalAmount: 5500,
    status: 'Completed',
    bookingDate: '2023-08-01',
    image: 'bg-gradient-to-br from-slate-800 to-slate-600'
  },
  {
    id: 'b2',
    hotelId: 'h4',
    hotelName: 'Canaves Oia',
    checkIn: '2023-06-10',
    checkOut: '2023-06-14',
    roomName: 'Plunge Pool Suite',
    guests: 2,
    totalAmount: 4200,
    status: 'Completed',
    bookingDate: '2023-02-15',
    image: 'bg-gradient-to-br from-sky-900 to-sky-400'
  },
  {
    id: 'b3',
    hotelId: 'h1',
    hotelName: 'Le Meurice',
    checkIn: '2022-12-24',
    checkOut: '2022-12-28',
    roomName: 'Superior Room',
    guests: 2,
    totalAmount: 3400,
    status: 'Completed',
    bookingDate: '2022-09-10',
    image: 'bg-gradient-to-br from-stone-800 to-stone-400'
  }
];

export const addOns: AddOn[] = [
  { id: 'a1', name: 'Extra bed', price: 30, type: 'per_night' },
  { id: 'a2', name: 'Breakfast included', price: 25, type: 'per_night' },
  { id: 'a3', name: 'Late checkout', price: 20, type: 'per_stay' }
];
