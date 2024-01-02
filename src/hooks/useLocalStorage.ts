import { useState, useEffect } from "react";

function getSavedValue(key: string, initialValue: any) {
    const savedValue = JSON.parse(localStorage.getItem(key));

    if (savedValue) return savedValue;
    if (initialValue instanceof function) return initialValue();

    return initialValue;
}

const useLocalStorage = (key: string, initialValue: any) => {
    const [value, setValue] = useState(() => {
        return getSavedValue(key, initialValue)
    });

    useEffect(() => {
        localStorage.setItem(key, JSON.stringify(value))
    }, [value])

    return [value, setValue];
};

export default useLocalStorage;
