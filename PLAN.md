## Task: Illustration component + RPC control

Goal
--
Add a small top-right illustration component that can be shown/hidden and set to display an image from an external URL. Control the component via a LiveKit RPC method so other clients or server logic can toggle visibility and change the image.

High-level requirements
--
- Component location: absolute, pinned to the top-right of the viewport (or container) with a small margin.
- Aspect ratio: 5:4 (width:height). The rendered image inside the component should preserve its own aspect ratio and be fully visible (no cropping).
- Exposed control: register a LiveKit RPC method to update the component's state and image URL. RPC name: `client.showIllustration`.
- Payload shape: a small JSON contract (see below).

Payload contract (single source of truth)
--
The RPC will receive an object with these fields:

{
  "state": "show" | "hidden",
  "image_url": string | null
}

- `state` controls whether the component is visible. Two allowed values: `show` and `hidden`.
- `image_url` is an absolute URL to the image to display. When null or empty and `state` is `show`, the component should render a default placeholder (or remain hidden, see acceptance criteria).

Component contract (developer-facing)
--
- Component name suggestion: `Illustration.tsx` (React + TypeScript). Keep it small and self-contained.
- Props (for local usage / testing):
  - `visible: boolean`
  - `imageUrl?: string`
  - `onClose?: () => void` (optional close callback)
- Styling: absolute top-right with a margin; CSS must enforce 5:4 aspect ratio. Prefer modern CSS (aspect-ratio) but include a fallback using padding-top if necessary.
- Image rendering: use `object-fit: contain` to preserve aspect ratio and avoid cropping.

Example UI/JSX (concept)
--
This is a minimal example the agent can implement or adapt to the codebase conventions (TSX + Tailwind/CSS-in-JS etc):

// Illustration.tsx (conceptual)
import React from 'react';

type Props = { visible: boolean; imageUrl?: string; onClose?: () => void };

export default function Illustration({ visible, imageUrl, onClose }: Props) {
  if (!visible) return null;
  return (
    <div className="illustration-root" aria-hidden={!visible}>
      <img src={imageUrl ?? '/placeholder.png'} alt="illustration" />
      {onClose && <button onClick={onClose}>Close</button>}
    </div>
  );
}

Example CSS notes
--
- Container: position: absolute; top: 16px; right: 16px; width: clamp(160px, 18vw, 320px); aspect-ratio: 5/4; z-index: high.
- Image: width: 100%; height: 100%; object-fit: contain; display: block;

RPC registration
--
Register a single RPC method that updates the component state. Use `room.registerRpcMethod(name, handler)` provided by LiveKit. The handler receives an invocation object containing `payload` and `callerIdentity`.

Example TypeScript handler (conceptual):

room.registerRpcMethod("client.showIllustration", async (data: RpcInvocationData) => {
  const payload = data.payload as { state: 'show' | 'hidden'; image_url?: string | null };
  // Update local component state: set visible = payload.state === 'show', imageUrl = payload.image_url
  // Return an acknowledgement if needed
  return { ok: true };
});

Notes for the agent wiring the RPC
--
- The RPC handler must validate the incoming payload (types and allowed values). Ignore or reject unknown fields.
- Prefer a small wrapper function that applies the incoming state to the React component (for example, via context, a global store, or via a room-scoped state object that the component subscribes to).
- The RPC should return a simple response (ack or error). If rejecting, return a readable error message.

Acceptance criteria
--
1. The `Illustration` component renders in the top-right with a 5:4 ratio and the image visible and fully contained.
2. Sending an RPC invocation with `{ state: 'show', image_url: '<url>' }` displays the component with that image.
3. Sending `{ state: 'hidden' }` hides the component.
4. Invalid payloads are ignored and an error response is returned by the RPC handler.

Edge cases and UX details
--
- If `image_url` is missing or 404s, fall back to a local placeholder or hide the component depending on the product preference.
- Rapid repeated RPC calls: ensure the handler is idempotent (setting the same state twice is safe).
- Cross-origin images: ensure the component sets `crossOrigin` if required, or rely on browser defaults.

Testing and verification
--
Manual test steps:
1. Start the app and open the UI that hosts the `Illustration` component.
2. In the client connection logic (where `room` is available), call the handler directly or use a test RPC invocation to simulate remote calls.
3. Verify acceptance criteria 1-3.

Automated test suggestions:
- Small unit test for the component rendering visible/hidden and `imageUrl` prop.
- Integration test (or a small script) that registers the RPC and invokes it with the sample payload.

Sample test payloads
--
- Valid show:
  { "state": "show", "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Triangle_illustration.svg/250px-Triangle_illustration.svg.png" }
- Valid hide:
  { "state": "hidden" }
- Invalid:
  { "state": "visible" }  // rejected: not an allowed value

Next steps for implementer
--
1. Implement `src/components/Illustration.tsx` following the component contract and styling notes.
2. Wire a small state store or React context that the component reads from.
3. Register `client.showIllustration` in the client connection code that has access to `room` and validate payloads before updating the store.
4. Add the brief unit tests and perform manual QA.

References
--
- LiveKit RPC docs: https://docs.livekit.io/home/client/data/rpc/

If you want, I can implement a starter `Illustration.tsx` + minimal CSS and show the exact code to register the RPC in the existing connection code.
