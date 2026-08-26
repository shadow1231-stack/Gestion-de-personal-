/** Formato de respuesta uniforme de la API (§5): {success, data, message}. */
export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
}
