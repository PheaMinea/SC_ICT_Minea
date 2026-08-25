import axios from "axios";

/*
|--------------------------------------------------------------------------
| API Base URL
|--------------------------------------------------------------------------
*/

const API_BASE_URL =
  process.env.REACT_APP_API_URL ||
  "http://127.0.0.1:8000";

/*
|--------------------------------------------------------------------------
| Axios Instance
|--------------------------------------------------------------------------
*/

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    Accept: "application/json",
  },
});

/*
|--------------------------------------------------------------------------
| Request Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    /*
    |--------------------------------------------------------------------------
    | Upload File
    |--------------------------------------------------------------------------
    | Browser will automatically generate multipart/form-data boundary.
    */

    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] =
        "application/json";
    }

    return config;
  },

  (error) => Promise.reject(error)
);

/*
|--------------------------------------------------------------------------
| Response Interceptor
|--------------------------------------------------------------------------
*/

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error.response?.status;

    const pathname =
      window.location.pathname.toLowerCase();

    /*
    |--------------------------------------------------------------------------
    | Redirect only Admin pages
    |--------------------------------------------------------------------------
    */

    const isAdminPage =
      pathname.startsWith("/admin") ||
      pathname.startsWith("/dashboard");

    const isLoginPage =
      pathname === "/login" ||
      pathname.startsWith("/admin/login");

    if (
      status === 401 &&
      isAdminPage &&
      !isLoginPage
    ) {
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

/*
|--------------------------------------------------------------------------
| Export
|--------------------------------------------------------------------------
*/

export default api;