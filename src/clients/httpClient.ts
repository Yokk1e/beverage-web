import axios from "axios";
import { configs } from "../configs";

export const httpClient = axios.create({
  baseURL: configs.apiUrl,
});
