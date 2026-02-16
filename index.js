import { LRUCache } from "lru-cache";
import { APIError, AuthenticationError, BadRequestError, NotFoundError, RateLimitError, ServerError } from "./lib/errors.js";

const DEFAULT_BASE_URL = "https://api.chapyapi.com/api/v1";
const DEFAULT_RETRIES = 2;
const DEFAULT_TIMEOUT = 30000;

const SDK_VERSION = "0.4.0";

export class ChapybaraClient {
  constructor(options) {
    if (!options || !options.apiKey) {
      throw new Error("API key is required.");
    }

    this.apiKey = options.apiKey;
    this.baseUrl = options.baseUrl || DEFAULT_BASE_URL;
    this.retries = options.retries ?? DEFAULT_RETRIES;
    this.timeout = options.timeout || DEFAULT_TIMEOUT;

    if (options.cacheOptions) {
      this.cache = new LRUCache(options.cacheOptions);
    }

    this.domain = {
      getIntelligence: (domain) => this._request(`/domain/${domain}`),
    };

    this.ip = {
      getIntelligence: (ip) => this._request(`/ip/${ip}`),
    };

    this.webtech = {
      getScanner: (domain) => this._request(`/webtech/${domain}`),
    };

    this.account = {
      getInfo: () => this._request("/account"),
    };

    this.getUserIP = () => this._request("/ip");
  }

  async _request(endpoint, attempt = 1) {
    const url = `${this.baseUrl}${endpoint}`;
    const cacheKey = endpoint;

    if (this.cache?.has(cacheKey)) {
      return this.cache.get(cacheKey);
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "X-API-Key": this.apiKey,
          "Content-Type": "application/json",
          "User-Agent": `Chapybara-NodeJS-SDK/${SDK_VERSION}`,
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        if (response.status >= 500 && attempt <= this.retries) {
          const delay = 2 ** attempt * 100;
          await new Promise((resolve) => setTimeout(resolve, delay));
          return this._request(endpoint, attempt + 1);
        }
        await this._handleError(response);
      }

      const data = await response.json();

      if (this.cache) {
        this.cache.set(cacheKey, data);
      }

      return data;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === "AbortError") {
        throw new Error("Request timed out");
      }
      throw error;
    }
  }

  async _handleError(response) {
    let errorData;
    try {
      errorData = await response.json();
    } catch (e) {
      errorData = { error: `HTTP ${response.status} Error` };
    }

    switch (response.status) {
      case 401:
      case 403:
        throw new AuthenticationError(response.status, errorData);
      case 404:
        throw new NotFoundError(response.status, errorData);
      case 429:
        throw new RateLimitError(response.status, errorData);
      case 400:
      case 402:
        throw new BadRequestError(response.status, errorData);
      default:
        if (response.status >= 500) {
          throw new ServerError(response.status, errorData);
        }
        throw new APIError(response.status, errorData);
    }
  }
}
