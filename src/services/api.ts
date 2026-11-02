import { ChemicalOxides, PredictionResponse } from '../types/petrology';

export const DEFAULT_API_URL = 'https://backend-atividade10-matheus.onrender.com';
export const API_URL_STORAGE_KEY = 'petroclass_api_url';

export function getStoredApiUrl(): string {
  if (typeof window === 'undefined') return DEFAULT_API_URL;
  return localStorage.getItem(API_URL_STORAGE_KEY) || DEFAULT_API_URL;
}

export function setStoredApiUrl(url: string): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(API_URL_STORAGE_KEY, url.trim().replace(/\/+$/, ''));
  }
}

export interface ApiStatus {
  online: boolean;
  message?: string;
  version?: string;
  latencyMs?: number;
}

export async function checkApiHealth(baseUrl: string = getStoredApiUrl()): Promise<ApiStatus> {
  const cleanUrl = baseUrl.trim().replace(/\/+$/, '');
  const startTime = performance.now();
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000);

    const res = await fetch(`${cleanUrl}/`, {
      method: 'GET',
      signal: controller.signal,
      headers: { 'Accept': 'application/json' }
    });
    clearTimeout(timeoutId);

    const latencyMs = Math.round(performance.now() - startTime);

    if (res.ok) {
      const data = await res.json().catch(() => null);
      return {
        online: true,
        message: data?.message || data?.status || 'API operacional',
        version: data?.versao || data?.version || '1.0',
        latencyMs
      };
    }
    return {
      online: false,
      message: `Status HTTP ${res.status} (${res.statusText})`,
      latencyMs
    };
  } catch (err: unknown) {
    const latencyMs = Math.round(performance.now() - startTime);
    const errorMsg = err instanceof Error ? err.message : 'Falha na conexão';
    return {
      online: false,
      message: errorMsg.includes('abort') ? 'Tempo limite esgotado (Servidor hibernando)' : errorMsg,
      latencyMs
    };
  }
}

export async function predictRockType(
  oxides: ChemicalOxides,
  customBaseUrl?: string
): Promise<PredictionResponse> {
  const rawBase = (customBaseUrl || getStoredApiUrl()).trim().replace(/\/+$/, '');

  // Determine candidate endpoints:
  // If the user entered a full URL that already ends with a path like /predict or /api/predict
  const hasEndpoint = rawBase.endsWith('/predict') || rawBase.endsWith('/api/predict') || rawBase.endsWith('/prever');
  const candidateUrls: string[] = hasEndpoint
    ? [rawBase]
    : [
        `${rawBase}/api/predict`,
        `${rawBase}/predict`,
        `${rawBase}/prever`,
        rawBase
      ];

  // Prepare dual-key payload: includes both requested format (SiO2n, FeO*n)
  // and direct oxide format (SiO2, FeO) to guarantee compatibility across backend versions
  const payload = {
    SiO2n: Number(oxides.SiO2n),
    TiO2n: Number(oxides.TiO2n),
    Al2O3n: Number(oxides.Al2O3n),
    'FeO*n': Number(oxides['FeO*n']),
    MnOn: Number(oxides.MnOn),
    MgOn: Number(oxides.MgOn),
    CaOn: Number(oxides.CaOn),
    Na2On: Number(oxides.Na2On),
    K2On: Number(oxides.K2On),
    P2O5n: Number(oxides.P2O5n),
    // Standard chemical abbreviations
    SiO2: Number(oxides.SiO2n),
    TiO2: Number(oxides.TiO2n),
    Al2O3: Number(oxides.Al2O3n),
    FeO: Number(oxides['FeO*n']),
    MnO: Number(oxides.MnOn),
    MgO: Number(oxides.MgOn),
    CaO: Number(oxides.CaOn),
    Na2O: Number(oxides.Na2On),
    K2O: Number(oxides.K2On),
    P2O5: Number(oxides.P2O5n)
  };

  let lastError: Error | null = null;

  for (const url of candidateUrls) {
    try {
      const controller = new AbortController();
      // Render free tier can take up to 45 seconds to wake up from cold spin-down
      const timeoutId = setTimeout(() => controller.abort(), 55000);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.status === 404 || response.status === 405) {
        // Try next candidate URL
        continue;
      }

      if (!response.ok) {
        const errorBody = await response.text().catch(() => '');
        let parsed;
        try {
          parsed = JSON.parse(errorBody);
        } catch {
          parsed = null;
        }
        throw new Error(
          parsed?.erro || parsed?.message || `Erro do servidor HTTP ${response.status}: ${errorBody.slice(0, 120)}`
        );
      }

      const data = await response.json();
      return data as PredictionResponse;
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.name === 'AbortError') {
          lastError = new Error('Tempo limite excedido. O servidor Render pode estar acordando de hibernação; por favor tente novamente em alguns instantes.');
          break; // Don't cycle all URLs if timeout
        }
        lastError = err;
      } else {
        lastError = new Error(String(err));
      }
    }
  }

  throw lastError || new Error('Não foi possível conectar ao backend de predição.');
}
