import api from "@/utils/api";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getJobs = async () => {
      try {
        const res = await api.get('/jobs/open');
        console.log(res);
        setJobs(res.data.jobs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    getJobs();
  }, []);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-600">
        Loading open roles...
      </div>
    );

  return (
    <div className="bg-gray-50">
      
      {/* Hero Section */}
      {/* <section className="bg-gradient-to-br from-blue-500 via-white to-blue-100 border-b">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900">
            Join Our Team
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl mx-auto">
            We're building something meaningful. Explore our open roles and
            grow with us.
          </p>
        </div>
      </section> */}

      {/* Jobs Section */}
      <section className="max-w-6xl mx-auto px-6 py-12">
        {jobs.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold text-gray-800">
              No Open Positions Right Now
            </h2>
            <p className="text-gray-500 mt-2">
              Please check back later for new opportunities.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white p-6 rounded-2xl shadow-sm border hover:shadow-lg transition duration-300"
              >
                {/* Department Badge */}
                <span className="inline-block text-xs font-medium bg-blue-100 text-blue-600 px-3 py-1 rounded-full">
                  {job.department}
                </span>

                {/* Title */}
                <h2 className="text-xl font-semibold mt-4 text-gray-900">
                  {job.title}
                </h2>

                {/* Location and type */}
                <p className="text-sm text-gray-500 mt-1">
                  {job.location} • {job.locationType || "in-person"}
                </p>
                {/* Salary */}
                {job.salary && (
                  <p className="text-sm text-gray-500 mt-1">
                    💰 {job.salary}
                  </p>
                )}

                {/* Description */}
                <p className="text-gray-600 mt-4 line-clamp-3">
                  {job.description}
                </p>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between">
                  <Link
                    to={`/careers/${job._id}`}
                    className="text-sm font-medium bg-black text-white px-5 py-2 rounded-full hover:bg-gray-800 transition"
                  >
                    View Role
                  </Link>

                  <span className="text-xs font-medium text-green-600 bg-green-100 px-3 py-1 rounded-full">
                    {job.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}