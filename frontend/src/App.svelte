<script>
    import { onMount, onDestroy } from "svelte";
    import Landing from "./lib/Landing.svelte";
    import Terminal from "./lib/Terminal.svelte";

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
        <Terminal />
    {:else if currentView === "portfolio"}
        <!-- Future: Visual Portfolio component -->
        <div style="color: #00ff00; text-align: center; padding-top: 40vh;">
            <p>Visual Portfolio coming soon...</p>
            <button
                onclick={() => (currentView = "landing")}
                style="color: #4facfe; background: none; border: 1px solid #4facfe; padding: 0.5rem 1rem; cursor: pointer; margin-top: 1rem;"
            >
                ← Back to Landing
            </button>
        </div>
    {/if}
</main>
