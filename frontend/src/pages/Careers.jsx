import React, { useEffect, useState } from "react";
import api from "../utils/api";
import { Link } from "react-router-dom";

export default function Careers() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get("/jobs/open");
        setJobs(res.data.jobs || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) return <div className="p-8">Loading jobs...</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-6">Careers</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {jobs.map((job) => (
          <div key={job._id} className="border rounded p-4 shadow-sm">
            <h2 className="text-xl font-medium">{job.title}</h2>
            <p className="text-sm text-gray-600">
              {job.department} • {job.location}
            </p>
            <p className="mt-2 text-gray-700">
              {job.description?.slice(0, 150)}
              {job.description && job.description.length > 150 ? "..." : ""}
            </p>
            <div className="mt-4 flex items-center justify-between">
              <Link
                to={`/careers/${job._id}`}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                View & Apply
              </Link>
              <span className="text-sm text-green-600">{job.status}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
