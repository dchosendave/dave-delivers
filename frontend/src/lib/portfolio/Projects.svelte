<script>
    import { onMount } from "svelte";

    let projects = [];

    onMount(async () => {
        try {
            const res = await fetch("http://localhost:8000/projects");
            projects = await res.json();
        } catch (err) {
            console.error(err);
        }
    });
</script>

<section class="space-y-12">
    <!-- Section Header -->
    <div class="space-y-4">
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Selected Works
        </h2>
        <p class="text-lg text-slate-400 max-w-2xl font-light">
            A collection of systems, APIs, and tools I've engineered.
        </p>
    </div>

    <!-- Grid Layout -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each projects as project}
            <!-- Card -->
            <div
                class="group relative flex flex-col justify-between p-8 rounded-[2rem]
                       bg-white/5 backdrop-blur-xl border border-white/5
                       hover:bg-white/10 hover:border-white/10 hover:-translate-y-1
                       transition-all duration-300 ease-out shadow-2xl shadow-black/20"
            >
                <div>
                    <!-- Title -->
                    <h3
                        class="text-2xl font-semibold text-white mb-3 group-hover:text-blue-400 transition-colors"
                    >
                        {project.name}
                    </h3>

                    <!-- Description -->
                    <p class="text-slate-400 leading-relaxed mb-6 font-light">
                        {project.description}
                    </p>
                </div>

                <div class="space-y-6">
                    <!-- Tech Stack Pills -->
                    <div class="flex flex-wrap gap-2">
                        {#each project.tags.split(",") as tag}
                            <span
                                class="px-3 py-1 text-xs font-medium tracking-wide text-blue-200 bg-blue-500/10 rounded-full border border-blue-500/20"
                            >
                                {tag.trim()}
                            </span>
                        {/each}
                    </div>

                    <!-- Link (Conditional) -->
                    {#if project.url}
                        <a
                            href={project.url}
                            target="_blank"
                            class="inline-flex items-center text-sm font-semibold text-white/50 hover:text-white transition-colors"
                        >
                            View Source
                            <svg
                                class="w-4 h-4 ml-1 opacity-50"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                                ><path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="M14 5l7 7m0 0l-7 7m7-7H3"
                                ></path></svg
                            >
                        </a>
                    {/if}
                </div>
            </div>
        {/each}
    </div>
</section>
