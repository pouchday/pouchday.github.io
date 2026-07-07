import { fetchDatabase } from "./utils/missions";

export function locationSearch(Alpine) {
    Alpine.data("locationSearch", () => ({
        /** @type {Awaited<ReturnType<typeof fetchDatabase>>} */
        database: new Map(),
        search: "",

        formatDate(date) {
            return date.toLocaleDateString();
        },

        /** @type {import("./utils/missions").Trip[]} */
        get closestTrips() {
            if (!this.database || this.database.size === 0) return [];

            return Array.from(this.database.entries())
                .filter(([name, mission]) => mission.trips.length > 0)
                .map(([name, mission]) => [
                    mission,
                    mission.trips.reduce((curr, trip) => {
                        return !curr || trip.date < curr.date ? trip : curr;
                    }, null),
                ]);
        },

        get filteredMissions() {
            const term = this.search.trim().toLowerCase();

            if (term === "") {
                return this.closestTrips.slice(0, 20);
            }

            return this.closestTrips
                .filter(([mission, trip]) => mission.mission.toLowerCase().includes(term))
                .slice(0, 20);
        },

        async init() {
            this.database = await fetchDatabase();
        },
    }));
}
