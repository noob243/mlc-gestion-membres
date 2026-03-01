
export interface Member {
  id: string;
  lastName: string;
  postName: string;
  firstName: string;
  sexe: string;
  birthDate: string;
  country: string;
  cityProvince: string;
  category: string;
  federation: string;
  phone: string;
  email: string;
  registrationDate: string;
  photoUrl: string;
}

export enum AppView {
  REGISTRATION = 'registration',
  CARD_GENERATOR = 'card_generator'
}

export interface CentralDatabase {
  version: string;
  lastUpdated: string;
  members: Member[];
}
