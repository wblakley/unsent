"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function NewLetterPage() {
  const router = useRouter();
  const didRun = useRef(false);
  const [msg, setMsg] = useState("Creating your new letter...");

  useEffect(() => {
    if (didRun.current) return;
    didRun.current = true;

    (async () => {
      const res = await fetch("/letters/new", { method: "POST" });

      if (res.status === 401) {
        router.replace("/login");
        return;
      }

      if (!res.ok) {
        const text = await res.text();
        setMsg(`Error creating letter: ${text}`);
        return;
      }

      const { id } = (await res.json()) as { id: string };
      router.replace(`/letters/${id}?new=1`);
    })();
  }, [router]);

  return (
    <div style={{ padding: 40, maxWidth: 760, margin: "0 auto" }}>
      <h1 style={{ fontSize: 28, marginBottom: 10 }}>New Letter</h1>
      <p style={{ opacity: 0.7 }}>{msg}</p>
    </div>
  );
}
