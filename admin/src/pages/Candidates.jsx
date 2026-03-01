import React, { useEffect, useState } from "react";
import api from "../utils/api";

const StatusBadge = ({ status, onClick }) => {
  const styles = {
    reviewing: "bg-blue-100 text-blue-800",
    shortlisted: "bg-emerald-100 text-emerald-800",
    interviewing: "bg-purple-100 text-purple-800",
    rejected: "bg-red-100 text-red-800",
  };
  const icons = {
    reviewing: "👀",
    shortlisted: "⭐",
    interviewing: "💬",
    rejected: "❌",
  };
  return (
    <select
      onChange={(e) => onClick(e.target.value)}
      value={status}
      className={`px-3 py-1.5 rounded-full text-xs font-semibold border-0 cursor-pointer ${styles[status] || "bg-slate-100 text-slate-800"}`}
    >
      <option value="reviewing">{icons.reviewing} Reviewing</option>
      <option value="shortlisted">{icons.shortlisted} Shortlisted</option>
      <option value="interviewing">{icons.interviewing} Interviewing</option>
      <option value="rejected">{icons.rejected} Rejected</option>
    </select>
  );
};

export default function Candidates() {
  const [candidates, setCandidates] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [filterJob, setFilterJob] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [sortBy, setSortBy] = useState("recent");
  const [loading, setLoading] = useState(true);
  const [selectedCandidateId, setSelectedCandidateId] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const q = filterJob ? `?job=${filterJob}` : "";
      const res = await api.get(`/candidates${q}`);
      setCandidates(res.data.candidates || []);
      setSelectedCandidateId(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
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

  // Refetch when the job filter changes so backend filtering takes effect
  useEffect(() => {
    fetch();
  }, [filterJob]);

  const updateStatus = async (id, status) => {
    setCandidates((prev) =>
      prev.map((c) => (c._id === id ? { ...c, status } : c))
    );
    try {
      await api.patch(`/candidates/${id}/status`, { status });
    } catch (e) {
      console.error(e);
      fetch();
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this candidate?")) return;
    try {
      await api.delete(`/candidates/${id}`);
      setCandidates(candidates.filter((c) => c._id !== id));
      if (selectedCandidateId === id) {
        setSelectedCandidateId(null);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const getFilteredAndSorted = () => {
    // Do not re-filter by job on the client; backend already applies job filter when provided
    let filtered = [...candidates];

    // Filter by status
    if (filterStatus !== "all") {
      filtered = filtered.filter((c) => c.status === filterStatus);
    }

    // Sort
    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "name") {
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
    return filtered;
  };

  const processedCandidates = getFilteredAndSorted();

  // baseList respects the job filter (server-side). Use this for accurate status counts.
  const baseList = filterJob
    ? candidates.filter((c) => String(c.job?._id || c.job) === String(filterJob))
    : candidates;

  const handleSelectCandidate = (candidate) => {
    setSelectedCandidateId(candidate._id);
  };

  // derive selectedCandidate and selectedIndex from id so navigation remains correct after filtering/sorting
  const selectedIndex = processedCandidates.findIndex((c) => c._id === selectedCandidateId);
  const selectedCandidate = selectedIndex >= 0 ? processedCandidates[selectedIndex] : null;

  const handlePrevious = () => {
    if (selectedIndex > 0) {
      const prev = processedCandidates[selectedIndex - 1];
      setSelectedCandidateId(prev._id);
    }
  };

  const handleNext = () => {
    if (selectedIndex >= 0 && selectedIndex < processedCandidates.length - 1) {
      const next = processedCandidates[selectedIndex + 1];
      setSelectedCandidateId(next._id);
    }
  };

  const downloadResume = async () => {
    if (!selectedCandidate?.resumeUrl) return;
    try {
      // For Cloudinary URLs, try to get original format from the URL or default to pdf
      const urlParts = selectedCandidate.resumeUrl.split('/');
      const lastPart = urlParts[urlParts.length - 1];
      const extensionMatch = lastPart.match(/\.(pdf|doc|docx|txt|rtf|odt)$/i);
      const extension = extensionMatch ? extensionMatch[0] : '.pdf';
      
      // Create clean filename: AbdulResume.pdf, MadhuResume.docx, etc.
      const filename = `${selectedCandidate.name.replace(/\s+/g, '')}Resume${extension}`;
      
      // Download the file with proper blob handling
      const response = await fetch(selectedCandidate.resumeUrl);
      if (!response.ok) throw new Error('Download failed');
      const blob = await response.blob();
      const link = document.createElement('a');
      const objectUrl = URL.createObjectURL(blob);
      link.href = objectUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(objectUrl);
    } catch (e) {
      console.error('Download failed:', e);
      // Fallback: direct download
      const link = document.createElement('a');
      link.href = selectedCandidate.resumeUrl;
      link.download = `${selectedCandidate.name.replace(/\s+/g, '')}Resume.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Applicants</h1>
        <p className="text-slate-600">Review and manage job applications</p>
      </div>

      {/* Filters */}
      <div className="card mb-6 p-0">
        <div className="card-body space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Filter by Job</label>
              <select
                value={filterJob}
                onChange={(e) => setFilterJob(e.target.value)}
                className="input-field w-full"
              >
                <option value="">All Jobs ({candidates.length})</option>
                {jobs.map((j) => (
                  <option key={j._id} value={j._id}>
                    {j.title} ({candidates.filter((c) => {
                      const jobId = c.job?._id || c.job;
                      return String(jobId) === String(j._id);
                    }).length})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="input-field w-full"
              >
                <option value="all">All ({baseList.length})</option>
                <option value="reviewing">👀 Reviewing ({baseList.filter((c) => c.status === "reviewing").length})</option>
                <option value="shortlisted">⭐ Shortlisted ({baseList.filter((c) => c.status === "shortlisted").length})</option>
                <option value="interviewing">💬 Interviewing ({baseList.filter((c) => c.status === "interviewing").length})</option>
                <option value="rejected">❌ Rejected ({baseList.filter((c) => c.status === "rejected").length})</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Sort by</label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="input-field w-full"
              >
                <option value="recent">Most Recent</option>
                <option value="name">Name (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Candidates List */}
        <div className="lg:col-span-1">
          <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto">
            {loading ? (
              <div className="space-y-3">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-24 bg-slate-100 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : processedCandidates.length === 0 ? (
              <div className="card p-8 text-center">
                <div className="text-4xl mb-3">📭</div>
                <p className="text-slate-500 font-medium mb-1">No applicants found</p>
                <p className="text-slate-400 text-sm">
                  {filterStatus !== "all" || filterJob ? "Adjust your filters" : "No applicants yet"}
                </p>
              </div>
            ) : (
              processedCandidates.map((candidate, index) => (
                <div
                  key={candidate._id}
                  onClick={() => handleSelectCandidate(candidate)}
                  className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                    selectedCandidate?._id === candidate._id
                      ? "border-primary-600 bg-primary-50 shadow-md"
                      : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                  }`}
                >
                  <div className="flex gap-3">
                    {/* Avatar */}
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold text-sm flex-shrink-0">
                      {candidate.name?.charAt(0).toUpperCase() || "?"}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-slate-900 text-sm truncate">{candidate.name}</h4>
                      <p className="text-xs text-slate-600 truncate">{candidate.email}</p>
                      {/* Show job title if jobId is present, otherwise fallback to appliedFor */}
                      {candidate.job ? (
                        <p className="text-xs text-slate-500 mt-1 truncate">{candidate.job.title || candidate.appliedFor}</p>
                      ) : (
                        candidate.appliedFor && (
                          <p className="text-xs text-slate-500 mt-1 truncate">{candidate.appliedFor}</p>
                        )
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right Column - Candidate Details */}
        <div className="lg:col-span-2">
          {selectedCandidate ? (
            <div className="card p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-slate-200">
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-1">{selectedCandidate.name}</h2>
                  <p className="text-sm text-slate-600">
                    {selectedCandidate.email} • {selectedCandidate.phone}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevious}
                    disabled={selectedIndex <= 0}
                    className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Previous candidate"
                  >
                    ←
                  </button>
                  <button
                    onClick={handleNext}
                    disabled={selectedIndex === -1 || selectedIndex >= processedCandidates.length - 1}
                    className="p-2 hover:bg-slate-100 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition"
                    title="Next candidate"
                  >
                    →
                  </button>
                </div>
              </div>

              {/* Meta Info */}
              <div className="grid grid-cols-2 gap-4 mb-6 pb-6 border-b border-slate-200">
                <div>
                  <p className="text-xs text-slate-600 font-semibold mb-1">APPLIED FOR</p>
                  <p className="text-sm font-medium text-slate-900">
                    {selectedCandidate.job
                      ? selectedCandidate.job.title || selectedCandidate.appliedFor || "N/A"
                      : selectedCandidate.appliedFor || "N/A"}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-semibold mb-1">Status</p>
                  <StatusBadge
                    status={selectedCandidate.status || "reviewing"}
                    onClick={(status) => updateStatus(selectedCandidate._id, status)}
                  />
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-semibold mb-1">APPLIED ON</p>
                  <p className="text-sm font-medium text-slate-900">
                    {new Date(selectedCandidate.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-slate-600 font-semibold mb-1">DOB</p>
                  <p className="text-sm font-medium text-slate-900">{selectedCandidate.dob || "N/A"}</p>
                </div>
              </div>

              {/* Personal Info */}
              <div className="mb-6 pb-6 border-b border-slate-200">
                <h3 className="font-bold text-slate-900 mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-600">University</p>
                    <p className="font-medium text-slate-900">{selectedCandidate.university || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Branch/Field</p>
                    <p className="font-medium text-slate-900">{selectedCandidate.branch || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">Course/Year</p>
                    <p className="font-medium text-slate-900">{selectedCandidate.course || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-slate-600">CGPA/Percentage</p>
                    <p className="font-medium text-slate-900">{selectedCandidate.percentage || "N/A"}</p>
                  </div>
                </div>
              </div>

              {/* Why Join Us */}
              {selectedCandidate.whyJoinUs && (
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <h3 className="font-bold text-slate-900 mb-3">Why do you want to join us?</h3>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedCandidate.whyJoinUs}</p>
                </div>
              )}

              {/* Resume Section */}
              {selectedCandidate.resumeUrl ? (
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-slate-900">Resume</h3>
                    <div className="flex gap-2">
                      <button
                        onClick={() => window.open(selectedCandidate.resumeUrl, "_blank", "noopener,noreferrer")}
                        className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition text-sm font-medium"
                      >
                        🔗 Open in New Tab
                      </button>
                      <button
                        onClick={downloadResume}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                      >
                        📥 Download
                      </button>
                    </div>
                  </div>
                  
                  {/* Resume Preview - Full Width Embed */}
                  <div className="bg-slate-100 rounded-lg overflow-hidden border border-slate-300">
                    <div className="bg-white p-4 border-b border-slate-200 flex items-center gap-2">
                      <span className="text-lg">📄</span>
                      <span className="text-sm font-medium text-slate-700">{selectedCandidate.name} Resume</span>
                    </div>
                    {/* Embed PDF directly; for non-PDFs use Google Docs viewer to render */}
                    {(() => {
                      try {
                        const parts = (selectedCandidate.resumeUrl || "").split(".");
                        const ext = parts[parts.length - 1].toLowerCase().split(/[#?]/)[0];
                        const isPdf = ext === "pdf";
                        const embedUrl = isPdf
                          ? selectedCandidate.resumeUrl
                          : `https://docs.google.com/gview?url=${encodeURIComponent(selectedCandidate.resumeUrl)}&embedded=true`;
                        return (
                          <iframe
                            src={embedUrl}
                            className="w-full h-[600px] bg-white"
                            title="Resume Preview"
                            onError={(e) => {
                              console.error("Failed to load resume preview:", e);
                            }}
                          />
                        );
                      } catch (err) {
                        console.error(err);
                        return (
                          <div className="p-6 text-center text-slate-500">Unable to preview this file type. Use Open in New Tab to view or Download to save.</div>
                        );
                      }
                    })()}
                  </div>
                  <p className="text-xs text-slate-500 mt-2 text-center">
                    Click "Download" to save, or "Open in New Tab" to view in full screen
                  </p>
                </div>
              ) : (
                <div className="mb-6 pb-6 border-b border-slate-200">
                  <p className="text-sm text-slate-500">❌ No resume uploaded</p>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  onClick={() => remove(selectedCandidate._id)}
                  className="flex items-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium text-sm transition-colors"
                >
                  🗑️ Remove Candidate
                </button>
              </div>
            </div>
          ) : (
            <div className="card p-12 text-center">
              <div className="text-5xl mb-4">👤</div>
              <p className="text-slate-500 font-medium">Select a candidate to view details</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
