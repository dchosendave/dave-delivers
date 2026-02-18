<script lang="ts">
    import { onMount } from "svelte";

    let hours = $state(0);
    let minutes = $state(0);
    let seconds = $state(0);
    let dateString = $state("");
    let greeting = $state("");

    onMount(() => {
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    });

    function updateTime() {
        const now = new Date();
        hours = now.getHours();
        minutes = now.getMinutes();
        seconds = now.getSeconds();

        dateString = now.toLocaleDateString("en-US", {
            weekday: "long",
            month: "long",
            day: "numeric",
        });

        // Time-of-day greeting
        if (hours < 12) greeting = "Good Morning";
        else if (hours < 17) greeting = "Good Afternoon";
        else greeting = "Good Evening";
    }

    // Analog clock hand rotations
    let hourDeg = $derived(((hours % 12) + minutes / 60) * 30);
    let minuteDeg = $derived((minutes + seconds / 60) * 6);
    let secondDeg = $derived(seconds * 6);

    // Digital time display
    let digitalTime = $derived(
        `${(hours % 12 || 12).toString()}:${minutes.toString().padStart(2, "0")}`,
    );
    let ampm = $derived(hours >= 12 ? "PM" : "AM");
</script>

<div class="clock-widget">
    <!-- Analog Clock Face -->
    <div class="clock-face">
        <!-- Hour markers -->
        {#each Array(12) as _, i}
            <div class="hour-marker" style="transform: rotate({i * 30}deg)">
                <div class="marker-dot"></div>
            </div>
        {/each}

        <!-- Clock Hands -->
        <div
            class="hand hour-hand"
            style="transform: rotate({hourDeg}deg)"
        ></div>
        <div
            class="hand minute-hand"
            style="transform: rotate({minuteDeg}deg)"
        ></div>
        <div
            class="hand second-hand"
            style="transform: rotate({secondDeg}deg)"
        ></div>

        <!-- Center dot -->
        <div class="center-dot"></div>
    </div>

    <!-- Digital Display -->
    <div class="clock-info">
        <span class="digital-time">{digitalTime}</span>
        <span class="ampm">{ampm}</span>
    </div>

    <p class="clock-date">{dateString}</p>
    <p class="clock-greeting">{greeting}</p>
</div>

<style>
    .clock-widget {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 1.25rem;
        width: 180px;
        background: rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(24px);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 1.25rem;
        user-select: none;
    }

    :global(:root.light) .clock-widget {
        background: rgba(255, 255, 255, 0.55);
        border-color: rgba(255, 255, 255, 0.6);
    }

    /* ===== ANALOG CLOCK ===== */
    .clock-face {
        position: relative;
        width: 120px;
        height: 120px;
        border-radius: 50%;
        background: rgba(0, 0, 0, 0.25);
        border: 2px solid rgba(255, 255, 255, 0.12);
    }

    :global(:root.light) .clock-face {
        background: rgba(255, 255, 255, 0.6);
        border-color: rgba(0, 0, 0, 0.08);
    }

    .hour-marker {
        position: absolute;
        top: 0;
        left: 50%;
        width: 1px;
        height: 100%;
        transform-origin: center center;
    }

    .marker-dot {
        width: 3px;
        height: 3px;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        margin: 6px auto 0;
    }

    :global(:root.light) .marker-dot {
        background: rgba(0, 0, 0, 0.25);
    }

    /* Clock hands */
    .hand {
        position: absolute;
        bottom: 50%;
        left: 50%;
        transform-origin: bottom center;
        border-radius: 4px;
    }

    .hour-hand {
        width: 3px;
        height: 28px;
        margin-left: -1.5px;
        background: rgba(255, 255, 255, 0.9);
    }

    .minute-hand {
        width: 2px;
        height: 38px;
        margin-left: -1px;
        background: rgba(255, 255, 255, 0.7);
    }

    .second-hand {
        width: 1px;
        height: 42px;
        margin-left: -0.5px;
        background: #ff6b6b;
    }

    :global(:root.light) .hour-hand {
        background: rgba(0, 0, 0, 0.8);
    }

    :global(:root.light) .minute-hand {
        background: rgba(0, 0, 0, 0.6);
    }

    .center-dot {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 6px;
        height: 6px;
        margin: -3px 0 0 -3px;
        border-radius: 50%;
        background: #ff6b6b;
    }

    /* ===== DIGITAL & INFO ===== */
    .clock-info {
        display: flex;
        align-items: baseline;
        gap: 0.25rem;
    }

    .digital-time {
        font-size: 1.5rem;
        font-weight: 700;
        color: var(--color-text-primary);
        font-variant-numeric: tabular-nums;
        letter-spacing: -0.02em;
    }

    .ampm {
        font-size: 0.6875rem;
        font-weight: 500;
        color: var(--color-text-secondary);
        text-transform: uppercase;
        letter-spacing: 0.05em;
    }

    .clock-date {
        font-size: 0.6875rem;
        color: var(--color-text-secondary);
        margin: 0;
        text-align: center;
        font-weight: 400;
    }

    .clock-greeting {
        font-size: 0.625rem;
        color: var(--color-text-tertiary, rgba(255, 255, 255, 0.35));
        margin: 0;
        font-weight: 500;
        text-transform: uppercase;
        letter-spacing: 0.08em;
    }
</style>
