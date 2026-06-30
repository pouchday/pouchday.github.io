import { getActiveSession } from "../utils/sessions"

export function headerNav(Alpine) {
    Alpine.store("auth", {
        user: window.__INITIAL_AUTH__?.user || null,
        isAuthenticated: window.__INITIAL_AUTH__?.authenticated || false,
        isLoading: false // Always ready immediately
    });

    Alpine.data('headerNav', () => ({
        navOpen: false,
        travelMenuOpen: false,

        init() {
            this.syncBodyClass()

        },

        syncBodyClass() {
            document.body.classList.toggle('nav-open', this.navOpen)
        },

        toggleNav() {
            this.navOpen = !this.navOpen

            if (!this.navOpen) {
                this.travelMenuOpen = false
            }

            this.syncBodyClass()
        },

        toggleTravelMenu() {
            this.travelMenuOpen = !this.travelMenuOpen
        },

        closeAll() {
            this.navOpen = false
            this.travelMenuOpen = false
            this.syncBodyClass()
        },

        async logout() {
            try {
                const res = await fetch("/api/logout", { method: "POST" });
                if (res.ok) {
                    // Send them back to the landing page or login page
                    window.location.href = "/auth";
                } else {
                    console.error("Logout failed server-side");
                }
            } catch (err) {
                console.error("Network error during logout:", err);
            }
        }
    }))
}
