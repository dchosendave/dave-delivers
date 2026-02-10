/**
 * SCROLL ANIMATIONS UTILITY
 * 
 * This file contains reusable animation logic using the Intersection Observer API.
 * Think of this like a reusable service/middleware in backend development.
 * 
 * KEY CONCEPT: Intersection Observer
 * - Browser API that watches when elements enter/exit the viewport
 * - Much more performant than listening to scroll events
 * - Like a "webhook" that triggers when visibility conditions are met
 */

/**
 * SVELTE ACTION: fadeIn
 * 
 * A Svelte action is a function that runs when an element is mounted.
 * It's similar to a decorator pattern in backend code.
 * 
 * Usage: <div use:fadeIn>Content</div>
 * 
 * @param {HTMLElement} node - The DOM element to animate
 * @param {Object} [options] - Configuration options
 * @param {number} [options.threshold] - How much of the element must be visible (0-1)
 * @param {number} [options.delay] - Animation delay in milliseconds
 * @param {string} [options.duration] - CSS animation duration (e.g., '0.8s')
 * 
 * Backend analogy: This is like a middleware function that:
 * 1. Sets up a listener (observer)
 * 2. Handles events (visibility changes)
 * 3. Cleans up when done (disconnect)
 */
export function fadeIn(node, options = {}) {
    // Default configuration (like default values in function parameters)
    const config = {
        threshold: options.threshold ?? 0.15,  // 15% visible triggers animation
        delay: options.delay ?? 0,
        duration: options.duration ?? '0.8s',
    };

    // Step 1: Add initial CSS properties
    // This sets the "before" state - element is invisible and slightly moved
    node.style.opacity = '0';
    node.style.transform = 'translateY(30px)';
    node.style.transition = `
        opacity ${config.duration} cubic-bezier(0.16, 1, 0.3, 1),
        transform ${config.duration} cubic-bezier(0.16, 1, 0.3, 1)
    `;

    // If there's a delay, apply it
    if (config.delay > 0) {
        node.style.transitionDelay = `${config.delay}ms`;
    }

    // Step 2: Create the Intersection Observer
    // This is like creating an event listener or webhook handler
    const observer = new IntersectionObserver(
        (entries) => {
            // This callback runs whenever visibility changes
            // Similar to a request handler in Express/FastAPI

            entries.forEach(entry => {
                // entry.isIntersecting = true when element enters viewport
                // It's like checking if a condition is met before executing logic

                if (entry.isIntersecting) {
                    // TRIGGER THE ANIMATION!
                    // Set final state - element becomes visible and moves to position

                    // FIX: Cast entry.target to HTMLElement
                    // IntersectionObserver returns 'Element' but we need 'HTMLElement' for .style
                    const element = /** @type {HTMLElement} */ (entry.target);
                    element.style.opacity = '1';
                    element.style.transform = 'translateY(0)';

                    // Once animated, stop observing this element (performance optimization)
                    // Like unsubscribing from a webhook after handling it once
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            // Observer configuration
            threshold: config.threshold,  // Percentage of element that must be visible
            rootMargin: '0px'  // Extra space around viewport (can be negative/positive)
        }
    );

    // Step 3: Start observing this element
    // Like registering a route handler or subscribing to events
    observer.observe(node);

    // CRITICAL FIX: Handle elements already in viewport
    // The observer callback only fires when intersection changes
    // If element is ALREADY visible on page load, callback never fires
    // Solution: Use setTimeout to check initial visibility
    setTimeout(() => {
        const rect = node.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            // Element is already visible, trigger animation immediately
            node.style.opacity = '1';
            node.style.transform = 'translateY(0)';
        }
    }, 50);  // Small delay ensures styles are applied first

    // Step 4: Return cleanup function
    // Svelte calls this when the component is destroyed
    // Like closing database connections or cleaning up event listeners
    return {
        destroy() {
            observer.disconnect();
        }
    };
}

/**
 * SVELTE ACTION: slideInLeft
 * 
 * Slides element in from the left side
 * Same pattern as fadeIn, but different transform
 * 
 * @param {HTMLElement} node - The DOM element to animate
 * @param {Object} [options] - Configuration options
 * @param {number} [options.threshold] - How much of element must be visible (0-1)
 * @param {number} [options.delay] - Animation delay in milliseconds
 * @param {string} [options.duration] - CSS animation duration
 */
export function slideInLeft(node, options = {}) {
    const config = {
        threshold: options.threshold ?? 0.15,
        delay: options.delay ?? 0,
        duration: options.duration ?? '0.8s',
    };

    // Initial state: moved to the left and invisible
    node.style.opacity = '0';
    node.style.transform = 'translateX(-40px)';  // Left instead of Y
    node.style.transition = `
        opacity ${config.duration} cubic-bezier(0.16, 1, 0.3, 1),
        transform ${config.duration} cubic-bezier(0.16, 1, 0.3, 1)
    `;

    if (config.delay > 0) {
        node.style.transitionDelay = `${config.delay}ms`;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Final state: in original position and visible

                    // FIX: Cast to HTMLElement for .style access
                    const element = /** @type {HTMLElement} */ (entry.target);
                    element.style.opacity = '1';
                    element.style.transform = 'translateX(0)';
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: config.threshold, rootMargin: '0px' }
    );

    observer.observe(node);

    // Handle elements already in viewport
    setTimeout(() => {
        const rect = node.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            node.style.opacity = '1';
            node.style.transform = 'translateX(0)';
        }
    }, 50);

    return {
        destroy() {
            observer.disconnect();
        }
    };
}

