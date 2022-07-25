import React, { useState } from "react";

import Form, { InputType } from "./Form";

export const Auth = () => {
  const [authState, setAuthState] = useState<"sign_up" | "sign_in">("sign_up");

  const inputArrays = {
    sign_in: [
      {
        name: "Email",
        type: "email",
        placeholder: "Email",
        required: true,
      },
      {
        name: "Password",
        type: "password",
        placeholder: "Password",
        required: true,
      },
    ] as InputType[],
    sign_up: [
      {
        name: "Email",
        type: "email",
        placeholder: "Email",
        required: true,
      },
      {
        name: "Password",
        type: "password",
        placeholder: "Password",
        required: true,
      },
      {
        name: "Confirm Password",
        type: "password",
        placeholder: "Confirm Password",
        required: true,
      },
    ] as InputType[],
  };

  const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  };

  return (
    <div className="flex h-screen items-center justify-center">
      <Form
        authState={authState}
        onAuthStateChange={() => {
          setAuthState(authState === "sign_up" ? "sign_up" : "sign_in");
        }}
        inputArray={inputArrays[authState]}
        onSubmit={(e) => onSubmit(e)}
      />
    </div>
  );
};
