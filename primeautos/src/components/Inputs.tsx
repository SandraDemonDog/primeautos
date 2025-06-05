import React from "react";

interface InputProps {
  type: "text" | "email" | "password" | "number" | "textarea" | "select" | "date" | "time"; 
  name: string; 
  value: string | number; 
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void; 
  onInvalid?: React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onInput?: React.FormEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  placeholder?: string; 
  label?: string; 
  required?: boolean; 
  className?: string; 
  options?: { value: string; label: string }[]; 
}

const Input: React.FC<InputProps> = ({
  type,
  name,
  value,
  onChange,
  onInvalid,
  onInput,
  placeholder,
  label,
  required = false,
  className = "",
  options,
}) => {
  if (type === "textarea") {
    return (
      <div className={`flex flex-col mb-6 ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className="text-gray-700 font-semibold mb-2 text-lg"
          >
            {label}
          </label>
        )}
        <textarea
          id={name}
          name={name}
          value={value}
          onChange={onChange}
          onInvalid={onInvalid}
          onInput={onInput}
          placeholder={placeholder}
          required={required}
          className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white transition"
        />
      </div>
    );
  }

  if (type === "select") {
    return (
      <div className={`flex flex-col mb-6 ${className}`}>
        {label && (
          <label
            htmlFor={name}
            className="text-gray-700 font-semibold mb-2 text-lg"
          >
            {label}
          </label>
        )}
        <select
          id={name}
          name={name}
          value={value}
          onChange={onChange} 
          required={required}
          className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white transition"
        >
          {options?.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    );
  }

  return (
    <div className={`flex flex-col mb-6 ${className}`}>
      {label && (
        <label
          htmlFor={name}
          className="text-gray-700 font-semibold mb-2 text-lg"
        >
          {label}
        </label>
      )}
      <input
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={onChange} 
        onInvalid={onInvalid}
        onInput={onInput}
        placeholder={placeholder}
        required={required}
        className="py-3 px-4 bg-gray-100 border border-gray-300 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:bg-white transition"
      />
    </div>
  );
};

export default Input;
