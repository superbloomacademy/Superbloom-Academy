import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Admissions() {
  const [admissions, setAdmissions] = useState([]);

  const fetch = async () => {
    try {
      const res = await api.get("/admin/admissions");
      setAdmissions(res.data.admissions || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete?")) return;
    await api.delete(`/admin/admissions/${id}`);
    fetch();
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Admissions</h1>
      <div className="bg-white p-4 rounded shadow overflow-x-scroll">
        <table className="w-full table-auto truncate">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Stream</th>
              <th>Message</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {admissions.map((a) => (
              <tr key={a._id} className="border-t">
                <td className="p-2">{a.name}</td>
                <td className="p-2">{a.email}</td>
                <td className="p-2">{a.stream}</td>
                <td className="p-2">{a.message?.slice(0, 100)}</td>
                <td className="p-2">
                  <button
                    onClick={() => remove(a._id)}
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
