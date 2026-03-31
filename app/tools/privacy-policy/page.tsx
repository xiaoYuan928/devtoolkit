"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

const THIRD_PARTY_SERVICES = [
  "Google Analytics",
  "Google Ads",
  "Facebook Pixel",
  "Stripe",
  "PayPal",
  "Mailchimp",
  "SendGrid",
  "Intercom",
  "Hotjar",
  "Cloudflare",
  "AWS",
  "Firebase",
];

const DATA_TYPES = [
  { id: "name", label: "Name" },
  { id: "email", label: "Email address" },
  { id: "phone", label: "Phone number" },
  { id: "address", label: "Physical address" },
  { id: "payment", label: "Payment information" },
  { id: "cookies", label: "Cookies & tracking" },
  { id: "analytics", label: "Usage analytics" },
  { id: "location", label: "Location data" },
  { id: "device", label: "Device information" },
  { id: "social", label: "Social media profiles" },
];

interface FormData {
  websiteName: string;
  websiteUrl: string;
  companyName: string;
  contactEmail: string;
  country: string;
  dataCollected: string[];
  thirdPartyServices: string[];
  gdpr: boolean;
  ccpa: boolean;
}

function generatePolicy(data: FormData): string {
  const date = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  let policy = `# Privacy Policy for ${data.websiteName}

**Last updated:** ${date}

**Website:** ${data.websiteUrl}
**Operated by:** ${data.companyName}
**Contact:** ${data.contactEmail}

---

## 1. Introduction

Welcome to ${data.websiteName}. We respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and safeguard your information when you visit our website.

By using ${data.websiteUrl}, you agree to the collection and use of information as described in this policy.

## 2. Information We Collect

We may collect the following types of information:

${data.dataCollected.map((d) => `- **${DATA_TYPES.find((t) => t.id === d)?.label || d}**`).join("\n")}

### How We Collect Information

- **Directly from you:** When you fill out forms, create an account, make a purchase, or contact us.
- **Automatically:** Through cookies, log files, and similar technologies when you browse our website.
${data.dataCollected.includes("analytics") ? "- **Analytics:** Through third-party analytics services that track your browsing behavior on our site." : ""}

## 3. How We Use Your Information

We use the collected information for the following purposes:

- To provide, operate, and maintain our website
- To improve, personalize, and expand our website
- To communicate with you, including customer service and updates
- To process transactions
- To detect and prevent fraud
- To comply with legal obligations
${data.dataCollected.includes("analytics") ? "- To understand how users interact with our website" : ""}
${data.dataCollected.includes("email") ? "- To send you emails, newsletters, and marketing communications (with your consent)" : ""}

## 4. Third-Party Services

We may share your information with the following third-party service providers:

${data.thirdPartyServices.map((s) => `- **${s}**`).join("\n")}

These third parties have access to your personal data only to perform specific tasks on our behalf and are obligated not to disclose or use it for any other purpose.

## 5. Cookies

${data.dataCollected.includes("cookies") ? `We use cookies and similar tracking technologies to track activity on our website and store certain information.

**Types of cookies we use:**
- **Essential cookies:** Required for the website to function properly
- **Analytics cookies:** Help us understand how visitors interact with our website
- **Marketing cookies:** Used to deliver relevant advertisements

You can instruct your browser to refuse all cookies or to indicate when a cookie is being sent. However, some parts of our website may not function properly without cookies.` : "We use minimal cookies necessary for the website to function properly."}
`;

  if (data.gdpr) {
    policy += `
## 6. GDPR Rights (European Economic Area)

If you are a resident of the European Economic Area (EEA), you have certain data protection rights under the General Data Protection Regulation (GDPR):

- **Right of access:** You can request copies of your personal data.
- **Right to rectification:** You can request that we correct inaccurate or incomplete data.
- **Right to erasure:** You can request that we delete your personal data.
- **Right to restrict processing:** You can request that we restrict the processing of your data.
- **Right to data portability:** You can request that we transfer your data to another organization.
- **Right to object:** You can object to our processing of your personal data.

To exercise any of these rights, please contact us at ${data.contactEmail}. We will respond to your request within 30 days.

**Legal basis for processing:**
- Your consent
- Performance of a contract
- Compliance with a legal obligation
- Our legitimate business interests
`;
  }

  if (data.ccpa) {
    policy += `
## ${data.gdpr ? "7" : "6"}. CCPA Rights (California Residents)

Under the California Consumer Privacy Act (CCPA), California residents have the following rights:

- **Right to know:** You can request information about the categories and specific pieces of personal data we have collected.
- **Right to delete:** You can request deletion of your personal data.
- **Right to opt-out:** You can opt out of the sale of your personal data.
- **Right to non-discrimination:** We will not discriminate against you for exercising your CCPA rights.

To exercise your rights, contact us at ${data.contactEmail} or visit our website.

**We do not sell personal information** as defined under the CCPA.
`;
  }

  const nextSection = data.gdpr && data.ccpa ? 8 : data.gdpr || data.ccpa ? 7 : 6;

  policy += `
## ${nextSection}. Data Security

We implement appropriate technical and organizational measures to protect your personal data against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet is 100% secure.

## ${nextSection + 1}. Data Retention

We retain your personal data only for as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required by law.

## ${nextSection + 2}. Children's Privacy

Our website is not intended for children under the age of 13. We do not knowingly collect personal data from children under 13. If you are a parent or guardian and believe your child has provided us with personal data, please contact us.

## ${nextSection + 3}. Changes to This Privacy Policy

We may update this privacy policy from time to time. We will notify you of any changes by posting the new privacy policy on this page and updating the "Last updated" date.

## ${nextSection + 4}. Contact Us

If you have any questions about this privacy policy, please contact us:

- **Email:** ${data.contactEmail}
- **Website:** ${data.websiteUrl}
${data.companyName ? `- **Company:** ${data.companyName}` : ""}
${data.country ? `- **Country:** ${data.country}` : ""}

---

*This privacy policy was generated on ${date} by Privacy Policy Generator.*
`;

  return policy;
}

