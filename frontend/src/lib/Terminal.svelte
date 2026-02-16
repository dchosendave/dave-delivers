<script lang="ts">
  import { onMount } from "svelte";

  interface TerminalLine {
    type: string;
    content: string;
    displayedContent?: string;
    user?: string;
    path?: string;
  }

  let commandHistory = $state<string[]>([]);
  let historyIndex = $state<number>(-1);
  let currentCommand = $state<string>("");
  let inputElement: HTMLInputElement | undefined; // Regular let for bind:this (not $state)
  let terminalOutput = $state<TerminalLine[]>([]);
  let isProcessing = $state<boolean>(false);
  let isTyping = $state<boolean>(false);

  const API_URL = "/api"; // SvelteKit API routes (no CORS needed)
  const TYPING_SPEED = 8;
  const TYPING_ENABLED = true;

  // ============================================
  // TYPEWRITER EFFECT
  // ============================================

  /**
   * Simulates a typewriter effect by progressively revealing text.
   * @param {string} fullText - The complete text to type out
   * @param {number} outputIndex - Index in terminalOutput to update
   */
  async function typewriterEffect(fullText: string, outputIndex: number) {
    isTyping = true;
    let displayedText = "";

    // Process character by character
    for (let i = 0; i < fullText.length; i++) {
      displayedText += fullText[i];

      // Update the output line's displayed content
      terminalOutput[outputIndex] = {
        ...terminalOutput[outputIndex],
        displayedContent: displayedText,
      };

      // Skip delay for HTML tags (render them instantly)
      if (fullText[i] === "<") {
        // Find the closing '>' and add all at once
        const closeIndex = fullText.indexOf(">", i);
        if (closeIndex !== -1) {
          displayedText =
            displayedText.slice(0, -1) + fullText.slice(i, closeIndex + 1);
          i = closeIndex;
          terminalOutput[outputIndex] = {
            ...terminalOutput[outputIndex],
            displayedContent: displayedText,
          };
        }
      }

      // Small delay between characters (skip for whitespace for speed)
      if (fullText[i] !== " " && fullText[i] !== "\n") {
        await new Promise((resolve) => setTimeout(resolve, TYPING_SPEED));
      }

      // Auto-scroll during typing
      scrollToBottom();
    }

    isTyping = false;
  }

  /**
   * Adds output with optional typewriter effect
   */
  async function addOutput(
    type: string,
    content: string,
    extras: Partial<TerminalLine> = {},
  ) {
    const newLine = {
      type,
      content,
      displayedContent:
        TYPING_ENABLED && (type === "response" || type === "system")
          ? ""
          : content,
      ...extras,
    };

    terminalOutput = [...terminalOutput, newLine];
    const outputIndex = terminalOutput.length - 1;

    // Apply typewriter effect for responses
    if (TYPING_ENABLED && (type === "response" || type === "system")) {
      await typewriterEffect(content, outputIndex);
    }

    scrollToBottom();
  }

  // ============================================
  // LIFECYCLE
  // ============================================

  onMount(async () => {
    // Welcome message with typewriter effect
    await addOutput(
      "system",
      `<span style="color: #4facfe; font-weight: bold; font-size: 1.2em;">H E L L O  W O R L D</span>
<span style="color: #888;">───────────────────────────────────────</span>
Type <span style="color: #00ff00;">help</span> to see available commands.`,
    );

    // Focus input AFTER typewriter completes (when input is no longer disabled)
    setTimeout(() => inputElement?.focus(), 50);
  });

  // ============================================
  // COMMAND EXECUTION
  // ============================================

  async function executeCommand() {
    if (!currentCommand.trim() || isProcessing || isTyping) return;

    const cmd = currentCommand.trim();

    // Add command to output (instant, no typewriter)
    await addOutput("command", cmd);

    // Special client-side commands
    if (cmd.toLowerCase() === "clear") {
      terminalOutput = [];
      currentCommand = "";
      return;
    }

    if (cmd.toLowerCase() === "exit") {
      await addOutput(
        "response",
        '<span style="color: #bd5eff;">Thanks for visiting! Refresh to return.</span>',
      );
      currentCommand = "";
      return;
    }

    // Add to history
    commandHistory = [...commandHistory, cmd];
    historyIndex = commandHistory.length;

    // Call backend API
    isProcessing = true;
    currentCommand = "";

    try {
      const response = await fetch(`${API_URL}/execute`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: cmd }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      await addOutput("response", data.output, {
        user: data.user,
        path: data.path,
      });
    } catch (error) {
      await addOutput(
        "error",
        `<span style="color: #ff4444;">Error: Failed to connect to backend. Make sure the server is running at ${API_URL}</span>`,
      );
    } finally {
      isProcessing = false;
      scrollToBottom();
    }
  }

  // ============================================
  // EVENT HANDLERS
  // ============================================

  function handleKeydown(event: KeyboardEvent) {
    if (event.key === "Enter") {
      executeCommand();
    } else if (event.key === "ArrowUp") {
      event.preventDefault();
      if (historyIndex > 0) {
        historyIndex--;
        currentCommand = commandHistory[historyIndex];
      }
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        currentCommand = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        currentCommand = "";
      }
    } else if (event.key === "Tab") {
      event.preventDefault();
      // Could add autocomplete here
    }
  }

  function handleWrapperKeydown(event: KeyboardEvent) {
    // Allow Enter or Space to focus input (accessibility)
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      focusInput();
    }
  }

  function focusInput() {
    inputElement?.focus();
  }

  // ============================================
  // UTILITIES
  // ============================================

  function scrollToBottom() {
    setTimeout(() => {
      const container = document.querySelector(".terminal-container");
      if (container) {
        container.scrollTop = container.scrollHeight;
      }
      // Auto-focus input when not typing/processing
      if (!isTyping && !isProcessing) {
        inputElement?.focus();
      }
    }, 10);
  }
