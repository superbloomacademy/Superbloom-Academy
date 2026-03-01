import React, { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, FileText, Briefcase, MapPin, Clock } from "lucide-react";
import api from "../utils/api";
import SEO from "../utils/SEO";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    university: "",
    branch: "",
    course: "",
    percentage: "",
    whyJoinUs: "",
    dob: "",
  });
  const [resume, setResume] = useState(null);
  const [resumeFileName, setResumeFileName] = useState("");

  const hasFetched = useRef(false);

  useEffect(() => {
    if (hasFetched.current) return;
    hasFetched.current = true;

    const fetchJob = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);
      } catch (e) {
        console.error(e);
        setError("Failed to load job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setResume(file);
      setResumeFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!resume) {
      setError("Please upload your resume");
      return;
    }

    const fd = new FormData();
    Object.keys(form).forEach((k) => fd.append(k, form[k]));
    fd.append("job", id);
    fd.append("resume", resume);

    setSubmitting(true);
    try {
      await api.post("/public/apply", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setSuccess("🎉 Application submitted successfully! We'll review it soon.");
      setForm({
        name: "",
        email: "",
        phone: "",
        university: "",
        branch: "",
        course: "",
        percentage: "",
        whyJoinUs: "",
        dob: "",
      });
      setResume(null);
      setResumeFileName("");
    } catch (e) {
      console.error(e);
      setError(e.response?.data?.message || "Error submitting application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <div className="w-8 h-8 border-3 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600 font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">😕</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-8">This job posting may have been removed or is no longer available.</p>
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <SEO
        title={`${job?.title || "Job"} - Superbloom Academy Careers`}
        description={`${job?.description?.substring(0, 150) || 'Join our team at Superbloom Academy. Explore exciting career opportunities.'}`}
        url={`https://www.superbloomacademy.in/careers/${id}`}
      />
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-800 text-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            to="/careers"
            className="inline-flex items-center gap-2 text-blue-100 hover:text-white transition mb-6 font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Careers
          </Link>
          <h1 className="text-4xl md:text-5xl font-bold mb-6">{job.title}</h1>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
            <div>
              <p className="text-blue-100 text-sm mb-1">Department</p>
              <p className="font-semibold text-lg">{job.department || "N/A"}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Location</p>
              <p className="font-semibold text-lg">{job.location || "N/A"}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Location Type</p>
              <p className="font-semibold text-lg">{job.locationType || "in-person"}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Job Type</p>
              <p className="font-semibold text-lg">{job.jobType || "N/A"}</p>
            </div>
            <div>
              <p className="text-blue-100 text-sm mb-1">Salary</p>
              <p className="font-semibold text-lg">{job.salary || "Competitive"}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold ${
                job.status === "open"
                  ? "bg-emerald-500/20 text-emerald-100"
                  : "bg-red-500/20 text-red-100"
              }`}
            >
              {job.status === "open" ? "🟢 Actively Hiring" : "❌ Position Closed"}
            </span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Job Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Job Description Card */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                <Briefcase className="w-6 h-6 text-blue-600" />
                Job Description
              </h2>
              <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
                {job.description}
              </p>
            </div>

            {/* Key Info Card */}
            {(job.hiringCount || job.hiringTimeline || job.benefits) && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 hover:shadow-md transition">
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Briefcase className="w-6 h-6 text-blue-600" />
                  Position Details
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {job.hiringCount && (
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <p className="text-sm text-gray-600 font-semibold mb-2">Positions Available</p>
                      <p className="text-3xl font-bold text-blue-600">{job.hiringCount}</p>
                    </div>
                  )}
                  {job.hiringTimeline && (
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <p className="text-sm text-gray-600 font-semibold mb-2">Hiring Timeline</p>
                      <p className="text-lg font-bold text-emerald-600 capitalize">
                        {job.hiringTimeline}
                      </p>
                    </div>
                  )}
                  {job.benefits && job.benefits.length > 0 && (
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                      <p className="text-sm text-gray-600 font-semibold mb-2">Benefits</p>
                      <p className="text-lg font-bold text-purple-600">{job.benefits.length}+ Benefits</p>
                    </div>
                  )}
                </div>
                {job.benefits && job.benefits.length > 0 && (
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <p className="font-semibold text-gray-900 mb-4">What We Offer:</p>
                    <ul className="space-y-2">
                      {job.benefits.map((benefit, idx) => (
                        <li key={idx} className="flex items-start gap-3 text-gray-700">
                          <span className="text-emerald-600 font-bold text-lg mt-0.5">✓</span>
                          <span>{benefit}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Right Column - Application Form */}
          <div className="lg:col-span-1">
            <div className="sticky top-6 bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Apply Now</h3>
              <p className="text-gray-600 text-sm mb-6">Join our team. Submit your application below.</p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700 text-sm font-medium">{error}</p>
                </div>
              )}

              {success && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                  <p className="text-emerald-700 text-sm font-medium">{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="John Doe"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
                    required
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="john@example.com"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
                    required
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
                  />
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="dob"
                    value={form.dob}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
                  />
                </div>

                {/* University */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    University
                  </label>
                  <input
                    type="text"
                    name="university"
                    value={form.university}
                    onChange={handleChange}
                    placeholder="e.g., MIT"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
                  />
                </div>

                {/* Branch */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Branch/Field
                  </label>
                  <input
                    type="text"
                    name="branch"
                    value={form.branch}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
                  />
                </div>

                {/* Course */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Course/Year
                  </label>
                  <input
                    type="text"
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    placeholder="e.g., B.Tech 2nd Year"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
                  />
                </div>

                {/* CGPA/Percentage */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    CGPA / Percentage
                  </label>
                  <input
                    type="number"
                    name="percentage"
                    value={form.percentage}
                    onChange={handleChange}
                    placeholder="8.5"
                    step="0.1"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50"
                  />
                </div>

                {/* Why Join Us */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Why do you want to join us?
                  </label>
                  <textarea
                    name="whyJoinUs"
                    value={form.whyJoinUs}
                    onChange={handleChange}
                    placeholder="Tell us what excites you about this role..."
                    rows="3"
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition bg-gray-50 resize-none"
                  />
                </div>

                {/* Resume Upload */}
                <div>
                  <label className="block text-sm font-semibold text-gray-900 mb-2">
                    Resume * <span className="text-xs text-gray-600 font-normal">(PDF, DOC, DOCX - Max 5MB)</span>
                  </label>
                  <label className="flex items-center justify-center w-full px-4 py-6 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 transition bg-gray-50 hover:bg-blue-50">
                    <div className="text-center">
                      <FileText className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm font-medium text-gray-700">
                        {resumeFileName || "Click to upload resume"}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">or drag and drop</p>
                    </div>
                    <input
                      type="file"
                      name="resume"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                      required
                    />
                  </label>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={submitting || !resume}
                  className={`w-full py-3 rounded-lg font-bold text-white transition-all flex items-center justify-center gap-2 ${
                    submitting || !resume
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 active:scale-95 shadow-lg shadow-blue-500/30"
                  }`}
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Submitting...
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      Submit Application
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  By submitting, you agree to our privacy policy and terms of service.
                </p>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
