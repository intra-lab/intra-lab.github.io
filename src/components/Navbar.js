import './TabSlider.js';

class MyNavbar extends HTMLElement {
 constructor() {
 super();
 this.attachShadow({ mode: 'open' });
 this._tabsData = [];
 }

 static get observedAttributes() {
 return ['brand', 'logo', 'subtitle'];
 }

 connectedCallback() {
 this.render();
    this.splitBrandIntoLetters();

 }

 attributeChangedCallback(name, oldValue, newValue) {
 if (this.isConnected) {
 this.render();
    this.splitBrandIntoLetters();

 }
 }
splitBrandIntoLetters() {
 const brandH2 = this.shadowRoot.querySelector('.brand h2');
 if (!brandH2) return;

 const text = brandH2.textContent;
 brandH2.innerHTML = '';

 // Define which positions get special styling
 const highlightPositions = [0, 1, 3, 5, 7, 9, 11, 13, 15, 17, 19, 21, 23, 25];
 const accentPositions = [12];

 text.split('').forEach((char, index) => {
   const span = document.createElement('span');
   span.className = 'brand-letter';
   span.setAttribute('data-index', index);
   
   if (highlightPositions.includes(index)) {
     span.classList.add('highlight');
   }
   if (accentPositions.includes(index)) {
     span.classList.add('accent');
   }
   
   span.textContent = char;
   brandH2.appendChild(span);
 });
}

