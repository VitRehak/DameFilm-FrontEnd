import { string } from "yup/lib/locale";

export interface ModalProps {
  onHide: () => void;
  show: boolean;
}

export interface Credentials {
  token: string;
  roles: Array<string>;
  userId: number;
}

export interface User {
  userId: number;
  email: string;
  username: string;
  lastname: string;
  firstname: string;
  dateOfRegistration: string;
}

export interface Movie {
  movieId: number;
  name: string;
  director: string;
  create: string;
  lastUpdate: string;
  actors: Array<string>;
  ageRating: string;
  publisher: User;
  averageRating: number;
}

export interface Comment {
  text: string;
  send: string;
}

export interface Rating {
  starCount: number;
}