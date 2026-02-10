/**
 * SIMPLE HASH-BASED ROUTER
 * 
 * This creates URL routing like:
 * - localhost:5000/ or localhost:5000/#/ → Landing
 * - localhost:5000/#/desktop → Terminal/Desktop
 * - localhost:5000/#/get-to-know-me → Portfolio
 * 
 * Why hash routing (#)?
 * - Works with Vite's dev server without extra config
 * - No server-side setup needed
 * - Browser back/forward buttons work
 * - Shareable URLs
 * 
 * Backend analogy: Like Express route handlers
 */

import { writable } from 'svelte/store';

/**
 * Svelte store to hold current route
 * Components can subscribe to this to react to route changes
 */
export const currentRoute = writable('/');

/**
 * Navigate to a new route programmatically
 * Like calling `res.redirect()` in Express
 * 
 * @param {string} path - The path to navigate to (e.g., '/desktop')
 */
export function navigate(path) {
    // Update the URL hash
    window.location.hash = path;
    // Store will update automatically via hashchange listener
}

/**
 * Get the current route from URL
 * Removes the # and returns clean path
 */
function getRoute() {
    // Get hash, remove #, default to '/'
    const hash = window.location.hash.slice(1) || '/';
    return hash;
}

/**
 * Initialize the router
 * Sets up listeners for URL changes
 * Call this once when app starts
 */
export function initRouter() {
    // Update store with initial route
    currentRoute.set(getRoute());

    // Listen for hash changes (back/forward buttons, manual hash change)
    window.addEventListener('hashchange', () => {
        currentRoute.set(getRoute());
    });

    // Listen for popstate (additional browser navigation support)
    window.addEventListener('popstate', () => {
        currentRoute.set(getRoute());
    });
}

/**
 * Route mapping
 * Maps URL paths to view names for backwards compatibility
 */
export const ROUTES = {
    '/': 'landing',
    '/desktop': 'terminal',
    '/get-to-know-me': 'portfolio',
};

/**
 * Get view name from route
 * Handles invalid routes by defaulting to landing
 */
export function getViewFromRoute(route) {
    return ROUTES[route] || 'landing';
}
