<script lang="ts">
    import { fadeIn, scaleIn } from "../animations.js";

    let name = $state("");
    let email = $state("");
    let message = $state("");
    let sending = $state(false);
    let sent = $state(false);
    let error = $state("");

    async function handleSubmit(e: Event) {
        e.preventDefault();
        error = "";
        sending = true;

        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, content: message }),
            });

            const data = await res.json();

            if (!res.ok) {
                // Show validation errors
                if (data.details) {
                    const errors = Object.values(data.details).flat();
                    error = errors.join(". ");
                } else {
                    error = data.error || "Something went wrong.";
                }
                return;
            }

            sent = true;
            name = "";
            email = "";
            message = "";

            // Reset success state after 5 seconds
            setTimeout(() => (sent = false), 5000);
        } catch (err) {
            error = "Network error. Please try again.";
        } finally {
            sending = false;
        }
    }
</script>

<section class="contact-section" use:fadeIn>
    <div class="section-header" use:fadeIn>
        <h2 class="section-title">Let's Work Together</h2>
        <p class="section-subtitle">
            Have a project in mind or want to chat? Drop me a message and I'll
            get back to you as soon as I can.
        </p>
    </div>

    <div class="form-container" use:scaleIn>
        {#if sent}
            <div class="success-state">
                <span class="success-icon">✅</span>
                <h3 class="success-title">Message Sent!</h3>
                <p class="success-text">
                    Thanks for reaching out. I'll get back to you shortly.
                </p>
            </div>
        {:else}
            <form class="contact-form" onsubmit={handleSubmit}>
                <div class="form-row">
                    <div class="form-group">
                        <label for="contact-name">Name</label>
                        <input
                            id="contact-name"
                            type="text"
                            bind:value={name}
                            placeholder="Your name"
                            required
                            minlength="2"
                            maxlength="100"
                        />
                    </div>
                    <div class="form-group">
                        <label for="contact-email">Email</label>
                        <input
                            id="contact-email"
                            type="email"
                            bind:value={email}
                            placeholder="you@example.com"
                            required
                        />
                    </div>
                </div>

                <div class="form-group">
                    <label for="contact-message">Message</label>
                    <textarea
                        id="contact-message"
                        bind:value={message}
                        placeholder="Tell me about your project, idea, or just say hi..."
                        required
                        minlength="10"
                        maxlength="2000"
                        rows="5"
                    ></textarea>
                </div>

                {#if error}
                    <p class="form-error">⚠️ {error}</p>
                {/if}

                <button type="submit" class="submit-btn" disabled={sending}>
                    {#if sending}
                        <span class="spinner"></span>
                        Sending...
                    {:else}
                        Send Message →
                    {/if}
                </button>
            </form>
        {/if}
    </div>
</section>

<style>
    .contact-section {
        max-width: 700px;
        margin: 0 auto;
    }

    .section-header {
        margin-bottom: 2.5rem;
    }

    .section-title {
        font-size: 2rem;
        font-weight: 700;
        color: var(--color-text-primary);
        margin-bottom: 0.5rem;
    }

    .section-subtitle {
        font-size: 1rem;
        color: var(--color-text-secondary);
        line-height: 1.6;
    }

    /* ===== FORM CONTAINER ===== */
    .form-container {
        background: var(--color-surface);
        border: 1px solid var(--color-glass-border);
        border-radius: 1rem;
        padding: 2rem;
    }

    .contact-form {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .form-row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1.25rem;
    }

    @media (max-width: 600px) {
        .form-row {
            grid-template-columns: 1fr;
        }
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: 0.375rem;
    }

    label {
        font-size: 0.8125rem;
        font-weight: 500;
        color: var(--color-text-secondary);
        letter-spacing: 0.01em;
    }

    input,
    textarea {
        width: 100%;
        padding: 0.625rem 0.875rem;
        font-size: 0.9375rem;
        font-family: var(--font-system);
        color: var(--color-text-primary);
        background: var(--color-bg);
        border: 1px solid var(--color-glass-border);
        border-radius: 0.5rem;
        outline: none;
        transition:
            border-color 0.2s ease,
            box-shadow 0.2s ease;
    }

    input:focus,
    textarea:focus {
        border-color: rgba(100, 80, 220, 0.5);
        box-shadow: 0 0 0 3px rgba(100, 80, 220, 0.12);
    }

    input::placeholder,
    textarea::placeholder {
        color: var(--color-text-tertiary, rgba(255, 255, 255, 0.25));
    }

    textarea {
        resize: vertical;
        min-height: 120px;
    }

    /* ===== ERROR ===== */
    .form-error {
        font-size: 0.8125rem;
        color: #ff6b6b;
        margin: 0;
    }

    /* ===== SUBMIT BUTTON ===== */
    .submit-btn {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        padding: 0.75rem 1.5rem;
        font-size: 0.9375rem;
        font-weight: 600;
        font-family: var(--font-system);
        color: #fff;
        background: linear-gradient(
            135deg,
            rgba(100, 80, 220, 0.9),
            rgba(150, 60, 200, 0.9)
        );
        border: none;
        border-radius: 0.625rem;
        cursor: pointer;
        transition:
            transform 0.15s ease,
            box-shadow 0.2s ease,
            opacity 0.2s ease;
    }

    .submit-btn:hover:not(:disabled) {
        transform: translateY(-1px);
        box-shadow: 0 4px 20px rgba(100, 80, 220, 0.35);
    }

    .submit-btn:active:not(:disabled) {
        transform: scale(0.98);
    }

    .submit-btn:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }

    .spinner {
        width: 16px;
        height: 16px;
        border: 2px solid rgba(255, 255, 255, 0.3);
        border-top-color: #fff;
        border-radius: 50%;
        animation: spin 0.6s linear infinite;
    }

    @keyframes spin {
        to {
            transform: rotate(360deg);
        }
    }

    /* ===== SUCCESS STATE ===== */
    .success-state {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
        padding: 2rem;
        text-align: center;
        animation: scaleIn 0.3s ease;
    }

    .success-icon {
        font-size: 2.5rem;
    }

    .success-title {
        font-size: 1.25rem;
        font-weight: 600;
        color: var(--color-text-primary);
        margin: 0;
    }

    .success-text {
        font-size: 0.875rem;
        color: var(--color-text-secondary);
        margin: 0;
    }

    @keyframes scaleIn {
        from {
            opacity: 0;
            transform: scale(0.9);
        }
        to {
            opacity: 1;
            transform: scale(1);
        }
    }
</style>
