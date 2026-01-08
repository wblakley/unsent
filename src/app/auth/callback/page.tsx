import { Suspense } from "react";
import AuthCallbackClient from "./AuthCallbackClient";

export default function Page() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: 40 }}>
          <h1>Signing you in…</h1>
          <p>Please wait.</p>
        </div>
      }
    >
      <AuthCallbackClient />
    </Suspense>
  );
}
