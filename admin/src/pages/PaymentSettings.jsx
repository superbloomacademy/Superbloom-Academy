import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function PaymentSettings() {
  const [form, setForm] = useState({ upiId: "", payeeName: "", instructions: "" });
  const [qrImage, setQrImage] = useState("");
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [removeQr, setRemoveQr] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null); // { type, text }

  useEffect(() => {
    api.get("/admin/payment").then((res) => {
      const p = res.data.payment;
      if (!p) return;
      setForm({ upiId: p.upiId || "", payeeName: p.payeeName || "", instructions: p.instructions || "" });
      setQrImage(p.qrImage || "");
    }).catch(console.error);
  }, []);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const pickFile = (e) => {
    const f = e.target.files[0];
    setFile(f || null);
    setRemoveQr(false);
    setPreview(f ? URL.createObjectURL(f) : "");
  };

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    if (file) data.append("qr", file);
    if (removeQr) data.append("removeQr", "true");
    try {
      const res = await api.put("/admin/payment", data);
      setQrImage(res.data.payment.qrImage || "");
      setFile(null);
      setPreview("");
      setRemoveQr(false);
      setMessage({ type: "success", text: "Payment details saved. Workshop pages will show them within a minute." });
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Could not save the payment details." });
    } finally {
      setSaving(false);
    }
  };

  const shown = removeQr ? "" : preview || qrImage;

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Payment details</h1>
        <p className="text-slate-600">The UPI ID and QR code students see when they register for a paid workshop.</p>
      </div>

      <form onSubmit={save} className="card max-w-3xl">
        <div className="card-body grid md:grid-cols-[1fr_16rem] gap-8">
          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-700">UPI ID *
              <input name="upiId" value={form.upiId} onChange={set} required placeholder="name@bank" className="input-field mt-1" />
            </label>
            <label className="block text-sm font-medium text-slate-700">Name shown to the payer
              <input name="payeeName" value={form.payeeName} onChange={set} placeholder="Superbloom Academy" className="input-field mt-1" />
            </label>
            <label className="block text-sm font-medium text-slate-700">Note for students (optional)
              <textarea name="instructions" value={form.instructions} onChange={set} placeholder="For example: add your name in the payment note." className="input-field mt-1" />
            </label>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-700 mb-2">QR code</p>
            <div className="aspect-square rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 flex items-center justify-center overflow-hidden">
              {shown ? <img src={shown} alt="UPI QR code" className="w-full h-full object-contain" /> : <span className="text-sm text-slate-400 px-4 text-center">No QR code uploaded</span>}
            </div>
            <input type="file" accept="image/png,image/jpeg,image/webp" onChange={pickFile} className="mt-3 block w-full text-sm text-slate-600" />
            <p className="text-xs text-slate-500 mt-1">PNG, JPG or WebP, under 700 KB.</p>
            {qrImage && !preview && !removeQr && (
              <button type="button" onClick={() => setRemoveQr(true)} className="mt-2 text-sm text-red-600 hover:underline">Remove QR code</button>
            )}
          </div>

          {message && <div className={`md:col-span-2 ${message.type === "success" ? "alert-success" : "alert-error"}`}>{message.text}</div>}
        </div>
        <div className="card-footer">
          <button type="submit" disabled={saving} className="btn-primary">{saving ? "Saving..." : "Save payment details"}</button>
        </div>
      </form>
    </div>
  );
}
