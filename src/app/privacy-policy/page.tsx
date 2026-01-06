export default function PrivacyPolicyPage() {
    const SUPPORT_EMAIL = "alicemaedllc@gmail.com";
    const DELETE_URL = "https://unsent-drab.vercel.app/delete-account";
  
    return (
      <main className="min-h-screen bg-[#f7f2ea] text-[#2b2b2b]">
        <div className="mx-auto max-w-2xl px-6 py-16">
          <h1 className="text-3xl font-semibold">Privacy Policy</h1>
  
          <p className="mt-4 leading-relaxed">
            Unsent respects your privacy. This policy explains what information we
            collect and how it is used.
          </p>
  
          <h2 className="mt-10 text-xl font-semibold">What we collect</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>
              <strong>Email address</strong> (used for authentication via magic
              link login).
            </li>
            <li>
              <strong>User-generated content</strong> you choose to enter into the
              app (letters and drafts).
            </li>
          </ul>
  
          <h2 className="mt-10 text-xl font-semibold">What we do not do</h2>
          <ul className="mt-3 list-disc space-y-2 pl-5">
            <li>We do not sell your personal information.</li>
            <li>We do not share your data with third parties for marketing.</li>
          </ul>
  
          <h2 className="mt-10 text-xl font-semibold">Account deletion</h2>
          <p className="mt-3 leading-relaxed">
            You may request deletion of your account and associated data at any
            time by visiting:
          </p>
  
          <div className="mt-4 rounded-xl border border-black/10 bg-white/70 p-5">
            <a
              href={DELETE_URL}
              className="select-all font-mono text-sm underline"
              target="_blank"
              rel="noreferrer"
            >
              {DELETE_URL}
            </a>
            <p className="mt-3 text-sm opacity-80">
              Deletion requests are typically processed within <strong>30 days</strong>.
            </p>
          </div>
  
          <h2 className="mt-10 text-xl font-semibold">Contact</h2>
          <p className="mt-3 leading-relaxed">
            If you have questions about this policy, contact:
          </p>
  
          <div className="mt-4 rounded-xl border border-black/10 bg-white/70 p-5">
            <p className="font-medium">Email:</p>
            <a
              className="mt-1 block select-all font-mono text-sm underline"
              href={`mailto:${SUPPORT_EMAIL}?subject=Unsent%20Privacy%20Policy`}
            >
              {SUPPORT_EMAIL}
            </a>
          </div>
        </div>
      </main>
    );
  }
  