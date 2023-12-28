"use client";

import { apiClient } from "@/utils/axios";
import { useCookies } from "next-client-cookies";
import { useEffect, useState } from "react";
import ErrorHandler from "@/utils/errorHandling";

const useFetch = (url: string) => {
    const cookies = useCookies();
    const [data, setData] = useState([]);

    useEffect(() => {
        apiClient
            .get(url, {
                headers: {
                    access_token: `Bearer ${cookies.get("access_token")}`,
                },
            })
            .then(({ data }) => {
                setData(data.data);
            })
            .catch((error) => {
                ErrorHandler.handleError(error);
            });
    }, []);

    return data;
};

export default useFetch;
