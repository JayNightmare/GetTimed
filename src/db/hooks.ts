import { useSQLiteContext } from "expo-sqlite";
import { JobType, Timesheet } from "./index";

export function useJobTypes() {
    const db = useSQLiteContext();

    const getJobTypes = () => {
        return db.getAllSync<JobType>(
            "SELECT * FROM job_types ORDER BY name ASC",
        );
    };

    const addJobType = (name: string, color: string) => {
        db.runSync(
            "INSERT INTO job_types (name, color) VALUES (?, ?)",
            name,
            color,
        );
    };

    const removeJobType = (id: number) => {
        db.runSync("DELETE FROM job_types WHERE id = ?", id);
    };

    return { getJobTypes, addJobType, removeJobType };
}

export function useTimesheets() {
    const db = useSQLiteContext();

    const getTimesheets = (startDate: number, endDate: number) => {
        return db.getAllSync<Timesheet>(
            "SELECT * FROM timesheets WHERE start_time >= ? AND start_time <= ? ORDER BY start_time DESC",
            startDate,
            endDate,
        );
    };

    const getTimesheetById = (id: string) => {
        return db.getFirstSync<Timesheet>(
            "SELECT * FROM timesheets WHERE id = ?",
            id,
        );
    };

    const addTimesheet = (ts: Omit<Timesheet, "is_draft">) => {
        db.runSync(
            `INSERT INTO timesheets (id, job_type_id, start_time, end_time, duration, description)
       VALUES (?, ?, ?, ?, ?, ?)`,
            ts.id,
            ts.job_type_id,
            ts.start_time,
            ts.end_time,
            ts.duration,
            ts.description,
        );
    };

    const updateTimesheet = (ts: Omit<Timesheet, "is_draft">) => {
        db.runSync(
            `UPDATE timesheets SET job_type_id = ?, start_time = ?, end_time = ?, duration = ?, description = ? WHERE id = ?`,
            ts.job_type_id,
            ts.start_time,
            ts.end_time,
            ts.duration,
            ts.description,
            ts.id,
        );
    };

    const deleteTimesheet = (id: string) => {
        db.runSync("DELETE FROM timesheets WHERE id = ?", id);
    };

    return {
        getTimesheets,
        getTimesheetById,
        addTimesheet,
        updateTimesheet,
        deleteTimesheet,
    };
}
