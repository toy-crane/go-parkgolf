"use server";

import { env } from "@/env.mjs";

async function alertDiscord(message: string): Promise<void> {
  await fetch(env.DISCORD_ALERT_WEBHOOK_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content: message }),
  });
}

export { alertDiscord };
