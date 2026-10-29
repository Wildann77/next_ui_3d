"use server";

export interface ContactActionState {
  status: "idle" | "success" | "error";
  message: string;
  timestamp?: string;
}

export async function submitContactTerminal(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  const email = (formData.get("email") as string)?.trim();
  const name = (formData.get("name") as string)?.trim();
  const formatTier = (formData.get("formatTier") as string) || "COMPACT CORE";
  const notes = (formData.get("notes") as string)?.trim() || "";

  if (!email || !email.includes("@")) {
    return {
      status: "error",
      message: "VALIDATION_FAILED // INVALID RFC-5322 TELEMETRY EMAIL SPECIFICATION.",
    };
  }

  // Simulate network edge dispatch latency
  await new Promise((resolve) => setTimeout(resolve, 600));

  return {
    status: "success",
    message: `TELEMETRY_DISPATCHED // ENCRYPTED SPECIFICATION RECEIVED FOR ${
      name ? name.toUpperCase() : "VERIFIED OPERATOR"
    } [${email}] ON TIER: ${formatTier}${
      notes ? ` [DOSSIER: ${notes.slice(0, 40)}]` : ""
    }. SECURE PROTOCOL INITIATED.`,
    timestamp: new Date().toISOString(),
  };
}
