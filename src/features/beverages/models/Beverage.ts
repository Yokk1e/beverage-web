export interface Beverage {
  id: number;
  name: string;
  price: number;
  beverageOptions: BeverageOption[];
}

export interface BeverageOption {
  id: number;
  name: string;
  price: number;
}
