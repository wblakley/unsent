export default function DeleteAccountPage() {
  return (
    <main className="min-h-screen bg-[#f7f2ea] text-[#2b2b2b]">
      <div className="mx-auto max-w-2xl px-6 py-16">
        <h1 className="text-3xl font-semibold">Request Account Deletion</h1>
        <p className="mt-4 leading-relaxed">
          If you would like your Unsent account and associated data deleted, please email us from
          the email address tied to your account and include the subject line:
          <strong> “Delete my Unsent account”</strong>.
        </p>

        <div className="mt-6 rounded-xl border border-black/10 bg-white/70 p-5">
          <p className="font-medium">Email:</p>
          <a
  href="mailto:alicemaedllc@gmail.com"
  className="mt-1 inline-block select-all font-mono text-sm underline"
>
  alicemaedllc@gmail.com
</a>

          <p className="mt-3 text-sm opacity-80">
  Please email us from the address associated with your Unsent account.
</p>

        </div>

        <h2 className="mt-10 text-xl font-semibold">What gets deleted</h2>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>Your account profile (email / user record)</li>
          <li>Saved drafts and letters associated with your account</li>
        </ul>

        <h2 className="mt-10 text-xl font-semibold">Timeline</h2>
        <p className="mt-3 leading-relaxed">
          Deletion requests are typically processed within <strong>30 days</strong>.
        </p>
      </div>
    </main>
  );
}
