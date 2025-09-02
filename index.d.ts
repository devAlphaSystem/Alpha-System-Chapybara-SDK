import type { LRUCache } from "lru-cache";

declare module "chapybara" {
  interface ChapybaraClientOptions {
    apiKey: string;
    baseUrl?: string;
    retries?: number;
    timeout?: number;
    cacheOptions?: LRUCache.Options<string, any, unknown>;
  }

  // API Response Types
  interface DomainIntelligenceResponse {
    domain_identity: any;
    classification: any;
    dns_records: any;
    dns_analysis: any;
    tls_certificate: any;
    network_details: any;
    security_analysis: any;
    metadata: any;
  }

  interface IPIntelligenceResponse {
    ip: string;
    hostnames: string[];
    location: any;
    network: any;
    time_zone: string | null;
    security: any;
    ads: any;
    metadata: any;
  }

  interface WebTechResponse {
    domain: string;
    final_url: string;
    status_code: number;
    title: string | null;
    meta: any;
    headers: Record<string, string | string[]>;
    security_headers: Record<string, string | string[]>;
    cookies: string[];
    links: any;
    structure: any;
    technologies: string[];
    redirect_chain: any[];
    metadata: any;
  }

  interface AccountInfoResponse {
    quotas: {
      domain: { limit: number; used: number; remaining: number };
      ip: { limit: number; used: number; remaining: number };
      webtech: { limit: number; used: number; remaining: number };
      reset_date: string;
    };
    api_key: {
      name: string;
      requests_made: number;
      allowed_endpoints: string[];
    };
    metadata: any;
  }

  // Error Types
  export class ChapybaraError extends Error {}
  export class APIError extends ChapybaraError {
    status: number;
    code?: string;
    requestId?: string;
  }
  export class AuthenticationError extends APIError {}
  export class RateLimitError extends APIError {}
  export class NotFoundError extends APIError {}
  export class ServerError extends APIError {}
  export class BadRequestError extends APIError {}

  export class ChapybaraClient {
    constructor(options: ChapybaraClientOptions);

    domain: {
      getIntelligence: (
        domain: string,
      ) => Promise<DomainIntelligenceResponse>;
    };

    ip: {
      getIntelligence: (ip: string) => Promise<IPIntelligenceResponse>;
    };

    webtech: {
      getScanner: (domain: string) => Promise<WebTechResponse>;
    };

    account: {
      getInfo: () => Promise<AccountInfoResponse>;
    };
  }
}