import { onBeforeUnmount, ref } from "vue";
import { streamSse } from "@/api/client";
import { AnsiSegment, parseAnsi } from "@/utils/ansi";

export interface LogLine {
  id: number;
  segments: AnsiSegment[];
}

const MIN_DELAY = 1000;
const MAX_DELAY = 15000;

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Follow the backend log stream, reconnecting with a backoff until stopped
export function useLogStream(maxLines = 1000) {
  const lines = ref<LogLine[]>([]);
  const connected = ref(false);

  let nextId = 0;
  let pending: LogLine[] = [];
  let frame = 0;
  let controller: AbortController | null = null;
  let stopped = true;

  // Batch bursts of lines into a single render
  const flush = () => {
    frame = 0;
    const merged = lines.value.concat(pending);
    pending = [];
    lines.value = merged.slice(-maxLines);
  };

  const push = (text: string) => {
    pending.push({ id: nextId++, segments: parseAnsi(text) });
    if (!frame) frame = requestAnimationFrame(flush);
  };

  async function loop() {
    let delay = MIN_DELAY;
    while (!stopped) {
      controller = new AbortController();
      try {
        await streamSse(
          "/logs/stream?tail=50",
          {
            onOpen: () => {
              connected.value = true;
              delay = MIN_DELAY;
              // The server replays the tail on every connection
              pending = [];
              lines.value = [];
            },
            onEvent: (event, data) => {
              if (event === "message") push(JSON.parse(data));
            },
          },
          controller.signal,
        );
      } catch (error) {
        if (stopped) return;
        console.error("Log stream error:", error);
      }
      connected.value = false;
      if (stopped) return;
      await sleep(delay);
      delay = Math.min(delay * 2, MAX_DELAY);
    }
  }

  function start() {
    if (!stopped) return;
    stopped = false;
    loop();
  }

  function stop() {
    stopped = true;
    controller?.abort();
    cancelAnimationFrame(frame);
    frame = 0;
  }

  onBeforeUnmount(stop);

  return { lines, connected, start, stop };
}
