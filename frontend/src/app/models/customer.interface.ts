export interface Customer {
  id: number;
  name: string;
  address: string;
  postcode: string;
  tags: string[];
}

export interface CustomerSearchResponse {
  customers: Customer[];
  totalCount: number;
}