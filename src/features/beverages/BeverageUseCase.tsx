import { useQuery } from "react-query";
import { getBeverageById, getBeverages } from "../../clients/beverages";
import { Pagination } from "../../components/commons/Pagination";
import { BeveragePaginationRequestParam } from "./forms/BeveragePaginationRequestParam";
import { Beverage } from "./models/Beverage";

export function useGetBeverages(
  form: BeveragePaginationRequestParam
): [Pagination<Beverage> | undefined, () => void, boolean, boolean] {
  const {
    data: beverages,
    refetch,
    isLoading,
    isFetching,
  } = useQuery("beverages", async () => await getBeverages(form));

  return [beverages, refetch, isLoading, isFetching];
}

export function useGetBeverageById(
  id: number
): [Beverage | undefined, boolean, boolean] {
  const { data, isLoading, isSuccess } = useQuery(
    `beverages${id}`,
    async () => await getBeverageById(id),
    { enabled: !!id }
  );

  return [data, isLoading, isSuccess];
}
