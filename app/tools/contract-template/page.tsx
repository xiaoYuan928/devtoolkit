"use client";
import { useState } from "react";
import ToolLayout from "@/components/ToolLayout";

interface ContractType {
  id: string;
  name: string;
  icon: string;
  desc: string;
  fields: { id: string; label: string; type: "text" | "textarea" | "date" | "select"; options?: string[]; placeholder?: string }[];
  generate: (data: Record<string, string>) => string;
}

const CONTRACT_TYPES: ContractType[] = [
  {
    id: "nda",
    name: "Non-Disclosure Agreement",
    icon: "🔒",
    desc: "Protect confidential information between parties",
    fields: [
      { id: "partyA", label: "Disclosing Party (Full Name / Company)", type: "text", placeholder: "Acme Inc." },
      { id: "partyAAddr", label: "Disclosing Party Address", type: "text", placeholder: "123 Main St, City, State" },
      { id: "partyB", label: "Receiving Party (Full Name / Company)", type: "text", placeholder: "Jane Smith" },
      { id: "partyBAddr", label: "Receiving Party Address", type: "text", placeholder: "456 Oak Ave, City, State" },
      { id: "purpose", label: "Purpose of Disclosure", type: "textarea", placeholder: "Exploring a potential business partnership..." },
      { id: "duration", label: "Confidentiality Period", type: "select", options: ["1 year", "2 years", "3 years", "5 years", "Indefinite"] },
      { id: "ndaType", label: "NDA Type", type: "select", options: ["Mutual (both parties)", "One-way (disclosing to receiving)"] },
      { id: "state", label: "Governing Law (State/Country)", type: "text", placeholder: "State of Delaware" },
      { id: "date", label: "Effective Date", type: "date" },
    ],
    generate: (d) => `NON-DISCLOSURE AGREEMENT

This Non-Disclosure Agreement ("Agreement") is entered into as of ${d.date || "[DATE]"} by and between:

DISCLOSING PARTY: ${d.partyA || "[PARTY A]"}
Address: ${d.partyAAddr || "[ADDRESS]"}

RECEIVING PARTY: ${d.partyB || "[PARTY B]"}
Address: ${d.partyBAddr || "[ADDRESS]"}

${d.ndaType?.includes("Mutual") ? "(This is a mutual NDA — both parties are bound by these terms.)" : ""}

1. PURPOSE
The parties wish to explore ${d.purpose || "[PURPOSE]"} and in connection with this, may disclose confidential information to each other.

2. DEFINITION OF CONFIDENTIAL INFORMATION
"Confidential Information" means any information disclosed by ${d.ndaType?.includes("Mutual") ? "either party" : "the Disclosing Party"} that is designated as confidential or that reasonably should be understood to be confidential, including but not limited to: business plans, financial information, technical data, trade secrets, customer lists, product designs, marketing strategies, and any other proprietary information.

3. OBLIGATIONS
The Receiving Party agrees to:
(a) Hold all Confidential Information in strict confidence;
(b) Not disclose Confidential Information to any third party without prior written consent;
(c) Use Confidential Information only for the purpose stated above;
(d) Take reasonable measures to protect the confidentiality of such information.

4. EXCLUSIONS
This Agreement does not apply to information that:
(a) Was publicly known at the time of disclosure;
(b) Becomes publicly known through no fault of the Receiving Party;
(c) Was already in the possession of the Receiving Party;
(d) Is independently developed by the Receiving Party;
(e) Is required to be disclosed by law or court order.

5. TERM
This Agreement shall remain in effect for ${d.duration || "2 years"} from the date of execution. The obligations of confidentiality shall survive termination.

6. RETURN OF INFORMATION
Upon termination or request, the Receiving Party shall promptly return or destroy all Confidential Information and any copies thereof.

7. REMEDIES
The parties acknowledge that breach of this Agreement may cause irreparable harm. The Disclosing Party shall be entitled to seek injunctive relief in addition to any other available remedies.

8. GOVERNING LAW
This Agreement shall be governed by the laws of ${d.state || "[STATE/COUNTRY]"}.

9. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between the parties regarding confidentiality and supersedes all prior agreements.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date first written above.

_________________________________
${d.partyA || "[PARTY A]"}
Date: ${d.date || "_______________"}

_________________________________
${d.partyB || "[PARTY B]"}
Date: ${d.date || "_______________"}`,
  },
  {
    id: "freelance",
    name: "Freelance Service Agreement",
    icon: "💼",
    desc: "For hiring freelancers or being hired as one",
    fields: [
      { id: "client", label: "Client Name / Company", type: "text", placeholder: "Acme Inc." },
      { id: "clientAddr", label: "Client Address", type: "text", placeholder: "123 Main St" },
      { id: "freelancer", label: "Freelancer Name", type: "text", placeholder: "Jane Smith" },
      { id: "freelancerAddr", label: "Freelancer Address", type: "text", placeholder: "456 Oak Ave" },
      { id: "scope", label: "Scope of Work", type: "textarea", placeholder: "Design and develop a responsive website..." },
      { id: "payment", label: "Payment Amount", type: "text", placeholder: "$5,000" },
      { id: "paymentTerms", label: "Payment Terms", type: "select", options: ["50% upfront, 50% on completion", "Monthly invoicing (Net 30)", "Upon completion (Net 15)", "Milestone-based payments"] },
      { id: "deadline", label: "Project Deadline", type: "date" },
      { id: "state", label: "Governing Law", type: "text", placeholder: "State of California" },
      { id: "date", label: "Effective Date", type: "date" },
    ],
    generate: (d) => `FREELANCE SERVICE AGREEMENT

This Agreement is entered into as of ${d.date || "[DATE]"} by and between:

CLIENT: ${d.client || "[CLIENT]"}
Address: ${d.clientAddr || "[ADDRESS]"}

FREELANCER: ${d.freelancer || "[FREELANCER]"}
Address: ${d.freelancerAddr || "[ADDRESS]"}

1. SCOPE OF WORK
The Freelancer agrees to perform the following services:
${d.scope || "[DESCRIPTION OF SERVICES]"}

2. COMPENSATION
The Client agrees to pay the Freelancer ${d.payment || "[AMOUNT]"}.
Payment Terms: ${d.paymentTerms || "Upon completion"}

3. TIMELINE
The work shall be completed by ${d.deadline || "[DEADLINE]"}.

4. INTELLECTUAL PROPERTY
Upon full payment, all work product created under this Agreement shall be the exclusive property of the Client. The Freelancer retains the right to display the work in their portfolio.

5. INDEPENDENT CONTRACTOR
The Freelancer is an independent contractor, not an employee. The Freelancer is responsible for their own taxes, insurance, and benefits.

6. CONFIDENTIALITY
The Freelancer agrees to keep all project-related information confidential and not disclose it to third parties.

7. REVISIONS
The scope includes up to 2 rounds of revisions. Additional revisions will be billed at the Freelancer's hourly rate.

8. TERMINATION
Either party may terminate this Agreement with 14 days written notice. The Client shall pay for all work completed up to the date of termination.

9. LIABILITY
The Freelancer's liability shall not exceed the total amount paid under this Agreement.

10. GOVERNING LAW
This Agreement shall be governed by the laws of ${d.state || "[STATE]"}.

_________________________________
${d.client || "[CLIENT]"}
Date: ${d.date || "_______________"}

_________________________________
${d.freelancer || "[FREELANCER]"}
Date: ${d.date || "_______________"}`,
  },
  {
    id: "tos",
    name: "Terms of Service",
    icon: "📜",
    desc: "For websites and web applications",
    fields: [
      { id: "company", label: "Company / Website Name", type: "text", placeholder: "Acme App" },
      { id: "url", label: "Website URL", type: "text", placeholder: "https://acme.com" },
      { id: "email", label: "Contact Email", type: "text", placeholder: "legal@acme.com" },
      { id: "service", label: "Service Description", type: "textarea", placeholder: "A web-based project management tool..." },
      { id: "state", label: "Governing Law", type: "text", placeholder: "State of Delaware" },
      { id: "date", label: "Effective Date", type: "date" },
    ],
    generate: (d) => `TERMS OF SERVICE

Last updated: ${d.date || "[DATE]"}

Welcome to ${d.company || "[COMPANY]"} (${d.url || "[URL]"}). By accessing or using our service, you agree to these Terms.

1. SERVICE DESCRIPTION
${d.company || "[COMPANY]"} provides ${d.service || "[DESCRIPTION]"}.

2. ACCOUNT TERMS
You must be 13 years or older to use this service. You are responsible for maintaining the security of your account. You must provide accurate information.

3. ACCEPTABLE USE
You agree not to:
- Violate any laws or regulations
- Upload malicious content or malware
- Interfere with the service's operation
- Access other users' accounts without permission
- Use the service for spam or bulk messaging

4. PAYMENT TERMS
If applicable, fees are billed in advance. Refunds are handled per our refund policy. We may change pricing with 30 days notice.

5. INTELLECTUAL PROPERTY
The service and its content are owned by ${d.company || "[COMPANY]"}. Your content remains yours, but you grant us a license to host and display it.

6. TERMINATION
We may suspend or terminate your access for violations. You may cancel your account at any time.

7. DISCLAIMER
The service is provided "as is" without warranties of any kind.

8. LIMITATION OF LIABILITY
${d.company || "[COMPANY]"} shall not be liable for indirect, incidental, or consequential damages.

9. CHANGES
We may update these Terms. Continued use constitutes acceptance.

10. GOVERNING LAW
These Terms are governed by the laws of ${d.state || "[STATE]"}.

11. CONTACT
${d.email || "[EMAIL]"}

---
${d.company || "[COMPANY]"} | ${d.url || "[URL]"}`,
  },
];

