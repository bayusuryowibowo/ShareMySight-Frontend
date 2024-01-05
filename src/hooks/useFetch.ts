"use client";

import { apiClient } from "@/utils/axios";
import { useContext, useEffect, useState } from "react";
import ErrorHandler from "@/utils/errorHandling";
import { AuthContext } from "@/context/authContext";

interface ApiResponse {
  data: any;
  message: string;
  status: boolean;
}

const useFetch = (url: string) => {
  const [data, setData] = useState<any>([]);
  const { logout } = useContext(AuthContext);

  useEffect(() => {
    apiClient
      .get<ApiResponse>(url)
      .then(({ data }) => {
        setData(data.data);
      })
      .catch((error) => {
        ErrorHandler.handleError(error);
        if (
          error.response.status === 401 &&
          error.response.data.message ===
            "Session expired. Please log in again."
        ) {
          logout();
        }
      });
  }, []);

  return [data, setData];
};

export default useFetch;
