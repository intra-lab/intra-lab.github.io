import { DEFAULT_IMAGES, DEFAULT_ALTS } from '../../shared-assets.js';

class ProjectHeadings extends HTMLElement {
 constructor() {
 super();
 this.attachShadow({ mode: 'open' });
 }
 static get observedAttributes() {
 return ['title', 'desc', 'image'];
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
 const title = this.getAttribute('title') || 'Default Title';
 const desc = this.getAttribute('desc') || 'Default Subtitle';
 const image = this.getAttribute('image') || DEFAULT_IMAGES.errorimage;;
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
 flex-direction: column;
 align-items: center;
 }
 .project-title {
 font-size: 5rem;
 padding-bottom: 0rem;
 padding-top: 4rem;
 text-align:center;
 font-weight:500;
  background: linear-gradient( to bottom,
  var(--text-color-primary) 80%,      /* Start at beginning */
  #88888816 100%     /* End at finish */
);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
   font-size: 6vw; /* Adjust value until it fits */
  white-space: nowrap;
  
 }
 .project-desc {
 font-size: 1rem;
 opacity: 0.5;
  font-weight:500;

 }
 .project-hero {
 width: 100%;
 margin-top: 4rem;
 border-radius: 1rem;
 user-select: none;
 -webkit-user-drag: none; 
 }
   @media (max-width: 768px) {

 .project-title {
    font-size: 8vw; /* Adjust value until it fits */
background: none;
color: var(--text-color-primary);
 
 }
 }
 </style>
 <h1 class="project-title">${title}</h1>
 <p class="project-desc">${desc}</p>
 <img class="project-hero" src="${image}" draggable="false" alt="${title} preview">
 `;
 }
}
customElements.define('project-headings', ProjectHeadings);
