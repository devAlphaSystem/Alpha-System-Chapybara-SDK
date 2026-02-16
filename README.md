# Chapybara NodeJS SDK

The official NodeJS SDK for the Chapybara Domain & IP Intelligence API.

## Features

- **Fluent, Promise-based API**: Modern and easy to use with `async/await`.
- **Automatic Retries**: Automatically retries failed requests on server errors (5xx) with exponential backoff.
- **Configurable Caching**: Built-in LRU caching to reduce latency and save on API quotas.
- **TypeScript Support**: Ships with detailed type definitions for a superior developer experience.
- **Custom Error Handling**: Throws specific error types for robust error management.

## Installation

```bash
npm install chapybara
```

## Usage

First, import and instantiate the client with your API key.

```javascript
import { ChapybaraClient } from "chapybara";

const chapybara = new ChapybaraClient({
  apiKey: "ck_your_api_key_here",
});
```

### Get Your IP Address

```javascript
async function getUserIP() {
  try {
    const data = await chapybara.getUserIP();
    console.log(data.ip);
  } catch (error) {
    console.error(`Error fetching user IP: ${error.message}`);
  }
}

getUserIP();
```

### Get Domain Intelligence

```javascript
async function getDomainInfo() {
  try {
    const data = await chapybara.domain.getIntelligence("google.com");
    console.log(data.domain_identity);
    console.log(data.security_analysis);
  } catch (error) {
    console.error(`Error fetching domain data: ${error.message}`);
  }
}

getDomainInfo();
```

### Get IP Intelligence

```javascript
async function getIpInfo() {
  try {
    const data = await chapybara.ip.getIntelligence("8.8.8.8");
    console.log(data.location.country.name);
    console.log(data.network.organization);
  } catch (error) {
    console.error(`Error fetching IP data: ${error.message}`);
  }
}

getIpInfo();
```

### Get Web Tech Data

```javascript
async function getWebTechInfo() {
  try {
    const data = await chapybara.webtech.getScanner("github.com");
    console.log(data.title);
    console.log(data.technologies);
  } catch (error) {
    console.error(`Error fetching web tech data: ${error.message}`);
  }
}

getWebTechInfo();
```

### Get Account Information

```javascript
async function getAccountDetails() {
  try {
    const data = await chapybara.account.getInfo();
    console.log("Domain quota remaining:", data.quotas.domain.remaining);
  } catch (error) {
    console.error(`Error fetching account info: ${error.message}`);
  }
}

getAccountDetails();
```

## Configuration

You can pass a configuration object to the `ChapybaraClient` constructor:

```javascript
const chapybara = new ChapybaraClient({
  apiKey: "ck_your_api_key_here",
  baseUrl: "https://api.chapyapi.com/api/v1", // Optional: override base URL
  retries: 2, // Optional: number of retries on server errors (default: 2)
  timeout: 30000, // Optional: request timeout in ms (default: 30000)
  cacheOptions: {
    // Optional: LRU cache options
    max: 500, // Max number of items in cache
    ttl: 1000 * 60 * 5, // Cache TTL in ms (5 minutes)
  },
});
```

## Error Handling

The SDK throws custom errors for different API responses, allowing you to handle them gracefully. All errors extend `ChapybaraError`.

- `AuthenticationError`: Invalid or missing API key (401, 403).
- `RateLimitError`: Rate limit exceeded (429).
- `NotFoundError`: Resource not found (404).
- `BadRequestError`: Invalid input (400, 402).
- `ServerError`: An error occurred on the Chapybara servers (5xx).
- `APIError`: A generic API error.

```javascript
import { RateLimitError, AuthenticationError } from "chapybara";

async function handleErrors() {
  try {
    await chapybara.domain.getIntelligence("invalid-domain");
  } catch (error) {
    if (error instanceof RateLimitError) {
      console.log("Rate limit hit. Please wait before trying again.");
    } else if (error instanceof AuthenticationError) {
      console.log("Authentication failed. Please check your API key.");
    } else {
      console.log(`An API error occurred: ${error.message}`);
      console.log(`Request ID: ${error.requestId}`);
    }
  }
}
```
