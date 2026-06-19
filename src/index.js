import Alpine from 'alpinejs'
import { fetchMissions } from './utils/missions'

Alpine.data("locationSearch", () => ({
    /** @type {Awaited<ReturnType<typeof fetchMissions>>} */
    missions: [],
    search: "",

    get filteredMissions() {
        const term = this.search.trim().toLowerCase()

        if (term === "") {
            return this.missions.slice(0, 10)
        }

        return this.missions
            .filter((m) => m["Mission Name"].toLowerCase().includes(term))
            .slice(0, 10)
    },

    async init() {
        this.missions = await fetchMissions()
    },
}))
