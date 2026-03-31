"use client";
import { useState, useMemo } from "react";
import ToolLayout from "@/components/ToolLayout";

interface SigData {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
  linkedin: string;
  twitter: string;
  color: string;
  template: string;
}

const TEMPLATES = [
  { id: "minimal", name: "Minimal", desc: "Clean one-liner" },
  { id: "professional", name: "Professional", desc: "Classic business" },
  { id: "modern", name: "Modern", desc: "Colorful accent" },
  { id: "bold", name: "Bold", desc: "Big & impactful" },
  { id: "elegant", name: "Elegant", desc: "Refined style" },
  { id: "plain", name: "Plain Text", desc: "No HTML" },
];

function generateHTML(d: SigData): string {
  const c = d.color || "#2563EB";

  if (d.template === "plain") {
    return `${d.name}${d.title ? `\n${d.title}` : ""}${d.company ? ` | ${d.company}` : ""}\n${d.email ? `Email: ${d.email}` : ""}${d.phone ? ` | Phone: ${d.phone}` : ""}\n${d.website ? `Web: ${d.website}` : ""}${d.linkedin ? ` | LinkedIn: ${d.linkedin}` : ""}`;
  }

  const socials = [
    d.linkedin && `<a href="${d.linkedin}" style="color:${c};text-decoration:none;margin-right:8px;">LinkedIn</a>`,
    d.twitter && `<a href="https://x.com/${d.twitter.replace("@", "")}" style="color:${c};text-decoration:none;margin-right:8px;">X/Twitter</a>`,
    d.website && `<a href="${d.website}" style="color:${c};text-decoration:none;">Website</a>`,
  ].filter(Boolean).join(" ");

  if (d.template === "minimal") {
    return `<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:13px;color:#333;">
<tr><td>
<strong style="color:${c};">${d.name}</strong>${d.title ? ` — ${d.title}` : ""}${d.company ? ` | ${d.company}` : ""}
<br/>${d.email ? `<a href="mailto:${d.email}" style="color:#555;text-decoration:none;">${d.email}</a>` : ""}${d.phone ? ` · ${d.phone}` : ""}
${socials ? `<br/>${socials}` : ""}
</td></tr></table>`;
  }

  if (d.template === "modern") {
    return `<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:13px;color:#333;">
<tr>
<td style="border-left:3px solid ${c};padding-left:12px;">
<div style="font-size:16px;font-weight:bold;color:${c};">${d.name}</div>
${d.title ? `<div style="font-size:12px;color:#666;margin-top:2px;">${d.title}${d.company ? ` · ${d.company}` : ""}</div>` : ""}
<div style="margin-top:6px;font-size:12px;">
${d.email ? `✉ <a href="mailto:${d.email}" style="color:#555;text-decoration:none;">${d.email}</a>` : ""}
${d.phone ? `&nbsp;&nbsp;📱 ${d.phone}` : ""}
</div>
${socials ? `<div style="margin-top:4px;font-size:12px;">${socials}</div>` : ""}
</td></tr></table>`;
  }

  if (d.template === "bold") {
    return `<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;">
<tr><td style="background:${c};color:white;padding:12px 16px;border-radius:6px;">
<div style="font-size:18px;font-weight:bold;">${d.name}</div>
${d.title ? `<div style="font-size:13px;opacity:0.9;margin-top:2px;">${d.title}${d.company ? ` — ${d.company}` : ""}</div>` : ""}
<div style="margin-top:8px;font-size:12px;opacity:0.85;">
${d.email || ""}${d.phone ? ` · ${d.phone}` : ""}
${d.website ? `<br/>${d.website}` : ""}
</div>
</td></tr></table>`;
  }

  if (d.template === "elegant") {
    return `<table cellpadding="0" cellspacing="0" style="font-family:Georgia,serif;font-size:13px;color:#333;">
<tr><td style="padding-bottom:8px;border-bottom:1px solid #ddd;">
<div style="font-size:16px;font-weight:bold;letter-spacing:1px;">${d.name.toUpperCase()}</div>
${d.title ? `<div style="font-size:12px;color:#888;font-style:italic;margin-top:2px;">${d.title}${d.company ? `, ${d.company}` : ""}</div>` : ""}
</td></tr>
<tr><td style="padding-top:8px;font-size:12px;color:#666;">
${d.email ? `${d.email}` : ""}${d.phone ? ` | ${d.phone}` : ""}
${socials ? `<br/>${socials}` : ""}
</td></tr></table>`;
  }

  // Default: professional
  return `<table cellpadding="0" cellspacing="0" style="font-family:Arial,sans-serif;font-size:13px;color:#333;">
<tr>
<td style="padding-right:12px;border-right:2px solid ${c};">
<div style="font-size:15px;font-weight:bold;">${d.name}</div>
${d.title ? `<div style="font-size:12px;color:#666;">${d.title}</div>` : ""}
${d.company ? `<div style="font-size:12px;color:${c};font-weight:bold;">${d.company}</div>` : ""}
</td>
<td style="padding-left:12px;font-size:12px;">
${d.email ? `<div>✉ <a href="mailto:${d.email}" style="color:#555;text-decoration:none;">${d.email}</a></div>` : ""}
${d.phone ? `<div>📱 ${d.phone}</div>` : ""}
${d.website ? `<div>🌐 <a href="${d.website}" style="color:${c};text-decoration:none;">${d.website}</a></div>` : ""}
${socials ? `<div style="margin-top:4px;">${socials}</div>` : ""}
</td>
</tr></table>`;
}

