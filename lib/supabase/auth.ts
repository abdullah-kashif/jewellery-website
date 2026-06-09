import "server-only";
import type { SupabaseClient, User } from "@supabase/supabase-js";

function isExpiredAuthSessionError(message: string) {
  const normalizedMessage = message.toLowerCase();

  return (
    normalizedMessage.includes("auth session missing") ||
    normalizedMessage.includes("invalid refresh token") ||
    normalizedMessage.includes("refresh token") ||
    normalizedMessage.includes("already used")
  );
}

export async function getSupabaseUserSafely(
  supabase: SupabaseClient
): Promise<User | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!error) {
    return user;
  }

  if (isExpiredAuthSessionError(error.message)) {
    return null;
  }

  console.error("Failed to load auth user:", error.message);
  return null;
}
