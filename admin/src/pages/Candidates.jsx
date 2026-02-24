import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filterJob, setFilterJob] = useState("");

  const fetch = async () => {
    try {
      const q = filterJob ? `?job=${filterJob}` : "";
      const res = await api.get(`/candidates${q}`);
      setCandidates(res.data.candidates || []);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    const f = async () => {
      try {
        const r = await api.get("/jobs");
        setJobs(r.data.jobs || []);
      } catch (e) {}
    };
    f();
    fetch();
  }, []);

  const updateStatus = async (id, status) => {
    await api.patch(`/candidates/${id}/status`, { status });
    fetch();
  };
  const remove = async (id) => {
    if (!confirm("Delete candidate?")) return;
    await api.delete(`/candidates/${id}`);
    fetch();
  };

  return (
    <div>
      <h1 className="text-2xl mb-4">Candidates</h1>
      <div className="mb-4">
        <select
          value={filterJob}
          onChange={(e) => {
            setFilterJob(e.target.value);
          }}
          className="border p-2 rounded"
        >
          <option value="">All jobs</option>
          {jobs.map((j) => (
            <option key={j._id} value={j._id}>
              {j.title}
            </option>
          ))}
        </select>
        <button
          onClick={fetch}
          className="ml-2 bg-blue-600 text-white px-3 py-1 rounded"
        >
          Filter
        </button>
      </div>
      <div className="bg-white p-4 rounded shadow">
        <table className="w-full table-auto">
          <thead>
            <tr>
              <th>Name</th>
              <th>University</th>
              <th>Why Join</th>
              <th>Resume</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => (
              <tr key={c._id} className="border-t">
                <td className="p-2">{c.name}</td>
                <td className="p-2">{c.university}</td>
                <td className="p-2">{c.whyJoinUs?.slice(0, 80)}</td>
                <td className="p-2">
                  <a
                    className="text-blue-600"
                    href={c.resumeUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    Resume
                  </a>
                </td>
                <td className="p-2">{c.status}</td>
                <td className="p-2">
                  <select
                    onChange={(e) => updateStatus(c._id, e.target.value)}
                    defaultValue={c.status}
                    className="mr-2"
                  >
                    <option value="reviewing">reviewing</option>
                    <option value="shortlisted">shortlisted</option>
                    <option value="interviewing">interviewing</option>
                    <option value="rejected">rejected</option>
                  </select>
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
