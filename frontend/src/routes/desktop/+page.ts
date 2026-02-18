// Disable SSR for the desktop route
// Leaflet (used by ISSTracker) requires `window` which doesn't exist during SSR
export const ssr = false;
