import { Worker } from './worker.model'

export interface GeoJSONPoint {
  type: 'Point';
  coordinates: [number, number]; // [longitude, latitude]
}

/* eslint-disable no-unused-vars */
export enum locationServiceType {
  // Personal care
  HAIRCUT = 'haircut',
  HAIR_COLOR = 'hair coloring',
  HAIR_TREATMENT = 'hair treatment',
  BEARD_TRIM = 'beard trim',
  FACIAL = 'facial cleansing',
  MAKEUP = 'makeup',
  MANICURE = 'manicure',
  PEDICURE = 'pedicure',
  EYEBROWS = 'eyebrows and lashes',
  WAXING = 'waxing',
  MASSAGE = 'relaxing massage',

  // Health and wellness
  MEDICAL_APPOINTMENT = 'medical appointment',
  PHYSIOTHERAPY = 'physiotherapy',
  THERAPY_SESSION = 'therapy session',
  DENTAL_APPOINTMENT = 'dentist appointment',
  NUTRITIONIST = 'nutritionist',

  // Fitness and sports
  GYM_SESSION = 'gym workout',
  YOGA_CLASS = 'yoga class',
  PILATES_CLASS = 'pilates class',
  BOXING_CLASS = 'boxing class',
  SWIMMING = 'swimming session',
  PERSONAL_TRAINING = 'personal training',

  // Food and restaurants
  RESTAURANT_BOOKING = 'restaurant reservation',
  TAKEAWAY = 'takeaway order',
  CATERING = 'catering service',
  PRIVATE_DINNER = 'private dinner',
  WINE_TASTING = 'wine tasting',

  // Lifestyle
  TATTOO = 'tattoo',
  PIERCING = 'piercing',
  LANGUAGE_CLASS = 'language class',
  MUSIC_LESSON = 'music lesson',
  DANCE_CLASS = 'dance class',
  COACHING = 'coaching session',
}

/* eslint-disable no-unused-vars */
export enum locationSchedule {
  MONDAY = 'monday',
  TUESDAY = 'tuesday',
  WEDNESDAY = 'wednesday',
  THURSDAY = 'thursday',
  FRIDAY = 'friday',
  SATURDAY = 'saturday',
  SUNDAY = 'sunday',
}


export interface Location extends Document {
  _id: string;
  nombre: string;
  address: string;
  phone: string;
  rating: number;
  ubicacion: GeoJSONPoint;
  serviceType: locationServiceType[];
  schedule: {
    day: locationSchedule;
    open: string; // HH:mm
    close: string; // HH:mm
  }[];
  business: string;
  workers: Worker[];
  isDeleted: boolean;
}
