import { getActiveSession } from "../utils/sessions"

export function headerNav(Alpine) {
    Alpine.store("session", {
        session: null,

        logOut() {
            localStorage.removeItem('pouchday_session');
            this.session = null
        },

        init() {
            this.session = getActiveSession()
        }
    })

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
    }))
}
