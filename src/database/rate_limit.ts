import { DateTime } from "luxon";
import { client, kvStore } from "../index";

export async function isRateLimited(ip: string) {
  const db = client();
  const key = `rate_${ip}`;
  const now = DateTime.now();
  const window = 15 * 60 * 1000; // 15 minutes
  const limit = 3;

  const { data } = await db
    .from(kvStore)
    .select("value")
    .eq("key", key)
    .maybeSingle();

  let record = data?.value || {
    count: 0,
    reset: now.plus({ milliseconds: window }).toISO(),
  };

  if (now > DateTime.fromISO(record.reset)) {
    record = { count: 1, reset: now.plus({ milliseconds: window }).toISO() };
  } else if (record.count >= limit) {
    return true; // Rate limited
  }

  await db.from(kvStore).upsert({ key, value: record });
  return false;
}

export async function incrementRateLimit(ip: string) {
  const db = client();
  const key = `rate_${ip}`;
  const now = DateTime.now();
  const window = 15 * 60 * 1000; // 15 minutes

  const { data } = await db
    .from(kvStore)
    .select("value")
    .eq("key", key)
    .maybeSingle();

  let record = data?.value || {
    count: 0,
    reset: now.plus({ milliseconds: window }).toISO(),
  };

  if (now > DateTime.fromISO(record.reset)) {
    record = { count: 1, reset: now.plus({ milliseconds: window }).toISO() };
  } else {
    record.count = (record.count || 0) + 1;
  }

  await db.from(kvStore).upsert({ key, value: record });
}
