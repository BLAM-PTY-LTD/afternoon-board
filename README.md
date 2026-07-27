# Afternoon Board

Browser prototype for a school afternoon destination board — plus **Carline** for matching students to pickup cars.

Parents update where their child is going after school and which vehicle will collect them; staff see a live dismissal board by class and a carline curb board.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://127.0.0.1:5173/`).

Use the **Parent** / **Staff board** / **Carline** toggle in the top bar to try each view.

## Views

- **Parent** — set today’s destination; for parent / approved-adult pickup, choose the registered car
- **Staff board** — class dismissal list with destination, car, and notes; office override
- **Carline** — curb workflow: Waiting → Arrived → Loaded for students on vehicle pickup

## Demo notes

- Sample data for “Riverside Primary” (classes 3A, 3B, 4A)
- Updates are in-memory only — refresh resets
- Parent changes lock after 2:30pm (office override still available on the staff board)
