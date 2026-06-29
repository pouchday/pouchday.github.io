import { fetchDatabase } from './utils/missions'

export function locationSearch(Alpine) {
    Alpine.data("locationSearch", () => ({
        /** @type {Awaited<ReturnType<typeof fetchDatabase>>} */
        database: { missions: [], trips: [] },
        search: "",

        formatDate(date) {
            return date.toLocaleDateString()
        },

        /** @type {import("./utils/missions").Trip[]} */
        get closestTrips() {
            if (!this.database || !this.database.trips) return [];

            // Group the earliest trip by mission name
            const closestMap = this.database.trips.reduce((acc, trip) => {
                const currentClosest = acc.get(trip.mission);

                if (!currentClosest || trip.date < currentClosest.date) {
                    acc.set(trip.mission, trip);
                }

                return acc;
            }, new Map());

            return Array.from(closestMap.values());
        },

        get filteredMissions() {
            const term = this.search.trim().toLowerCase()

            if (term === "") {
                return this.closestTrips.slice(0, 20)
            }

            return this.closestTrips
                .filter((m) => m.mission.toLowerCase().includes(term))
                .slice(0, 20)
        },

        async init() {
            this.database = await fetchDatabase()
        },
    }))
}