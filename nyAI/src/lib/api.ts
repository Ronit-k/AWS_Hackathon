const getApiBaseUrl = () => {
  const baseUrl = import.meta.env.VITE_BASE_URL?.trim();

  if (!baseUrl) {
    throw new Error("Missing VITE_BASE_URL in nyAI/.env");
  }

  return baseUrl.replace(/\/+$/, "");
};

interface BackendResponse {
  response: string;
}

export const postQuery = async (endpoint: "chatbot" | "doc_analyzer", query: string) => {
  const res = await fetch(`${getApiBaseUrl()}/${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!res.ok) {
    throw new Error(`Request failed with status ${res.status}`);
  }

  const data = (await res.json()) as Partial<BackendResponse>;

  if (typeof data.response !== "string") {
    throw new Error("Backend response is missing the response field.");
  }

  return data.response;
};
