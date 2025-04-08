// src/pages/AdminPanel.js
import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const roles = ["Customer", "Owner", "Admin"];

  const fetchUsers = async () => {
    const res = await fetch("http://localhost:5000/users");
    const data = await res.json();
    setUsers(data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, newRole) => {
    const user = users.find((u) => u.id === userId);
    const updatedUser = { ...user, role: newRole };

    await fetch(`http://localhost:5000/users/${userId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedUser),
    });

    fetchUsers();
  };

  const handleDelete = async (userId) => {
    await fetch(`http://localhost:5000/users/${userId}`, {
      method: "DELETE",
    });

    fetchUsers();
  };

  return (
    <div>
      <h2>Управление пользователями</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>
            <th>Имя</th>
            <th>Email</th>
            <th>Роль</th>
            <th>Изменить роль</th>
            <th>Удалить</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td>{u.id}</td>
              <td>{u.name}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                <select
                  value={u.role}
                  onChange={(e) => handleRoleChange(u.id, e.target.value)}
                >
                  {roles.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
              <td>
                <button onClick={() => handleDelete(u.id)}>Удалить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminPanel;
