(function (global) {
  var paths = {
    sprout:
      '<path d="M7 20h10"/><path d="M12 20v-4"/><path d="M12 16a4 4 0 0 0 4-4c0-2-2-3-4-5-2 2-4 3-4 5a4 4 0 0 0 4 4Z"/>',
    laptop:
      '<path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9"/><path d="M2 17h20v2H2z"/>',
    "book-open":
      '<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>',
    briefcase:
      '<path d="M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/><rect width="20" height="14" x="2" y="6" rx="2"/>',
    "shield-check":
      '<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z"/><path d="m9 12 2 2 4-4"/>',
    bug:
      '<path d="m8 2 1.88 1.88"/><path d="M14.12 3.88 16 2"/><path d="M9 7.13v-1a3.003 3.003 0 1 1 6 0v1"/><path d="M12 20c-3.3 0-6-2.7-6-6v-3a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v3c0 3.3-2.7 6-6 6"/><path d="M12 20v-9"/><path d="M6.53 9C4.6 8.8 3 7.1 3 5"/><path d="M6 13H2"/><path d="M3 5c0-2.2 2.2-4 4-4"/><path d="M17.47 9c1.93-.2 3.53-1.9 3.53-4"/><path d="M18 13h4"/><path d="M21 5c0 2.2-2.2 4-4 4"/>',
    "file-search":
      '<path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4.268 21a2 2 0 0 0 1.727 1H18a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v3"/><circle cx="8" cy="16" r="3"/><path d="m10.5 18.5 2 2"/>',
    cloud:
      '<path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z"/>',
    database:
      '<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/><path d="M3 12c0 1.66 4 3 9 3s9-1.34 9-3"/>',
    "file-shield":
      '<path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4 7V4a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"/><path d="M12 22v-6"/><path d="M9 19h6"/>',
    shield:
      '<path d="M20 13c0 5-3.5 7.5-8 9-4.5-1.5-8-4-8-9V5l8-3 8 3z"/>',
    search:
      '<circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/>',
    code:
      '<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>',
    target:
      '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
    terminal:
      '<polyline points="4 17 10 11 4 5"/><line x1="12" x2="20" y1="19" y2="19"/>',
    network:
      '<rect x="16" y="16" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="9" y="2" width="6" height="6" rx="1"/><path d="M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3"/><path d="M12 12V8"/>',
    globe:
      '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    lock:
      '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    rocket:
      '<path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>',
    "file-text":
      '<path d="M14 2v4a2 2 0 0 0 2 2h4"/><path d="M4 7V4a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-3"/><path d="M8 13h8"/><path d="M8 17h6"/>',
    play:
      '<polygon points="6 3 20 12 6 21 6 3"/>',
    "external-link":
      '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    check: '<path d="M20 6 9 17l-5-5"/>',
    clock:
      '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    user:
      '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    menu: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    x: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
  };

  function icon(name, className) {
    var inner = paths[name] || paths.shield;
    var cls = className ? className : "bb-icon";
    return (
      '<svg xmlns="http://www.w3.org/2000/svg" class="' +
      cls +
      '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' +
      inner +
      "</svg>"
    );
  }

  function pathVisual(type) {
    if (type === "shield-laptop") {
      return (
        icon("shield", "bb-icon") +
        '<svg class="bb-icon" style="margin-left:-8px;margin-top:12px;opacity:.7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><path d="M20 16V7a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v9"/><path d="M2 17h20v2H2z"/></svg>'
      );
    }
    if (type === "bug-target") {
      return icon("bug", "bb-icon") + icon("target", "bb-icon");
    }
    if (type === "cloud-lock") {
      return icon("cloud", "bb-icon");
    }
    if (type === "code-shield") {
      return icon("code", "bb-icon") + icon("shield", "bb-icon");
    }
    if (type === "search-doc") {
      return icon("file-search", "bb-icon");
    }
    if (type === "doc-shield") {
      return icon("file-shield", "bb-icon");
    }
    return icon("shield", "bb-icon");
  }

  global.BlackbatIcons = {
    icon: icon,
    pathVisual: pathVisual,
  };
})(typeof window !== "undefined" ? window : globalThis);
