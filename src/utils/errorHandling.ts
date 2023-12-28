import { AxiosError } from "axios";
import { toast } from "react-toastify";

type ErrorMessage = {
    message: string;
};

export default class ErrorHandler {
    static handleError(error: AxiosError): void {
        console.log("Error:", error);
        const { status, response } = error;
        const message = (response?.data as ErrorMessage)?.message;
        toast.error(message, {
            position: "top-right",
            autoClose: 3000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
        });
    }
}
