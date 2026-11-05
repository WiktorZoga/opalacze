const XAI_BASE = process.env.XAI_BASE_URL ?? "https://api.x.ai/v1";

export function xaiKey(): string | undefined {
  return process.env.XAI_API_KEY || undefined;
}

export async function xaiPost(path: string, body: unknown): Promise<any> {
  const key = xaiKey();
  if (!key) throw new Error("XAI_API_KEY is not set");
  const res = await fetch(`${XAI_BASE}${path}`, {
    method: "POST",
    headers: { authorization: `Bearer ${key}`, "content-type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`xAI ${path} ${res.status}: ${(await res.text()).slice(0, 400)}`);
  return res.json();
}
