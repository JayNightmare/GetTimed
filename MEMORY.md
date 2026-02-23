# Project Memory: GetTimed

## Current Project State

- Completed the initial implementation of the GetTimed React Native Expo app.
- All core features are developed: SQLite database layer, Zustand local storage, NativeWind UI components, and Expo Notifications.

## Active Tasks

### Completed

- Created `app-icon.svg` featuring a modern, dark-themed stopwatch aesthetic with a vibrant "GT" monogram for GetTimed.
- Fixed CRUD operations for Job Types in Settings.
- Improved `TimesheetModal.tsx` to process and persist entries into SQLite.
- Wired Start Time & Duration inputs to the Draft form state to effectively save data.
- Refactored `HomeScreen.tsx` to utilize the SQLite timesheet hooks for tracking weekly targets and history instead of placeholders.
- Fixed a `Maximum update depth exceeded` React infinite loop caused by unmemoized hooks in Expo SQLite context loops.
- Replaced the simple 1-tap Preset mode with a more robust horizontally sweeping Job Type pill selector paired with dual vertical Plus/Minus counters for exact timing.

### Next Steps

- Continue verifying app usability and flows within Expo Go.
- Add editing functionality for existing local timesheets.

## Architectural Decisions

- **Framework:** React Native + Expo Go
- **Styling:** Nativewind v4 + TailwindCSS (Dark mode primary)
- **Persistence:** Expo SQLite (instead of MMKV for standard Expo Go compatibility) + AsyncStorage for minimal settings.
- **State Management:** Zustand
- **Requirements:** Strictly no emojis, SVGs exclusively mapped in Icon.tsx.
