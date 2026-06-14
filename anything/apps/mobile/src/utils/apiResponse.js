export class ApiResponseFormatError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = "ApiResponseFormatError";
    Object.assign(this, details);
  }
}

function getResponsePreview(text) {
  return text.replace(/\s+/g, " ").trim().slice(0, 120);
}

export async function readJsonResponse(response, { action = "Request" } = {}) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    const preview = getResponsePreview(text);
    const looksLikeHtml = preview.startsWith("<");
    const reason = looksLikeHtml
      ? "The server returned HTML instead of JSON."
      : "The server returned invalid JSON.";

    throw new ApiResponseFormatError(`${action} failed. ${reason}`, {
      cause: error,
      contentType: response.headers?.get?.("content-type") || null,
      preview,
      status: response.status,
      url: response.url,
    });
  }
}

function getTokenFromPayload(payload) {
  if (!payload || typeof payload !== "object") {
    return null;
  }

  return (
    payload.jwt ||
    payload.token ||
    payload.accessToken ||
    payload.authToken ||
    payload.sessionToken ||
    null
  );
}

export function extractAuthPayload(data) {
  const candidates = [
    data,
    data?.data,
    data?.result,
    data?.payload,
    data?.session,
    data?.auth,
  ];

  for (const candidate of candidates) {
    if (!candidate || typeof candidate !== "object") {
      continue;
    }

    const user = candidate.user || null;
    const jwt = getTokenFromPayload(candidate);
    if (user && jwt) {
      return { jwt, user };
    }
  }

  return null;
}

export async function resolveAuthPayloadFromResponse(
  data,
  { action = "Request", tokenEndpoint = "/api/auth/token" } = {},
) {
  const directPayload = extractAuthPayload(data);
  if (directPayload) {
    return directPayload;
  }

  if (!data?.success || !data?.user) {
    return null;
  }

  const response = await fetch(tokenEndpoint, {
    method: "GET",
    credentials: "include",
  });
  const tokenData = await readJsonResponse(response, {
    action: `${action} token exchange`,
  });

  if (!response.ok) {
    return null;
  }

  const tokenPayload = extractAuthPayload(tokenData);
  if (!tokenPayload) {
    return null;
  }

  return {
    jwt: tokenPayload.jwt,
    user: {
      ...data.user,
      ...tokenPayload.user,
    },
  };
}

export function getUserFacingApiError(
  error,
  fallbackMessage = "Network error. Please try again.",
) {
  if (error instanceof ApiResponseFormatError) {
    return "The service is temporarily unavailable. Please try again.";
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallbackMessage;
}
