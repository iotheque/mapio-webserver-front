declare interface ImportMeta {
  readonly env: {
    // Environment variables defined in .env
    readonly VITE_TTS_KEY: string;
    readonly VITE_TTS_REGION: string;
  };
}
