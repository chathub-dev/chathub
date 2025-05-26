import React, { FC } from 'react';

interface Props {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  id?: string;
}

const Checkbox: FC<Props> = ({ checked, onChange, label, id }) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange(event.target.checked);
  };

  return (
    <label htmlFor={id} className="flex items-center cursor-pointer">
      <input
        id={id}
        type="checkbox"
        className="form-checkbox h-5 w-5 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
        checked={checked}
        onChange={handleChange}
      />
      {label && <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{label}</span>}
    </label>
  );
};

export default Checkbox;