export default function PrivacyPolicyPage() {
  const [formData, setFormData] = useState<FormData>({
    websiteName: "",
    websiteUrl: "",
    companyName: "",
    contactEmail: "",
    country: "",
    dataCollected: ["email", "cookies", "analytics"],
    thirdPartyServices: [],
    gdpr: false,
    ccpa: false,
  });
  const [generatedPolicy, setGeneratedPolicy] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const handleCheckbox = (field: "dataCollected" | "thirdPartyServices", value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((v) => v !== value)
        : [...prev[field], value],
    }));
  };

  const handleGenerate = () => {
    if (!formData.websiteName || !formData.websiteUrl || !formData.contactEmail) {
      alert("Please fill in website name, URL, and contact email.");
      return;
    }
    setGeneratedPolicy(generatePolicy(formData));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedPolicy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generatedPolicy], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `privacy-policy-${formData.websiteName.toLowerCase().replace(/\s+/g, "-")}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ToolLayout
      title="Privacy Policy Generator"
      description="Create a professional privacy policy for your website with GDPR and CCPA sections."
      width="wide"
    >
      <div className="max-w-4xl mx-auto pt-2">
        {!generatedPolicy ? (
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-6">Fill in your details</h2>

            {/* Basic Info */}
            <div className="grid md:grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website Name *</label>
                <input type="text" placeholder="My Awesome App" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.websiteName} onChange={(e) => setFormData({ ...formData, websiteName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Website URL *</label>
                <input type="url" placeholder="https://example.com" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.websiteUrl} onChange={(e) => setFormData({ ...formData, websiteUrl: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                <input type="text" placeholder="Acme Inc." className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.companyName} onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email *</label>
                <input type="email" placeholder="privacy@example.com" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.contactEmail} onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                <input type="text" placeholder="United States" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  value={formData.country} onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
              </div>
            </div>

            {/* Data Collected */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">What data do you collect?</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {DATA_TYPES.map((dt) => (
                  <label key={dt.id} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" className="rounded text-blue-600" checked={formData.dataCollected.includes(dt.id)}
                      onChange={() => handleCheckbox("dataCollected", dt.id)} />
                    <span className="text-sm">{dt.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Third-party Services */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Third-party services used</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {THIRD_PARTY_SERVICES.map((svc) => (
                  <label key={svc} className="flex items-center gap-2 p-2 rounded hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" className="rounded text-blue-600" checked={formData.thirdPartyServices.includes(svc)}
                      onChange={() => handleCheckbox("thirdPartyServices", svc)} />
                    <span className="text-sm">{svc}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Compliance */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold mb-3">Compliance requirements</h3>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600" checked={formData.gdpr}
                    onChange={(e) => setFormData({ ...formData, gdpr: e.target.checked })} />
                  <span>🇪🇺 GDPR (European users)</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" className="rounded text-blue-600" checked={formData.ccpa}
                    onChange={(e) => setFormData({ ...formData, ccpa: e.target.checked })} />
                  <span>🇺🇸 CCPA (California users)</span>
                </label>
              </div>
            </div>

            <button onClick={handleGenerate}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl text-lg transition">
              Generate Privacy Policy →
            </button>
          </div>
        ) : (
          <div>
            {/* Action buttons */}
            <div className="flex gap-3 mb-6">
              <button onClick={handleCopy}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-5 rounded-lg transition">
                {copied ? "✅ Copied!" : "📋 Copy to Clipboard"}
              </button>
              <button onClick={handleDownload}
                className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-5 rounded-lg transition">
                ⬇️ Download Markdown
              </button>
              <button onClick={() => setGeneratedPolicy("")}
                className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-5 rounded-lg transition">
                ← Edit Details
              </button>
            </div>

            {/* Generated Policy */}
            <div className="bg-white rounded-2xl shadow-lg p-8 prose prose-blue max-w-none">
              {generatedPolicy.split("\n").map((line, i) => {
                if (line.startsWith("# ")) return <h1 key={i} className="text-3xl font-bold mt-4 mb-2">{line.slice(2)}</h1>;
                if (line.startsWith("## ")) return <h2 key={i} className="text-xl font-bold mt-6 mb-2 text-blue-800">{line.slice(3)}</h2>;
                if (line.startsWith("### ")) return <h3 key={i} className="text-lg font-semibold mt-4 mb-1">{line.slice(4)}</h3>;
                if (line.startsWith("- **")) {
                  const parts = line.slice(2).split("**");
                  return <p key={i} className="ml-4 my-1">• <strong>{parts[1]}</strong>{parts[2]}</p>;
                }
                if (line.startsWith("- ")) return <p key={i} className="ml-4 my-1">• {line.slice(2)}</p>;
                if (line.startsWith("**") && line.endsWith("**")) return <p key={i} className="font-semibold my-2">{line.replace(/\*\*/g, "")}</p>;
                if (line.startsWith("---")) return <hr key={i} className="my-4" />;
                if (line.startsWith("*") && line.endsWith("*")) return <p key={i} className="text-sm text-gray-500 italic">{line.replace(/\*/g, "")}</p>;
                if (line.trim() === "") return <br key={i} />;
                return <p key={i} className="my-1">{line}</p>;
              })}
            </div>
          </div>
        )}

        {/* FAQ */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-6">Frequently Asked Questions</h2>
          <div className="space-y-4">
            {[
              { q: "Is this privacy policy generator free?", a: "Yes, completely free. No sign-up, no hidden fees. Generate as many privacy policies as you need." },
              { q: "Is the generated privacy policy legally binding?", a: "The generated policy provides a solid starting point based on common privacy practices. However, we recommend having a legal professional review it for your specific situation, especially if you handle sensitive data." },
              { q: "Does this cover GDPR and CCPA?", a: "Yes! You can enable GDPR (for European users) and CCPA (for California users) compliance sections. The generated policy will include the required rights and disclosures." },
              { q: "Can I edit the generated policy?", a: "Absolutely. Copy the generated text and modify it as needed. The policy is yours to customize." },
            ].map((faq, i) => (
              <details key={i} className="bg-white rounded-lg shadow p-4 cursor-pointer">
                <summary className="font-semibold">{faq.q}</summary>
                <p className="mt-2 text-gray-600">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
