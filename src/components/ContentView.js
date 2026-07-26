class ContentView extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
  }

  connectedCallback() {
    const active = this.hasAttribute('active');

    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: ${active ? 'flex' : 'none'};
          width: 100%;
          min-height: calc(100vh - 70px); /* Fill the screen below navbar */
          animation: pageFadeIn 0.4s ease-out forwards;
                                  font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;

        }

        .page-wrapper {
          max-width: 1200px;
          margin: 0 auto;
          box-sizing: border-box;
        
        }

                @media (min-width: 768px) {
                        .page-wrapper {

          padding: 1rem;
  }
  }
        @keyframes pageFadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
      </style>
      <div class="page-wrapper">
        <slot></slot> </div>
    `;
  }

  show() { this.style.display = 'flex'; }
  hide() { this.style.display = 'none'; }
}
customElements.define('content-view', ContentView);