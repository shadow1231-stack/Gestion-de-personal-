export interface Vehicle {
  id: number;
  owner_id: number;
  plate: string;
  brand: string;
  model: string;
  year: number;
  created_at: string;
}

export interface VehicleCreate {
  plate: string;
  brand: string;
  model: string;
  year: number;
}
