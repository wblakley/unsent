import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export async function POST() {
  const supabase = await createClient();

  const { data: userData } = await supabase.auth.getUser();
  const user = userData?.user;

  if (!user) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data, error } = await supabase
    .from("letters")
    .insert({
      user_id: user.id,
      title: "Untitled",
      body: "",
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !data?.id) {
    return NextResponse.json(
      { error: error?.message ?? "insert_failed" },
      { status: 500 }
    );
  }

  return NextResponse.json({ id: data.id }, { status: 200 });
}
