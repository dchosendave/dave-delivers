<script lang="ts">
    import { onMount, onDestroy } from "svelte";
    import L from "leaflet";
    import type { ISSTrackerProps, ISSData, ISSStats } from "./types/iss-types";
    import "leaflet/dist/leaflet.css";

    let { onClose }: ISSTrackerProps = $props();

    let map: L.Map | null = null;
    let issMarker: L.Marker | null = null;
    let pathPolyline: L.Polyline | null = null;
    let intervalId: number | null = null;

    let issStats = $state<ISSStats | null>(null);
    let loading = $state(true);
    let error = $state<string | null>(null);
    let pathPoints: [number, number][] = [];

    const ISS_ALTITUDE = 408; // Average ISS altitude in km
    const ISS_VELOCITY = 27600; // Average ISS velocity in km/h

    async function fetchISSPosition() {
        try {
            const response = await fetch(
                "http://api.open-notify.org/iss-now.json",
            );
            if (!response.ok) {
                throw new Error("Failed to fetch ISS position");
            }

            const data: ISSData = await response.json();
            const lat = parseFloat(data.iss_position.latitude);
            const lon = parseFloat(data.iss_position.longitude);

            // Update stats
            issStats = {
                lat,
                lon,
                altitude: ISS_ALTITUDE,
                velocity: ISS_VELOCITY,
                timestamp: new Date(data.timestamp * 1000),
            };

            // Initialize map on first successful fetch (when DOM is ready)
            if (!map && issStats) {
                await initializeMap();
            }

            // Update marker position
            if (issMarker && map) {
                issMarker.setLatLng([lat, lon]);
                map.panTo([lat, lon], { animate: true, duration: 0.5 });

                // Add to path
                pathPoints.push([lat, lon]);
                // Keep only last 50 points (approx 4 minutes)
                if (pathPoints.length > 50) {
                    pathPoints.shift();
                }

                // Update path line
                if (pathPolyline) {
                    pathPolyline.setLatLngs(pathPoints);
                }
            }

            loading = false;
            error = null;
        } catch (e) {
            error =
                e instanceof Error ? e.message : "Failed to fetch ISS position";
            loading = false;
        }
    }

    async function initializeMap() {
        // Wait for Svelte to render the map container
        await new Promise((resolve) => setTimeout(resolve, 100));

        const mapElement = document.getElementById("iss-map");
        if (!mapElement) {
            console.error("Map container not found in DOM");
            return;
        }

        // Initialize Leaflet map
        map = L.map("iss-map", {
            zoomControl: true,
            attributionControl: false,
        }).setView([issStats!.lat, issStats!.lon], 3);

        // Add OpenStreetMap tile layer
        L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
        }).addTo(map);

        // Create ISS marker with custom icon
        const issIcon = L.divIcon({
            className: "iss-icon",
            html: '<div class="iss-marker">🛰️</div>',
            iconSize: [32, 32],
            iconAnchor: [16, 16],
        });

        issMarker = L.marker([issStats!.lat, issStats!.lon], {
            icon: issIcon,
        }).addTo(map);

        // Create path polyline
        pathPolyline = L.polyline([[issStats!.lat, issStats!.lon]], {
            color: "#3b82f6",
            weight: 2,
            opacity: 0.7,
            smoothFactor: 1,
        }).addTo(map);
    }

    function startTracking() {
        fetchISSPosition(); // Initial fetch
        intervalId = window.setInterval(fetchISSPosition, 5000); // Every 5 seconds
    }

    onMount(() => {
        startTracking();
    });

    onDestroy(() => {
        if (intervalId) {
            clearInterval(intervalId);
        }
        if (map) {
            map.remove();
        }
    });

    function formatCoordinate(value: number, isLatitude: boolean): string {
        const direction = isLatitude
            ? value >= 0
                ? "N"
                : "S"
            : value >= 0
              ? "E"
              : "W";
        return `${Math.abs(value).toFixed(2)}° ${direction}`;
    }

    function formatTime(date: Date): string {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        });
    }
</script>

