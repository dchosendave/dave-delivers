<script>
    import { onMount, onDestroy } from "svelte";

    let canvas;
    let animationId;

    onMount(() => {
        const ctx = canvas.getContext("2d");

        // Responsive sizing
        function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener("resize", resize);

        // Matrix characters (minimal set)
        const chars =
            "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789";
        const fontSize = 14;
        const columns = Math.floor(canvas.width / fontSize);

        // Track Y position per column
        const drops = Array(columns).fill(1);

        function draw() {
            // Semi-transparent black for fade trail effect
            ctx.fillStyle = "rgba(13, 17, 23, 0.04)";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Green text with subtle glow
            ctx.fillStyle = "rgba(0, 255, 0, 0.5)";
            ctx.font = `${fontSize}px monospace`;

            for (let i = 0; i < drops.length; i++) {
                // Random character
                const char = chars[Math.floor(Math.random() * chars.length)];
                const x = i * fontSize;
                const y = drops[i] * fontSize;

                ctx.fillText(char, x, y);

                // Reset to top randomly after passing screen
                if (y > canvas.height && Math.random() > 0.999) {
                    drops[i] = 0;
                }
                drops[i]++;
            }

            animationId = requestAnimationFrame(draw);
        }

        draw();

        // Cleanup
        return () => {
            window.removeEventListener("resize", resize);
            cancelAnimationFrame(animationId);
        };
    });
</script>

<canvas bind:this={canvas}></canvas>

<style>
    canvas {
        position: fixed;
        top: 0;
        left: 0;
        width: 100vw;
        height: 100vh;
        z-index: 0;
        pointer-events: none;
    }
</style>
