import React, { useEffect, useState } from "react";
import api from "../utils/api";

const StatCard = ({ icon, label, value, bg, border }) => (
  <div className={`relative overflow-hidden card hover:shadow-xl group cursor-pointer transition-all transform hover:-translate-y-1 ${border}`}>
    <div className={`absolute top-0 right-0 w-32 h-32 ${bg} rounded-full blur-3xl opacity-10`}></div>
    <div className="card-body relative z-10">
      <div className="flex items-start justify-between mb-4">
        <div className={`text-4xl p-3 rounded-xl ${bg} bg-opacity-10`}>{icon}</div>
        <div className={`w-10 h-10 rounded-lg ${bg} bg-opacity-20 group-hover:${bg} group-hover:bg-opacity-30 flex items-center justify-center transition-all text-lg font-bold text-slate-900`}>↗</div>
      </div>
      <p className="text-slate-600 text-sm font-medium mb-1">{label}</p>
      <p className="text-3xl font-bold text-slate-900">{value ?? "0"}</p>
    </div>
  </div>
);

export default function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        console.log("🔄 Fetching dashboard stats...");
        
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);

        const res = await api.get("/admin/stats", { signal: controller.signal });
        clearTimeout(timeoutId);
        
        console.log("✅ Stats received:", res.data);
        setStats(res.data);
        setError(null);
        setLoading(false);
      } catch (e) {
        console.error("❌ Error fetching stats:", e);
        
        if (e.code === "ERR_CANCELED") {
          setError("Request timeout. Backend might be down.");
        } else if (!e.response) {
          setError("Network error. Cannot connect to backend.");
        } else if (e.response?.status === 401) {
          setError("Unauthorized. Please login again.");
        } else if (e.response?.status === 403) {
          setError("Access denied. You don't have permission.");
        } else {
          setError(e.response?.data?.message || e.message || "Failed to load stats");
        }
        
        setStats({
          totalJobs: 0,
          totalCandidates: 0,
          totalAdmissions: 0,
          totalContacts: 0,
        });
        setLoading(false);
      }
    };

    const fetchJobs = async () => {
      try {
        const res = await api.get("/jobs");
        setJobs((res.data.jobs || []).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5));
      } catch (e) {
        console.error("Error fetching jobs:", e);
      }
    };

    const fetchCandidates = async () => {
      try {
        const res = await api.get("/admin/candidates");
        setCandidates((res.data.candidates || []).slice(0, 5));
      } catch (e) {
        console.error("Error fetching candidates:", e);
      }
    };

    fetchStats();
    fetchJobs();
    fetchCandidates();
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Dashboard</h1>
        <p className="text-slate-600">Welcome back! Here's your recruitment overview.</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="card h-32 animate-pulse">
              <div className="card-body space-y-3">
                <div className="w-8 h-8 bg-slate-200 rounded"></div>
                <div className="h-4 bg-slate-200 rounded w-24"></div>
                <div className="h-6 bg-slate-200 rounded w-full"></div>
              </div>
            </div>
          ))}
        </div>
      ) : error ? (
        <div className="card border-red-200 bg-red-50 p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">⚠️</div>
            <div>
              <h3 className="font-semibold text-red-900 mb-1">Error Loading Dashboard</h3>
              <p className="text-red-700 text-sm mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="text-sm font-medium text-red-600 hover:text-red-700 underline"
              >
                Retry
              </button>
            </div>
          </div>
        </div>
      ) : (
        <>
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <StatCard 
              icon="💼" 
              label="Active Jobs" 
              value={stats?.totalJobs || 0}
              bg="bg-blue"
              border="border border-blue-200"
            />
            <StatCard 
              icon="👥" 
              label="Total Applicants" 
              value={stats?.totalCandidates || 0}
              bg="bg-emerald"
              border="border border-emerald-200"
            />
            <StatCard 
              icon="🎓" 
              label="Admissions" 
              value={stats?.totalAdmissions || 0}
              bg="bg-amber"
              border="border border-amber-200"
            />
            <StatCard 
              icon="📧" 
              label="Messages" 
              value={stats?.totalContacts || 0}
              bg="bg-red"
              border="border border-red-200"
            />
          </div>

          {/* Recent Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Jobs */}
            <div className="card">
              <div className="card-header border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">📮 Recent Job Postings</h2>
              </div>
              <div className="card-body p-0">
                {jobs.length === 0 ? (
                  <div className="p-6 text-center text-slate-500">
                    <p>No jobs posted yet</p>
                  </div>
                ) : (
                  <div className="space-y-0 divide-y divide-slate-200">
                    {jobs.map((job) => (
                      <div key={job._id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-semibold text-slate-900">{job.title}</h3>
                          <span
                            className={`text-xs px-2 py-1 rounded-full font-medium ${
                              job.status === "open"
                                ? "bg-emerald-100 text-emerald-800"
                                : "bg-slate-100 text-slate-800"
                            }`}
                          >
                            {job.status === "open" ? "🟢 Open" : "⭕ Closed"}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-2">{job.location || "No location"}</p>
                        <div className="flex gap-4 text-xs text-slate-500">
                          <span>👥 {job.applications || 0} applicants</span>
                          <span>👁️ {job.views || 0} views</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Recent Applicants */}
            <div className="card">
              <div className="card-header border-b border-slate-200">
                <h2 className="text-lg font-bold text-slate-900">👤 Recent Applicants</h2>
              </div>
              <div className="card-body p-0">
                {candidates.length === 0 ? (
                  <div className="p-6 text-center text-slate-500">
                    <p>No applicants yet</p>
                  </div>
                ) : (
                  <div className="space-y-0 divide-y divide-slate-200">
                    {candidates.map((candidate) => (
                      <div key={candidate._id} className="p-4 hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white text-sm font-semibold">
                            {candidate.name?.charAt(0).toUpperCase() || "?"}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-slate-900 text-sm">{candidate.name || "Unknown"}</h3>
                            <p className="text-xs text-slate-500">{candidate.email || "No email"}</p>
                          </div>
                        </div>
                        {candidate.appliedFor && (
                          <p className="text-xs text-slate-600 ml-11">Applied for: {candidate.appliedFor}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
