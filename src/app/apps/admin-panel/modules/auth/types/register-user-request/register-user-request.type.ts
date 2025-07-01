export interface RegisterUserRequest {
  email: string;
  password: string;
  fullName: string;
  phoneNumber?: string;
  acceptTerms: boolean;
}
