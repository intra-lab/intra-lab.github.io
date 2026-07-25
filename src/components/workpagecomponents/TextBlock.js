class TextBlock extends HTMLElement {
 constructor() {
 super();
 this.attachShadow({ mode: 'open' });
 }
 static get observedAttributes() {
 return ['title', 'desc'];
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
 const titleAttr = this.getAttribute('title');
const hasTitle = !!titleAttr?.trim();
  const title = titleAttr || '';
    this.classList.toggle('has-title', hasTitle);

  const descAttr = this.getAttribute('desc');
  const hasDesc = !!descAttr?.trim();
  const desc = descAttr || '';
    this.classList.toggle('has-desc', hasDesc);
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
 width: 60%;
 align-self: center;
 gap: 0.25rem;
 margin-bottom: -3rem !important;
 

 }
    :host(.has-title) {
        margin-top: -2rem !important;
      }

      :host(.has-desc) {
              margin-bottom: 0rem !important;
              

      }
 .text-block-title {
 font-weight: 700;
 font-size:1rem;
 }
 .text-block-desc {
 opacity: 0.5;
  font-weight: 300;
   font-size:1rem;


 }

  .text-block-title.is-default + .text-block-desc {
      margin-top:-3rem !important;
      }

     

 /* --- Mobile Responsive Layout --- */
 @media (max-width: 768px) {
 :host {
 width: 90%;
 }
 }
 </style>
 <p class="text-block-title ${hasTitle ? '' : 'is-default'}">${title}</p>
 <p class="text-block-desc ${hasDesc ? '' : 'is-default'}">${desc}</p>
 `;
 }
}
customElements.define('text-block', TextBlock);
