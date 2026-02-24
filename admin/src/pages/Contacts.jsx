import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);

  const fetch = async () => {
    try {
      const res = await api.get("/admin/contacts");
      setContacts(res.data.contacts || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete?")) return;
    await api.delete(`/admin/contacts/${id}`);
    fetch();
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Contacts</h1>
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Organization</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {contacts.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.email}</td>
                <td className="p-2">{c.organization}</td>
                <td className="p-2">{c.message?.slice(0, 100)}</td>
                <td className="p-2">
                  <button
                    onClick={() => remove(c._id)}
                    className="text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
