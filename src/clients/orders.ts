import { CreateOrderForm } from "../features/orders/forms/CreateOrderForm";
import { Order } from "../features/orders/models/Order";
import { httpClient } from "./httpClient";

export const postOrder = async (form: CreateOrderForm) => {
  await httpClient.post<Order>(`/orders`, form);
};
