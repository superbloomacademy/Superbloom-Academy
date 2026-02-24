import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("admin");

  const submit = async (e) => {
    e.preventDefault();
    await register({ name, email, password, role });
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded shadow mt-6">
      <h2 className="text-2xl mb-4">Register Admin</h2>
      <form onSubmit={submit} className="space-y-3">
        <input
          className="w-full border p-2 rounded"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
        />
        <input
          className="w-full border p-2 rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
        />
        <input
          className="w-full border p-2 rounded"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
        />
        <div>
          <label className="mr-3">Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className="border p-1 rounded"
          >
            <option value="admin">admin</option>
            <option value="superadmin">superadmin</option>
          </select>
        </div>
        <button className="bg-green-600 text-white px-4 py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
