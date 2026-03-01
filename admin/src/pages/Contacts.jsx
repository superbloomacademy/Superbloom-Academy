import React, { useEffect, useState } from "react";
import api from "../utils/api";

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("date"); // date, name, email
  const [sortOrder, setSortOrder] = useState("desc"); // asc, desc
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  const fetch = async () => {
    setLoading(true);
    try {
      const res = await api.get("/admin/contacts");
      setContacts(res.data.contacts || []);
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
    if (!confirm("Delete this message?")) return;
    try {
      await api.delete(`/admin/contacts/${id}`);
      setContacts(contacts.filter((c) => c._id !== id));
    } catch (e) {
      console.error(e);
    }
  };

  const sortContacts = (data) => {
    const sorted = [...data];
    sorted.sort((a, b) => {
      let aVal, bVal;
      if (sortBy === "name") {
        aVal = a.name.toLowerCase();
        bVal = b.name.toLowerCase();
      } else if (sortBy === "email") {
        aVal = a.email.toLowerCase();
        bVal = b.email.toLowerCase();
      } else {
        aVal = new Date(a.createdAt).getTime();
        bVal = new Date(b.createdAt).getTime();
      }

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });
    return sorted;
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.subject && contact.subject.toLowerCase().includes(searchQuery.toLowerCase())) ||
      contact.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedContacts = sortContacts(filteredContacts);

  const toggleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
  };

  const SortButton = ({ field, label }) => (
    <button
      onClick={() => toggleSort(field)}
      className={`flex items-center gap-2 px-3 py-2 rounded-lg font-medium text-sm transition-colors ${
        sortBy === field
          ? "bg-primary-100 text-primary-700"
          : "bg-slate-100 text-slate-600 hover:bg-slate-200"
      }`}
    >
      {label}
      {sortBy === field && <span>{sortOrder === "asc" ? "↑" : "↓"}</span>}
    </button>
  );

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-1">Messages</h1>
        <p className="text-slate-600">Manage contact form submissions ({filteredContacts.length})</p>
      </div>

      <div className="card">
        {/* Header with filters and sort */}
        <div className="card-header border-b border-slate-200">
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-slate-900">Contact Messages</h2>

            {/* Search Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder="Search by name, email, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:border-primary-500 focus:ring-1 focus:ring-primary-500 text-sm"
                />
              </div>
            </div>

            {/* Sort Options */}
            <div className="flex gap-2 flex-wrap">
              <span className="text-sm text-slate-600 flex items-center">Sort by:</span>
              <SortButton field="date" label="📅 Date" />
              <SortButton field="name" label="👤 Name" />
              <SortButton field="email" label="📧 Email" />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card-body p-0">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-16 bg-slate-100 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : sortedContacts.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-slate-500 text-lg">
                {searchQuery ? "No messages match your search." : "No contact messages yet."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50">
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Phone</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Subject</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Message</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-right text-xs font-semibold text-slate-600 uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sortedContacts.map((contact) => (
                    <tr
                      key={contact._id}
                      className="hover:bg-slate-50 transition-colors cursor-pointer"
                      onClick={() => setSelectedId(selectedId === contact._id ? null : contact._id)}
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                            {contact.name.charAt(0).toUpperCase()}
                          </div>
                          <span className="font-medium text-slate-900">{contact.name}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-600 text-sm">{contact.email}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-600 text-sm">{contact.phone || "-"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-600 text-sm line-clamp-2">{contact.subject || "-"}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-slate-600 text-sm line-clamp-2">{contact.message}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm">
                          <div className="text-slate-900 font-medium">
                            {new Date(contact.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "short",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-slate-500 text-xs">
                            {new Date(contact.createdAt).toLocaleTimeString("en-US", {
                              hour: "2-digit",
                              minute: "2-digit",
                              second: "2-digit",
                            })}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            remove(contact._id);
                          }}
                          className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          🗑️ Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Expanded Row for Full Message */}
          {selectedId && (
            <div className="border-t border-slate-200 p-6 bg-slate-50">
              {(() => {
                const contact = contacts.find((c) => c._id === selectedId);
                return (
                  <div className="space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-slate-900">Full Message Details</h3>
                      <button
                        onClick={() => setSelectedId(null)}
                        className="text-slate-400 hover:text-slate-600 text-xl"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 font-semibold mb-1">Name</p>
                        <p className="text-sm font-medium text-slate-900">{contact.name}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 font-semibold mb-1">Email</p>
                        <p className="text-sm font-medium text-slate-900">{contact.email}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 font-semibold mb-1">Phone</p>
                        <p className="text-sm font-medium text-slate-900">{contact.phone || "-"}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 font-semibold mb-1">Organization</p>
                        <p className="text-sm font-medium text-slate-900">{contact.organization || "-"}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 font-semibold mb-1">Subject</p>
                        <p className="text-sm font-medium text-slate-900">{contact.subject || "-"}</p>
                      </div>
                      <div className="bg-white p-4 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 font-semibold mb-1">Received On</p>
                        <p className="text-sm font-medium text-slate-900">
                          {new Date(contact.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </p>
                        <p className="text-xs text-slate-400 mt-1">
                          {new Date(contact.createdAt).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit",
                            second: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="bg-white p-4 rounded-lg border border-slate-200">
                      <p className="text-xs text-slate-500 font-semibold mb-2">Message</p>
                      <p className="text-slate-700 leading-relaxed">{contact.message}</p>
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