export default function ContractTemplatePage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [generated, setGenerated] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const contract = CONTRACT_TYPES.find((c) => c.id === selected);

  const handleGenerate = () => {
    if (contract) setGenerated(contract.generate(formData));
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generated);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([generated], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${selected}-contract.txt`;
    a.click();
  };

  if (generated) {
    return (
      <ToolLayout
        title="Contract Template Generator"
        description="Generate NDA, freelance agreements, and terms of service in plain text."
        width="wide"
      >
        <div className="max-w-3xl mx-auto pt-2">
          <div className="flex gap-3 mb-6">
            <button onClick={handleCopy} className="bg-amber-600 hover:bg-amber-700 text-white font-medium py-2 px-5 rounded-lg">
              {copied ? "✅ Copied!" : "📋 Copy Text"}
            </button>
            <button onClick={handleDownload} className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-5 rounded-lg">
              ⬇️ Download TXT
            </button>
            <button onClick={() => { setGenerated(""); }} className="bg-gray-200 text-gray-700 font-medium py-2 px-5 rounded-lg">
              ← Edit
            </button>
            <button onClick={() => { setGenerated(""); setSelected(null); setFormData({}); }} className="bg-gray-200 text-gray-700 font-medium py-2 px-5 rounded-lg">
              🏠 New Contract
            </button>
          </div>
          <div className="bg-white rounded-xl shadow p-8 font-mono text-sm whitespace-pre-wrap leading-relaxed">
            {generated}
          </div>
        </div>
      </ToolLayout>
    );
  }

  if (contract) {
    return (
      <ToolLayout title={contract.name} description={contract.desc} width="wide">
        <div className="max-w-3xl mx-auto pt-2">
          <button onClick={() => { setSelected(null); setFormData({}); }} className="text-amber-700 hover:text-amber-800 mb-4">
            ← Back
          </button>
          <div className="bg-white rounded-xl shadow p-8">
            <div className="space-y-4">
              {contract.fields.map((f) => (
                <div key={f.id}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  {f.type === "textarea" ? (
                    <textarea rows={3} placeholder={f.placeholder} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                      value={formData[f.id] || ""} onChange={(e) => setFormData({ ...formData, [f.id]: e.target.value })} />
                  ) : f.type === "select" ? (
                    <select className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                      value={formData[f.id] || ""} onChange={(e) => setFormData({ ...formData, [f.id]: e.target.value })}>
                      <option value="">Select...</option>
                      {f.options?.map((o) => <option key={o} value={o}>{o}</option>)}
                    </select>
                  ) : (
                    <input type={f.type} placeholder={f.placeholder} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-amber-500"
                      value={formData[f.id] || ""} onChange={(e) => setFormData({ ...formData, [f.id]: e.target.value })} />
                  )}
                </div>
              ))}
            </div>
            <button onClick={handleGenerate}
              className="w-full mt-8 bg-amber-600 hover:bg-amber-700 text-white font-semibold py-3 rounded-xl text-lg">
              Generate Contract →
            </button>
          </div>
        </div>
      </ToolLayout>
    );
  }

  return (
    <ToolLayout
      title="Contract Template Generator"
      description="Generate NDA, freelance agreements, and terms of service in plain text."
      width="wide"
    >
      <div className="max-w-4xl mx-auto pt-2">
        <h2 className="text-2xl font-bold mb-6 text-center">Choose a contract type</h2>
        <div className="grid md:grid-cols-3 gap-4">
          {CONTRACT_TYPES.map((c) => (
            <button key={c.id} onClick={() => setSelected(c.id)}
              className="bg-white rounded-xl shadow hover:shadow-lg p-6 text-left transition border-2 border-transparent hover:border-amber-500">
              <div className="text-3xl mb-2">{c.icon}</div>
              <h3 className="font-bold text-lg mb-1">{c.name}</h3>
              <p className="text-sm text-gray-500">{c.desc}</p>
            </button>
          ))}
        </div>
        <div className="mt-16">
          <h2 className="text-2xl font-bold mb-4">FAQ</h2>
          <div className="space-y-3">
            {[
              { q: "Are these contracts legally binding?", a: "These templates provide a solid starting point. We recommend having a lawyer review any contract before signing, especially for high-value agreements." },
              { q: "Is it really free?", a: "Yes, 100% free. Generate and download as many contracts as you need. No sign-up, no hidden fees." },
              { q: "Can I customize the generated contract?", a: "Absolutely. Copy the text and modify it to fit your specific situation." },
            ].map((f, i) => (
              <details key={i} className="bg-white rounded-lg shadow p-4">
                <summary className="font-semibold cursor-pointer">{f.q}</summary>
                <p className="mt-2 text-gray-600 text-sm">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </ToolLayout>
  );
}
