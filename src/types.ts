
export type SportType = 'Fútbol' | 'Pádel' | 'Tenis' | 'Básquet';
export type UserRole = 'usuario' | 'admin_cancha' | 'root';

export interface Court {
  id: string;
  name: string;
  type: SportType;
  pricePerHour: number;
  image: string;
  rating: number;
  location: string;
  amenities: string[];
  description: string;
  ownerId?: string;
}

export interface Reservation {
  id: string;
  courtId: string;
  courtName: string;
  date: string;
  time: string;
  duration: number;
  status: 'Confirmada' | 'Pendiente' | 'Cancelada';
  userName?: string;
  userId: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar: string;
}
