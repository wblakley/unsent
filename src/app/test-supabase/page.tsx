"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase/client";

export default function TestSupabase() {
  const [status, setStatus] = useState("Checking...");

  useEffect(() => {
    async function testConnection() {
      const { error } = await supabase.from("letters").select("id").limit(1);

      if (error) {
        setStatus("❌ Error: " + error.message);
      } else {
        setStatus("✅ Supabase connected successfully");
      }
    }

    testConnection();
  }, []);

  return (
    <div style={{ padding: 40 }}>
      <h1>Supabase Test</h1>
      <p>{status}</p>
    </div>
  );
}