</script>

<!-- 
  role="application" tells screen readers this is a custom widget
  tabindex="0" makes it focusable
  Both onclick and onkeydown for accessibility
  svelte-ignore: These warnings are expected for a custom terminal widget
-->
<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<div
  class="terminal-container"
  onclick={focusInput}
  onkeydown={handleWrapperKeydown}
  role="application"
  aria-label="Terminal interface"
  tabindex="0"
>
  {#each terminalOutput as line, i (i)}
    {#if line.type === "command"}
      <div class="output-line command-line">
        <span class="prompt">visitor@dchosen:~$</span>
        <span class="command-text">{line.content}</span>
      </div>
    {:else if line.type === "response" || line.type === "system"}
      <div class="output-line response-line">
        {@html line.displayedContent || line.content}
      </div>
    {:else if line.type === "error"}
      <div class="output-line error-line">
        {@html line.displayedContent || line.content}
      </div>
    {/if}
  {/each}

  <div class="input-line">
    <span class="prompt">visitor@dchosen:~$</span>
    <input
      bind:this={inputElement}
      bind:value={currentCommand}
      onkeydown={handleKeydown}
      type="text"
      class="command-input"
      disabled={isProcessing || isTyping}
      autocomplete="off"
      autocorrect="off"
      autocapitalize="off"
      spellcheck="false"
      aria-label="Terminal command input"
    />
    {#if isProcessing || isTyping}
      <span class="loading">▓</span>
    {/if}
  </div>
</div>

<style>
  .terminal-container {
    padding: 20px;
    height: 70vh;
    max-height: 600px;
    overflow-y: auto;
    font-family: var(--terminal-font);
    line-height: 1.6;
    cursor: text;
  }

  /* Custom Scrollbar */
  .terminal-container::-webkit-scrollbar {
    width: 8px;
  }

  .terminal-container::-webkit-scrollbar-track {
    background: #0d1117;
  }

  .terminal-container::-webkit-scrollbar-thumb {
    background: #00ff0044;
    border-radius: 4px;
  }

  .terminal-container::-webkit-scrollbar-thumb:hover {
    background: #00ff0066;
  }

  .output-line {
    margin-bottom: 10px;
    white-space: pre-wrap;
    word-wrap: break-word;
  }

  .command-line {
    display: flex;
    gap: 10px;
  }

  .prompt {
    color: #4facfe;
    font-weight: bold;
    user-select: none;
  }

  .command-text {
    color: #ffffff;
  }

  .response-line {
    color: #00ff00;
    margin-left: 0;
    padding-left: 0;
  }

  .error-line {
    color: #ff4444;
  }

  .input-line {
    display: flex;
    gap: 10px;
    align-items: center;
  }

  .command-input {
    flex: 1;
    background: transparent;
    border: none;
    color: #ffffff;
    font-family: var(--terminal-font);
    font-size: 1em;
    outline: none;
    caret-color: #00ff00;
  }

  .command-input:disabled {
    opacity: 0.5;
  }

  .loading {
    color: #00ff00;
    animation: blink 0.8s infinite;
  }

  @keyframes blink {
    0%,
    49% {
      opacity: 1;
    }
    50%,
    100% {
      opacity: 0;
    }
  }

  /* Link Styling */
  :global(.terminal-container a) {
    color: #4facfe;
    text-decoration: underline;
    cursor: pointer;
  }

  :global(.terminal-container a:hover) {
    color: #bd5eff;
  }
</style>
