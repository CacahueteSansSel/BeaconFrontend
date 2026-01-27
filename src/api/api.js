const BASE_URL = "https://services.cacahuete.dev/api/beacon";

async function request(path, options = {}) {
    const response = await fetch(`${BASE_URL}${path}`, {
        ...options,
        headers: {
            "Accept": "application/json",
            ...(options.headers || {}),
        },
    });

    if (!response.ok) {
        const text = await response.text();
        throw new Error(`Erreur API ${response.status}: ${text}`);
    }

    return response.json();
}

export async function apiGetFeed() {
    return request("/beacon/feed", { method: "GET" });
}