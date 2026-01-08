import { redirect } from "next/navigation";
import LettersClient from "./LettersClient";
import { createClient } from "@/utils/supabase/server";

export const dynamic = "force-dynamic";

export default async function Page() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data?.user) {
    redirect("/login");
  }

  return <LettersClient />;
}
