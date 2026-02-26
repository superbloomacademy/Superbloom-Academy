import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    department: "",
    location: "",
    status: "open",
  });

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs");
      setJobs(res.data.jobs || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      if (editing) await api.put(`/jobs/${editing}`, form);
      else await api.post("/jobs", form);
      setForm({
        title: "",
        description: "",
        department: "",
        location: "",
        status: "open",
      });
      setEditing(null);
      fetch();
    } catch (e) {
      console.error(e);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete job?")) return;
    await api.delete(`/jobs/${id}`);
    fetch();
  };

  const changeStatus = async (id, status) => {
  // Update UI immediately
  setJobs((prevJobs) =>
    prevJobs.map((j) => (j._id === id ? { ...j, status } : j))
  );

  // Send API request
  try {
    await api.patch(`/jobs/${id}/status`, { status });
  } catch (e) {
    console.error(e);
    // Optional: revert UI change if API fails
    fetch(); 
  }
};

  return (
    <div>
      <h1 className="text-2xl mb-4">Jobs</h1>
      <div className="mb-4 bg-white p-4 rounded shadow">
        <form
          onSubmit={submit}
          className="grid grid-cols-1 md:grid-cols-2 gap-2"
        >
          <input
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            placeholder="Title"
            className="border p-2 rounded"
            required
          />
          <input
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            placeholder="Department"
            className="border p-2 rounded"
          />
          <input
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Location"
            className="border p-2 rounded"
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border p-2 rounded"
          >
            <option value="open">open</option>
            <option value="closed">closed</option>
          </select>
          <textarea
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            placeholder="Description"
            className="border p-2 rounded md:col-span-2"
          />
          <div className="md:col-span-2">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">
              {editing ? "Update" : "Add"} Job
            </button>
            {editing && (
              <button
                type="button"
                onClick={() => {
                  setEditing(null);
                  setForm({
                    title: "",
                    description: "",
                    department: "",
                    location: "",
                    status: "open",
                  });
                }}
                className="ml-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white p-4 rounded shadow overflow-x-scroll">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="text-left">
                <th>Title</th>
                <th>Applications</th>
                <th>Department</th>
                <th>Location</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((j) => (
              
                <tr key={j._id} className="border-t">
                  <td className="p-2">{j.title}</td>
                  <td className="p-2">{j.applications}</td>
                  <td className="p-2">{j.department}</td>
                  <td className="p-2">{j.location}</td>
                  {/* Status as dropdown */}
      <td className="p-2">
        <select
          value={j.status} // show current status
          onChange={(e) => {
            e.preventDefault();
            changeStatus(j._id, e.target.value)}}
          className="border p-1 rounded"
        >
          <option value="open">Open</option>
          <option value="closed">Closed</option>
        </select>
      </td>
                  <td className="p-2">
                    <button
                      onClick={() => {
                        setEditing(j._id);
                        setForm({
                          title: j.title,
                          description: j.description,
                          department: j.department,
                          location: j.location,
                          status: j.status,
                        });
                      }}
                      className="mr-2 text-sm text-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => remove(j._id)}
                      className="text-sm text-red-600"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
