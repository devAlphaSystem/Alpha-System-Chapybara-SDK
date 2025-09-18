import type { LRUCache } from "lru-cache";
import type { Buffer } from "node:buffer";

declare module "chapybara" {
  interface ChapybaraClientOptions {
    apiKey: string;
    baseUrl?: string;
    retries?: number;
    timeout?: number;
    cacheOptions?: LRUCache.Options<string, any, unknown>;
  }

  interface MxRecord {
    priority: number;
    exchange: string;
  }

  interface SoaRecord {
    nsname: string;
    hostmaster: string;
    serial: number;
    refresh: number;
    retry: number;
    expire: number;
    minttl: number;
  }

  interface CaaRecord {
    critical: number;
    issue: string;
  }

  interface TlsCertificate {
    subject: Record<string, string>;
    issuer: Record<string, string>;
    subject_alternative_names: string[];
    valid_from: string;
    valid_to: string;
    days_until_expiry: number;
    is_expired: boolean;
    is_self_signed: boolean;
    fingerprint: string;
    fingerprint256: string;
    serial_number: string;
    signature_algorithm: string;
    public_key_algorithm: string | null;
    key_size: number;
    protocol: string;
    cipher: { name: string; version: string };
  }

  interface DomainIntelligenceResponse {
    domain_identity: {
      domain: string;
      punycode: string;
      subdomain: string | null;
      domain_name: string;
      tld: string;
      is_subdomain: boolean;
      domain_hash: string;
    };
    classification: {
      types: string[];
    };
    dns_records: {
      A: string[] | null;
      AAAA: string[] | null;
      MX: MxRecord[] | null;
      TXT: string[] | null;
      NS: string[] | null;
      CNAME: string[] | null;
      SOA: SoaRecord | null;
      CAA: CaaRecord[] | null;
      PTR: string[] | null;
    };
    dns_analysis: {
      spf: { record: string | null; valid: boolean };
      dmarc: { record: string | null; valid: boolean };
      dkim: { record: string | null; valid: boolean };
      has_mx: boolean;
      has_caa: boolean;
      wildcard_cert: boolean;
      subdomain_takeover_risk: boolean;
    };
    tls_certificate: TlsCertificate | null;
    network_details: {
      ip_addresses: {
        ipv4: string[];
        ipv6: string[];
      };
      mail_servers: MxRecord[] | null;
      nameservers: string[] | null;
      hosting_provider: string | null;
    };
    security_analysis: {
      is_malicious: boolean;
      threat_sources: string[];
      risk_assessment: {
        risk_score: number;
        threat_types: string[];
        risk_level: string;
      };
      is_disposable_email: boolean;
    };
    metadata: {
      data_freshness: {
        last_update_check: string;
      };
      timestamp: string;
      response_time_ms: number;
      request_id: string;
    };
  }

  interface IPIntelligenceResponse {
    ip: string;
    hostnames: string[];
    location: {
      continent: {
        name: string | null;
        code: string | null;
        hemisphere: string[];
      };
      country: {
        name: string | null;
        code: string | null;
        alpha3_code: string | null;
        numeric_code: number | null;
        capital: string | null;
        demonym: string | null;
        population: number | null;
        total_area: number | null;
        tld: string | null;
        currency: {
          code: string;
          name: string;
          symbol: string;
        } | null;
        language: {
          code: string;
          name: string;
        } | null;
        calling_codes: string | null;
      };
      region: {
        name: string | null;
        code: string | null;
      };
      city: {
        name: string | null;
      };
      latitude: number | null;
      longitude: number | null;
      zip_code: string | null;
      accuracy_radius: number | null;
    };
    network: {
      asn: string | null;
      organization: string | null;
      isp: string | null;
      usage_type: string | null;
      net_speed: string | null;
      mobile: {
        is_mobile: boolean;
        mcc: string | null;
        mnc: string | null;
        brand: string | null;
      };
      registration_date: string | null;
    };
    time_zone: string | null;
    security: {
      is_proxy: boolean;
      proxy_type: string | null;
      is_tor: boolean;
      is_vpn: boolean;
      is_datacenter: boolean;
      is_spammer: boolean;
      threat_level: string;
    };
    ads: {
      category_code: string;
      category_name: string;
    };
    metadata: {
      data_freshness: {
        last_update_check: string;
      };
      timestamp: string;
      response_time_ms: number;
      request_id: string;
    };
  }

  interface WebTechResponse {
    domain: string;
    final_url: string;
    status_code: number;
    title: string | null;
    html_lang: string | null;
    meta: {
      description: string | null;
      keywords: string | null;
      generator: string | null;
      all_meta: Record<string, any>[];
      open_graph: Record<string, any>;
      twitter: Record<string, any>;
      robots: string | null;
    };
    headers: Record<string, string | string[]>;
    security_headers: Record<string, string | string[]>;
    cookies: string[];
    links: {
      canonical: string | null;
      favicon: string | null;
      manifest: string | null;
    };
    structure: {
      script_count: number;
      stylesheet_count: number;
      image_count: number;
      form_count: number;
      anchor_count: number;
      external_links: number;
      internal_links: number;
    };
    technologies: string[];
    redirect_chain: any[];
    metadata: {
      data_freshness: {
        last_update_check: string;
      };
      timestamp: string;
      request_id: string;
      response_time_ms: number;
    };
  }

  interface AccountInfoResponse {
    quotas: {
      domain: { limit: number; used: number; remaining: number };
      ip: { limit: number; used: number; remaining: number };
      webtech: { limit: number; used: number; remaining: number };
      screenshot: { limit: number; used: number; remaining: number };
      reset_date: string;
    };
    api_key: {
      name: string;
      requests_made: number;
      allowed_endpoints: string[];
    };
    metadata: {
      response_time_ms: number;
      request_id: string;
    };
  }

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
      getIntelligence: (domain: string) => Promise<DomainIntelligenceResponse>;
    };

    ip: {
      getIntelligence: (ip: string) => Promise<IPIntelligenceResponse>;
    };

    webtech: {
      getScanner: (domain: string) => Promise<WebTechResponse>;
    };

    screenshot: {
      get: (domain: string) => Promise<Buffer>;
    };

    account: {
      getInfo: () => Promise<AccountInfoResponse>;
    };
  }
}