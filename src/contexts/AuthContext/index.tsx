import React, {
  useState,
  useEffect,
  createContext,
  useContext,
  useMemo,
} from "react";

import { IUserData } from "@/models/user";
import { APP_NAME } from "@/constants";

export const USER_DATA_STORAGE_KEY = `${APP_NAME}_USER_DATA_KEY`;

interface AuthContextProps {
  userData: IUserData | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextProps>({
  userData: null,
  loading: true,
});

interface AuthProviderProps {
  children?: React.ReactNode;
}

const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [userData, setUserData] = useState<IUserData | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const loggedInUser = localStorage.getItem(USER_DATA_STORAGE_KEY);
    if (loggedInUser) {
      setUserData(JSON.parse(loggedInUser));
    }

    setLoading(false);
  }, []);

  const authProviderValue = useMemo(
    () => ({
      userData,
      loading,
    }),
    [userData, loading]
  );

  return (
    <AuthContext.Provider value={authProviderValue}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

export const useAuth = (): AuthContextProps => {
  const data = useContext(AuthContext);
  return { ...data };
};
