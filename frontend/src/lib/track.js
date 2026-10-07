// Browser-only helpers for visit counting and the announcement popup.
// Storage can be blocked (private windows), so every read and write is guarded.

const read = (store, key) => {
  try {
    return window[store].getItem(key);
  } catch {
    return null;
  }
};

const write = (store, key, value) => {
  try {
    window[store].setItem(key, value);
  } catch {
    // nothing to do: the feature simply does not remember
  }
};

// A random ID for this browser. It is not linked to a name, phone number or IP address.
export function visitorId() {
  let id = read("localStorage", "sba_vid");
  if (!id) {
    id = window.crypto?.randomUUID?.() || `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 12)}`;
    write("localStorage", "sba_vid", id);
  }
  return id;
}

// Fire and forget: counting must never get in the way of the page.
export function post(path, body) {
  try {
    fetch(`/api/site${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // ignore
  }
}

// Where this visit came from, worked out once when the visitor lands.
export function landing() {
  const saved = read("sessionStorage", "sba_landing");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      // fall through and work it out again
    }
  }
  let referrer = document.referrer || "";
  try {
    if (referrer && new URL(referrer).host === window.location.host) referrer = "";
  } catch {
    referrer = "";
  }
  const info = { referrer, utm: new URLSearchParams(window.location.search).get("utm_source") || "" };
  write("sessionStorage", "sba_landing", JSON.stringify(info));
  return info;
}

const today = () => new Date().toLocaleDateString("en-CA");

// Whether this visitor is due to see the announcement again, by the frequency set in the admin panel:
// every page load ("always"), once per visit, or once a day.
function due(a) {
  if (a.frequency === "daily") return read("localStorage", `sba_ann_${a._id}`) !== today();
  if (a.frequency === "visit") return !read("sessionStorage", `sba_ann_${a._id}`);
  return true;
}

// The announcement to show next. When several are live they take turns.
export function nextAnnouncement(list) {
  const ready = list.filter(due);
  if (!ready.length) return null;
  const last = ready.findIndex((a) => a._id === read("localStorage", "sba_ann_last"));
  return ready[(last + 1) % ready.length];
}

export function markSeen(id) {
  write("localStorage", `sba_ann_${id}`, today());
  write("sessionStorage", `sba_ann_${id}`, "1");
  write("localStorage", "sba_ann_last", id);
}

const WEEK = 7 * 24 * 60 * 60 * 1000;

// Remember which announcement the visitor followed, so a registration or admission
// enquiry sent within a week is counted against it.
export function setSource(id) {
  write("localStorage", "sba_src", JSON.stringify({ id, at: Date.now() }));
}

export function getSource() {
  try {
    const { id, at } = JSON.parse(read("localStorage", "sba_src") || "{}");
    return id && Date.now() - at < WEEK ? id : null;
  } catch {
    return null;
  }
}
