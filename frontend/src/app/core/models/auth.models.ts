// Contratti DTO (models): Interfacce TypeScript speculari ai DTO Java per garantire la tipizzazione debole lato client.
export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface AuthResponseDTO {
  token: string;
  type: string; // "Bearer"
}

export interface ApiErrorDTO {
  timestamp: string;
  status: number;
  error: string;
  message: string;
}