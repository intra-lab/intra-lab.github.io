
let currentActiveBtn = document.querySelector('.nav-btn.active');

// Initialize position
window.onload = () => {
    moveIndicator(currentActiveBtn);
};

// 1. Function to move the pill (used for both Hover and Click)
function moveIndicator(btn) {
    const indicator = document.querySelector('.nav-indicator');
    indicator.style.width = `${btn.offsetWidth}px`;
    indicator.style.left = `${btn.offsetLeft}px`;
    
}

// 2. Function to lock in the new Active state
function setActive(btn, sectionId) {
    currentActiveBtn = btn; // Update our "Home Base"
    console.log(btn)
    // Update button styling
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    // Switch the page content
    document.querySelectorAll('.tab-content').forEach(s => s.classList.remove('active'));
    document.getElementById(sectionId).classList.add('active');
    
    moveIndicator(btn);
}

// 3. Function to snap back to active when mouse leaves navbar
function resetIndicator() {
    moveIndicator(currentActiveBtn);
}






const themeBtn = document.getElementById('theme-toggle');
const themeImg = document.getElementById('theme-icon');
const themeText = document.getElementById('nav-theme-text');
const body = document.body;

themeBtn.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
    
    if (body.classList.contains('dark-mode')) {
        themeImg.src = 'images/sun-icon.png';  // Path to your light mode image
        themeImg.alt = 'Light Mode';
                themeText.textContent = 'View in Dark Mode';

    } else {
        themeImg.src = 'images/moon-icon2.png'; // Path to your dark mode image
        themeImg.alt = 'Dark Mode';
                        themeText.textContent = 'View in Light Mode';

    }
});












function copyEmail() {
    // 1. Get the text
    const email = document.getElementById('email-text').textContent;
    const copyBtn = document.getElementById('copy-btn');
    const emailText2 = document.getElementById('email-text');

    // 2. Use the modern Clipboard API
    navigator.clipboard.writeText(email).then(() => {
        // 3. Visual Feedback
        const originalIcon = emailText2.textContent;
        emailText2.textContent = "Copied!"; // Change icon to checkmark
        
        setTimeout(() => {
            emailText2.textContent = originalIcon; // Change back after 2 seconds
        }, 1000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}

function copyEmail2() {
    // 1. Get the text
    const email = document.getElementById('email-text2').textContent;
    const copyBtn = document.getElementById('copy-btn2');
    const emailText2 = document.getElementById('email-text2');

    // 2. Use the modern Clipboard API
    navigator.clipboard.writeText(email).then(() => {
        // 3. Visual Feedback
        const originalIcon = emailText2.textContent;
        emailText2.textContent = "Copied!"; // Change icon to checkmark
        
        setTimeout(() => {
            emailText2.textContent = originalIcon; // Change back after 2 seconds
        }, 1000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
}







function toggleMenus() {
  const oldMenu = document.getElementById('menuContainer');
    const oldMenu2 = document.getElementById('menuContainer2');

  const newMenu = document.getElementById('menuContainerNew');

  oldMenu.classList.toggle('hidden');
    oldMenu2.classList.toggle('hidden');

  newMenu.classList.toggle('hidden');
}


function toggleMenus2() {
  const oldMenu = document.getElementById('menuContainer');
    const oldMenu2 = document.getElementById('menuContainer2');

  const newMenu = document.getElementById('menuContainerNew2');

  oldMenu.classList.toggle('hidden');
    oldMenu2.classList.toggle('hidden');

  newMenu.classList.toggle('hidden');
}











