import { Input } from '@nextui-org/react';
import React from 'react';
interface InputProps {
  type?: string;
  name?: string;
  onBlur?: (event: React.FocusEvent<HTMLInputElement>) => void;
  className?: string;
  classNames?: {
    input: string;
    mainWrapper: string;
  };
  placeholder?: string;
  id?: string;
  value?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  isInvalid?: boolean;
  color?: string;
  errorMessage?: string;
  variant?: 'default' | 'bordered' | 'flat';
  endContent?: React.ReactNode;
  isDisabled?: boolean;
  label?: string;
}

const LTInput: React.FC<InputProps> = ({
  classNames = { input: 'w-full', mainWrapper: 'w-full' },
  placeholder = 'Search',
  value = '',
  disabled = false,
  onChange,
  ...props
}) => {
  return (
    <Input
      classNames={classNames}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      {...props}
    />
  );
};

export default LTInput;
