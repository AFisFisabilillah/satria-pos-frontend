export interface Unit {
  id: number;
  name: string;
}

export interface UnitQuery {
  search?: string;
}

export interface CreateUnitRequest {
  name: string;
}
