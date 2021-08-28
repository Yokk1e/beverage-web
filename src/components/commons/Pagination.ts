export interface PaginationRequestParams {
  orderType: "DESC" | "ASC";
  search?: string;
  page: number | undefined;
  limit: number | undefined;
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface Pagination<T> {
  items: T[];
  meta: PaginationMeta;
}
