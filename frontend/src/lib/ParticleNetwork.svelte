<script lang="ts">
    import { onMount, onDestroy } from "svelte";

    let canvas: HTMLCanvasElement | undefined;
    let ctx: CanvasRenderingContext2D | null | undefined;
    let particles: Particle[] = [];
    let animationFrameId: number;
    let width: number;
    let height: number;
    let isPageVisible = true;

    // Theme state to adjust particle color
    let { isDark }: { isDark: boolean } = $props();

    // Low-spec device detection
    // C# equivalent: Environment.ProcessorCount <= 4
    function isLowSpecDevice(): boolean {
        if (typeof window === "undefined") return false;
        const lowCores = navigator.hardwareConcurrency <= 4;
        const smallScreen = window.innerWidth < 768;
        return lowCores || smallScreen;
    }

    class Particle {
        x: number;
        y: number;
        vx: number;
        vy: number;
        size: number;
        opacity: number;
        fadeSpeed: number;
        fadingIn: boolean;

        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5; // Very slow velocity
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
            this.opacity = Math.random() * 0.5 + 0.1; // Random starting opacity
            this.fadeSpeed = Math.random() * 0.01 + 0.005;
            this.fadingIn = Math.random() > 0.5;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Bounce off edges
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;

            // Pulse opacity
            if (this.fadingIn) {
                this.opacity += this.fadeSpeed;
                if (this.opacity >= 0.6) this.fadingIn = false;
            } else {
                this.opacity -= this.fadeSpeed;
                if (this.opacity <= 0.1) this.fadingIn = true;
            }
        }

        draw() {
            if (!ctx) return;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // Use props for color (white for dark mode, dark grey for light mode)
            const color = isDark ? "255, 255, 255" : "60, 60, 67";
            ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        // Halve particle count on low-spec devices for a smooth 60fps
        const divisor = isLowSpecDevice() ? 50000 : 25000;
        const particleCount = Math.floor((width * height) / divisor);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function resize() {
        if (!canvas) return;

        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function handleResize() {
        resize();
        init();
    }

    function animate() {
        if (!canvas || !ctx) return;

        // Skip rendering entirely when tab is hidden — saves CPU/GPU on low-spec machines.
        // C# equivalent: checking Application.Current.MainWindow.IsVisible
        if (!isPageVisible) {
            animationFrameId = requestAnimationFrame(animate);
            return;
        }

        ctx.clearRect(0, 0, width, height);

        // Use squared distance to avoid Math.sqrt in the O(n²) inner loop.
        // Math.sqrt is expensive; comparing distSq < threshSq is mathematically identical
        // but ~3-5x faster because it avoids the square root computation entirely.
        // C# equivalent: skipping Math.Sqrt in a tight loop by comparing squares.
        const connectionDistance = 150;
        const connectionDistSq = connectionDistance * connectionDistance;
        const color = isDark ? "255, 255, 255" : "60, 60, 67";

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distSq = dx * dx + dy * dy;

                if (distSq < connectionDistSq) {
                    // Restore distance only for opacity calc (one sqrt, not per-pair)
                    const distance = Math.sqrt(distSq);
                    const opacity = (1 - distance / connectionDistance) * 0.25;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(${color}, ${opacity})`;
                    ctx.lineWidth = 1;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }

        // Update and draw particles
        particles.forEach((p) => {
            p.update();
            p.draw();
        });

        animationFrameId = requestAnimationFrame(animate);
    }

    function handleVisibilityChange() {
        isPageVisible = document.visibilityState === "visible";
    }

    onMount(() => {
        if (!canvas) return;

        ctx = canvas.getContext("2d");
        window.addEventListener("resize", handleResize);
        // Pause the RAF loop when user switches tabs — saves CPU on low-spec machines
        document.addEventListener("visibilitychange", handleVisibilityChange);
        init();
        animate();
    });

    onDestroy(() => {
        if (typeof window !== "undefined") {
            window.removeEventListener("resize", handleResize);
            document.removeEventListener(
                "visibilitychange",
                handleVisibilityChange,
            );
            cancelAnimationFrame(animationFrameId);
        }
    });

    // React to prop changes (theme switch)
    $effect(() => {
        // Force redraw or just let the animate loop handle it with new isDark value
    });
</script>

<canvas bind:this={canvas} class="particle-network"></canvas>

<style>
    .particle-network {
        /* fixed = viewport-relative, lives outside the normal document flow.
           This means it won't be occluded by stacking contexts in .content-main
           no matter how far the user scrolls. */
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        z-index: 0; /* Sits behind everything; content needs z-index ≥ 1 */
        opacity: 0.6;
        will-change: transform;
        transform: translateZ(0);
    }
</style>
