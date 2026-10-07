import type { SQLiteDatabase } from "expo-sqlite";
import type { Scan } from "../types/scan";

export async function initializeDatabase(db: SQLiteDatabase) {
    await db.execAsync(`
        CREATE TABLE IF NOT EXISTS scans (
            id TEXT PRIMARY KEY NOT NULL,
            value TEXT NOT NULL,
            format TEXT NOT NULL,
            scanned_at TEXT NOT NULL
        );
    `)
}

export async function insertScan(db: SQLiteDatabase, scan: Scan) {
    await db.runAsync(
        `INSERT INTO scans (id, value, format, scanned_at)
        VALUES (?, ?, ?, ?)`,
        scan.id,
        scan.value,
        scan.format,
        scan.scannedAt
    );
}

export async function getScans(db: SQLiteDatabase): Promise<Scan[]> {
    return db.getAllAsync<Scan>(
        `SELECT id, value, format, scanned_at AS scannedAt
        FROM scans
        ORDER BY scanned_at ASC`
    );
}