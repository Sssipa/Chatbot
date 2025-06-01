// Anda perlu memastikan ini ada di sisi client
export function getOrCreateSessionId() {
    let sessionId = localStorage.getItem('chatSessionId');
    // Jika tidak ada sessionId, buat yang baru
    if (!sessionId) {
        sessionId = crypto.randomUUID(); // Atau gunakan library uuid
        localStorage.setItem('chatSessionId', sessionId);
    }
    return sessionId;
}
