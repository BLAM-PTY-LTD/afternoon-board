# Afternoon Board

Browser prototype for a school afternoon destination board.

Parents update where their child is going after school; staff see a live dismissal board by class.

## Run locally

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually `http://127.0.0.1:5173/`).

Use the **Parent** / **Staff board** toggle in the top bar to try both views.

## Demo notes

- Sample data for “Riverside Primary” (classes 3A, 3B, 4A)
- Updates are in-memory only — refresh resets
- Parent changes lock after 2:30pm (office override still available on the staff board)
