<script>
    import { onMount, onDestroy } from "svelte";
    import Landing from "./lib/Landing.svelte";
    import Desktop from "./lib/Desktop.svelte";
    import PortfolioView from "./lib/portfolio/PortfolioView.svelte";

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
        <PortfolioView />
    {/if}
</main>
