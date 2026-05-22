import { ConflictsStore, SchedulingConflict } from "./types";

const BLOB_KEY = "makerspace/conflicts.json";
const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

async function getStore(): Promise<ConflictsStore> {
  if (!BLOB_TOKEN) {
    return { conflicts: [] };
  }

  try {
    const { list } = await import("@vercel/blob");
    const { blobs } = await list({ prefix: "makerspace/", token: BLOB_TOKEN });
    const existing = blobs.find((b) => b.pathname === BLOB_KEY);

    if (!existing) {
      return { conflicts: [] };
    }

    const res = await fetch(existing.url, { cache: "no-store" });
    if (!res.ok) return { conflicts: [] };
    return (await res.json()) as ConflictsStore;
  } catch {
    return { conflicts: [] };
  }
}

async function saveStore(store: ConflictsStore): Promise<void> {
  if (!BLOB_TOKEN) return;

  const { put } = await import("@vercel/blob");
  await put(BLOB_KEY, JSON.stringify(store), {
    access: "public",
    token: BLOB_TOKEN,
    contentType: "application/json",
    addRandomSuffix: false,
  });
}

export async function getConflicts(): Promise<SchedulingConflict[]> {
  const store = await getStore();
  return store.conflicts;
}

export async function appendConflict(
  conflict: SchedulingConflict
): Promise<void> {
  const store = await getStore();
  store.conflicts.push(conflict);
  await saveStore(store);
}
