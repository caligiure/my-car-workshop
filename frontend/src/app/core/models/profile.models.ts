export interface UserProfileDTO {
  id: number;
  name: string;
  surname: string;
  email: string;
}

export interface UserProfileUpdateDTO {
  name: string;
  surname: string;
}

export interface UserPasswordUpdateDTO {
  oldPassword: string;
  newPassword: string;
}
