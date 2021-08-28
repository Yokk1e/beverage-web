import { Pagination } from "../components/commons/Pagination";
import { BeveragePaginationRequestParam } from "../features/beverages/forms/BeveragePaginationRequestParam";
import { Beverage } from "../features/beverages/models/Beverage";
import { httpClient } from "./httpClient";

export const getBeverages = async (params: BeveragePaginationRequestParam) => {
  const { data } = await httpClient.get<Pagination<Beverage>>(`/beverages`, {
    params,
  });
  return data;
};

export const getBeverageById = async (id: number) => {
  const { data } = await httpClient.get<Beverage>(`/beverages/${id}`);
  return data;
};
