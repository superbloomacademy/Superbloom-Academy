import React, { useEffect, useState } from "react";
import api from "../utils/api";
import {
  Mail,
  Phone,
  Trash2,
  User,
  BookOpen,
  Calendar,
  MessageSquare,
  GraduationCap,
  ClipboardList,
} from "lucide-react";

export default function Admissions() {
  const [admissions, setAdmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("recent");
  const [filterStream, setFilterStream] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedId, setSelectedId] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/admissions");
      setAdmissions(res.data.admissions || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetch();
  }, []);

  const remove = async (id) => {
    if (!confirm("Delete this admission request?")) return;
    try {
      await api.delete(`/admin/admissions/${id}`);
      setAdmissions(admissions.filter((a) => a._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const streams = [...new Set(admissions.map((a) => a.stream).filter(Boolean))];
  const statuses = [...new Set(admissions.map((a) => a.status).filter(Boolean))];

  const getFilteredAndSorted = () => {
    let filtered = admissions;

    if (filterStream !== "all") {
      filtered = filtered.filter((a) => a.stream === filterStream);
    }
    if (filterStatus !== "all") {
      filtered = filtered.filter((a) => a.status === filterStatus);
    }

    const sorted = [...filtered];
    if (sortBy === "recent") {
      sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "name") {
      sorted.sort((a, b) => a.name.localeCompare(b.name));
    }
    return sorted;
  };

  const processedAdmissions = getFilteredAndSorted();

  const getStreamColor = (stream) => {
    const colors = {
      engineering: "from-blue-500 to-blue-600",
      pharmacy: "from-emerald-500 to-emerald-600",
      management: "from-purple-500 to-purple-600",
      arts: "from-amber-500 to-amber-600",
    };
    return colors[stream?.toLowerCase()] || "from-slate-500 to-slate-600";
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-1">Admissions</h1>
          <p className="text-slate-600">Manage student admission inquiries</p>
        </div>
        <a
          href="/admission"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-4 md:mt-0 inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + New Application
        </a>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="relative overflow-hidden card border border-emerald-200 hover:shadow-xl group cursor-pointer transition-all transform hover:-translate-y-1">
          <div className="absolute top-0 right-0 w-32 h-32 bg-emerald rounded-full blur-3xl opacity-10"></div>
          <div className="card-body relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 rounded-xl bg-emerald bg-opacity-10">
                      <ClipboardList className="w-6 h-6 text-emerald-500" />
                    </div>
              <div className="w-10 h-10 rounded-lg bg-emerald bg-opacity-20 group-hover:bg-opacity-30 flex items-center justify-center transition-all text-lg font-bold text-slate-900">↗</div>
            </div>
            <p className="text-slate-600 text-sm font-medium mb-1">Total Inquiries</p>
            <p className="text-3xl font-bold text-slate-900">{admissions.length}</p>
          </div>
        </div>
        {streams.map((stream) => (
          <div key={stream} className="relative overflow-hidden card border border-blue-200 hover:shadow-xl group cursor-pointer transition-all transform hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue rounded-full blur-3xl opacity-10"></div>
            <div className="card-body relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="p-3 rounded-xl bg-blue bg-opacity-10">
                        <GraduationCap className="w-6 h-6 text-blue-500" />
                      </div>
                <div className="w-10 h-10 rounded-lg bg-blue bg-opacity-20 group-hover:bg-opacity-30 flex items-center justify-center transition-all text-lg font-bold text-slate-900">→</div>
              </div>
              <p className="text-slate-600 text-sm font-medium mb-1 capitalize">{stream}</p>
              <p className="text-3xl font-bold text-slate-900">{admissions.filter((a) => a.stream === stream).length}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="card mb-6 p-0">
        <div className="card-body space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">Filter by Stream</label>
              <select
                value={filterStream}
                onChange={(e) => setFilterStream(e.target.value)}
                className="input-field w-full"
              >
                <option value="all">All Streams ({admissions.length})</option>
                {streams.map((stream) => (
                  <option key={stream} value={stream}>
                    {stream.charAt(0).toUpperCase() + stream.slice(1)} (
                    {admissions.filter((a) => a.stream === stream).length})
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
                <option value="all">Select Status</option>
                {statuses.map((st) => (
                  <option key={st} value={st}>
                    {st.charAt(0).toUpperCase() + st.slice(1)} ({admissions.filter((a) => a.status === st).length})
                  </option>
                ))}
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

            <div className="flex items-end">
              <div className="text-sm text-slate-600 px-4 py-2 bg-slate-50 rounded-lg w-full text-center">
                {processedAdmissions.length} result{processedAdmissions.length !== 1 ? "s" : ""}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Admissions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-slate-100 rounded-xl animate-pulse"></div>
            ))}
          </div>
        ) : processedAdmissions.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="text-5xl mb-4">🎓</div>
            <p className="text-slate-500 text-lg font-medium mb-2">No admission inquiries found</p>
            <p className="text-slate-400 text-sm">
              {filterStream !== "all" ? "Try adjusting your filters" : "No inquiries yet"}
            </p>
          </div>
        ) : (
          processedAdmissions.map((admission) => (
            <div
              key={admission._id}
              className="card hover:shadow-md transition-all p-6 border border-slate-200 cursor-pointer"
              onClick={() => setSelectedId(selectedId === admission._id ? null : admission._id)}
            >
              <div className="flex justify-between items-start gap-4 mb-4">
                <div className="flex items-start gap-4 flex-1">
                  {/* Avatar */}
                  <div
                    className={`w-12 h-12 rounded-full bg-gradient-to-br ${getStreamColor(
                      admission.stream
                    )} flex items-center justify-center text-white font-semibold text-lg flex-shrink-0`}
                  >
                    {admission.name?.charAt(0).toUpperCase() || "?"}
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-slate-900 mb-1">{admission.name}</h3>
                    <div className="flex flex-wrap gap-2 text-sm text-slate-600 items-center">
                      <div className="flex flex-wrap gap-4 text-sm text-slate-600 items-center">
                      <div className="flex items-center gap-1">
                        <Mail className="w-4 h-4" />
                        <span>{admission.email}</span>
                      </div>
                      {admission.phone && (
                        <div className="flex items-center gap-1">
                          <Phone className="w-4 h-4" />
                          <span>{admission.phone}</span>
                        </div>
                      )}
                      {admission.course && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full">
                          <BookOpen className="w-4 h-4" /> {admission.course}
                        </span>
                      )}
                      {admission.stream && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 bg-slate-100 rounded-full">
                          <GraduationCap className="w-4 h-4" /> {admission.stream.charAt(0).toUpperCase() + admission.stream.slice(1)}
                        </span>
                      )}
                      {admission.status && (
                        <span
                          className={
                            "inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold " +
                            (admission.status === "new"
                              ? "bg-green-100 text-green-800"
                              : admission.status === "under review"
                              ? "bg-yellow-100 text-yellow-800"
                              : admission.status === "accepted"
                              ? "bg-emerald-100 text-emerald-800"
                              : "bg-red-100 text-red-800")
                          }
                        >
                          {admission.status.toUpperCase()}
                        </span>
                      )}
                    </div>
                    </div>
                  </div>
                </div>

                {/* Date */}
                {admission.createdAt && (
                  <div className="text-right text-xs text-slate-500">
                    {new Date(admission.createdAt).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </div>
                )}
              </div>

              {/* Message Preview */}
              {admission.message && (
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">{admission.message}</p>
              )}

              {/* Actions */}
              <div className="flex gap-2">
                <button
                    onClick={(e) => {
                      e.stopPropagation();
                      remove(admission._id);
                    }}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium text-sm transition-colors"
                  >
                    <Trash2 className="w-4 h-4" /> Delete
                  </button>
              </div>

              {/* Expanded Message */}
              {selectedId === admission._id && (
                <div className="mt-4 pt-4 border-t border-slate-200 bg-slate-50 p-4 rounded-lg space-y-6">
                  {/* Personal */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-900">
                      <User className="w-5 h-5" /> Personal Details
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-500">
                      <div>DOB: {admission.dob || "-"}</div>
                      <div>Address: {admission.address || "-"}</div>
                      <div>First Name: {admission.firstName || "-"}</div>
                      <div>Last Name: {admission.lastName || "-"}</div>
                    </div>
                  </div>

                  {/* Educational */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-900">
                      <BookOpen className="w-5 h-5" /> Educational Background
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-500">
                      <div>Qualification: {admission.course || "-"}</div>
                      <div>Institution: {admission.institution || "-"}</div>
                      <div>Year of Study: {admission.yearOfStudy || "-"}</div>
                    </div>
                  </div>

                  {/* Program */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-900">
                      <Calendar className="w-5 h-5" /> Program Details
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-500">
                      <div>Preferred Duration: {admission.duration || "-"}</div>
                      <div>Referral: {admission.hearAboutUs || "-"}</div>
                    </div>
                  </div>

                  {/* Motivation */}
                  <div>
                    <div className="flex items-center gap-2 mb-2 text-sm font-semibold text-slate-900">
                      <MessageSquare className="w-5 h-5" /> Motivation
                    </div>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      {admission.message || "-"}
                    </p>
                  </div>

                  {/* Raw data for debugging */}
                  <div className="mt-4 text-xs text-slate-400">
                    <details>
                      <summary className="cursor-pointer">View raw JSON</summary>
                      <pre className="whitespace-pre-wrap break-all bg-gray-100 p-2 rounded mt-2">
{JSON.stringify(admission, null, 2)}
                      </pre>
                    </details>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
