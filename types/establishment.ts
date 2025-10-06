
export interface Service {
  id: string;
  name: string;
  duration: number; // in minutes
  price: number;
  description?: string;
  establishment_id?: string;
  is_active?: boolean;
}

export interface TimeSlot {
  id: string;
  time: string; // HH:MM format
  available: boolean;
  date: string; // YYYY-MM-DD format
}

export interface Employee {
  id: string;
  establishment_id: string;
  name: string;
  role: string;
  photo_url?: string;
  phone?: string;
  email?: string;
  bio?: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Establishment {
  id: string;
  name: string;
  type: 'hairdresser' | 'cosmetologist' | 'nail_salon' | 'spa' | 'barbershop';
  address: string;
  latitude: number;
  longitude: number;
  rating: number;
  reviewCount: number;
  priceRange: '$' | '$$' | '$$$' | '$$$$';
  imageUrl: string;
  phone: string;
  services: Service[];
  availableSlots: TimeSlot[];
  openingHours: {
    [key: string]: { open: string; close: string } | null;
  };
  distance?: number; // in kilometers, calculated based on user location
  isFavorite?: boolean; // Added for favorites functionality
  owner_id?: string;
  description?: string;
  employees?: Employee[];
}

export interface Booking {
  id: string;
  user_id: string;
  establishment_id: string;
  employee_id?: string;
  service_id: string;
  booking_date: string;
  booking_time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  total_price?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Chat {
  id: string;
  user_id: string;
  establishment_id: string;
  employee_id: string;
  last_message_at: string;
  created_at: string;
  establishment?: Establishment;
  employee?: Employee;
  last_message?: Message;
}

export interface Message {
  id: string;
  chat_id: string;
  sender_id: string;
  content: string;
  message_type: 'text' | 'image' | 'file';
  is_read: boolean;
  created_at: string;
}

export type SortOption = 'distance' | 'rating' | 'price' | 'availability';

export interface EstablishmentFilters {
  type?: string[];
  priceRange?: string[];
  rating?: number;
  availableToday?: boolean;
}

export interface UserProfile {
  firstName: string;
  lastName: string;
  age?: number;
  city: string;
  photo?: string;
  phone?: string;
  email?: string;
}

export type Language = 'en' | 'uk' | 'ru';

export interface AppSettings {
  language: Language;
  themeColor: string;
}
