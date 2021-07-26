import { TextField } from "@fluentui/react";
import { useField } from "formik";
import React, { ReactElement } from "react";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
};

function InputField({ defaultValue, ...props }: InputFieldProps): ReactElement {
  const [field, { error }] = useField(props);
  return (
    <TextField
      {...props}
      {...field}
      defaultValue={defaultValue as string}
      errorMessage={error}
      canRevealPassword
    />
  );
}

export default InputField;
