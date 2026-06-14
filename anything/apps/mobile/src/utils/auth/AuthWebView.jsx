import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import { WebView } from "react-native-webview";
import { useAuthStore, useAuthModal } from "./store";
import { extractAuthPayload, readJsonResponse } from "../apiResponse";
import {
  getBaseUrl,
  getHost,
  getProjectGroupId,
  getProxyBaseUrl,
} from "../runtimeConfig";

const callbackUrl = "/api/auth/token";
const callbackQueryString = `callbackUrl=${callbackUrl}`;

/**
 * This renders a WebView for authentication and handles both web and native platforms.
 */
export const AuthWebView = ({ mode, proxyURL, baseURL }) => {
  const resolvedBaseUrl = baseURL || getBaseUrl();
  const resolvedProxyUrl = proxyURL || getProxyBaseUrl() || resolvedBaseUrl;
  const host = getHost();
  const projectGroupId = getProjectGroupId();
  const [currentURI, setURI] = useState(
    `${resolvedBaseUrl}/account/${mode}?${callbackQueryString}`,
  );
  const { auth, setAuth, isReady } = useAuthStore();
  const { close } = useAuthModal();
  const isAuthenticated = isReady ? !!auth : null;
  const iframeRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) {
      return;
    }
    setURI(`${resolvedBaseUrl}/account/${mode}?${callbackQueryString}`);
  }, [mode, resolvedBaseUrl, isAuthenticated]);

  useEffect(() => {
    if (typeof window === "undefined" || !window.addEventListener) {
      return;
    }
    const handleMessage = (event) => {
      // Verify the origin for security
      if (event.origin !== resolvedProxyUrl && event.origin !== resolvedBaseUrl) {
        return;
      }
      if (event.data.type === "AUTH_SUCCESS") {
        setAuth({
          jwt: event.data.jwt,
          user: event.data.user,
        });
      } else if (event.data.type === "AUTH_ERROR") {
        console.error("Auth error:", event.data.error);
      }
    };

    window.addEventListener("message", handleMessage);

    return () => {
      window.removeEventListener("message", handleMessage);
    };
  }, [resolvedBaseUrl, resolvedProxyUrl, setAuth]);

  if (Platform.OS === "web") {
    const handleIframeError = () => {
      console.error("Failed to load auth iframe");
    };

    return (
      <iframe
        ref={iframeRef}
        title="Authentication"
        src={`${resolvedProxyUrl}/account/${mode}?callbackUrl=/api/auth/expo-web-success`}
        style={{ width: "100%", height: "100%", border: "none" }}
        onError={handleIframeError}
      />
    );
  }
  return (
    <WebView
      sharedCookiesEnabled
      source={{
        uri: currentURI,
      }}
      headers={{
        "x-createxyz-project-group-id": projectGroupId,
        host,
        "x-forwarded-host": host,
        "x-createxyz-host": host,
      }}
      onShouldStartLoadWithRequest={(request) => {
        if (request.url === `${resolvedBaseUrl}${callbackUrl}`) {
          fetch(request.url)
            .then(async (response) => {
              const data = await readJsonResponse(response, {
                action: "Auth callback",
              });
              const authPayload = extractAuthPayload(data);

              if (!response.ok || !authPayload) {
                console.error("Auth callback failed:", response.status, data);
                return;
              }

              setAuth(authPayload);
              // Close modal and route to home after successful mobile auth
              setTimeout(() => {
                close();
                router.replace("/");
              }, 100);
            })
            .catch((error) => {
              console.error("Failed to complete auth callback:", error);
            });
          return false;
        }
        if (request.url === currentURI) return true;

        // Add query string properly by checking if URL already has parameters
        const hasParams = request.url.includes("?");
        const separator = hasParams ? "&" : "?";
        const newURL = request.url.replaceAll(resolvedProxyUrl, resolvedBaseUrl);
        if (newURL.endsWith(callbackUrl)) {
          setURI(newURL);
          return false;
        }
        setURI(`${newURL}${separator}${callbackQueryString}`);
        return false;
      }}
      style={{ flex: 1 }}
    />
  );
};
