<script>
    import { onMount } from "svelte";
    import Landing from "./lib/Landing.svelte";
    import Desktop from "./lib/Desktop.svelte";
    import PortfolioView from "./lib/portfolio/PortfolioView.svelte";

    /**
     * ROUTER SETUP
     * Import our hash-based router
     */
    import {
        currentRoute,
        initRouter,
        getViewFromRoute,
    } from "./lib/router.js";

    // Initialize router on app load
    onMount(() => {
        initRouter();
    });

    // Derive current view from route
    // This automatically updates when route changes
    $: currentView = getViewFromRoute($currentRoute);
</script>

<main>
    {#if currentView === "landing"}
        <Landing />
    {:else if currentView === "terminal"}
        <Desktop />
    {:else if currentView === "portfolio"}
        <PortfolioView />
    {/if}
</main>
