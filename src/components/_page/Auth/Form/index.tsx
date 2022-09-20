import React from "react";
import { useTranslation } from "react-i18next";

import { APP_NAME } from "@/constants";
import { MainButton } from "@/components/Buttons";

export type InputType = {
  name: string;
  type: "email" | "password" | "text" | "tel" | "number";
  placeholder: string;
  required?: boolean;
};

interface FormProps {
  authState: "sign_up" | "sign_in";
  description?: string;
  inputActionAndValues: Array<{
    value: string;
    setValue: React.Dispatch<React.SetStateAction<string>>;
  }>;
  error?: string | null;
  /* eslint-disable */
  // eslint-disable-next-line no-unused-vars
  onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
  /* eslint-enable */
  onAuthStateChange?: () => void;
}

const Form: React.FC<FormProps> = ({
  authState,
  description,
  onSubmit,
  onAuthStateChange,
  inputActionAndValues,
  error,
}) => {
  const { t, i18n } = useTranslation();

  const loginInput: InputType[] = [
    {
      name: t("auth-login-field-1"),
      type: "email",
      placeholder: t("auth-login-field-1"),
      required: true,
    },
    {
      name: t("auth-login-field-2"),
      type: "password",
      placeholder: t("auth-login-field-2"),
      required: true,
    },
  ];

  const signUpInput: InputType[] = [
    {
      name: t("auth-register-field-1"),
      type: "email",
      placeholder: t("auth-register-field-1"),
      required: true,
    },
    {
      name: t("auth-register-field-2"),
      type: "password",
      placeholder: t("auth-register-field-2"),
      required: true,
    },
    {
      name: t("auth-register-field-3"),
      type: "password",
      placeholder: t("auth-register-field-3"),
      required: true,
    },
  ];

  const inputArray = authState === "sign_in" ? loginInput : signUpInput;

  return (
    <form
      className={`w-[500px] bg-neutral-100 p-[50px] shadow-lg drop-shadow-lg ${
        i18n.language === "en" ? "font-enSans" : "font-jaSans"
      }`}
      onSubmit={onSubmit}
    >
      <div className="mb-5 text-center">
        <h1 className="mb-3 text-2xl font-medium">{APP_NAME}</h1>
        <h2 className="mb-1 text-4xl font-bold">
          {authState === "sign_up"
            ? t("auth-register-header")
            : t("auth-login-header")}
        </h2>
        <p className="mx-auto w-[300px]">{description}</p>
      </div>
      <div className="flex flex-col space-y-5">
        {inputArray &&
          inputArray.map((input, index) => (
            <input
              key={input.name}
              className="border border-neutral-300 px-3 py-3 outline-none"
              type={input.type}
              required={input.required}
              placeholder={input.placeholder}
              value={inputActionAndValues[index].value}
              onChange={(e) => {
                const val = e.target.value;
                let newVal = "";

                if (input.type === "number" || input.type === "tel") {
                  newVal = val.replace(/\D+/g, "");
                } else {
                  newVal = val.trim();
                }

                inputActionAndValues[index].setValue(newVal);
              }}
            />
          ))}
        <MainButton
          text={
            authState === "sign_in"
              ? t("auth-login-button")
              : t("auth-register-button")
          }
          type="submit"
        />
      </div>
      <div className="my-5 h-[1px] w-full bg-neutral-300" />
      <p className="text-center">
        {authState === "sign_in"
          ? t("auth-login-text-1")
          : t("auth-register-text-1")}
        <span
          className="font-medium text-sky-600"
          onClick={onAuthStateChange}
          onKeyDown={onAuthStateChange}
          role="button"
          tabIndex={0}
        >
          {authState === "sign_in"
            ? ` ${t("auth-login-text-2")}`
            : ` ${t("auth-register-text-2")}`}
        </span>
      </p>
      {error && <p className="mt-3 text-center text-red-500">{error}</p>}
    </form>
  );
};

export default Form;
