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
        fetch('/assets/data/travel.json')
            .then(res => res.json())
            .then(data => {
                travelList.innerHTML = data.locations.map(loc => `
                    <div class="card">
                        <h3>${loc.city}</h3>
                        <p style="margin:0; font-weight:bold; color: ${loc.status.includes('Full') ? '#d9534f' : '#5cb85c'}">
                            ${loc.status}
                        </p>
                    </div>
                `).join('');
            })
            .catch(err => console.error('Error loading travel data:', err));
    }
});