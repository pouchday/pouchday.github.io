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
                closeAllNavDropdowns();
            });
        });
    }

    // --- Nav Group Dropdown Logic ---
    function closeAllNavDropdowns() {
        document.querySelectorAll('.nav-group-btn').forEach(btn => {
            btn.setAttribute('aria-expanded', 'false');
            const menuId = btn.getAttribute('aria-controls');
            const menu = menuId ? document.getElementById(menuId) : null;
            if (menu) menu.classList.remove('is-open');
        });
    }

    document.querySelectorAll('.nav-group-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const expanded = btn.getAttribute('aria-expanded') === 'true';
            const menuId = btn.getAttribute('aria-controls');
            const menu = menuId ? document.getElementById(menuId) : null;
            closeAllNavDropdowns();
            if (!expanded) {
                btn.setAttribute('aria-expanded', 'true');
                if (menu) menu.classList.add('is-open');
            }
            e.stopPropagation();
        });
    });

    document.addEventListener('click', () => {
        closeAllNavDropdowns();
    });
});