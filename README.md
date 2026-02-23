# GetTimed

GetTimed is an aggressively minimalist, locally-stored time tracking utility built for mobile using React Native and Expo. Designed with a dark mode primary aesthetic, it empowers swift "Job Type" template logging and manual timesheet adjustments right from the dashboard.

## Tech Stack

- **Framework**: React Native + Expo Go
- **Styling**: Nativewind v4 + TailwindCSS
- **Storage**: Expo SQLite (Database) + Zustand (State & Local storage)
- **Design Philosophy**: Strictly no emojis, SVGs exclusively mapped via centralized Icon component.

## Core Features

### Home Dashboard

- Real-time weekly quota progress tracking.
- Interactive horizontal calendar view.
- Weekly overview with total hours tracking.
- Visual timeline of Recent Logs.

### Logging Mechanism

- **Custom Mode:** Input standard specific start times, duration hours, job types, and descriptions.
- **Preset Mode:** Utilize horizontally scrolling preset job pills and precise plus/minus duration counters (handling hours and 15-minute minute chunks) to store logs quickly.

### User Settings

- Dynamically build and color-code `Job Types` to assign to different logs.
- Adjust weekly target hour quotas directly affecting the tracker logic.
- Configure daily reminder intervals.
