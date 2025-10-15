import { API_CONFIG, ENDPOINTS } from "../config";

export interface Suggestion {
  id: string;
  title: string;
  category?: string;
  type: "product" | "category" | "tag";
}

export interface SuggestionResponse {
  success: boolean;
  data: Suggestion[];
  message: string;
}

export interface SuggestionParams {
  q: string;
  limit?: number; // keep this optional if you might need it later
}

class SearchSuggestionService {
  private async makeRequest<T>(url: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`${API_CONFIG.baseURL}${url}`, {
      ...options,
      headers: {
        ...API_CONFIG.headers,
        ...options.headers,
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  async getSuggestions(params: SuggestionParams): Promise<SuggestionResponse> {
    // ✅ Only send 'q' in the query
    const searchParams = new URLSearchParams();
    searchParams.append("q", params.q);

    const endpoint = `${ENDPOINTS.SEARCH.SUGGESTIONS}?${searchParams.toString()}`;
    return this.makeRequest<SuggestionResponse>(endpoint);
  }
}

export const searchSuggestionService = new SearchSuggestionService();
