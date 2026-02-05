
const hamburger = document.querySelector('.humburg');
const cancel = document.querySelector('.cancel');
const dropdown = document.querySelector('.dropdown');
const dropdownLinks = document.querySelectorAll('.dropdown .links a');

hamburger.addEventListener('click', () => {
    dropdown.style.transform = 'translateY(0)';
    });

    cancel.addEventListener('click', () => {
        dropdown.style.transform = 'translateY(-500px)';
    });

    // Close dropdown when clicking a link
    dropdownLinks.forEach(link => {
        link.addEventListener('click', () => {
            dropdown.style.transform = 'translateY(-500px)';
        });
    });
