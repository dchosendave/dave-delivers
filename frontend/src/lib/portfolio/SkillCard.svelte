<script>
    export let skill;

    let rotX = 0;
    let rotY = 0;
    let isflipped = false;

    function handleMouseMove(e) {
        // Get card dimensions and position
        const card = e.currentTarget;
        const rect = card.getBoundingClientRect();

        // Calculate mouse position relative to center of card
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Calculate rotation (max 15 degrees)
        rotY = (x / (rect.width / 2)) * 15;
        rotX = -(y / (rect.height / 2)) * 15;
    }

    function handleMouseLeave() {
        rotX = 0;
        rotY = 0;
    }

    // Determine color based on proficiency for the back glow
    function getGlowColor(proficiency) {
        if (proficiency >= 90) return "rgba(168,85,247,0.5)"; // Purple
        if (proficiency >= 75) return "rgba(59,130,246,0.5)"; // Blue
        return "rgba(100,116,139,0.5)"; // Slate
    }
</script>

<!-- svelte-ignore a11y-click-events-have-key-events -->
<!-- svelte-ignore a11y-no-static-element-interactions -->
<div
    class="relative h-48 w-full perspective-1000 cursor-pointer group"
    on:mousemove={handleMouseMove}
    on:mouseleave={handleMouseLeave}
    on:click={() => (isflipped = !isflipped)}
>
    <div
        class="relative h-full w-full transition-all duration-200 ease-out preserve-3d"
        style="transform: rotateX({isflipped
            ? 180
            : rotX}deg) rotateY({isflipped ? 0 : rotY}deg)"
    >
        <!-- FRONT -->
        <div
            class="absolute inset-0 backface-hidden rounded-xl border border-white/10 bg-white/5 p-6 backdrop-blur-md shadow-xl flex flex-col justify-between overflow-hidden"
        >
            <!-- Shininess/Reflection gradient -->
            <div
                class="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                style="transform: translateX({rotY}%) translateY({rotX}%)"
            ></div>

            <div class="z-10">
                <h3 class="text-2xl font-bold text-white tracking-tight">
                    {skill.name}
                </h3>
                <div class="h-1 w-8 bg-blue-500 rounded-full mt-2"></div>
            </div>

            <div
                class="text-xs text-slate-400 font-mono flex items-center gap-2"
            >
                <span
                    class="animate-pulse w-1.5 h-1.5 rounded-full bg-green-400"
                ></span>
                CLICK TO ANALYZE
            </div>
        </div>

        <!-- BACK -->
        <div
            class="absolute inset-0 backface-hidden rounded-xl border border-white/10 bg-slate-900/90 p-6 backdrop-blur-xl shadow-2xl flex flex-col justify-center items-center text-center"
            style="transform: rotateX(180deg);"
        >
            <div class="relative w-24 h-24 flex items-center justify-center">
                <!-- Circular Progress Ring Background -->
                <svg class="w-full h-full transform -rotate-90">
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        stroke-width="8"
                        fill="transparent"
                        class="text-slate-800"
                    />
                    <!-- Progress Ring Foreground -->
                    <circle
                        cx="48"
                        cy="48"
                        r="40"
                        stroke="currentColor"
                        stroke-width="8"
                        fill="transparent"
                        stroke-dasharray={2 * Math.PI * 40}
                        stroke-dashoffset={2 *
                            Math.PI *
                            40 *
                            (1 - skill.proficiency / 100)}
                        class="text-blue-500 transition-all duration-1000 ease-out"
                        style="color: {skill.proficiency >= 90
                            ? '#a855f7'
                            : '#3b82f6'}"
                    />
                </svg>
                <div class="absolute text-xl font-bold text-white font-mono">
                    {skill.proficiency}%
                </div>
            </div>
            <p class="mt-4 text-sm text-slate-400 font-light">
                Proficiency Level
            </p>
        </div>
    </div>
</div>

<style>
    .perspective-1000 {
        perspective: 1000px;
    }
    .preserve-3d {
        transform-style: preserve-3d;
    }
    .backface-hidden {
        backface-visibility: hidden;
    }
</style>
