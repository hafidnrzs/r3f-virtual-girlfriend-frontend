# Illustration RPC Testing Guide

## Overview

The illustration component is now integrated with LiveKit RPC control. This document shows how to test the implementation.

## Manual Testing Steps

### 1. Start the Application

```bash
cd vyna-avatar-fe
pnpm dev
```

### 2. Connect to a Room

- Open the application in your browser
- Click "Start a conversation" to connect to the LiveKit room

### 3. Test RPC Calls from Browser Console

Once connected, open the browser console and use these commands:

#### Show illustration with a test image:

```javascript
// Get the room instance from the React context
const room = window.__LIVEKIT_ROOM__; // You may need to expose this in dev mode

// Or use the LiveKit client directly if available
await room.localParticipant.performRpc({
  destinationIdentity: room.localParticipant.identity,
  method: "client.showIllustration",
  payload: JSON.stringify({
    state: "show",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Triangle_illustration.svg/250px-Triangle_illustration.svg.png",
  }),
});
```

#### Hide illustration:

```javascript
await room.localParticipant.performRpc({
  destinationIdentity: room.localParticipant.identity,
  method: "client.showIllustration",
  payload: JSON.stringify({
    state: "hidden",
  }),
});
```

#### Test with different images:

```javascript
// Math illustration
await room.localParticipant.performRpc({
  destinationIdentity: room.localParticipant.identity,
  method: "client.showIllustration",
  payload: JSON.stringify({
    state: "show",
    image_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9b/Pythagorean_theorem_abc.svg/300px-Pythagorean_theorem_abc.svg.png",
  }),
});
```

#### Test error handling (invalid state):

```javascript
// This should return an error
await room.localParticipant.performRpc({
  destinationIdentity: room.localParticipant.identity,
  method: "client.showIllustration",
  payload: JSON.stringify({
    state: "visible", // Invalid - should be "show" or "hidden"
  }),
});
```

## Testing from Backend (Python Agent)

Add this to your agent code to test RPC calls:

```python
from livekit import rtc

# In your agent's message handler or any appropriate place:
async def show_illustration(room: rtc.Room, participant_identity: str, image_url: str):
    """Show an illustration to a specific participant"""
    try:
        result = await room.local_participant.perform_rpc(
            destination_identity=participant_identity,
            method="client.showIllustration",
            payload=json.dumps({
                "state": "show",
                "image_url": image_url
            })
        )
        print(f"RPC result: {result}")
    except Exception as e:
        print(f"RPC error: {e}")

# Example usage:
await show_illustration(
    room,
    "participant_identity",
    "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Triangle_illustration.svg/250px-Triangle_illustration.svg.png"
)
```

## Acceptance Criteria Checklist

- [ ] The Illustration component renders in the top-right with a 5:4 aspect ratio
- [ ] The image is fully visible with object-fit: contain (no cropping)
- [ ] Sending RPC with `{ state: 'show', image_url: '<url>' }` displays the image
- [ ] Sending RPC with `{ state: 'hidden' }` hides the component
- [ ] Invalid payloads return error responses
- [ ] The close button works correctly
- [ ] Failed image URLs show a placeholder icon
- [ ] Component has smooth animations (fade in/out)

## Expected Behavior

### On Show:

- Component fades in from the right
- Image loads and displays with correct aspect ratio
- Close button is visible and functional
- Image is contained within the 5:4 container

### On Hide:

- Component fades out smoothly
- State is preserved for next show

### On Error:

- Invalid state values log error and return error response
- Failed image loads show placeholder icon
- Malformed JSON is caught and logged

## Console Logs to Watch For

When testing, you should see these logs:

```
[RPC] Registering client.showIllustration method
[RPC] Received client.showIllustration from: <participant_identity>
[RPC] Illustration updated: { state: 'show', imageUrl: '<url>' }
```

## Sample Test Payloads

### Valid Show:

```json
{
  "state": "show",
  "image_url": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Triangle_illustration.svg/250px-Triangle_illustration.svg.png"
}
```

### Valid Hide:

```json
{
  "state": "hidden"
}
```

### Invalid (should error):

```json
{
  "state": "visible"
}
```

## Troubleshooting

### RPC method not registered

- Check browser console for "[RPC] Registering client.showIllustration method"
- Ensure you're connected to the room (not in disconnected state)
- Check that IllustrationRpcHandler is rendered

### Image not displaying

- Check browser console for image load errors
- Verify the image URL is accessible (no CORS issues)
- Try a different image URL

### Component not appearing

- Verify the RPC call succeeded (check return value)
- Check that state is "show" not "visible" or other values
- Inspect React DevTools for IllustrationProvider state

## Next Steps

1. Integrate with your AI agent to call this RPC when teaching concepts
2. Add more illustrations to your content library
3. Consider adding transition effects between different images
4. Add analytics to track which illustrations are shown
