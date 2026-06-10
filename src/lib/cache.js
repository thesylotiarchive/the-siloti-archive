import { redis } from "./redis";

/**
 * Format date to HH:MM:SS.mmm for clean console logs
 */
function formatTime(date) {
  const pad = (n, width = 2) => String(n).padStart(width, '0');
  return `${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}.${pad(date.getMilliseconds(), 3)}`;
}

/**
 * Resilient cache helper with database fallback and execution time telemetry.
 *
 * @param {string} key - Unique cache key
 * @param {function} fetchFromDb - Async database query function
 * @param {number} ttlSeconds - Time to live in seconds (default 600s / 10 minutes)
 */
export async function getCachedData(key, fetchFromDb, ttlSeconds = 600) {
  const beforeTime = new Date();
  const startTime = performance.now();
  let data = null;
  let cacheHit = false;

  // 1. Try to read from Upstash Redis
  try {
    const cached = await redis.get(key);
    if (cached !== null) {
      cacheHit = true;
      data = typeof cached === "string" ? JSON.parse(cached) : cached;
    }
  } catch (err) {
    console.warn(`[Upstash Redis Cache Warning] Failed to READ key "${key}":`, err.message || err);
    // Silent fallback to database
  }

  // 2. Cache hit - return cached data with stats
  if (cacheHit) {
    const afterTime = new Date();
    const endTime = performance.now();
    const duration = (endTime - startTime).toFixed(2);
    
    const telemetry = `[CACHE HIT] Source: Upstash Redis\n  Key:         "${key}"\n  Before Time: ${formatTime(beforeTime)}\n  After Time:  ${formatTime(afterTime)}\n  Duration:    ${duration}ms (PostgreSQL query avoided)`;

    console.log(
      `\x1b[36m[CACHE HIT]\x1b[0m Source: \x1b[1mUpstash Redis\x1b[0m\n` +
      `  Key:         "${key}"\n` +
      `  Before Time: ${formatTime(beforeTime)}\n` +
      `  After Time:  ${formatTime(afterTime)}\n` +
      `  Duration:    ${duration}ms (PostgreSQL query avoided)\n`
    );

    if (data && typeof data === "object") {
      Object.defineProperty(data, "_cacheTelemetry", {
        value: telemetry,
        writable: true,
        enumerable: true,
        configurable: true
      });
    }
    return data;
  }

  // 3. Cache miss - fetch from DB
  const dbBeforeTime = new Date();
  const dbStartTime = performance.now();
  data = await fetchFromDb();
  const dbEndTime = performance.now();
  const dbAfterTime = new Date();
  const dbDuration = (dbEndTime - dbStartTime).toFixed(2);

  // 4. Try to write data back to Upstash Redis
  try {
    await redis.set(key, JSON.stringify(data), { ex: ttlSeconds });
  } catch (err) {
    console.warn(`[Upstash Redis Cache Warning] Failed to WRITE key "${key}":`, err.message || err);
    // Silent fallback: serve db data even if write fails
  }

  const totalTime = (performance.now() - startTime).toFixed(2);
  const telemetry = `[CACHE MISS] Source: PostgreSQL Database\n  Key:         "${key}"\n  Before Time: ${formatTime(dbBeforeTime)}\n  After Time:  ${formatTime(dbAfterTime)}\n  DB Duration: ${dbDuration}ms\n  Total Time:  ${totalTime}ms (Includes Redis set attempt)`;

  console.log(
    `\x1b[33m[CACHE MISS]\x1b[0m Source: \x1b[1mPostgreSQL Database\x1b[0m\n` +
    `  Key:         "${key}"\n` +
    `  Before Time: ${formatTime(dbBeforeTime)}\n` +
    `  After Time:  ${formatTime(dbAfterTime)}\n` +
    `  DB Duration: ${dbDuration}ms\n` +
    `  Total Time:  ${totalTime}ms (Includes Redis set attempt)\n`
  );

  if (data && typeof data === "object") {
    Object.defineProperty(data, "_cacheTelemetry", {
      value: telemetry,
      writable: true,
      enumerable: true,
      configurable: true
    });
  }

  return data;
}

/**
 * Cache invalidation helper.
 *
 * @param {string} key - Unique cache key to remove
 */
export async function invalidateCache(key) {
  try {
    await redis.del(key);
    console.log(`\x1b[35m[CACHE INVALIDATED]\x1b[0m Key: "${key}" cleared.`);
  } catch (err) {
    console.warn(`[Upstash Redis Cache Warning] Failed to delete key "${key}":`, err.message || err);
  }
}

/**
 * Cache invalidation by pattern helper.
 *
 * @param {string} pattern - Redis key pattern (e.g. "blogs:*")
 */
export async function invalidatePattern(pattern) {
  try {
    const keys = await redis.keys(pattern);
    if (keys && keys.length > 0) {
      await redis.del(...keys);
      console.log(`\x1b[35m[CACHE PATTERN INVALIDATED]\x1b[0m Pattern: "${pattern}" cleared ${keys.length} keys: ${keys.join(", ")}`);
    } else {
      console.log(`\x1b[35m[CACHE PATTERN INVALIDATED]\x1b[0m Pattern: "${pattern}" matched 0 keys.`);
    }
  } catch (err) {
    console.warn(`[Upstash Redis Cache Warning] Failed to invalidate pattern "${pattern}":`, err.message || err);
  }
}
