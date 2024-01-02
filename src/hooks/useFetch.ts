"use client";

import { apiClient } from "@/utils/axios";
import { useEffect, useState } from "react";
import ErrorHandler from "@/utils/errorHandling";

interface ApiResponse {
    data: any;
    message: string;
    status: boolean;
}

const useFetch = (url: string) => {
    const [data, setData] = useState<any>([]);

    useEffect(() => {
        apiClient
            .get<ApiResponse>(url)
            .then(({ data }) => {
                setData(data.data);
            })
            .catch((error) => {
                ErrorHandler.handleError(error);
            });
    }, []);

    return [data, setData];
};

export default useFetch;
