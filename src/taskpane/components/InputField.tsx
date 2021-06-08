import { TextField } from "@fluentui/react";
import { useField } from "formik";

import * as React from "react";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

// eslint-disable-next-line react/prop-types
export const InputField: React.FC<InputFieldProps> = ({ defaultValue, ...props }) => {
  const [field, { error }] = useField(props);
  return (
    <>
      <TextField {...props} {...field} defaultValue={defaultValue as string} errorMessage={error} canRevealPassword />
    </>
  );
};
