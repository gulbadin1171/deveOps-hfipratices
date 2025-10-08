import { ReactNode } from 'react';

export type BaseEntity = {
  id: string;
  createdAt: number;
  weight?: any;
  freightClass?: any;
  commodityDescription?: any;
  hazardousMaterials?: any;
  dimensions?: any;
  serviceLevel?: any;
  insurance?: any;
  companyName?: any;
  contactPerson?: any;
  phoneNumber?: any;
  emailAddress?: any;
  deliveryDate?: string | number | Date;
  pickupDate?: string | number | Date;
  pickupLocation?: any;
  deliveryLocation?: ReactNode;
  numberOfPieces?: ReactNode;
};

export type Entity<T> = {
  [K in keyof T]: T[K];
} & BaseEntity;

export type Meta = {
  page: number;
  total: number;
  totalPages: number;
};

export type User = Entity<{
  firstName: string;
  lastName: string;
  email: string;
  role: 'ADMIN' | 'USER';
  teamId?: string;
  bio: string;
}>;

export type AuthResponse = {
  jwt: string;
  user: User;
};

export type Team = Entity<{
  name: string;
  description: string;
}>;

export type Discussion = Entity<{
  title: string;
  body: string;
  teamId: string;
  author: User;
}>;

export type Comment = Entity<{
  body: string;
  discussionId: string;
  author: User;
}>;
export interface QuickEstimate {
  id: string;
  origin: string;
  destination: string;
  weight: number;
  dimensions?: string;
  type?: string;
  items?: number;
  createdAt: number;
}

export interface Email {
  id: string;
  from: string;
  subject: string;
  snippet: string;
  date: string | null;
  read: boolean;
}