/**
 * SVELTE ACTION: scaleIn
 * 
 * Scales element up from slightly smaller size
 * Great for cards and images
 * 
 * @param {HTMLElement} node - The DOM element to animate
 * @param {Object} [options] - Configuration options
 * @param {number} [options.threshold] - How much of element must be visible (0-1)
 * @param {number} [options.delay] - Animation delay in milliseconds
 * @param {string} [options.duration] - CSS animation duration
 */
export function scaleIn(node, options = {}) {
    const config = {
        threshold: options.threshold ?? 0.15,
        delay: options.delay ?? 0,
        duration: options.duration ?? '0.6s',
    };

    // Initial state: slightly smaller and invisible
    node.style.opacity = '0';
    node.style.transform = 'scale(0.95)';  // 95% of original size
    node.style.transition = `
        opacity ${config.duration} cubic-bezier(0.16, 1, 0.3, 1),
        transform ${config.duration} cubic-bezier(0.16, 1, 0.3, 1)
    `;

    if (config.delay > 0) {
        node.style.transitionDelay = `${config.delay}ms`;
    }

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Final state: full size and visible

                    // FIX: Cast to HTMLElement for .style access
                    const element = /** @type {HTMLElement} */ (entry.target);
                    element.style.opacity = '1';
                    element.style.transform = 'scale(1)';
                    observer.unobserve(entry.target);
                }
            });
        },
        { threshold: config.threshold, rootMargin: '0px' }
    );

    observer.observe(node);

    // Handle elements already in viewport
    setTimeout(() => {
        const rect = node.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom > 0;

        if (isVisible) {
            node.style.opacity = '1';
            node.style.transform = 'scale(1)';
        }
    }, 50);

    return {
        destroy() {
            observer.disconnect();
        }
    };
}

/**
 * HELPER: Create staggered delays for child elements
 * 
 * Use this to create cascading animations (items appear one after another)
 * Like processing items in a queue with delays between each
 * 
 * @param {number} index - Position of the element (0, 1, 2, etc.)
 * @param {number} [baseDelay=100] - Delay between each item (in ms)
 * @returns {number} - Calculated delay for this item
 */
export function staggerDelay(index, baseDelay = 100) {
    return index * baseDelay;
}
