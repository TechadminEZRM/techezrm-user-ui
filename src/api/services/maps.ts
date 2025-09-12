import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5007";

export interface GeocodeResult {
  formatted_address: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  place_id: string;
  types: string[];
}

export interface AutocompleteResult {
  place_id: string;
  description: string;
  structured_formatting: {
    main_text: string;
    secondary_text: string;
  };
}

export interface PlaceDetails {
  place_id: string;
  name?: string;
  formatted_address?: string;
  geometry?: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
  user_ratings_total?: number;
  photos?: Array<{
    photo_reference: string;
    height: number;
    width: number;
  }>;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  count?: number;
  message?: string;
  error?: string;
}

class MapsService {
  private baseURL = `${API_BASE_URL}/public/maps`;

  /**
   * Convert address to coordinates
   */
  async geocode(address: string): Promise<GeocodeResult[]> {
    try {
      const response = await axios.get<ApiResponse<GeocodeResult[]>>(
        `${this.baseURL}/geocode`,
        {
          params: { address },
        }
      );

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Geocoding failed");
    } catch (error) {
      console.error("Geocoding error:", error);
      throw error;
    }
  }

  /**
   * Convert coordinates to address
   */
  async reverseGeocode(lat: number, lng: number): Promise<GeocodeResult[]> {
    try {
      const response = await axios.get<ApiResponse<GeocodeResult[]>>(
        `${this.baseURL}/reverse-geocode`,
        {
          params: { lat, lng },
        }
      );

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Reverse geocoding failed");
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      throw error;
    }
  }

  /**
   * Get place autocomplete suggestions
   */
  async getAutocompleteSuggestions(
    input: string,
    lat?: number,
    lng?: number,
    radius?: number,
    types?: string
  ): Promise<AutocompleteResult[]> {
    try {
      const params: any = { input };
      if (lat !== undefined) params.lat = lat;
      if (lng !== undefined) params.lng = lng;
      if (radius !== undefined) params.radius = radius;
      if (types !== undefined) params.types = types;

      const response = await axios.get<ApiResponse<AutocompleteResult[]>>(
        `${this.baseURL}/autocomplete`,
        { params }
      );

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Autocomplete failed");
    } catch (error) {
      console.error("Autocomplete error:", error);
      throw error;
    }
  }

  /**
   * Get detailed information about a place
   */
  async getPlaceDetails(
    placeId: string,
    fields?: string
  ): Promise<PlaceDetails> {
    try {
      const params: any = { placeId };
      if (fields !== undefined) params.fields = fields;

      const response = await axios.get<ApiResponse<PlaceDetails>>(
        `${this.baseURL}/place-details`,
        { params }
      );

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Place details failed");
    } catch (error) {
      console.error("Place details error:", error);
      throw error;
    }
  }

  /**
   * Search for places by text query
   */
  async searchPlaces(
    query: string,
    lat?: number,
    lng?: number,
    radius?: number,
    type?: string
  ): Promise<PlaceDetails[]> {
    try {
      const params: any = { query };
      if (lat !== undefined) params.lat = lat;
      if (lng !== undefined) params.lng = lng;
      if (radius !== undefined) params.radius = radius;
      if (type !== undefined) params.type = type;

      const response = await axios.get<ApiResponse<PlaceDetails[]>>(
        `${this.baseURL}/search-places`,
        { params }
      );

      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || "Place search failed");
    } catch (error) {
      console.error("Place search error:", error);
      throw error;
    }
  }
}

export const mapsService = new MapsService();
