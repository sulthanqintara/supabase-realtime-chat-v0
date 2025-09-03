import { createClient } from "@/lib/server";
import { RealtimeChat } from "@/components/realtime-chat";
import { AuthButton } from "@/components/auth-button";

export default async function HomePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get user profile for display name (only if logged in)
  let displayName: string | undefined = undefined;
  if (user) {
    const { data: profile } = await supabase.from("profiles").select("display_name, role").eq("id", user.id).single();
    displayName = profile?.display_name;
  }

  return (
    <div className="min-h-screen bg-background mx-auto border">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <h1 className="text-xl font-semibold">Community</h1>
          <AuthButton user={user} displayName={displayName} />
        </div>
      </header>
      <div className="container mx-auto py-3 flex justify-between items-center">
        <RealtimeChat user={user} displayName={displayName || user?.email || "Anonymous"} />
      </div>
    </div>
  );
}
