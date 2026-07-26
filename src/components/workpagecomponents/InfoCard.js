import { DEFAULT_IMAGES, DEFAULT_ALTS } from '../../shared-assets.js';

class InfoCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['title', 'desc', 'icon', 'iconAlt'];
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
        const title = this.getAttribute('title') || 'Default Subtitle';
        const desc = this.getAttribute('desc') || 'Default Subtitle';
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
            flex-direction: column;
            border: 1px solid var(--card-border-secondary);
            border-radius: 1rem;
            padding: 1.75rem !important;
            gap: 1rem;
            width: 100%;
            box-shadow: 0 4px 8px var(--close-shadow), 0 16px 32px var(--far-shadow);
     background-color:var(--card-color-primary);
            }

        .info-card-text {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .info-card-title {
            font-weight: 600;
                        font-size: 1rem;

        }

        .info-card-desc {
            font-size: 0.75rem;
                        font-weight: 500;

            opacity: 0.5;
        }

        .info-card-icon {
            width: 2.5rem;
            user-select: none;
            -webkit-user-drag: none; 
        }
        </style>

        <div class="info-card-icon"  alt="${iconAlt}">${icon}</div>
        <div class="info-card-text">
            <p class="info-card-title">${title}</p>
            <p class="info-card-desc">${desc}</p>
        </div>
        `;
    }
}

customElements.define('info-card', InfoCard);
