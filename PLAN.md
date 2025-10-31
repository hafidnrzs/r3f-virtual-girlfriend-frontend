# Task 1 — Create a responsive two-row grid layout

## Goal

Create a full-height, responsive layout in `src/App.tsx` that contains two rows:

- The main content row (split 2/5 | 3/5) for the avatar area and chat UI.
- A full-width control bar row at the bottom with microphone toggle, visualizer, and disconnect button.

## Files to edit

- `src/App.tsx` — create the grid container and use the existing components (or placeholders).
- (Optional) Create small components to keep code tidy: `components/AvatarPanel.tsx`, `components/ChatPanel.tsx`, `components/ControlBar.tsx`.

## Layout requirements (explicit)

1. Full viewport height: the app must fill the browser height (100vh).
2. Two rows:
   - Row 1 (main): takes remaining space above the control bar.
   - Row 2 (controls): fixed height (e.g., ~64px) across the full width.
3. Main row content is a two-column split: 2/5 (40%) on the left for the avatar area, 3/5 (60%) on the right for chat.
4. The left column shows a centered placeholder for the 3D avatar and a small area for a future visualizer.
5. The right column is the chat panel: a scrollable transcript area above and a compact chat input pinned/stuck to the bottom of the panel.

## Desktop (recommended CSS/Tailwind behavior)

- Use CSS Grid for the overall page: grid with two rows: main and controls.
- For the main row, use a 5-column fraction grid (or set widths via percentages): left 2fr, right 3fr.
- Example Tailwind container classes (for guidance):
  - Outer container: `h-screen grid grid-rows-[1fr_auto] gap-4` — fills viewport and provides a fixed controls row.
  - Main area: `grid grid-cols-5 gap-4`.
  - Left panel: `col-span-2 flex items-center justify-center bg-gray-50 p-4` (placeholder centered text).
  - Right panel: `col-span-3 flex flex-col` with transcript as `flex-1 overflow-auto` and input as `h-14 sticky bottom-0`.

## Mobile / small screens

- Stack content vertically on narrow viewports: avatar first, then chat, then controls.
- Use responsive Tailwind utilities (e.g., `md:grid-cols-5` and `grid-cols-1` for small screens).

## Control bar (second row)

- Full width across the bottom.
- Fixed (or visually fixed inside the grid) height: recommended ~56–72px.
- Items aligned horizontally: left area for visualizer, center (optional), right area for primary controls (microphone toggle, disconnect).
- Microphone toggle: visible state (on/off) and accessible label.
- Disconnect button: visually distinct, aligned to the right.

## Accessibility & interaction details

- All interactive controls must have accessible labels (aria-label / title).
- Keyboard focus states should be visible.
- Chat input should autofocus when the user opens the page (optional).

## Suggested component contract

- AvatarPanel
  - Props: none for now; shows placeholder text and a "visualizer" area.
- ChatPanel
  - Props: messages: ChatMessage[]
  - Behavior: scrolls to bottom on new message; input is sticky at bottom; exposes onSend(message).
- ControlBar
  - Props: micOn: boolean, onToggleMic(), onDisconnect()
  - Contains a small visualizer placeholder and primary controls.

## Acceptance criteria (how we'll know it's done)

1. Launching the frontend (`pnpm dev`) shows a full-height layout with two rows.
2. The top row is split approximately 40% (avatar) / 60% (chat).
3. The chat transcript area scrolls independently and the input stays pinned to the bottom of the chat panel.
4. The control bar is always visible at the bottom of the viewport and contains a mic toggle and disconnect button.
5. Layout collapses to a single-column stack on small screens.

## Quick implementation notes

- Keep changes minimal in `src/App.tsx`: add the grid container and simple placeholders.
- Use Tailwind utilities already in the project; no new CSS files are required for this task.
- If you prefer, split into the three small components listed above to keep `App.tsx` tidy.

## How to test locally

1. Start the dev server in the frontend folder:

```pwsh
pnpm dev
```

2. Open the app in a browser and verify the acceptance criteria.

## Next steps (optional)

- Replace placeholders with the 3D avatar canvas and real audio visualizer.
- Wire the control bar to LiveKit connection state and mic input.

## Notes

- Do not hardcode any API URLs or secrets into the frontend. Keep the layout purely presentational for this task.
