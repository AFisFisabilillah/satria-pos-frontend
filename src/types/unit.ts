export interface Unit {
  id: number;
  name: string;
}

export interface UnitQuery {
  search?: string;
  page?: number;
  size?: number;
}

export interface CreateUnitRequest {
  name: string;
}
