const MISSIONS_TSV = 'https://docs.google.com/spreadsheets/d/1pNKEJRMOZY2yTuOt91vOZ9qeRW5S9oVaF9NnkLsoEOc/export?gid=0&format=tsv';

/* 0: Object { "Mission Name": "Adriatic North", "Currently Accepting Packages": "TRUE", "Mission Office Address": "" } */

// export interface MissionRow {
//     "Mission Name": string,
//     "Currently Accepting Packages": string,
//     "Mission Office Address": string
// }

/**
 * @typedef {{
 * "Mission Name": string,
 * "Currently Accepting Packages": string,
 * "Mission Office Address": string
 * }} MissionRow 
 */


/**
 * Parses a TSV file into a row of objects
 * @param {string} text 
 * @returns {MissionRow[]}
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

export async function fetchMissions() {
    const res = await fetch(MISSIONS_TSV)
    const tsv = await res.text()
    return parseTSVRows(tsv);
}
