import React, { createContext, useState, useContext } from "react";

const ProfileContext = createContext();

const useProfileContext = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
};

const ProfileProvider = ({ children }) => {
  const [profileContext, setProfileContext] = useState({
    prof_name: "",
    first_name: "",
    last_name: "",
    phone: "",
    role: "",
    tagline: "",
    location: "",
    about: "",
    avatar: "",
    enterpise: "",
    id: "",
  });

  return (
    <ProfileContext.Provider value={{ profileContext, setProfileContext }}>
      {children}
    </ProfileContext.Provider>
  );
};

export { ProfileProvider, useProfileContext };
