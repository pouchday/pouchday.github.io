const MISSIONS_TSV = 'https://docs.google.com/spreadsheets/d/1vmm4U60ifl4Yh1ypGuRzkEUIZzB_WeTXb2VgCtBL4zY/export?gid=0&format=tsv'
const TRIPS_TSV = 'https://docs.google.com/spreadsheets/d/1vmm4U60ifl4Yh1ypGuRzkEUIZzB_WeTXb2VgCtBL4zY/export?gid=1211587268&format=tsv'

/**
 * @typedef {{
 * mission: string,
 * date: Date,
 * status: "Not Yet Open" | "Open" | "Sold Out" | "Shipped"
 * }} Trip
 */

/**
 * @typedef {{
 * mission: string,
 * price: number,
 * officeAddress: string,
 * officePhone: string,
 * country: string,
 * trips: Trip[]
 * }} Mission 
 */

/**
 * Parses a TSV file into a row of objects
 * @param {string} text 
 * @returns {Object[]}
 */
function parseTSVRows(text) {
    const lines = text.trim().split('\n');
    const headers = lines[0].split('\t').map(h => h.trim());
    const rows = lines.slice(1).map(line => {
        const row = line.split('\t').map(c => c.trim())
        return Object.fromEntries(headers.map((header, i) => [header, row[i]]))
    });

    return rows;
}

/**
 * Pulls missions from the google sheet.
 * @returns {Promise<Mission[]>}
 */
async function fetchMissions() {
    const res = await fetch(MISSIONS_TSV)
    const tsv = await res.text()
    return parseTSVRows(tsv).map(missionRow => ({
        mission: missionRow["Mission Name"],
        internationalPrice: Number(missionRow["International Price"]),
        domesticPrice: Number(missionRow["Domestic Price"]),
        officeAddress: missionRow["Mission Office Address"],
        officePhone: missionRow["Mission Office Phone"],
        country: missionRow["Country"],
        trips: []
    }));
}

/**
 * Pulls missions from the google sheet.
 * @returns {Promise<Trip[]>}
 */
async function fetchTrips() {
    const res = await fetch(TRIPS_TSV)
    const tsv = await res.text()
    return parseTSVRows(tsv).map(trip => ({
        mission: trip["Mission Name"],
        date: new Date(trip["Due Date"]),
        status: trip["Status"]
    }))
}

export async function fetchDatabase() {
    const [missions, trips] = await Promise.all([fetchMissions(), fetchTrips()])
    const missionMap = new Map(missions.map(m => [m.mission, m]))
    trips.forEach(trip => {
        missionMap.get(trip.mission)?.trips?.push(trip)
    })
    return missionMap
}