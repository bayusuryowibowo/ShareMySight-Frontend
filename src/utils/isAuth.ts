"use client";
import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAppSelector } from "../lib/hooks";
import { RootState } from "../lib/stores";

export default function isAuth(Component: any) {
    return function IsAuth(props: any) {
        const isLoggedIn = useAppSelector(
            (state: RootState) => state.auth.isLoggedIn
        );

        useEffect(() => {
            if (!isLoggedIn) {
                return redirect("/login");
            }
        }, [isLoggedIn]);

        return Component;
    };
}