export default function EmailSignaturePage() {
  const [data, setData] = useState<SigData>({
    name: "Jane Smith",
    title: "Product Designer",
    company: "Acme Inc.",
    phone: "+1 (555) 123-4567",
    email: "jane@acme.com",
    website: "https://acme.com",
    linkedin: "https://linkedin.com/in/janesmith",
    twitter: "@janesmith",
    color: "#2563EB",
    template: "professional",
  });
  const [copied, setCopied] = useState<string>("");

  const html = useMemo(() => generateHTML(data), [data]);

  const handleCopy = (type: "rich" | "html") => {
    if (type === "html") {
      navigator.clipboard.writeText(html);
      setCopied("html");
    } else {
      const blob = new Blob([html], { type: "text/html" });
      const item = new ClipboardItem({ "text/html": blob });
      navigator.clipboard.write([item]);
      setCopied("rich");
    }
    setTimeout(() => setCopied(""), 2000);
  };

  const update = (field: keyof SigData, value: string) => setData((prev) => ({ ...prev, [field]: value }));

  return (
    <ToolLayout
      title="Email Signature Generator"
      description="Create a professional email signature in minutes. Works with Gmail, Outlook, and Apple Mail."
      width="wide"
    >
      <div className="max-w-6xl mx-auto pt-2">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold mb-4">Your Information</h2>
              <div className="space-y-3">
                {([
                  ["name", "Full Name", "Jane Smith"],
                  ["title", "Job Title", "Product Designer"],
                  ["company", "Company", "Acme Inc."],
                  ["email", "Email", "jane@acme.com"],
                  ["phone", "Phone", "+1 (555) 123-4567"],
                  ["website", "Website", "https://acme.com"],
                  ["linkedin", "LinkedIn URL", "https://linkedin.com/in/..."],
                  ["twitter", "X/Twitter", "@handle"],
                ] as [keyof SigData, string, string][]).map(([field, label, placeholder]) => (
                  <div key={field}>
                    <label className="text-sm font-medium text-gray-600">{label}</label>
                    <input type="text" placeholder={placeholder} className="w-full mt-1 px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                      value={data[field]} onChange={(e) => update(field, e.target.value)} />
                  </div>
                ))}
                <div>
                  <label className="text-sm font-medium text-gray-600">Brand Color</label>
                  <div className="flex items-center gap-2 mt-1">
                    <input type="color" value={data.color} onChange={(e) => update("color", e.target.value)}
                      className="w-10 h-10 rounded border cursor-pointer" />
                    <input type="text" value={data.color} onChange={(e) => update("color", e.target.value)}
                      className="px-3 py-2 border rounded-lg text-sm w-28" />
                  </div>
                </div>
              </div>
            </div>

            {/* Templates */}
            <div className="bg-white rounded-xl shadow p-6">
              <h2 className="text-lg font-bold mb-4">Choose Template</h2>
              <div className="grid grid-cols-2 gap-2">
                {TEMPLATES.map((t) => (
                  <button key={t.id} onClick={() => update("template", t.id)}
                    className={`p-3 rounded-lg text-left transition border-2 ${data.template === t.id ? "border-emerald-500 bg-emerald-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <div className="font-semibold text-sm">{t.name}</div>
                    <div className="text-xs text-gray-500">{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Preview */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow p-6 sticky top-6">
              <h2 className="text-lg font-bold mb-4">Live Preview</h2>
              <div className="border rounded-lg p-6 bg-gray-50 min-h-[120px]" dangerouslySetInnerHTML={{ __html: html }} />

              <div className="flex gap-3 mt-6">
                <button onClick={() => handleCopy("rich")}
                  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2 px-4 rounded-lg transition text-sm">
                  {copied === "rich" ? "✅ Copied!" : "📋 Copy Signature"}
                </button>
                <button onClick={() => handleCopy("html")}
                  className="flex-1 bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-4 rounded-lg transition text-sm">
                  {copied === "html" ? "✅ Copied!" : "</> Copy HTML"}
                </button>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                <p className="font-semibold mb-1">How to add to your email client:</p>
                <p>• <strong>Gmail:</strong> Settings → See all settings → Signature → Paste</p>
                <p>• <strong>Outlook:</strong> Settings → Mail → Compose → Email signature → Paste</p>
                <p>• <strong>Apple Mail:</strong> Preferences → Signatures → New → Paste</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
