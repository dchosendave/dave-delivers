<script>
    import { onMount } from "svelte";
    let skills = [];
    onMount(async () => {
        try {
            const res = await fetch("http://localhost:8000/skills");
            skills = await res.json();
        } catch (err) {
            console.error(err);
        }
    });
    // Helper to calculate color based on proficiency (optional flair)
    function getColor(proficiency) {
        if (proficiency >= 90)
            return "bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.4)]";
        if (proficiency >= 75)
            return "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.4)]";
        return "bg-slate-500";
    }
</script>

<section class="space-y-12 pb-20">
    <!-- Header -->
    <div class="space-y-4">
        <h2 class="text-4xl md:text-5xl font-bold tracking-tight text-white">
            Technical Arsenal
        </h2>
        <p class="text-lg text-slate-400 max-w-2xl font-light">
            Tools, languages, and frameworks I use to build systems.
        </p>
    </div>
    <!-- Skills Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
        {#each skills as skill}
            <div class="space-y-3 group">
                <!-- Label Row -->
                <div class="flex justify-between items-end">
                    <span
                        class="text-xl font-medium text-slate-200 group-hover:text-white transition-colors"
                    >
                        {skill.name}
                    </span>
                    <span class="text-sm font-mono text-slate-500">
                        {skill.proficiency}%
                    </span>
                </div>
                <!-- Progress Bar Track -->
                <div
                    class="h-2 w-full bg-slate-800/50 rounded-full overflow-hidden backdrop-blur-sm border border-white/5"
                >
                    <!-- Progress Fill -->
                    <div
                        class="h-full rounded-full transition-all duration-1000 ease-out {getColor(
                            skill.proficiency,
                        )}"
                        style="width: {skill.proficiency}%"
                    ></div>
                </div>
            </div>
        {/each}
    </div>
</section>
