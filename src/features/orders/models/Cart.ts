import { Beverage } from "../../beverages/models/Beverage";

export interface Cart extends Beverage {
  amount: number;
}
