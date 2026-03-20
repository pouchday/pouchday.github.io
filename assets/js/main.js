document.addEventListener('DOMContentLoaded', () => {

    // --- Mobile Nav Toggle Logic ---
    const navToggle = document.querySelector('.nav-toggle');
    const body = document.body;

    if (navToggle) {
        navToggle.addEventListener('click', () => {
            // Toggles a class on the body to handle state
            body.classList.toggle('nav-open');
        });

        // Close menu when a link is clicked
        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                body.classList.remove('nav-open');
            });
        });
    }

    // --- Dynamic Travel Loader (Existing) ---
    const travelList = document.getElementById('travel-locations');
    if (travelList) {
        const TRAVEL_TSV_URL = 'https://docs.google.com/spreadsheets/d/1pNKEJRMOZY2yTuOt91vOZ9qeRW5S9oVaF9NnkLsoEOc/export?gid=712744042&format=tsv';
        fetch(TRAVEL_TSV_URL)
            .then(res => res.text())
            .then(text => {
                const lines = text.trim().split('\n');
                if (lines.length < 2) {
                    travelList.innerHTML = '<p>No travel data available.</p>';
                    return;
                }
                const headers = lines[0].split('\t').map(h => h.trim());
                let cityIdx = headers.findIndex(h => ['city', 'location', 'destination'].some(k => h.toLowerCase().includes(k)));
                if (cityIdx < 0) cityIdx = 0;
                let statusIdx = headers.findIndex(h => h.toLowerCase().includes('status'));
                if (statusIdx < 0) statusIdx = 1;

                const rows = lines.slice(1)
                    .map(line => line.split('\t').map(c => c.trim()))
                    .filter(cols => cols[cityIdx]);

                if (!rows.length) {
                    travelList.innerHTML = '<p>No travel data available.</p>';
                    return;
                }

                travelList.innerHTML = rows.map(cols => `
                    <div class="card">
                        <h3>${cols[cityIdx]}</h3>
                        <p style="margin:0; font-weight:bold; color: ${(cols[statusIdx] || '').includes('Full') ? '#d9534f' : '#5cb85c'}">
                            ${cols[statusIdx] || ''}
                        </p>
                    </div>
                `).join('');
            })
            .catch(err => {
                console.error('Error loading travel data:', err);
                travelList.innerHTML = '<p>Unable to load travel data.</p>';
            });
    }
});