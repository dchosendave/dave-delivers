<script>
    import Hero from "./Hero.svelte";
    import Projects from "./Projects.svelte";
    import Skills from "./Skills.svelte";
    import Experience from "./Experience.svelte";
    import ParticleNetwork from "../ParticleNetwork.svelte";

    // Simple "Back" navigation
    function goHome() {
        const event = new CustomEvent("navigate", {
            detail: { view: "landing" },
        });
        document.dispatchEvent(event);
    }

    let isDark = $state(true);
</script>

<!-- Main Container: MacOS Dark Mode Background -->
<div
    class="h-screen w-full bg-slate-950 text-slate-50 font-sans selection:bg-blue-500/30 overflow-y-auto"
>
    <ParticleNetwork {isDark} />
    <!-- Floating "Dock-style" Back Button -->
    <nav class="fixed top-6 left-6 z-50">
        <button
            onclick={goHome}
            class="flex items-center gap-2 px-4 py-2 rounded-full
                   bg-black/20 backdrop-blur-xl border border-white/10
                   hover:bg-white/10 transition-all duration-300 active:scale-95"
        >
            <span class="text-sm font-medium opacity-80">← Home</span>
        </button>
    </nav>

    <!-- Content Stack -->
    <main class="max-w-7xl mx-auto px-6 py-20 flex flex-col gap-32">
        <Hero />
        <Experience />
        <Projects />
        <Skills />
    </main>

    <footer class="py-12 text-center opacity-40 text-sm">
        <p>Designed by Lowie Dave Dichoson in 2026</p>
    </footer>
</div>
