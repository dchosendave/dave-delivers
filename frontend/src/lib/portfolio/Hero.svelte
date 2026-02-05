<script>
    import { onMount } from "svelte";

    // State for contacts
    let contacts = [];

    // Map contact types to icons (simple text fallback, or use lucide-svelte if you have it)
    const icons = {
        github: "GitHub",
        linkedin: "LinkedIn",
        gmail: "Email",
        whatsapp: "WhatsApp",
        viber: "Viber",
    };

    onMount(async () => {
        try {
            const res = await fetch("http://localhost:8000/contacts");
            contacts = await res.json();
        } catch (error) {
            console.error("Failed to load contacts", error);
        }
    });

    function getLabel(type) {
        return icons[type] || type;
    }
</script>

<section class="min-h-[80vh] flex flex-col justify-center items-start relative">
    <!-- Background Gradient Blob (Subtle Apple Glow) -->
    <div
        class="absolute -top-20 -right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] pointer-events-none"
    ></div>
    <div
        class="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full blur-[96px] pointer-events-none"
    ></div>

    <!-- Main Content -->
    <div class="z-10 space-y-6 max-w-2xl">
        <!-- Badge -->
        <span
            class="inline-block px-3 py-1 rounded-full text-xs font-semibold tracking-wide bg-blue-500/10 text-blue-400 border border-blue-500/20"
        >
            Available for Hire
        </span>

        <!-- Headline -->
        <h1
            class="text-6xl md:text-8xl font-black tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-br from-white to-white/50"
        >
            Lowie Dave <br /> Dichoson.
        </h1>

        <!-- Subtitle -->
        <p
            class="text-xl md:text-2xl text-slate-400 font-light leading-relaxed max-w-lg"
        >
            Experienced <span class="text-white font-medium"
                >.NET Backend Developer.</span
            ><br />
            Turning complex business requirements into clean, scalable software solutions.
        </p>

        <!-- Dynamic Contacts Buttons -->
        <div class="flex flex-wrap gap-4 pt-4">
            {#each contacts as contact}
                <a
                    href={contact.url || "#"}
                    target="_blank"
                    class="group flex items-center gap-2 px-6 py-3 rounded-2xl
                           bg-white/5 backdrop-blur-md border border-white/10
                           hover:bg-white/10 hover:border-white/20 hover:scale-105
                           transition-all duration-300 cursor-pointer"
                >
                    <!-- Icon placeholder -->
                    <span
                        class="text-lg opacity-80 group-hover:opacity-100 transition-opacity"
                    >
                        <!-- You can replace this later with actual SVG icons -->
                        {getLabel(contact.type)}
                    </span>
                    <span class="text-sm font-medium">{contact.value}</span>
                </a>
            {/each}
        </div>
    </div>
</section>
