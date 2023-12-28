"use client";

import { FunctionComponent } from "react";
import Select from "react-select";
import { ActionMeta, SingleValue } from "react-select";

type OptionType = { [key: string]: any };
type OptionsType = Array<OptionType>;

interface Props {
    name: string;
    options: OptionsType;
    placeholder: string;
    className: string;
    handleSelectChange: (params: {
        name: string | undefined;
        value: unknown;
    }) => void;
}

const SelectOption: FunctionComponent<Props> = ({
    options,
    name,
    placeholder,
    className,
    handleSelectChange,
}) => {
    const id = Date.now().toString();

    const handleOnChange = (
        selectedOption: SingleValue<OptionType>,
        actionMeta: ActionMeta<OptionType>
    ) => {
        handleSelectChange({
            name: actionMeta.name,
            value: selectedOption?.value,
        });
    };

    return (
        <>
            <Select
                instanceId={id}
                className={className}
                isClearable={true}
                isSearchable={true}
                name={name}
                options={options}
                placeholder={placeholder}
                onChange={handleOnChange}
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
