import { DEFAULT_IMAGES, DEFAULT_ALTS } from '../../shared-assets.js';

class StackBlock extends HTMLElement {
 constructor() {
 super();
 this.attachShadow({ mode: 'open' });
 }
 static get observedAttributes() {
 return ['text', 'icon', 'iconAlt'];
 }
 connectedCallback() {
 this.render();
 }
 attributeChangedCallback(name, oldValue, newValue) {
 if (this.isConnected) {
 this.render();
 }
 }
 render() {
 const text = this.getAttribute('text') || 'Default Subtitle';
 const icon = this.getAttribute('icon') || DEFAULT_IMAGES.errorimage;
 const iconAlt = this.getAttribute('iconAlt') || 'View Project';
 this.shadowRoot.innerHTML = `
 <style>
 * {
 margin: 0;
 padding: 0;
 box-sizing: border-box;
                         font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;

 }
 :host {
 display: flex;
 flex-direction: row;
 padding: 1.25rem !important;
 border-radius: 0.5rem;
 background-color: var(--card-color-primary);
 gap: 1rem;
 width: 100%;
 box-shadow: 0 4px 8px var(--close-shadow), 0 16px 32px var(--far-shadow);
 align-items: center;
 }
 .stack-block-icon {
 width: 2.5rem;
 user-select: none;
 -webkit-user-drag: none; 

 display: flex;
 justify-content: center;
 align-items: center;
    flex-shrink: 0;       
 }
 .stack-block-text {
 opacity: 0.5;
 font-weight: 400;
 font-size:1rem;
 }

 svg {
 width: 1.5rem;
 }
 </style>
 <div class="stack-block-icon" alt="${iconAlt}">${icon} </div>
 <p class="stack-block-text">${text}</p>
 `;
 }
}
customElements.define('stack-block', StackBlock);
