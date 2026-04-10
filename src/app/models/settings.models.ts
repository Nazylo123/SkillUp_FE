export interface AiSettings {
  provider: string; // "Ollama" or "OpenRouter"
  ollamaModelName: string;
  openRouterModelName: string;
  apiKey?: string;  // Masked or full depending on GET/PUT
}

export interface UpdateAiSettingsRequest {
  provider: string;
  ollamaModelName: string;
  openRouterModelName: string;
  apiKey?: string;
}
