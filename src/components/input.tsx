import { ChangeEvent, FunctionComponent } from "react";

interface Props {
    type: "text" | "number" | "email" | "password" | "radio";
    label?: string;
    value?: string | number;
    name: string;
    placeholder?: string;
    error: boolean;
    disabled?: boolean;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    inputClassName?: string;
    labelClassName?: string;
}

const Input: FunctionComponent<Props> = ({
    type,
    label,
    value,
    name,
    placeholder,
    error = false,
    disabled,
    onChange,
    inputClassName,
    labelClassName,
}) => {
    return (
        <>
            {label && (
                <label htmlFor={name} className={labelClassName}>
                    {label}
                </label>
            )}
            <input
                type={type}
                id={name}
                value={value}
                name={name}
                placeholder={placeholder}
                onChange={onChange}
                disabled={disabled}
                className={inputClassName}
            />
            {error && <p className="error">Input field can't be empty!</p>}
        </>
    );
};

export default Input;
