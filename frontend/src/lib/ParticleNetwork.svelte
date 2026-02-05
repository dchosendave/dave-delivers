<script>
    import { onMount, onDestroy } from "svelte";

    let canvas;
    let ctx;
    let particles = [];
    let animationFrameId;
    let width, height;

    // Theme state to adjust particle color
    let { isDark } = $props();

    class Particle {
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
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            // Use props for color (white for dark mode, dark grey for light mode)
            const color = isDark ? "255, 255, 255" : "0, 0, 0";
            ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
            ctx.fill();
        }
    }

    function init() {
        resize();
        particles = [];
        // Create fewer particles for subtlety
        const particleCount = Math.floor((width * height) / 25000);
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function resize() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    function animate() {
        ctx.clearRect(0, 0, width, height);

        const connectionDistance = 150;
        const color = isDark ? "255, 255, 255" : "0, 0, 0";

        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < connectionDistance) {
                    const opacity = (1 - distance / connectionDistance) * 0.25; // Very faint lines
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

    onMount(() => {
        ctx = canvas.getContext("2d");
        window.addEventListener("resize", () => {
            resize();
            init(); // Re-init particles on resize to prevent clustering
        });
        init();
        animate();
    });

    onDestroy(() => {
        if (typeof window !== "undefined") {
            window.removeEventListener("resize", resize);
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
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none; /* Let clicks pass through */
        z-index: 1; /* Above gradient, below text */
        opacity: 0.6; /* Global subtlety */
    }
</style>
