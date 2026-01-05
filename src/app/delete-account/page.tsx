export default function DeleteAccountPage() {
    return (
      <main style={{ maxWidth: 720, margin: "40px auto", padding: "0 16px", fontFamily: "system-ui, sans-serif" }}>
        <h1>Delete Your Account</h1>
  
        <p>
          Users may request deletion of their Unsent account and associated data by emailing:
        </p>
  
        <p style={{ fontSize: 18, fontWeight: 600 }}>
          support@unsent.app
        </p>
  
        <p>
          Please include the email address associated with your account and use the subject line:
          <strong> “Account Deletion Request”</strong>.
        </p>
  
        <h2>Data that will be deleted</h2>
        <ul>
          <li>Account information</li>
          <li>User-created letters and content</li>
        </ul>
  
        <h2>Processing time</h2>
        <p>
          Requests are processed within <strong>30 days</strong>.
        </p>
  
        <h2>Data retention</h2>
        <p>
          Some information may be retained where required by law or for security and fraud prevention.
        </p>
      </main>
    );
  }
  