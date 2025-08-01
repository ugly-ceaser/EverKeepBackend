export interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface CreateUserRequest {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }
  
  export interface UpdateUserRequest {
    firstName?: string;
    lastName?: string;
    email?: string;
  }