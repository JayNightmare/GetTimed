# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased]

- **Fixed:** Resolved `Maximum update depth exceeded` infinite loop tied to hook dependency rerenders in Expo SQLite implementations.
- **Fixed:** Job Type CRUD functionality in `SettingsScreen.tsx` now correctly interacts with the SQLite database.
- **Fixed:** The TimesheetModal now appropriately saves the timesheet to the database upon submission, rather than only clearing the draft.
- **Fixed:** Custom draft inputs for Start Time and Duration now correctly update local state and save upon entry submission.
- **Fixed:** The HomeScreen now automatically fetches the current week's timesheets and dynamically calculates progress toward the weekly quota.
- **Added:** New Duration Setter capabilities for the Preset Timesheet Logging mode, utilizing Plus/Minus counters for specific hours constraints and 15-minute minute increments.
- **Added:** Job Types available in the Timesheet preset row.
- **Added:** Recent Logs correctly display the list of log entries for the current week.
