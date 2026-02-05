<script>
    import { onMount } from "svelte";

    let experiences = [];

    onMount(async () => {
        try {
            const res = await fetch("http://localhost:8000/experiences");
            experiences = await res.json();
        } catch (err) {
            console.error(err);
        }
    });
</script>

<section class="space-y-12">
    <!-- Header -->
    <div class="space-y-4">
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Experience
        </h2>
        <p class="text-lg text-slate-400 max-w-2xl font-light">
            My professional journey and key contributions.
        </p>
    </div>

    <!-- Timeline Container -->
    <div class="relative border-l border-white/10 ml-3 md:ml-6 space-y-12 pb-4">
        {#each experiences as exp}
            <div class="relative pl-8 md:pl-12 group">
                <!-- Timeline Dot (Glows on hover) -->
                <div
                    class="absolute -left-[5px] top-2 w-3 h-3 rounded-full bg-slate-600 border border-slate-900 group-hover:bg-blue-500 group-hover:scale-125 transition-all duration-300 shadow-[0_0_10px_rgba(59,130,246,0)] group-hover:shadow-[0_0_10px_rgba(59,130,246,0.5)]"
                ></div>

                <!-- Content Card -->
                <div
                    class="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 mb-2"
                >
                    <h3
                        class="text-2xl font-semibold text-white group-hover:text-blue-400 transition-colors"
                    >
                        {exp.company}
                    </h3>
                    <span
                        class="text-sm font-medium text-slate-500 font-mono bg-white/5 px-2 py-1 rounded-md"
                    >
                        {exp.duration}
                    </span>
                </div>

                <div class="space-y-4">
                    <p
                        class="text-slate-400 leading-relaxed font-light max-w-3xl"
                    >
                        {exp.description}
                    </p>

                    <!-- Tech Stack (Minimal text representation) -->
                    <div class="flex items-center gap-3 text-sm text-slate-500">
                        <span class="w-4 h-[1px] bg-slate-700"></span>
                        <span class="font-medium text-slate-400 tracking-wide">
                            {exp.tech_stack}
                        </span>
                    </div>
                </div>
            </div>
        {/each}
    </div>
</section>
