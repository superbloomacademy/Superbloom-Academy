import React, { useEffect, useState } from "react";
import { Mail, MessageCircle, RefreshCw } from "lucide-react";
import api from "../utils/api";
import CampaignForm from "../components/CampaignForm";
import CampaignPanel from "../components/CampaignPanel";

const kindLabel = { workshop_invite: "Workshop invitation", course_offer: "Course offer", feedback: "Feedback request" };
const statusBadge = { draft: ["badge-warning", "Not sent yet"], sending: ["badge-info", "Part sent"], sent: ["badge-success", "Sent"] };

const showDate = (d) =>
  d ? new Date(d).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) : "-";
const when = (d) =>
  new Date(d).toLocaleString("en-IN", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" });

const delivered = (c = {}) => (c.sent || 0) + (c.delivered || 0) + (c.read || 0);

// Whether email and WhatsApp can send right now, and what to do when one cannot.
function Channels({ channels, loading, onCheck }) {
  const mail = channels?.email;
  const wa = channels?.whatsapp;
  return (
    <section className="card mb-8" aria-label="Sending channels">
      <div className="card-header flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-lg font-bold text-slate-900">Sending channels</h2>
        <button onClick={onCheck} disabled={loading} className="btn-secondary btn-sm">
          <RefreshCw size={16} aria-hidden className={loading ? "animate-spin" : ""} /> Check again
        </button>
      </div>
      <div className="card-body grid gap-4 md:grid-cols-2">
        {!channels ? (
          <div className="skeleton h-20 md:col-span-2" />
        ) : (
          <>
            <div>
              <p className="flex items-center gap-2 font-semibold text-slate-900">
                <Mail size={18} aria-hidden className="text-slate-500" /> Email
                <span className={mail.working ? "badge-success" : mail.configured ? "badge-danger" : "badge-warning"}>
                  {mail.working ? "Working" : mail.configured ? "Not working" : "Not set up"}
                </span>
              </p>
              <p className="mt-1.5 text-sm text-slate-600">
                {mail.working
                  ? `Sent from ${mail.from}.`
                  : mail.configured
                    ? mail.error
                    : `The server is missing: ${mail.missing.join(", ")}. See Workshop emails on the Workshops page.`}
              </p>
            </div>
            <div>
              <p className="flex items-center gap-2 font-semibold text-slate-900">
                <MessageCircle size={18} aria-hidden className="text-slate-500" /> WhatsApp
                <span className={wa.working ? "badge-success" : wa.configured ? "badge-danger" : "badge-warning"}>
                  {wa.working ? "Connected" : wa.configured ? "Not working" : "Not connected"}
                </span>
              </p>
              <p className="mt-1.5 text-sm text-slate-600">
                {wa.working ? (
                  <>
                    Sent from {wa.name} ({wa.number}), the academy's business number. {channels.templates.length} approved
                    {channels.templates.length === 1 ? " template" : " templates"}.
                    {!wa.webhook && " Delivered and read reports are off until WHATSAPP_VERIFY_TOKEN is set."}
                  </>
                ) : wa.configured ? (
                  wa.error
                ) : (
                  <>
                    WhatsApp needs a business number connected through Meta. Follow docs/WHATSAPP-SETUP-GUIDE.md, add{" "}
                    {wa.missing.join(", ")} in Vercel (backend project), redeploy and press Check again. Email campaigns work
                    without it.
                  </>
                )}
              </p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState([]);
  const [workshops, setWorkshops] = useState([]);
  const [lists, setLists] = useState([]);
  const [channels, setChannels] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checking, setChecking] = useState(false);
  const [creating, setCreating] = useState(false);
  const [open, setOpen] = useState(null); // { id, summary }
  const [error, setError] = useState("");

  const load = async () => {
    try {
      const res = await api.get("/admin/campaigns");
      setCampaigns(res.data.campaigns || []);
    } catch (err) {
      setError(err.response?.data?.message || "Could not load the campaigns.");
    } finally {
      setLoading(false);
    }
  };

  const check = async () => {
    setChecking(true);
    try {
      const res = await api.get("/admin/campaigns/channels");
      setChannels(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Could not check email and WhatsApp.");
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    load();
    check();
    api.get("/admin/workshops").then((res) => setWorkshops(res.data.workshops || [])).catch(console.error);
    api.get("/admin/students/lists").then((res) => setLists(res.data.lists || [])).catch(console.error);
  }, []);

  const remove = async (c) => {
    if (!confirm(`Delete "${c.name}" and its sending record? Messages already sent stay sent.`)) return;
    try {
      await api.delete(`/admin/campaigns/${c._id}`);
      if (open?.id === c._id) setOpen(null);
      load();
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete the campaign.");
    }
  };

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="mb-1 text-3xl font-bold text-slate-900">Campaigns</h1>
          <p className="text-slate-600">Invite past students to a workshop, offer a course or ask for feedback, by email and WhatsApp.</p>
        </div>
        <button onClick={() => { setCreating(true); setOpen(null); }} className="btn-primary">+ New campaign</button>
      </div>

      {error && <div role="alert" className="alert-error mb-6">{error}</div>}

      {creating && (
        <CampaignForm
          workshops={workshops}
          lists={lists}
          channels={channels}
          onCancel={() => setCreating(false)}
          onSaved={(campaign, summary) => {
            setCreating(false);
            setOpen({ id: campaign._id, summary });
            load();
          }}
        />
      )}

      {open && <CampaignPanel id={open.id} summary={open.summary} onClose={() => setOpen(null)} onChanged={load} />}

      <div className="card mb-8">
        <div className="card-body p-0">
          {loading ? (
            <div className="space-y-4 p-6">{[1, 2, 3].map((i) => <div key={i} className="skeleton h-14" />)}</div>
          ) : campaigns.length === 0 ? (
            <div className="p-12 text-center text-slate-500">No campaigns yet. Create the first one.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="table">
                <thead>
                  <tr><th>Campaign</th><th>Students</th><th>Email</th><th>WhatsApp</th><th>Status</th><th className="text-right">Actions</th></tr>
                </thead>
                <tbody>
                  {campaigns.map((c) => (
                    <tr key={c._id}>
                      <td>
                        <button onClick={() => { setOpen({ id: c._id }); setCreating(false); }} className="text-left font-medium text-primary-700 hover:underline">{c.name}</button>
                        <div className="text-xs text-slate-500">{kindLabel[c.kind]}, created {showDate(c.createdAt)}</div>
                      </td>
                      <td className="text-sm text-slate-700">{c.counts.total}</td>
                      <td className="text-sm text-slate-700">
                        {c.channels.email ? <>{delivered(c.counts.mail)} sent{c.counts.mail.failed ? <span className="badge-danger ml-2">{c.counts.mail.failed} failed</span> : null}</> : "-"}
                      </td>
                      <td className="text-sm text-slate-700">
                        {c.channels.whatsapp ? (
                          <>
                            {delivered(c.counts.whatsapp)} sent{c.counts.whatsapp.read ? `, ${c.counts.whatsapp.read} read` : ""}
                            {c.counts.whatsapp.failed ? <span className="badge-danger ml-2">{c.counts.whatsapp.failed} failed</span> : null}
                          </>
                        ) : "-"}
                      </td>
                      <td><span className={statusBadge[c.status][0]}>{statusBadge[c.status][1]}</span></td>
                      <td className="whitespace-nowrap text-right">
                        <button onClick={() => { setOpen({ id: c._id }); setCreating(false); }} className="btn-secondary btn-sm mr-2">Open</button>
                        <button onClick={() => remove(c)} className="btn-danger btn-sm">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      <Channels channels={channels} loading={checking} onCheck={check} />

      {channels?.replies?.length > 0 && (
        <section className="card mb-8" aria-label="WhatsApp replies">
          <div className="card-header">
            <h2 className="text-lg font-bold text-slate-900">Replies on WhatsApp</h2>
            <p className="text-sm text-slate-600">
              What students wrote back to the business number. It has no phone app, so answer from the academy's usual WhatsApp.
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr><th>When</th><th>From</th><th>Message</th><th className="text-right">Answer</th></tr>
              </thead>
              <tbody>
                {channels.replies.map((r) => (
                  <tr key={r._id}>
                    <td className="whitespace-nowrap text-sm text-slate-600">{when(r.at)}</td>
                    <td className="text-sm">
                      <div className="font-medium text-slate-900">{r.name || "Unknown"}</div>
                      <div className="text-xs text-slate-500">+{r.from}</div>
                    </td>
                    <td className="max-w-[28rem] whitespace-pre-wrap text-sm text-slate-700">{r.text}</td>
                    <td className="text-right">
                      <a href={`https://wa.me/${r.from}`} target="_blank" rel="noopener noreferrer" className="btn-secondary btn-sm">
                        <MessageCircle size={16} aria-hidden /> Reply
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}
