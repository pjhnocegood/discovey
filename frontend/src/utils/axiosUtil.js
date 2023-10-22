import axios from "axios";

export const proofServiceAPi = axios.create({
    baseURL: "https://proof-service.next.id/",
  });

  export const kvServiceAPi = axios.create({
    baseURL: "https://kv-service.next.id/",
  });

  export const nextAPi = axios.create({
    baseURL: "http://localhost:4000/api/",
  });

  export const gitHubTokenAPi = axios.create({
    baseURL: "https://github.com/",
  });

  export const gitHubAPi = axios.create({
    baseURL: "https://api.github.com/",
  });