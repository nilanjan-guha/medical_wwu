import React, { PropsWithChildren, createContext, useContext } from "react";

type AppContextValue = {
  appName: string;
};

const AppContext = createContext<AppContextValue>({ appName: "We Are With U" });

export const AppProvider = ({ children }: PropsWithChildren) => {
  return <AppContext.Provider value={{ appName: "We Are With U" }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => useContext(AppContext);
