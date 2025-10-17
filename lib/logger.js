import fs from "fs-extra";
import path from "path";

/**
 * Simple asynchronous file logger
 * - Writes to logs/<level>-YYYY-MM-DD.log
 * - Exposes async info/warn/error/log methods
 * - Rotates per-day (a new file per day)
 */

// Where logs are created (project root)
const LOG_DIR = path.join(process.cwd(), "logs");

// Levels and file name prefixes
const LEVELS = {
    info: "info",
    warn: "warn",
    error: "error",
};

// Cache of streams per level+date: { "<level>|YYYY-MM-DD": { stream, date } }
const streamCache = new Map();

// return YYYY-MM-DD string for today or given date
function dateStr(d = new Date()) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
}

// Ensure logs dir exists
async function ensureLogDir() {
    try {
        await fs.ensureDir(LOG_DIR);
    } catch (err) {
        // If even creating logs dir fails, rethrow so caller can decide
        throw new Error(`Failed to create log directory (${LOG_DIR}): ${err.message}`);
    }
}

// Return an async writable stream for (level, dateStr) — creates or reuses from cache
async function getStream(level, forDate = dateStr()) {
    const key = `${level}|${forDate}`;

    // If cached and still valid, return
    if (streamCache.has(key)) {
        const cached = streamCache.get(key);
        // verify stream is writable
        if (cached.stream && !cached.stream.destroyed) return cached.stream;
        // else fallthrough to recreate
    }

    await ensureLogDir();

    const filename = `${level}-${forDate}.log`;
    const filePath = path.join(LOG_DIR, filename);

    // create write stream in append mode
    const stream = fs.createWriteStream(filePath, { flags: "a", encoding: "utf8" });

    // store in cache
    streamCache.set(key, { stream, date: forDate });

    // optionally prune older streams for this level (keep only current)
    for (const k of streamCache.keys()) {
        if (k.startsWith(`${level}|`) && k !== key) {
            const old = streamCache.get(k);
            try {
                old.stream.end();
            } catch (e) {
                // ignore but can use later if we need
            }
            streamCache.delete(k);
        }
    }

    return stream;
}

// Internal write helper — returns a Promise that resolves when write completes (or rejects on error)
async function writeLine(level, text, meta = null) {
    const today = dateStr();
    const stream = await getStream(level, today);

    // Format: ISO timestamp | pid | level | message | meta(JSON)
    const timestamp = new Date().toISOString();
    let line = `${timestamp} | pid:${process.pid} | ${level.toUpperCase()} | ${text}`;
    if (meta !== null && typeof meta !== "undefined") {
        try {
            line += " | " + (typeof meta === "string" ? meta : JSON.stringify(meta));
        } catch (err) {
            line += " | [meta serialization failed]";
        }
    }

    return new Promise((resolve, reject) => {
        // write and resolve when flushed
        stream.write(line + "\n", "utf8", (err) => {
            if (err) return reject(err);
            resolve();
        });
    });
}

// Public API
async function info(msg, meta) {
    return writeLine(LEVELS.info, String(msg), meta);
}

async function warn(msg, meta) {
    return writeLine(LEVELS.warn, String(msg), meta);
}

async function error(msg, meta) {
    return writeLine(LEVELS.error, String(msg), meta);
}

// log must be one of 'info'|'warn'|'error')
async function log(level, msg, meta) {
    if (!Object.prototype.hasOwnProperty.call(LEVELS, level)) {
        throw new Error(`Invalid log level: ${level}`);
    }
    return writeLine(level, String(msg), meta);
}

// Shutdown to close streams => OPTIONAL Utility
async function closeAll() {
    const promises = [];
    for (const [, val] of streamCache) {
        try {
            // end returns void, wrap in promise to wait 'finish' event
            const p = new Promise((resolve) => {
                val.stream.end(() => resolve());
            });
            promises.push(p);
        } catch (e) {
            // ignore but can use later if we need
        }
    }
    await Promise.all(promises);
    streamCache.clear();
}

export default {
    info,
    warn,
    error,
    log,
    closeAll,
};
export { info, warn, error, log, closeAll };

//for coloured logs in console 
export const logInfo = (msg) => console.log("\x1b[36m%s\x1b[0m", msg); // cyan
export const logSuccess = (msg) => console.log("\x1b[32m%s\x1b[0m", msg); // green
export const logError = (msg) => console.log("\x1b[31m%s\x1b[0m", msg); // red
