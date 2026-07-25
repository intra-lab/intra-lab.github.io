import { smoothScrollToTop, attachScrollListener } from '../scroll-utils.js';

class TabSlider extends HTMLElement {
 constructor() {
 super();
 this.attachShadow({ mode: 'open' });
 this._tabsData = [];
 this.activeIndex = 0;
 }

 // Watch for attribute changes (optional, if you want to load tabs from attributes)
 static get observedAttributes() {
 return ['data-tabs'];
 }

 connectedCallback() {
 // Render immediately, even if no data yet
 this.render();
 this.initSlider();
 }

 attributeChangedCallback(name, oldValue, newValue) {
 if (this.isConnected) {
 this.render();
 this.initSlider();
 }
 }

 set tabs(data) {
 this._tabsData = data;
 this.render();
 this.initSlider();
 }

 setActiveTab(tabId) {
 const buttons = this.shadowRoot.querySelectorAll('.tab-btn');
 const targetBtn = Array.from(buttons).find(b => b.dataset.target === tabId);
 
 if (targetBtn) {
 this._switchToTab(targetBtn);
 }
 }

 _switchToTab(targetBtn) {
 const buttons = this.shadowRoot.querySelectorAll('.tab-btn');
 const indicator = this.shadowRoot.querySelector('.slider-indicator');

 this.activeIndex = parseInt(targetBtn.dataset.index, 10);
 
 buttons.forEach(b => b.classList.remove('active', 'hovered'));
 targetBtn.classList.add('active');
 
 if (indicator) {
 indicator.style.width = `${targetBtn.offsetWidth}px`;
 indicator.style.transform = `translateX(${targetBtn.offsetLeft - 5}px)`;
 }

 const targetTabId = targetBtn.dataset.target;
 this.dispatchEvent(new CustomEvent('tab-change', {
 detail: { tabId: targetTabId },
 bubbles: true,
 composed: true
 }));
 }

 render() {
 if (!this._tabsData.length) {
 // Empty state - still create the container
 this.shadowRoot.innerHTML = `
 <style>
 .nav-container {
 position: relative;
 display: flex;
 background: var(--glass-color-primary);
 border-radius: 30px;
 padding: 5px;
 pointer-events: auto;
 backdrop-filter: blur(10px);
 -webkit-backdrop-filter: blur(10px);
 border: 1px solid var(--glass-border-primary);
 box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.15);
 transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease-in-out;
                         font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;

 }
 .tab-btn {
 flex: 1;
 background: none;
 border: none;
 padding: 0.75rem 1.5rem;
 font-size: 0.9rem;
 font-weight: 300;
 color: var(--text-color-secondary);
 cursor: pointer;
 position: relative;
 z-index: 2;
 transition: color 0.2s ease;
 white-space: nowrap;
 }
 .tab-btn.active,
 .tab-btn.hovered {
 color: var(--text-color-primary);
 }
 .nav-container:hover {
 transform: scale(1.1);
 box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.15);
 border: 1px solid var(--glass-border-secondary);
 }
 .slider-indicator {
 position: absolute;
 top: 5px;
 left: 5px;
 height: calc(100% - 10px);
 background: var(--glass-color-secondary);
 border-radius: 25px;
 transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s ease;
 z-index: 1;
 backdrop-filter: blur(10px);
 -webkit-backdrop-filter: blur(10px);
 }
 </style>
 <div class="nav-container">
 <div class="slider-indicator"></div>
 </div>
 `;
 return;
 }

 const navHTML = this._tabsData.map((tab, index) => `
 <button class="tab-btn ${index === 0 ? 'active' : ''}" data-index="${index}" data-target="${tab.id}">
 ${tab.label}
 </button>
 `).join('');

 this.shadowRoot.innerHTML = `
 <style>
 .nav-container {
 
 position: relative;
 display: flex;
 background: var(--glass-color-primary);
 border-radius: 30px;
 padding: 5px;
 pointer-events: auto;
 backdrop-filter: blur(10px);
 -webkit-backdrop-filter: blur(10px);
 border: 1px solid var(--glass-border-primary);
 box-shadow: 0px 5px 10px rgba(0, 0, 0, 0.15);
 transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease-in-out;
 }
 .tab-btn {
                         font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;

 flex: 1;
 background: none;
 border: none;
 padding: 0.75rem 1.5rem;
 font-size: 0.9rem;
 font-weight: 500;
 color: var(--text-color-secondary);
 cursor: pointer;
 position: relative;
 z-index: 2;
 transition: color 0.2s ease;
 white-space: nowrap;
 }
 .tab-btn.active,
 .tab-btn.hovered {
 color: var(--text-color-primary);
 }
 .nav-container:hover {
 transform: scale(1.1);
 box-shadow: 0px 10px 15px rgba(0, 0, 0, 0.15);
 border: 1px solid var(--glass-border-secondary);
 }
 .slider-indicator {
 position: absolute;
 top: 5px;
 left: 5px;
 height: calc(100% - 10px);
 background: var(--glass-color-secondary);
 border-radius: 25px;
 transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), width 0.3s ease;
 z-index: 1;
 backdrop-filter: blur(10px);
 -webkit-backdrop-filter: blur(10px);
 }
 </style>
 <div class="nav-container scroll-to-top">
 <div class="slider-indicator"></div>
 ${navHTML}
 </div>
 `;
 }

 initSlider() {
 const buttons = this.shadowRoot.querySelectorAll('.tab-btn');
 const indicator = this.shadowRoot.querySelector('.slider-indicator');
 const navContainer = this.shadowRoot.querySelector('.nav-container');

 if (!buttons.length || !indicator) return;

 const moveIndicator = (targetBtn) => {
 indicator.style.width = `${targetBtn.offsetWidth}px`;
 indicator.style.transform = `translateX(${targetBtn.offsetLeft - 5}px)`;
 };

 setTimeout(() => moveIndicator(buttons[this.activeIndex]), 50);

 const updateTextColors = (activeButton) => {
 buttons.forEach(b => b.classList.remove('active', 'hovered'));
 activeButton.classList.add('hovered');
 };

 buttons.forEach((btn) => {
 btn.addEventListener('mouseenter', (e) => {
 moveIndicator(e.target);
 updateTextColors(e.target);
 });
 });

 navContainer.addEventListener('mouseleave', () => {
 const permanentActive = buttons[this.activeIndex];
 moveIndicator(permanentActive);
 buttons.forEach(b => b.classList.remove('active', 'hovered'));
 permanentActive.classList.add('active');
 });

 buttons.forEach((btn) => {
 btn.addEventListener('click', (e) => {
 this._switchToTab(e.target);
 });
 });
         attachScrollListener(this.shadowRoot, 'scroll-to-top', 1500);

 }
}

customElements.define('tab-slider', TabSlider);
