import React from "react";

export default function Input(props: {
    value: string;
    setValue: (value: string) => void;
    className?: string;
    type?: string;
    placeholder?: string;
}) {
    return (
        <>
            <input
                type={props.type || "text"}
                placeholder={props.placeholder}
                value={props.value}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    props.setValue(e.target.value)
                }
                className={`w-full pl-10 p-2 border hover:scale-105 transition-transform rounded-md focus:ring-yellow-500 focus:border-yellow-500 ${props.className}`}
                required
            />
        </>
    );
}
