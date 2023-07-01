import { useState, useEffect } from 'react';

import { Outlet } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../../Context/authContext';
import Spinner from '../spinner';

export default function PrivateRoute() {
  const [ok, setOk] = useState<boolean>(false);
  const {auth, setAuth} = useAuth();

  useEffect(() => {
    const authCheck = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/api/user-auth`);
        if (res.data.ok) {
          setOk(true);
        } else {
          setOk(false);
        }
      } catch (error) {
        setOk(false);
      }
    };

    if (auth?.token) {
      authCheck();
    }
  }, [auth?.token]);

  return ok ? <Outlet /> : <Spinner />;
}
