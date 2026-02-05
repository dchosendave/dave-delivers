<script>
    import { onMount } from "svelte";
    import SkillCard from "./SkillCard.svelte";

    let skills = [];

    onMount(async () => {
        try {
            const res = await fetch("http://localhost:8000/skills");
            skills = await res.json();
        } catch (err) {
            console.error(err);
            // Fallback data if API fails (for dev preview)
            if (skills.length === 0) {
                skills = [
                    { name: "Svelte", proficiency: 95 },
                    { name: "FastAPI", proficiency: 90 },
                    { name: "Python", proficiency: 92 },
                    { name: "TypeScript", proficiency: 85 },
                    { name: "Three.js", proficiency: 75 },
                    { name: "PostgreSQL", proficiency: 88 },
                ];
            }
        }
    });
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
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {#each skills as skill}
            <SkillCard {skill} />
        {/each}
    </div>
</section>
