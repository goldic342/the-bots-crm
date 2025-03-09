import axios from "axios";
import camelcaseKeysDeep from "camelcase-keys-deep";
import { API_BASE_URL, API_TIMEOUT } from "../config";
let convertSnakeToCamel = true; // DO NOT TURN OFF

export const setConversionEnabled = (enabled) => {
  convertSnakeToCamel = enabled;
};

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: { "Content-Type": "application/json" },
});
api.defaults.withCredentials = true;

api.interceptors.response.use((config) => {
  if (config.method === "options") return;
  if (convertSnakeToCamel && config.data && typeof config.data === "object") {
    config.data = camelcaseKeysDeep(config.data);
  }
  return config;
});
