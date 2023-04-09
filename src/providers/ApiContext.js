import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

export const ApiContext = createContext({});

export const ApiProvider = ({ children, serverUrl }) => {
  const [api, setApi] = useState(null);

  useEffect(() => {
    if (serverUrl) {
      const apiInstance = axios.create({
        baseURL: serverUrl,
      });
      setApi(apiInstance);
    }
  }, [serverUrl]);

  const value = {
    api,
  };

  return (
    <ApiContext.Provider value={value}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = () => {
  return useContext(ApiContext);
};
