import React, { useEffect, useState } from "react";
import api from "../utils/api";

const statuses = ["new", "contacted", "meeting scheduled", "proposal sent", "converted", "lost"];

export default function Colleges() {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    api.get("/admin/college-enquiries")
      .then((res) => setEnquiries(res.data.enquiries || []))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const setStatus = async (id, status) => {
    await api.patch(`/admin/college-enquiries/${id}/status`, { status });
    setEnquiries(enquiries.map((e) => (e._id === id ? { ...e, status } : e)));
  };

  const remove = async (id) => {
    if (!confirm("Delete this enquiry?")) return;
    await api.delete(`/admin/college-enquiries/${id}`);
    setEnquiries(enquiries.filter((e) => e._id !== id));
  };

  const detail = (label, value) => (
    <div className="bg-white p-4 rounded-lg border border-slate-200">
      <p className="text-xs text-slate-500 font-semibold mb-1">{label}</p>
      <p className="text-sm font-medium text-slate-900">{value || "-"}</p>
    </div>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">College enquiries</h1>
        <p className="text-slate-600">Proposal requests from colleges ({enquiries.length})</p>
      </div>

      <div className="card">
        <div className="card-body p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-14 bg-slate-100 rounded-lg animate-pulse"></div>)}
            </div>
          ) : enquiries.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No college enquiries yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr><th>College</th><th>Contact</th><th>Programme</th><th>Received</th><th>Status</th><th className="text-right">Action</th></tr>
                </thead>
                <tbody>
                  {enquiries.map((e) => (
                    <React.Fragment key={e._id}>
                      <tr className="cursor-pointer" onClick={() => setOpenId(openId === e._id ? null : e._id)}>
                        <td>
                          <div className="font-medium text-slate-900">{e.collegeName}</div>
                          <div className="text-xs text-slate-500">{e.location}</div>
                        </td>
                        <td className="text-sm text-slate-600">{e.contactPerson}<div className="text-xs">{e.phone}</div></td>
                        <td className="text-sm text-slate-600">{e.program || "-"}</td>
                        <td className="text-sm text-slate-600">{new Date(e.createdAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })}</td>
                        <td onClick={(ev) => ev.stopPropagation()}>
                          <select value={e.status} onChange={(ev) => setStatus(e._id, ev.target.value)} className="input-field py-1.5 text-sm">
                            {statuses.map((s) => <option key={s}>{s}</option>)}
                          </select>
                        </td>
                        <td className="text-right" onClick={(ev) => ev.stopPropagation()}>
                          <button onClick={() => remove(e._id)} className="btn-danger btn-sm">Delete</button>
                        </td>
                      </tr>
                      {openId === e._id && (
                        <tr>
                          <td colSpan={6} className="bg-slate-50">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                              {detail("College type", e.collegeType)}
                              {detail("Designation", e.designation)}
                              {detail("Email", e.email)}
                              {detail("Number of students", e.students)}
                              {detail("Departments", e.departments)}
                              {detail("Year of study", e.year)}
                              {detail("Training mode", e.mode)}
                              {detail("Timeline", e.timeline)}
                            </div>
                            {e.message && <div className="mt-4 bg-white p-4 rounded-lg border border-slate-200 text-sm text-slate-700">{e.message}</div>}
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
