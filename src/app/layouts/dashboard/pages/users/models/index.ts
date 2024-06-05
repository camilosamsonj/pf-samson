export type UserRole = 'ADMIN' | 'USER';

export interface IUser {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  createdAt: Date;
  password?: string;
}

export interface CreateUserPayload {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  role: UserRole | null;
  createdAt: Date;
}
