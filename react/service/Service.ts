import axios, { AxiosResponse } from "axios";
const Http = axios.create({
  baseURL: "https://hccontroll03.app.br",
});

class Service {
  protected static Http = Http;
  protected static getData = getData;
}

function getData<T>(res: AxiosResponse<T>) {
  return res.data;
}

export default Service;
