<script>
    import { onMount, onDestroy } from "svelte";
    import Landing from "./lib/Landing.svelte";
    import Desktop from "./lib/Desktop.svelte";

    let currentView = $state("landing");

    function handleNavigate(event) {
        currentView = event.detail.view;
    }

    onMount(() => {
        document.addEventListener("navigate", handleNavigate);
        return () => document.removeEventListener("navigate", handleNavigate);
    });
</script>

<main>
    {#if currentView === "landing"}
        <Landing />
    {:else if currentView === "terminal"}
        <Desktop />
    {:else if currentView === "portfolio"}
        <!-- Future: Visual Portfolio component -->
        <div
            style="color: #fff; text-align: center; padding-top: 40vh; font-family: 'Inter', sans-serif;"
        >
            <p style="font-size: 1.5rem; margin-bottom: 1rem;">
                Visual Portfolio coming soon...
            </p>
            <button
                onclick={() => (currentView = "landing")}
                style="color: #007AFF; background: none; border: 1px solid #007AFF; padding: 0.75rem 1.5rem; cursor: pointer; border-radius: 50px; font-family: 'Inter', sans-serif;"
            >
                ← Back to Home
            </button>
        </div>
    {/if}
</main>
