import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Dashboard() {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const accessToken = localStorage.getItem("sb_token");
      
      try {
        const res = await api.get("/admin/stats", accessToken);
        
        setStats(res.data);
      } catch (e) {
        console.error(e);
      }
    };
    fetch();
  }, []);

  return (
    <div>
      <h1 className="text-2xl mb-4">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded shadow">
          Total Jobs: <strong>{stats?.totalJobs ?? "—"}</strong>
        </div>
        <div className="bg-white p-4 rounded shadow">
          Total Candidates: <strong>{stats?.totalCandidates ?? "—"}</strong>
        </div>
        <div className="bg-white p-4 rounded shadow">
          Total Admissions: <strong>{stats?.totalAdmissions ?? "—"}</strong>
        </div>
        <div className="bg-white p-4 rounded shadow">
          Total Contacts: <strong>{stats?.totalContacts ?? "—"}</strong>
        </div>
      </div>
    </div>
  );
}