<div class="iss-tracker-overlay">
    <div class="iss-tracker-window">
        <!-- macOS Window Header -->
        <div class="window-header">
            <div class="window-controls">
                <button
                    class="control-btn close"
                    onclick={onClose}
                    title="Close"
                ></button>
                <button class="control-btn minimize" title="Minimize"></button>
                <button class="control-btn maximize" title="Maximize"></button>
            </div>
            <div class="window-title">
                <span class="title-icon">🛰️</span>
                <span class="title-text">ISS Live Tracker</span>
            </div>
            <div class="window-spacer"></div>
        </div>

        <!-- Content -->
        <div class="window-content">
            {#if loading && !issStats}
                <div class="loading-state">
                    <div class="spinner"></div>
                    <p>Connecting to ISS...</p>
                </div>
            {:else if error && !issStats}
                <div class="error-state">
                    <span class="error-icon">⚠️</span>
                    <p>{error}</p>
                </div>
            {:else}
                <div class="content-layout">
                    <!-- Map Container -->
                    <div class="map-container">
                        <div id="iss-map"></div>
                    </div>

                    <!-- Stats Panel -->
                    {#if issStats}
                        <div class="stats-panel">
                            <div class="stat-group">
                                <h3 class="stat-title">📍 Position</h3>
                                <div class="stat-items">
                                    <div class="stat-item">
                                        <span class="stat-label">Latitude</span>
                                        <span class="stat-value"
                                            >{formatCoordinate(
                                                issStats.lat,
                                                true,
                                            )}</span
                                        >
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Longitude</span
                                        >
                                        <span class="stat-value"
                                            >{formatCoordinate(
                                                issStats.lon,
                                                false,
                                            )}</span
                                        >
                                    </div>
                                </div>
                            </div>

                            <div class="stat-group">
                                <h3 class="stat-title">🚀 Movement</h3>
                                <div class="stat-items">
                                    <div class="stat-item">
                                        <span class="stat-label">Altitude</span>
                                        <span class="stat-value"
                                            >{issStats.altitude.toLocaleString()}
                                            km</span
                                        >
                                    </div>
                                    <div class="stat-item">
                                        <span class="stat-label">Velocity</span>
                                        <span class="stat-value"
                                            >{issStats.velocity.toLocaleString()}
                                            km/h</span
                                        >
                                    </div>
                                </div>
                            </div>

                            <div class="stat-group">
                                <h3 class="stat-title">⏰ Last Updated</h3>
                                <div class="stat-items">
                                    <div class="stat-item">
                                        <span class="stat-value time"
                                            >{formatTime(
                                                issStats.timestamp,
                                            )}</span
                                        >
                                    </div>
                                </div>
                            </div>
                        </div>
                    {/if}
                </div>
            {/if}
        </div>
    </div>
</div>

<style>
    .iss-tracker-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        background: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
        backdrop-filter: blur(4px);
    }

    .iss-tracker-window {
        width: 90%;
        max-width: 900px;
        height: 85vh;
        max-height: 700px;
        background: rgba(20, 20, 30, 0.95);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 12px;
        backdrop-filter: blur(40px);
        box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
        display: flex;
        flex-direction: column;
        overflow: hidden;
    }

    /* macOS Window Header */
    .window-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        background: rgba(255, 255, 255, 0.02);
    }

    .window-controls {
        display: flex;
        gap: 0.5rem;
    }

    .control-btn {
        width: 12px;
        height: 12px;
        border-radius: 50%;
        border: none;
        cursor: pointer;
        transition: filter 0.2s;
    }

    .control-btn:hover {
        filter: brightness(1.2);
    }

    .control-btn.close {
        background: #ff5f56;
    }
    .control-btn.minimize {
        background: #ffbd2e;
    }
    .control-btn.maximize {
        background: #27c93f;
    }

    .window-title {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
    }

    .title-icon {
        font-size: 1.25rem;
    }

    .title-text {
        font-size: 0.875rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
    }

    .window-spacer {
        width: 60px;
    }

    /* Content */
    .window-content {
        flex: 1;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }

    .loading-state,
    .error-state {
        flex: 1;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        color: rgba(255, 255, 255, 0.7);
        gap: 1rem;
    }

    .spinner {
        width: 40px;
        height: 40px;
        border: 3px solid rgba(255, 255, 255, 0.1);
        border-top-color: #3b82f6;
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    .error-icon {
        font-size: 3rem;
    }

    .content-layout {
        flex: 1;
        display: flex;
        gap: 1rem;
        padding: 1rem;
        overflow: hidden;
    }

    /* Map */
    .map-container {
        flex: 1;
        border-radius: 8px;
        overflow: hidden;
        background: #1a1a1d;
    }

    #iss-map {
        width: 100%;
        height: 100%;
    }

    :global(.iss-marker) {
        font-size: 28px;
        animation: pulse 2s ease-in-out infinite;
        filter: drop-shadow(0 0 8px rgba(59, 130, 246, 0.8));
    }

    @keyframes pulse {
        0%,
        100% {
            transform: scale(1);
        }
        50% {
            transform: scale(1.1);
        }
    }

    /* Stats Panel */
    .stats-panel {
        width: 280px;
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
        padding: 1rem;
        background: rgba(255, 255, 255, 0.02);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 8px;
        overflow-y: auto;
    }

    .stat-group {
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
    }

    .stat-title {
        font-size: 0.875rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.9);
        margin: 0;
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .stat-items {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .stat-item {
        display: flex;
        justify-content: space-between;
        align-items: baseline;
        padding: 0.5rem;
        background: rgba(255, 255, 255, 0.02);
        border-radius: 4px;
    }

    .stat-label {
        font-size: 0.75rem;
        color: rgba(255, 255, 255, 0.6);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .stat-value {
        font-size: 0.9375rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.95);
        font-family: "SF Mono", "Monaco", "Courier New", monospace;
    }

    .stat-value.time {
        font-size: 1rem;
    }

    /* Responsive */
    @media (max-width: 768px) {
        .iss-tracker-window {
            width: 95%;
            height: 90vh;
        }

        .content-layout {
            flex-direction: column;
        }

        .stats-panel {
            width: 100%;
            max-height: 200px;
        }
    }
</style>
