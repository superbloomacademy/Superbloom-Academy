import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../utils/api";

export default function JobDetails() {
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
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

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await api.get(`/jobs/${id}`);
        setJob(res.data.job);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) return alert("Resume required");
    const fd = new FormData();
    Object.keys(form).forEach((k) => fd.append(k, form[k]));
    fd.append("job", id);
    fd.append("resume", resume);
    setSubmitting(true);
    try {
      await api.post("/public/apply", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("Application submitted");
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
    } catch (e) {
      console.error(e);
      alert(e.response?.data?.message || "Error submitting");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!job) return <div className="p-8">Job not found</div>;

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-semibold mb-4">{job.title}</h1>
      <p className="text-sm text-gray-600 mb-2">
        {job.department} • {job.location}
      </p>
      <div className="prose max-w-none mb-6">{job.description}</div>

      <h2 className="text-2xl font-medium mb-3">Apply for this role</h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Full name"
          className="border p-2 rounded"
          required
        />
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          type="email"
          className="border p-2 rounded"
          required
        />
        <input
          name="phone"
          value={form.phone}
          onChange={handleChange}
          placeholder="Phone"
          className="border p-2 rounded"
        />
        <input
          name="dob"
          value={form.dob}
          onChange={handleChange}
          placeholder="Date of birth"
          type="date"
          className="border p-2 rounded"
        />
        <input
          name="university"
          value={form.university}
          onChange={handleChange}
          placeholder="University"
          className="border p-2 rounded"
        />
        <input
          name="branch"
          value={form.branch}
          onChange={handleChange}
          placeholder="Branch"
          className="border p-2 rounded"
        />
        <input
          name="course"
          value={form.course}
          onChange={handleChange}
          placeholder="Course"
          className="border p-2 rounded"
        />
        <input
          name="percentage"
          value={form.percentage}
          onChange={handleChange}
          placeholder="Percentage"
          className="border p-2 rounded"
        />
        <textarea
          name="whyJoinUs"
          value={form.whyJoinUs}
          onChange={handleChange}
          placeholder="Why join us"
          className="border p-2 rounded md:col-span-2"
        />
        <div className="md:col-span-2">
          <label className="block mb-1">Resume (pdf/doc/docx, max 5MB)</label>
          <input
            type="file"
            accept=".pdf,.doc,.docx"
            onChange={(e) => setResume(e.target.files[0])}
          />
        </div>
        <div className="md:col-span-2">
          <button
            disabled={submitting}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            {submitting ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </form>
    </div>
  );
}
