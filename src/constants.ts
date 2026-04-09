
import { Court, SportType } from './types';

export const COURTS: Court[] = [
  {
    id: '1',
    name: 'Arena Central Soccer',
    type: 'Fútbol',
    pricePerHour: 45,
    image: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&q=80&w=800',
    rating: 4.8,
    location: 'Calle Principal 123, Centro',
    amenities: ['Duchas', 'Parking', 'Buffet'],
    description: 'Cancha sintética de última generación con iluminación LED profesional.'
  },
  {
    id: '2',
    name: 'Pádel Pro Hub',
    type: 'Pádel',
    pricePerHour: 30,
    image: 'https://images.unsplash.com/photo-1626224583764-f87db24ac4ea?auto=format&fit=crop&q=80&w=800',
    rating: 4.9,
    location: 'Av. Las Palmas 45, Norte',
    amenities: ['Alquiler Palas', 'Grip Shop', 'Aire Libre'],
    description: 'Pistas panorámicas con cristal templado de alta resistencia.'
  },
  {
    id: '3',
    name: 'Tennis Classic Club',
    type: 'Tenis',
    pricePerHour: 25,
    image: 'https://images.unsplash.com/photo-1595435064214-04d1733b8660?auto=format&fit=crop&q=80&w=800',
    rating: 4.5,
    location: 'Urbanización El Sol, Este',
    amenities: ['Arcilla', 'Entrenador', 'Toallas'],
    description: 'Canchas de polvo de ladrillo mantenidas diariamente.'
  },
  {
    id: '4',
    name: 'Metropolitan Basket',
    type: 'Básquet',
    pricePerHour: 20,
    image: 'https://images.unsplash.com/photo-1544919982-b61976f0ba43?auto=format&fit=crop&q=80&w=800',
    rating: 4.6,
    location: 'Plaza Deportiva, Sur',
    amenities: ['Vestuarios', 'Agua Gratis'],
    description: 'Cancha techada con piso de madera flotante.'
  },
  {
    id: '5',
    name: 'Sunset Padel Club',
    type: 'Pádel',
    pricePerHour: 35,
    image: 'https://images.unsplash.com/photo-1554068865-24bccd4e3d77?auto=format&fit=crop&q=80&w=800',
    rating: 4.7,
    location: 'Costanera 88, Oeste',
    amenities: ['Vista al Mar', 'Restaurante'],
    description: 'Disfruta del mejor pádel con vista al atardecer.'
  }
];

export const TIME_SLOTS = [
  '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'
];
