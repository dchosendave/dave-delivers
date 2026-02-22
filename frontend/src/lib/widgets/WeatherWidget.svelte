<script lang="ts">
    import { onMount } from "svelte";

    // Makati, Philippines coordinates
    const LAT = 14.5547;
    const LON = 121.0244;

    let temperature = $state<number | null>(null);
    let weatherCode = $state(0);
    let humidity = $state(0);
    let windSpeed = $state(0);
    let feelsLike = $state<number | null>(null);
    let isDay = $state(true);
    let loading = $state(true);
    let error = $state(false);
    let locationName = $state("Makati, PH");

    onMount(() => {
        fetchWeather();
        // Refresh every 15 minutes
        const interval = setInterval(fetchWeather, 15 * 60 * 1000);
        return () => clearInterval(interval);
    });

    async function fetchWeather() {
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${LAT}&longitude=${LON}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&timezone=auto`;
            const res = await fetch(url);
            if (!res.ok) throw new Error("Weather API failed");
            const data = await res.json();

            const current = data.current;
            temperature = Math.round(current.temperature_2m);
            weatherCode = current.weather_code;
            humidity = current.relative_humidity_2m;
            windSpeed = Math.round(current.wind_speed_10m);
            feelsLike = Math.round(current.apparent_temperature);
            isDay = current.is_day === 1;
            loading = false;
        } catch (e) {
            console.error("Weather fetch failed:", e);
            error = true;
            loading = false;
        }
    }

    // Map WMO weather codes to emoji + description
    function getWeatherInfo(
        code: number,
        day: boolean,
    ): { icon: string; desc: string } {
        if (code === 0) return { icon: day ? "☀️" : "🌙", desc: "Clear" };
        if (code <= 3)
            return { icon: day ? "⛅" : "☁️", desc: "Partly Cloudy" };
        if (code <= 49) return { icon: "🌫️", desc: "Foggy" };
        if (code <= 59) return { icon: "🌧️", desc: "Drizzle" };
        if (code <= 69) return { icon: "🌧️", desc: "Rain" };
        if (code <= 79) return { icon: "🌨️", desc: "Snow" };
        if (code <= 84) return { icon: "🌧️", desc: "Showers" };
        if (code <= 94) return { icon: "🌨️", desc: "Snow Showers" };
        if (code <= 99) return { icon: "⛈️", desc: "Thunderstorm" };
        return { icon: "🌤️", desc: "Unknown" };
    }

    let weatherInfo = $derived(getWeatherInfo(weatherCode, isDay));
</script>

<div class="weather-widget">
    {#if loading}
        <div class="weather-loading">
            <div class="weather-spinner"></div>
        </div>
    {:else if error}
        <div class="weather-error">
            <span class="error-icon">⚠️</span>
            <span class="error-text">Offline</span>
        </div>
    {:else}
        <!-- Main temp display -->
        <div class="weather-main">
            <span class="weather-icon">{weatherInfo.icon}</span>
            <div class="temp-block">
                <span class="temp-value">{temperature}°</span>
                <span class="temp-unit">C</span>
            </div>
        </div>

        <p class="weather-desc">{weatherInfo.desc}</p>

        <!-- Details row -->
        <div class="weather-details">
            <div class="detail">
                <span class="detail-icon">🌡️</span>
                <span class="detail-value">Feels {feelsLike}°</span>
            </div>
            <div class="detail">
                <span class="detail-icon">💧</span>
                <span class="detail-value">{humidity}%</span>
            </div>
            <div class="detail">
                <span class="detail-icon">💨</span>
                <span class="detail-value">{windSpeed} km/h</span>
            </div>
        </div>

        <p class="weather-location">📍 {locationName}</p>
    {/if}
</div>

<style>
    .weather-widget {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 1.25rem;
        width: 180px;
        background: rgba(255, 255, 255, 0.06);
        /* Reduced from 24px → 12px: same visual result, half the GPU compositing cost */
        backdrop-filter: blur(12px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 1.25rem;
        user-select: none;
        will-change: transform;
    }

    :global(:root.light) .weather-widget {
        background: rgba(255, 255, 255, 0.55);
        border-color: rgba(255, 255, 255, 0.6);
    }

    /* Loading */
    .weather-loading {
        display: flex;
        align-items: center;
        justify-content: center;
        min-height: 120px;
    }

    .weather-spinner {
        width: 24px;
        height: 24px;
        border: 2px solid rgba(255, 255, 255, 0.1);
        border-top-color: var(--color-text-primary);
        border-radius: 50%;
        animation: spin 1s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    /* Error */
    .weather-error {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        min-height: 120px;
        justify-content: center;
    }

    .error-icon {
        font-size: 1.5rem;
    }

    .error-text {
        font-size: 0.75rem;
        color: var(--color-text-secondary);
    }

    /* Main display */
    .weather-main {
        display: flex;
        align-items: center;
        gap: 0.5rem;
    }

    .weather-icon {
        font-size: 2.5rem;
        line-height: 1;
        filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
    }

    .temp-block {
        display: flex;
        align-items: flex-start;
    }

    .temp-value {
        font-size: 2.25rem;
        font-weight: 700;
        color: var(--color-text-primary);
        line-height: 1;
        letter-spacing: -0.03em;
    }

    .temp-unit {
        font-size: 0.875rem;
        font-weight: 500;
        color: var(--color-text-secondary);
        margin-top: 0.25rem;
    }

    .weather-desc {
        font-size: 0.75rem;
        font-weight: 500;
        color: var(--color-text-secondary);
        margin: 0;
        text-transform: uppercase;
        letter-spacing: 0.06em;
    }

    /* Details */
    .weather-details {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;
        width: 100%;
        margin-top: 0.25rem;
        padding-top: 0.5rem;
        border-top: 1px solid rgba(255, 255, 255, 0.08);
    }

    :global(:root.light) .weather-details {
        border-top-color: rgba(0, 0, 0, 0.06);
    }

    .detail {
        display: flex;
        align-items: center;
        gap: 0.375rem;
    }

    .detail-icon {
        font-size: 0.6875rem;
        line-height: 1;
    }

    .detail-value {
        font-size: 0.6875rem;
        color: var(--color-text-secondary);
        font-weight: 400;
    }

    .weather-location {
        font-size: 0.625rem;
        color: var(--color-text-tertiary, rgba(255, 255, 255, 0.35));
        margin: 0;
        font-weight: 400;
    }

    @media (max-width: 768px) {
        .weather-widget {
            width: 150px;
            padding: 1rem;
            gap: 0.375rem;
        }

        .weather-icon {
            font-size: 2rem;
        }
        .temp-value {
            font-size: 1.75rem;
        }
        .weather-desc {
            font-size: 0.675rem;
        }
        .detail-value {
            font-size: 0.625rem;
        }
    }
</style>
