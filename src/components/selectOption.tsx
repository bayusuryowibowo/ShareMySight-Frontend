import { FunctionComponent } from "react";
import Select from "react-select";

type OptionType = { [key: string]: any };
type OptionsType = Array<OptionType>;

interface Props {
    name: string;
    options: OptionsType;
    placeholder: string;
    className: string;
}

const SelectOption: FunctionComponent<Props> = ({
    options,
    name,
    placeholder,
    className,
}) => {
    return (
        <>
            <Select
                className={className}
                isClearable={true}
                isSearchable={true}
                name={name}
                options={options}
                placeholder={placeholder}
                styles={{
                    control: (baseStyles, state) => ({
                        ...baseStyles,
                        borderWidth: "2px",
                        borderColor: "#E4E7EB",
                        color: "#606060",
                        boxShadow: "0 !important",
                        "&:hover": {},
                    }),
                    placeholder: (baseStyles) => ({
                        ...baseStyles,
                        color: "#606060",
                    }),
                }}
            />
        </>
    );
};

export default SelectOption;
