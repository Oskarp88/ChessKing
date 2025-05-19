import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../../context/authContext/authContext';
import Spinner from '../Spinner';

export default function PrivateRoute() {
  const { auth } = useAuth();
  
  return  auth?.user ? <Outlet /> : <Spinner path='' />;
 
}