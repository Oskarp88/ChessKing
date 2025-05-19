import React, { useEffect, useState } from 'react';
import axios from 'axios';
import style from './AllUsers.module.css';
import { baseUrl } from '../../utils/services';

const AllUsers = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${baseUrl}/users`);
        setUsers(response.data);
      } catch (error) {
        console.log('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = (index, value) => {
    const updatedUsers = [...users];
    updatedUsers[index].role = value;
    setUsers(updatedUsers);
  };

  const handleBanChange = (index, value) => {
    const updatedUsers = [...users];
    updatedUsers[index].ban = value;
    setUsers(updatedUsers);
  };

  const handleDelete = (index) => {
    const updatedUsers = [...users];
    updatedUsers.splice(index, 1);
    setUsers(updatedUsers);
  };

  return (
    <div className={style.userlist}>
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Rango</th>
            <th>Role</th>
            <th>Delete</th>
            <th>Ban</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{user.username}</td>
              <td>
                <input
                  type="text"
                  value={user.rango || ''}
                  onChange={(e) => handleRoleChange(index, e.target.value)}
                />
              </td>
              <td>
                <select value={user.role} onChange={(e) => handleRoleChange(index, e.target.value)}>
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(index)}>Delete</button>
              </td>
              <td>
                <select value={user.ban.toString()} onChange={(e) => handleBanChange(index, e.target.value === 'true')}>
                  <option value="true">Yes</option>
                  <option value="false">No</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AllUsers;
