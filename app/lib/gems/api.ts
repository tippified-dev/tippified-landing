const API_BASE_URL = "https://api.tippified.com/api/auth";

export interface GemCreator {
  username: string;
  display_name: string;
  first_name: string;
  last_name: string;
  referral_code: string;
  bio: string;
  niche: string;
  location: string;
  profile_image_url: string | null;
  hero_badge: boolean;
  is_online: boolean;
}

export interface CreatorNiche {
  value: string;
  label: string;
  creator_count: number;
}

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

interface NichesResponse {
  success: boolean;
  count: number;
  results: CreatorNiche[];
}

async function fetchGemAPI<T>(
  endpoint: string,
  signal?: AbortSignal,
): Promise<T> {
  const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
    method: "GET",
    cache: "no-store",
    signal,
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    let message = `Gem API request failed (${response.status})`;

    try {
      const errorData = await response.json();

      if (typeof errorData.detail === "string") {
        message = errorData.detail;
      } else if (typeof errorData.q === "string") {
        message = errorData.q;
      } else if (typeof errorData.niche === "string") {
        message = errorData.niche;
      }
    } catch {
      // Retain the default error message if the response isn't JSON.
    }

    throw new Error(message);
  }

  return response.json() as Promise<T>;
}

/**
 * Fetch creator niches and the number of discoverable creators in each.
 */
export async function getCreatorNiches(
  signal?: AbortSignal,
): Promise<CreatorNiche[]> {
  const data = await fetchGemAPI<NichesResponse>("niches/", signal);

  return data.results;
}

/**
 * Fetch suggested creators.
 *
 * Optionally filter by niche and paginate results.
 */
export async function getSuggestedCreators(options?: {
  niche?: string;
  page?: number;
  pageSize?: number;
  signal?: AbortSignal;
}): Promise<PaginatedResponse<GemCreator>> {
  const params = new URLSearchParams();

  if (options?.niche) {
    params.set("niche", options.niche);
  }

  params.set("page", String(options?.page ?? 1));

  if (options?.pageSize) {
    params.set("page_size", String(options.pageSize));
  }

  return fetchGemAPI<PaginatedResponse<GemCreator>>(
    `suggested/?${params.toString()}`,
    options?.signal,
  );
}

/**
 * Search creators by username, name, or referral code.
 */
export async function searchCreators(options: {
  query: string;
  page?: number;
  pageSize?: number;
  signal?: AbortSignal;
}): Promise<PaginatedResponse<GemCreator>> {
  const query = options.query.trim();

  if (query.length < 2) {
    return {
      count: 0,
      next: null,
      previous: null,
      results: [],
    };
  }

  const params = new URLSearchParams({
    q: query,
    page: String(options.page ?? 1),
  });

  if (options.pageSize) {
    params.set("page_size", String(options.pageSize));
  }

  return fetchGemAPI<PaginatedResponse<GemCreator>>(
    `search/?${params.toString()}`,
    options.signal,
  );
}