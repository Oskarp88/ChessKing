import React from 'react';
import style from './AdminDasboard.module.css';
import { useAuth } from '../../context/authContext/authContext';

const AdminDashboard = () => {
  const { auth } = useAuth();
  return (
    <div>
      <div className={`${style.containerfluid} ${style.dashboard}`}>
        <div className={style.row}>
          <div className={style.colmd3}>
            {/* Contenido de colmd3 */}
          </div>
          <div className={style.colmd9}>
            <div className={style.card}>
              <h3> Admin Name: {auth?.user?.name}</h3>
              <h3> Admin Email: {auth?.user?.email}</h3>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
