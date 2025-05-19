import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseUrl, getRequest } from "@/utils/services";
import { AuthContext } from "./AuthContext";

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({
    user: null,
    token: ''
  });
  const [user, setUser] = useState(null);
  const [isScore, setScore] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if (auth && auth.user) {
        const response = await getRequest(`${baseUrl}/user/${auth?.user?._id}`);
        if (response.error) {
          return console.log('Error fetching users', response);
        }
        setUser(response);
      }
    };
    fetchUser();
  }, [auth, isScore, setUser]);

  axios.defaults.headers.common['Authorization'] = auth?.token;

  useEffect(() => {
    const data = localStorage.getItem('auth');
    if (data) {
      const parseData = JSON.parse(data);
      setAuth({
        ...auth,
        user: parseData.user,
        token: parseData.token
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ auth, setAuth, user, isScore, setScore }}>
      {children}
    </AuthContext.Provider>
  );
};
