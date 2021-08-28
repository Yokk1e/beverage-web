import { useMutation } from "react-query";
import { postOrder } from "../../clients/orders";
import { CreateOrderForm } from "./forms/CreateOrderForm";

export function useCreateOrder(): [
  (form: CreateOrderForm) => Promise<void>,
  boolean,
  boolean
] {
  const {
    mutateAsync: createOrder,
    isLoading,
    isSuccess,
  } = useMutation(async (form: CreateOrderForm) => await postOrder(form));

  async function submitPostOrder(form: CreateOrderForm) {
    try {
      await createOrder(form);
    } catch (error) {
      console.log(error);
    }
  }

  return [submitPostOrder, isLoading, isSuccess];
}
