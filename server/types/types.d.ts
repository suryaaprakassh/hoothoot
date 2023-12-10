export interface UserType {
  email: string;
  name: string;
}
export declare global {
  namespace Express {
    interface Request {
      user?: UserType;
    }
  }
}
