import { createContext, useState, useEffect, useContext } from "react";

export const UIContext = createContext({});

export const UIProvider = ({ children }) => {
  const [isClient, setIsClient] = useState(false);
  const [applicationError, setApplicationError] = useState(false);
  const [applicationErrorIsFadingOut, setApplicationErrorIsFadingOut] =
    useState(false);
  const [applicationSuccess, setApplicationSuccess] = useState(false);
  const [applicationSuccessIsFadingOut, setApplicationSuccessIsFadingOut] =
    useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (applicationError) {
      setTimeout(() => {
        setApplicationErrorIsFadingOut(true);
      }, 8000);
      setTimeout(() => {
        setApplicationErrorIsFadingOut(false);
        setApplicationError(false);
      }, 8300);
    }
  }, [applicationError]);

  useEffect(() => {
    if (applicationSuccess) {
      setTimeout(() => {
        setApplicationSuccessIsFadingOut(true);
      }, 8000);
      setTimeout(() => {
        setApplicationSuccessIsFadingOut(false);
        setApplicationSuccess(false);
      }, 8300);
    }
  }, [applicationSuccess]);

  return (
    <UIContext.Provider
      value={{
        isClient,
        applicationError,
        setApplicationError,
        applicationErrorIsFadingOut,
        setApplicationErrorIsFadingOut,
        applicationSuccess,
        setApplicationSuccess,
        applicationSuccessIsFadingOut,
        setApplicationSuccessIsFadingOut,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
