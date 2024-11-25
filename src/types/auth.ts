export type UserRole = 'admin' | 'technician';

export interface User {
  id: string;
  username: string;
  role: UserRole;
}