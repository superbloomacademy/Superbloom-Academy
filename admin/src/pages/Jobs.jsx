import React, { useEffect, useState } from "react";
import api from "../utils/api";

const StatusBadge = ({ status, onClick }) => {
  const styles = {
    open: "bg-emerald-100 text-emerald-800",
    draft: "bg-slate-100 text-slate-800",
    paused: "bg-amber-100 text-amber-800",
    closed: "bg-red-100 text-red-800",
  };
  const icons = {
    open: "🟢",
    draft: "📝",
    paused: "⏸️",
    closed: "❌",
  };
  return (
    <select
      onChange={(e) => onClick(e.target.value)}
      defaultValue={status}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border-0 cursor-pointer ${styles[status] || "bg-blue-100 text-blue-800"}`}
    >
      <option value="open">{icons.open} Open</option>
      <option value="draft">{icons.draft} Draft</option>
      <option value="paused">{icons.paused} Paused</option>
      <option value="closed">{icons.closed} Closed</option>
    </select>
  );
};

const MultiStepForm = ({ editing, job, onClose, onSubmit }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(
    job
      ? {
          title: job.title || "",
          description: job.description || "",
          department: job.department || "",
          location: job.location || "",
          locationType: job.locationType || "in-person",
          salary: job.salary || "",
          jobType: job.jobType || "full-time",
          status: job.status || "draft",
          benefits: job.benefits || [],
          hiringTimeline: job.hiringTimeline || "4weeks",
          hiringCount: job.hiringCount || 1,
        }
      : {
          title: "",
          description: "",
          department: "",
          location: "",
          locationType: "in-person",
          salary: "",
          jobType: "full-time",
          status: "draft",
          benefits: [],
          hiringTimeline: "4weeks",
          hiringCount: 1,
        }
  );

  const jobTypes = [
    { value: "full-time", label: "Full-time" },
    { value: "part-time", label: "Part-time" },
    { value: "contract", label: "Contract/Temporary" },
    { value: "internship", label: "Internship" },
    { value: "freelance", label: "Freelance" },
  ];

  const benefitsList = [
    "Health Insurance",
    "Dental Insurance",
    "Provident Fund",
    "Work from home",
    "Paid time off",
    "Cell phone reimbursement",
    "Food provided",
  ];

  const handleNext = () => {
    if (step < 5) setStep(step + 1);
  };

  const handlePrev = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      if (step < 5) {
        handleNext();
      } else if (!loading) {
        handleSubmit(e);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Only allow actual submit from step 5
    if (step !== 5) {
      return;
    }

    // Validation
    if (!form.title.trim()) {
      setError("Job title is required");
      return;
    }

    setLoading(true);
    try {
      await onSubmit(form);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Error submitting form. Please try again.",
      );
      setLoading(false);
    }
  };

  const toggleBenefit = (benefit) => {
    setForm((prev) => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter((b) => b !== benefit)
        : [...prev.benefits, benefit],
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">
              {editing ? "Edit Job Posting" : "Post a New Job"}
            </h2>
            <p className="text-sm text-slate-600 mt-1">Step {step} of 5</p>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 text-2xl font-light"
          >
            ✕
          </button>
        </div>

        {/* Progress Bar */}
        <div className="h-1 bg-slate-100">
          <div
            className="h-full bg-primary-600 transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          ></div>
        </div>

        {/* Form Content */}
        <form onKeyDown={handleKeyDown} className="p-8">
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}
          {/* Step 1: Job Basics */}
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Add job basics</h3>
                <p className="text-slate-600 text-sm mb-6">Tell us about the job you're posting</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Job Title *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Senior Software Engineer"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Where is this role located?
                </label>
                <div className="text-sm text-slate-600 mb-2">Job location type</div>
                <div className="space-y-2">
                  {["in-person", "remote", "hybrid"].map((type) => (
                    <label key={type} className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="locationType"
                        value={type}
                        checked={form.locationType === type}
                        onChange={(e) => setForm({ ...form, locationType: e.target.value })}
                        className="w-4 h-4"
                      />
                      <span className="capitalize text-slate-900">{type.replace("-", " ")}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Job Location *
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., San Francisco, CA"
                  value={form.location}
                  onChange={(e) => setForm({ ...form, location: e.target.value })}
                  required
                />
              </div>
            </div>
          )}

          {/* Step 2: Job Description */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Describe the job</h3>
                <p className="text-slate-600 text-sm mb-6">
                  Write a compelling job description to attract candidates
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Job Description *
                </label>
                <textarea
                  rows="10"
                  className="input-field resize-none font-mono text-sm"
                  placeholder="• Describe the role and responsibilities&#10;• List required qualifications&#10;• Mention nice-to-have skills&#10;• Include any additional information"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                />
                <p className="text-xs text-slate-500 mt-2">
                  Character count: {form.description.length}
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Department
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Engineering, Sales, Marketing"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
              </div>
            </div>
          )}

          {/* Step 3: Job Details */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Add job details</h3>
                <p className="text-slate-600 text-sm mb-6">Select all that apply</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">
                  Job Type *
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {jobTypes.map((type) => (
                    <label
                      key={type.value}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                        form.jobType === type.value
                          ? "border-primary-500 bg-primary-50"
                          : "border-slate-200 hover:border-slate-300"
                      }`}
                    >
                      <input
                        type="radio"
                        name="jobType"
                        value={type.value}
                        checked={form.jobType === type.value}
                        onChange={(e) => setForm({ ...form, jobType: e.target.value })}
                        className="mr-2"
                      />
                      <span className="font-medium text-slate-900">{type.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Hiring Goals */}
          {step === 4 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Hiring goals</h3>
                <p className="text-slate-600 text-sm mb-6">Tell us about your hiring timeline</p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Hiring Timeline *
                </label>
                <select
                  value={form.hiringTimeline}
                  onChange={(e) => setForm({ ...form, hiringTimeline: e.target.value })}
                  className="input-field"
                >
                  <option value="2weeks">Within 2 weeks</option>
                  <option value="4weeks">Within 4 weeks</option>
                  <option value="2months">Within 2 months</option>
                  <option value="3months">Within 3 months</option>
                  <option value="ongoing">Ongoing</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Number of positions to fill *
                </label>
                <div className="flex items-center gap-4">
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        hiringCount: Math.max(1, prev.hiringCount - 1),
                      }))
                    }
                    className="w-10 h-10 border border-slate-300 rounded-lg hover:bg-slate-100"
                  >
                    −
                  </button>
                  <input
                    type="number"
                    min="1"
                    value={form.hiringCount}
                    onChange={(e) => {
                      const raw = e.target.value;
                      const parsed = parseInt(raw, 10);
                      setForm((prev) => ({
                        ...prev,
                        hiringCount:
                          Number.isNaN(parsed) || parsed < 1 ? 1 : parsed,
                      }));
                    }}
                    className="w-20 text-center text-2xl font-bold border border-slate-300 rounded-lg px-4 py-2"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setForm((prev) => ({
                        ...prev,
                        hiringCount: prev.hiringCount + 1,
                      }))
                    }
                    className="w-10 h-10 border border-slate-300 rounded-lg hover:bg-slate-100"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Pay & Benefits */}
          {step === 5 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-slate-900 mb-1">Add pay and benefits</h3>
                <p className="text-slate-600 text-sm mb-6">
                  Attract candidates with competitive pay and benefits
                </p>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Salary Range (Optional)
                </label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., $120,000 - $180,000 per year"
                  value={form.salary}
                  onChange={(e) => setForm({ ...form, salary: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-3">Benefits</label>
                <div className="space-y-2">
                  {benefitsList.map((benefit) => (
                    <label key={benefit} className="flex items-center gap-3 cursor-pointer p-3 hover:bg-slate-50 rounded-lg">
                      <input
                        type="checkbox"
                        checked={form.benefits.includes(benefit)}
                        onChange={() => toggleBenefit(benefit)}
                        className="w-5 h-5 rounded border-slate-300 text-primary-600"
                      />
                      <span className="text-slate-900">{benefit}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="input-field"
                >
                  <option value="draft">Draft</option>
                  <option value="open">Open</option>
                  <option value="paused">Paused</option>
                  <option value="closed">Closed</option>
                </select>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-slate-200">
            {step > 1 && (
              <button
                type="button"
                onClick={handlePrev}
                disabled={loading}
                className="flex-1 px-6 py-3 border border-slate-300 text-slate-900 rounded-lg hover:bg-slate-50 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                ← Back
              </button>
            )}
            {step < 5 ? (
              <button
                type="button"
                onClick={handleNext}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-primary-600 text-white rounded-lg hover:bg-primary-700 font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    {editing ? "Updating..." : "Posting..."}
                  </>
                ) : (
                  editing ? "Update Job" : "Post Job"
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [editJob, setEditJob] = useState(null);
  const [sortBy, setSortBy] = useState("recent");
  const [filterStatus, setFilterStatus] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedJobId, setExpandedJobId] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/jobs");
      setJobs(res.data.jobs || []);
      setExpandedJobId(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const submit = async (form) => {
    try {
      if (editing) {
        await api.put(`/jobs/${editing}`, form);
      } else {
        await api.post("/jobs", form);
      }
      resetForm();
      fetch();
    } catch (e) {
      console.error(e);
      throw e; // Re-throw to let the form component handle it
    }
  };

  const resetForm = () => {
    setEditing(null);
    setEditJob(null);
    setShowForm(false);
  };

  const remove = async (id) => {
    if (!confirm("Delete this job?")) return;
    try {
      await api.delete(`/jobs/${id}`);
      setJobs(jobs.filter((j) => j._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const changeStatus = async (id, status) => {
    setJobs((prev) => prev.map((j) => (j._id === id ? { ...j, status } : j)));
    try {
      await api.patch(`/jobs/${id}/status`, { status });
    } catch (e) {
      console.error(e);
      fetch();
    }
  };

  const getFilteredJobs = () => {
    let filtered = jobs;
    if (filterStatus !== "all") {
      filtered = jobs.filter((j) => j.status === filterStatus);
    }

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter((j) => {
        const title = j.title || "";
        const dept = j.department || "";
        const loc = j.location || "";
        return (
          title.toLowerCase().includes(term) ||
          dept.toLowerCase().includes(term) ||
          loc.toLowerCase().includes(term)
        );
      });
    }

    const sorted = [...filtered];
    if (sortBy === "recent") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "applications") {
      sorted.sort((a, b) => (b.applications || 0) - (a.applications || 0));
    }
    return sorted;
  };

  const getDaysPosted = (createdAt) => {
    const days = Math.floor((new Date() - new Date(createdAt)) / (1000 * 60 * 60 * 24));
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    return `${days} days ago`;
  };

  const filteredJobs = getFilteredJobs();
  const hasAnyJobs = jobs.length > 0;
  const stats = {
    totalJobs: jobs.length,
    activeJobs: jobs.filter((j) => j.status === "open").length,
    draftJobs: jobs.filter((j) => j.status === "draft").length,
    closedJobs: jobs.filter((j) => j.status === "closed").length,
    totalApplications: jobs.reduce((sum, j) => sum + (j.applications || 0), 0),
    totalViews: jobs.reduce((sum, j) => sum + (j.views || 0), 0),
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-slate-200 border-t-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600">Loading jobs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-wider text-primary-600 font-semibold">
            Hiring
          </p>
          <h1 className="mt-1 text-3xl md:text-4xl font-bold text-slate-900">
            Jobs
          </h1>
          <p className="mt-2 text-sm text-slate-600 max-w-xl">
            Create, track and optimize your openings in a single view.
          </p>
        </div>
        <div className="flex flex-col items-stretch md:items-end gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="btn-primary btn-lg flex items-center gap-2 justify-center"
          >
            <span className="text-lg">＋</span>
            <span>Post Job</span>
          </button>
          <p className="hidden md:block text-xs text-slate-500">
            {stats.activeJobs} active • {stats.totalApplications} applications
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card">
          <div className="card-body">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Jobs
            </p>
            <p className="mt-2 text-2xl md:text-3xl font-bold text-slate-900">
              {stats.totalJobs}
            </p>
            <p className="mt-1 text-xs text-slate-500">Across all statuses</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Active Jobs
            </p>
            <p className="mt-2 text-2xl md:text-3xl font-bold text-emerald-600">
              {stats.activeJobs}
            </p>
            <p className="mt-1 text-xs text-slate-500">Currently visible to candidates</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Applications
            </p>
            <p className="mt-2 text-2xl md:text-3xl font-bold text-primary-600">
              {stats.totalApplications}
            </p>
            <p className="mt-1 text-xs text-slate-500">All time applications</p>
          </div>
        </div>
        <div className="card">
          <div className="card-body">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
              Total Views
            </p>
            <p className="mt-2 text-2xl md:text-3xl font-bold text-blue-600">
              {stats.totalViews}
            </p>
            <p className="mt-1 text-xs text-slate-500">Impressions across jobs</p>
          </div>
        </div>
      </div>

      {/* Filters, search & sort */}
      <div className="card">
        <div className="card-body flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap gap-2">
            {[
              { label: "All", value: "all", count: jobs.length },
              {
                label: "Open",
                value: "open",
                count: jobs.filter((j) => j.status === "open").length,
              },
              {
                label: "Draft",
                value: "draft",
                count: jobs.filter((j) => j.status === "draft").length,
              },
              {
                label: "Closed",
                value: "closed",
                count: jobs.filter((j) => j.status === "closed").length,
              },
            ].map((filter) => (
              <button
                key={filter.value}
                type="button"
                onClick={() => setFilterStatus(filter.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                  filterStatus === filter.value
                    ? "bg-primary-600 text-white border-primary-600 shadow-sm"
                    : "bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100"
                }`}
              >
                {filter.label}
                <span className="ml-1 text-xs text-slate-500">
                  ({filter.count})
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto md:ml-auto">
            <div className="relative flex-1 min-w-[220px]">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by title, department or location"
                className="input-field pl-9 pr-3"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">
                🔍
              </span>
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field sm:w-44"
            >
              <option value="recent">Sort: Most recent</option>
              <option value="applications">Sort: Most applied</option>
            </select>
          </div>
        </div>
      </div>

      {/* Jobs Table / Empty states */}
      {!hasAnyJobs ? (
        <div className="card">
          <div className="card-body py-12 text-center">
            <div className="text-5xl mb-4">📋</div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              No jobs yet
            </h3>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Start by posting your first job to attract great candidates to
              Superbloom Academy.
            </p>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary btn-lg"
            >
              Post your first job
            </button>
          </div>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className="card">
          <div className="card-body py-10 text-center">
            <div className="text-4xl mb-3">🔎</div>
            <h3 className="text-lg font-semibold text-slate-900 mb-1">
              No jobs match your filters
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              Try adjusting the status, search term or sort order.
            </p>
            <button
              type="button"
              onClick={() => {
                setFilterStatus("all");
                setSearchTerm("");
              }}
              className="btn-secondary btn-sm"
            >
              Clear filters
            </button>
          </div>
        </div>
      ) : (
        <div className="card overflow-hidden">
          <div className="card-header flex items-center justify-between">
            <div>
              <h2 className="text-sm font-semibold text-slate-900">
                Job listings
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                {filteredJobs.length} job
                {filteredJobs.length !== 1 ? "s" : ""} shown
              </p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="btn-primary btn-sm hidden sm:inline-flex"
            >
              + Post job
            </button>
          </div>
          <div className="card-body p-0 overflow-x-auto">
            <table className="table min-w-full text-sm">
              <thead>
                <tr>
                  <th>Job</th>
                  <th>Status</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Salary</th>
                  <th>Openings</th>
                  <th>Applications</th>
                  <th>Views</th>
                  <th>Posted</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.map((job) => (
                  <React.Fragment key={job._id}>
                    <tr
                      className="cursor-pointer"
                      onClick={() =>
                        setExpandedJobId(
                          expandedJobId === job._id ? null : job._id
                        )
                      }
                    >
                      <td>
                        <div className="space-y-1">
                          <p className="font-semibold text-slate-900">
                            {job.title}
                          </p>
                          <p className="text-xs text-slate-500">
                            {job.department || "No department"}
                          </p>
                        </div>
                      </td>
                      <td onClick={(e) => e.stopPropagation()}>
                        <StatusBadge
                          status={job.status}
                          onClick={(status) => changeStatus(job._id, status)}
                        />
                      </td>
                      <td>
                        <span className="badge-info">
                          {job.jobType || "N/A"}
                        </span>
                      </td>
                      <td>
                        <p className="font-medium text-slate-900">
                          {job.location || "-"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {job.locationType || "in-person"}
                        </p>
                      </td>
                      <td>{job.salary || "-"}</td>
                      <td>{job.hiringCount ?? 1}</td>
                      <td>{job.applications ?? 0}</td>
                      <td>{job.views ?? 0}</td>
                      <td>{getDaysPosted(job.createdAt)}</td>
                      <td
                        className="text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="inline-flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditing(job._id);
                              setEditJob(job);
                              setShowForm(true);
                            }}
                            className="px-2 py-1 text-xs font-medium text-primary-600 hover:bg-primary-50 rounded-md"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => remove(job._id)}
                            className="px-2 py-1 text-xs font-medium text-red-600 hover:bg-red-50 rounded-md"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedJobId === job._id && (
                      <tr className="bg-slate-50/70">
                        <td colSpan={9} className="px-6 py-4">
                          <div className="grid gap-6 md:grid-cols-3">
                            <div className="md:col-span-2 space-y-2">
                              <h3 className="text-sm font-semibold text-slate-900">
                                Description
                              </h3>
                              <p className="text-sm text-slate-700 whitespace-pre-wrap leading-relaxed">
                                {job.description || "No description provided."}
                              </p>
                            </div>
                            <div>
                              <h3 className="text-sm font-semibold text-slate-900">
                                Benefits
                              </h3>
                              {job.benefits && job.benefits.length ? (
                                <ul className="mt-1 space-y-1 text-sm text-slate-700">
                                  {job.benefits.map((b) => (
                                    <li key={b}>• {b}</li>
                                  ))}
                                </ul>
                              ) : (
                                <p className="mt-1 text-sm text-slate-500">
                                  No benefits listed.
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Form */}
      {showForm && (
        <MultiStepForm
          editing={editing}
          job={editJob}
          onClose={resetForm}
          onSubmit={submit}
        />
      )}
    </div>
  );
}
