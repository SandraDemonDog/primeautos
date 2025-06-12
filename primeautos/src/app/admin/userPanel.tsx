"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "./userForm";

interface User {
  id: string;
  name: string;
  email: string;
  role: "admin" | "usuario";
  password?: string;
}

interface RawUser {
  id?: string;
  _id?: string;
  name?: string;
  email?: string;
  role?: "admin" | "usuario";
}

export default function UsersPanel() {
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined);
  const [showForm, setShowForm] = useState(false);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users");

      if (Array.isArray(res.data.data)) {
        const mappedUsers = res.data.data.map((user: RawUser) => ({
          id: user.id ?? user._id ?? "", // fallback
          name: user.name ?? "Sin nombre",
          email: user.email ?? "Sin email",
          role: user.role ?? "usuario",
        }));

        setUsers(mappedUsers);
      } else {
        console.error("Formato inesperado de respuesta:", res.data);
        setUsers([]);
      }
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const indexLast = currentPage * itemsPerPage;
  const indexFirst = indexLast - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexFirst, indexLast);

  const handleDelete = async (id: string) => {
    if (confirm("¿Estás seguro de que quieres eliminar este usuario?")) {
      await axios.delete(`/api/users/${id}`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setShowForm(true);
  };

  const handleCreate = () => {
    setSelectedUser(undefined);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Usuarios</h2>
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Crear Usuario
        </button>
      </div>

      {showForm && (
        <UserForm user={selectedUser} onSuccess={handleSuccess} />
      )}

      <input
        type="text"
        placeholder="Buscar usuarios"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="border p-2 rounded w-full mb-4"
      />

      <ul className="space-y-2 mt-4">
        {currentUsers.map((user) => (
          <li key={user.id} className="border p-4 rounded shadow flex justify-between items-center">
            <div>
              <p className="font-semibold">{user.name}</p>
              <p className="text-sm text-gray-600">{user.email}</p>
              <p className="text-sm text-gray-400">Rol: {user.role}</p>
            </div>
            <div className="space-x-2">
              <button
                onClick={() => handleEdit(user)}
                className="bg-blue-500 text-white px-3 py-1 rounded"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>

      {filteredUsers.length > itemsPerPage && (
        <div className="flex justify-center items-center mt-6 space-x-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Anterior
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded ${
                currentPage === i + 1
                  ? "bg-gray-800 text-yellow-500"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400 disabled:opacity-50"
          >
            Siguiente
          </button>
        </div>
      )}
    </div>
  );
}
