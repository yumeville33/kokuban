import React, { useState } from "react";

import fetchAPI from "@/utils/fetch";
import { IUser, IUserData } from "@/models/user";
import { USER_DATA_STORAGE_KEY } from "@/contexts/AuthContext";
import LoaderModal from "@/components/LoaderModal";
import Form from "./Form";

type AuthType = "sign_in" | "sign_up";
const authEnum = {
  sign_in: "sign_in" as AuthType,
  sign_up: "sign_up" as AuthType,
};

export const Auth = () => {
  const [authState, setAuthState] = useState<AuthType>("sign_up");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Sign in states
  const [signInEmail, setSignInEmail] = useState("");
  const [signInPassword, setSignInPassword] = useState("");

  // Sign up states
  const [signUpEmail, setSignUpEmail] = useState("");
  const [signUpPassword, setSignUpPassword] = useState("");
  const [signUpConfirmPassword, setSignUpConfirmPassword] = useState("");

  const inputActionAndValues =
    authState === authEnum.sign_in
      ? [
          { value: signInEmail, setValue: setSignInEmail },
          { value: signInPassword, setValue: setSignInPassword },
        ]
      : [
          { value: signUpEmail, setValue: setSignUpEmail },
          { value: signUpPassword, setValue: setSignUpPassword },
          { value: signUpConfirmPassword, setValue: setSignUpConfirmPassword },
        ];

  const checkInfo = (data: IUserData) => {
    if (data.message) {
      setError(data.message);

      return;
    }

    if (data.status === "success") {
      const newUser: IUser = {
        // eslint-disable-next-line no-underscore-dangle
        _id: data.data.user._id,
        email: data.data.user.email,
        firstName: data.data.user.firstName,
        lastName: data.data.user.lastName,
      };
      const newUserData: IUserData = {
        ...data,
        data: {
          user: newUser,
        },
      };

      window.localStorage.setItem(
        USER_DATA_STORAGE_KEY,
        JSON.stringify(newUserData)
      );

      setTimeout(() => {
        window.location.href = window.location.origin;
      }, 300);
    }
  };

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      setIsLoading(true);
      // Sign in
      if (authState === authEnum.sign_in) {
        const data: IUserData = await fetchAPI(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT as string}users/login/`,
          "POST",
          { email: signInEmail, password: signInPassword }
        );

        checkInfo(data);
      } else {
        // Sign up
        const data: IUserData = await fetchAPI(
          `${process.env.NEXT_PUBLIC_API_ENDPOINT as string}users/signup/`,
          "POST",
          {
            email: signUpEmail,
            password: signUpPassword,
            passwordConfirm: signUpConfirmPassword,
          }
        );

        checkInfo(data);
      }

      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center py-[100px]">
      <LoaderModal isModalOpen={isLoading} />
      <Form
        authState={authState}
        onAuthStateChange={() => {
          const newAuthState =
            authState === authEnum.sign_up
              ? authEnum.sign_in
              : authEnum.sign_up;
          setAuthState(newAuthState);
        }}
        onSubmit={(e) => onSubmit(e)}
        inputActionAndValues={inputActionAndValues}
        error={error}
      />
    </div>
  );
};
