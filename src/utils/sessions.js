// Add session resolution logic on app initialization
document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const authError = params.get('error');

    if (authError) {
        alert(`Authentication Error: ${authError}`);
        // Clean up ugly URL parameters safely
        window.history.replaceState({}, document.title, window.location.pathname);
    }
});

/**
 * Global Utility helper to evaluate logged-in status across pages
 */
export function getActiveSession() {
    const rawSession = localStorage.getItem('pouchday_session');
    if (!rawSession) return null;

    const session = JSON.parse(rawSession);

    // Guard clause against expired session bounds
    if (session.expires_at && Date.now() > session.expires_at) {
        localStorage.removeItem('pouchday_session');
        return null;
    }
    return session;
}