 render() {
 const brand = this.getAttribute('brand') || 'Guest';
 const subtitle = this.getAttribute('subtitle') || 'Guest';


 this.shadowRoot.innerHTML = `
 <style>
 .navbar {
 display: flex;
 justify-content: space-between;
 align-items: center;
 box-sizing: border-box;
 padding: 2rem 4rem;
 color: var(--text-color-primary, white);
 transition: background-color 0.3s, color 0.3s;
 position: fixed;
 z-index: 100;
 width: 100%;
 pointer-events: none;
                         font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;

 }

 .nav-bg {
 position: absolute;
 top: 0;
 left: 0;
 width: 100%;
 height: 100%;
 z-index: -1;
 }

 .brand { 
 font-size: 1.3rem; 
   white-space: nowrap;

 }

 .toggle-wrapper {
 position: relative;
 display: flex;
 align-items: center;
 overflow: hidden;
 }

 .toggle-text {
 position: absolute;
 right: 10px;
 opacity: 0;
 white-space: nowrap;
 font-size: 0.75rem;
 color: var(--text-color-primary, white);
 transition: transform 0.4s ease, opacity 0.3s ease;
 pointer-events: none;
 z-index: 1;
 font-weight:400;
 }

 /* --- Updated Button Styles --- */
 .theme-toggle-btn {
 position: relative;
 z-index: 2;
 background-color: transparent;
 border: none;
 cursor: pointer;
 padding: 8px;
 display: flex;
 align-items: center;
 justify-content: center;
 border-radius: 50%;
 width: 48px;
 height: 48px;
 overflow: hidden;
 pointer-events: auto;
 }

 /* --- Sliding Icon Animations --- */
 svg {
 position: absolute;
 width: 32px;
 height: 32px;
 object-fit: contain;
 transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-in-out;
 pointer-events: none;
 }

 /* DEFAULT STATE */
 svg.active {
 opacity: 0.5;
 transform: translateY(0);
 fill: var(--text-color-primary);
 }
 
 .theme-toggle-btn:hover svg.active {
 opacity: 1;
 }

 /* ANIMATION STATES */
 svg.exit-down {
 opacity: 0 !important;
 transform: translateY(25px);

 }

svg.enter-top {
 opacity: 0 !important;
 transform: translateY(-25px);
 }

 .nav-item { 
 flex: 1; 
 display: flex; 
 }

 .align-left { 
 justify-content: flex-start; 
 display:flex;
 flex-direction:column;
 }

 .align-center { 
 justify-content: center; 
 }

 .align-right { 
 justify-content: flex-end; 
 }

 .theme-toggle-btn:hover ~ .toggle-text {
 opacity: 0.5;
 transform: translateX(-45px);
 }

 /* --- Mobile Responsive Layout --- */
 @media (max-width: 768px) {
 .navbar {
 padding: 1rem 2rem;
 }

 .nav-bg {
 backdrop-filter: blur(10px);
 -webkit-backdrop-filter: blur(10px);
 mask-image: linear-gradient(to top, transparent 0%, black 40%);
 }

 tab-slider {
 position: fixed;
 bottom: 0;
 left: 0;
 width: 100%;
 z-index: 9999;
 display: flex;
 justify-content: center;
 padding: 2rem 0;
 }

 .brand {
 flex: 1;
 justify-content: flex-start;
 }
 
 .toggle-wrapper {
 flex: 1;
 justify-content: flex-end;
 }

 .toggle-text {
 display: none !important;
 }
 }
 
 #sunIcon {
 width: 1.5rem;   /* smaller */
  height: 1.5rem;
 }

 #moonIcon{
 width: 2rem;   /* smaller */
  height: 2rem;
 }

 .logo-image {
 width:8rem;
 filter: brightness(var(--image-brightness-filter));
 display:none;
 }




.brand-letter {
  display: inline-block;
  letter-spacing: inherit;
  font-weight: var(--logo-weight);
  letter-spacing: -0.8px;
  font-size:1.5rem;

}
.brand-letter.highlight {
  color: #ff0000;
  font-size: 0em;
   font-weight: 300;
   
}

.brand-letter.accent {
  color: #ff00ff;
  text-shadow: 0 0 5px rgba(255, 0, 255, 0.5);
  padding:0 0.1em;
}

h2, p {
margin: 0}
.subtitle{
margin-top:-0.1rem;
opacity:0.5;
font-size:0.75rem;
  letter-spacing: -0.75px;
   font-weight: 400;

}
 </style>

 <nav class="navbar">
 <div class="nav-bg"></div>
 <div class="brand nav-item align-left">
 <h2>${brand}</h2>
  <p class="subtitle">${subtitle}</p>

</div>
 <tab-slider id="navbar-slider" class="nav-item align-center"></tab-slider>
 
 <div class="toggle-wrapper nav-item align-right">
 <button class="theme-toggle-btn" id="themeBtn" aria-label="Toggle Theme">

<svg  id="sunIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" class="size-6">
  <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 0 1 .162.819A8.97 8.97 0 0 0 9 6a9 9 0 0 0 9 9 8.97 8.97 0 0 0 3.463-.69.75.75 0 0 1 .981.98 10.503 10.503 0 0 1-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 0 1 .818.162Z" clip-rule="evenodd" />
</svg>

 <svg  id="moonIcon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"  class="size-6">
  <path d="M12 2.25a.75.75 0 0 1 .75.75v2.25a.75.75 0 0 1-1.5 0V3a.75.75 0 0 1 .75-.75ZM7.5 12a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM18.894 6.166a.75.75 0 0 0-1.06-1.06l-1.591 1.59a.75.75 0 1 0 1.06 1.061l1.591-1.59ZM21.75 12a.75.75 0 0 1-.75.75h-2.25a.75.75 0 0 1 0-1.5H21a.75.75 0 0 1 .75.75ZM17.834 18.894a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 1 0-1.061 1.06l1.59 1.591ZM12 18a.75.75 0 0 1 .75.75V21a.75.75 0 0 1-1.5 0v-2.25A.75.75 0 0 1 12 18ZM7.758 17.303a.75.75 0 0 0-1.061-1.06l-1.591 1.59a.75.75 0 0 0 1.06 1.061l1.591-1.59ZM6 12a.75.75 0 0 1-.75.75H3a.75.75 0 0 1 0-1.5h2.25A.75.75 0 0 1 6 12ZM6.697 7.757a.75.75 0 0 0 1.06-1.06l-1.59-1.591a.75.75 0 0 0-1.061 1.06l1.59 1.591Z" />
</svg>

 
 </button>
 <span class="toggle-text" id="toggleText">View in Light Mode</span>
 </div>
 </nav>
 `;

 // Re-setup after render
 this.setupThemeToggle();
 
 // Re-apply tabs data if it exists
 if (this._tabsData.length > 0) {
 this.applyTabsToSlider();
 }
 }
setupThemeToggle() {
  const btn = this.shadowRoot.querySelector('#themeBtn');
  const sunIcon = this.shadowRoot.querySelector('#sunIcon');
  const moonIcon = this.shadowRoot.querySelector('#moonIcon');
  const text = this.shadowRoot.querySelector('#toggleText');

  if (!btn) return;

  const currentTheme = localStorage.getItem('theme') || 'dark';

  if (currentTheme === 'light') {
    document.body.classList.add('light-theme');
    moonIcon.classList.add('active');
    sunIcon.classList.add('enter-top');
    text.textContent = 'View in Dark Mode';
  } else {
    sunIcon.classList.add('active');
    moonIcon.classList.add('enter-top');
    text.textContent = 'View in Light Mode';
  }

  btn.addEventListener('click', () => {
  const isLight = document.body.classList.toggle('light-theme');

  if (isLight) {
    // Clean up sunIcon (exiting)
    sunIcon.classList.remove('active', 'enter-top');
    sunIcon.classList.add('exit-down');
    
    // Clean up moonIcon (entering)
    moonIcon.classList.remove('enter-top', 'exit-down');
    
    // Force reflow for animation
    void moonIcon.offsetWidth;
    
    moonIcon.classList.add('active');
    text.textContent = 'View in Dark Mode';
    localStorage.setItem('theme', 'light');
  } else {
    // Clean up moonIcon (exiting)
    moonIcon.classList.remove('active', 'enter-top');
    moonIcon.classList.add('exit-down');
    
    // Clean up sunIcon (entering)
    sunIcon.classList.remove('enter-top', 'exit-down');
    
    // Force reflow for animation
    void sunIcon.offsetWidth;
    
    sunIcon.classList.add('active');
    text.textContent = 'View in Light Mode';
    localStorage.setItem('theme', 'dark');
  }
});
}

 applyTabsToSlider() {
 const slider = this.shadowRoot.querySelector('tab-slider');
 if (slider && this._tabsData.length > 0) {
 slider.tabs = this._tabsData;
 }
 }

 set menuItems(data) {
 this._tabsData = data;
 this.applyTabsToSlider();
 }

 get menuItems() {
 return this._tabsData;
 }
}

customElements.define('my-navbar', MyNavbar);
