class EmailContact extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['email'];
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
        const email = this.getAttribute('email') || 'Default Subtitle';

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
                gap: 0.5rem;
            }

            .email-box {
                display: flex;
                flex-direction: row;
                background-color: var(--card-color-primary);
                border: 1px solid var(--card-border-secondary);
                border-radius: 0.5rem;
            }

            .email-text {
                display: flex;
                flex-direction: row;
                align-items: center;
                font-weight:400;
            }

            .email-box p {
                padding: 0.5rem;
                font-size: 0.8rem;
                opacity: 0.5;
                color: var(--text-color-primary);
            }

            .copy-button {
                display: flex;
                flex-direction: row;
                align-items: center;
                padding: 0.5rem;
                border: none;
                background-color: transparent;
                cursor: pointer;
                border-left: 1px solid var(--card-border-secondary);
                position: relative;
            }

            .copy-icon {
                width: 1rem;
                padding: 0.05rem;
                opacity: 0.5;
                transition: opacity 0.3s ease-in-out;
stroke:       var(--text-color-primary);  
  transform: scaleY(-1);
    transform: scaleX(-1);

    }

            .mailto-button {
                display: flex;
                flex-direction: row;
                align-items: center;
                gap: 0.4rem;
                background-color: var(--text-color-primary);
                border: 1px solid var(--card-border-primary);
                padding: 0.5rem;
                border-radius: 0.5rem;
                text-decoration: none;
                color: var(--bg-color);
                font-weight: 700;
                font-size: 0.75rem;
                transition: filter 0.3s ease;
            }

            .mailto-icon {
                width: 1rem;
                filter: brightness(var(--icon-brightness-negative));
            }

            .tooltip {
                position: absolute;
                transform: translateX(-150%) translateY(-100%);
                background-color: var(--card-color-primary-patch);
                color: var(--text-color-primary);
                padding: 6px 12px;
                border-radius: 4px;
                font-size: 12px;
                opacity: 0;
                pointer-events: none;
                transition: all 0.2s ease-in-out;
            }

            .tooltip::after {
                content: "";
                position: absolute;
                top: 100%;
                left: 50%;
                margin-left: -5px;
                border-width: 5px;
                border-style: solid;
                border-color: var(--card-color-primary-patch) transparent transparent transparent;
            }

            .copy-button.show-tooltip .tooltip {
                opacity: 1;
                transform: translateX(-150%) translateY(-150%);
            }

            .copy-button:hover .copy-icon {
                opacity: 1;
            }

            .mailto-button:hover {
                filter: brightness(0.5);
            }
            </style>

            <div class="email-box">
                <div class="email-text">
                    <p>${email}</p>
                </div>

                <button class="copy-button" id="copy-button" data-email="${email}">
                <svg  class="copy-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 8.25V6a2.25 2.25 0 0 0-2.25-2.25H6A2.25 2.25 0 0 0 3.75 6v8.25A2.25 2.25 0 0 0 6 16.5h2.25m8.25-8.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-7.5A2.25 2.25 0 0 1 8.25 18v-1.5m8.25-8.25h-6a2.25 2.25 0 0 0-2.25 2.25v6" />
</svg>

                    <span class="tooltip" id="tooltip">Copied!</span>
                </button>
            </div>

            <a href="mailto:${email}" class="mailto-button">
                <p>Contact</p>
                <svg class="mailto-icon" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 343.438 345.469">
 <g>
  <rect height="345.469" opacity="0" width="343.438" x="0" y="0"/>
  <path d="M195.625 345.469C206.875 345.469 214.844 335.781 220.625 320.781L322.969 53.4375C325.781 46.25 327.344 39.8438 327.344 34.5312C327.344 24.375 321.094 18.125 310.938 18.125C305.625 18.125 299.219 19.6875 292.031 22.5L23.2812 125.469C10.1562 130.469 0 138.438 0 149.844C0 164.219 10.9375 169.062 25.9375 173.594L138.75 206.719L171.562 318.125C176.25 333.906 181.094 345.469 195.625 345.469ZM145.781 182.969L37.9688 150C35.4688 149.219 34.6875 148.594 34.6875 147.5C34.6875 146.406 35.3125 145.625 37.6562 144.688L248.906 64.6875C261.406 60 273.438 53.75 285 48.4375C274.688 56.875 261.875 66.875 253.281 75.4688ZM198.125 311.094C196.875 311.094 196.25 310 195.469 307.5L162.5 199.688L270 92.1875C278.438 83.75 288.906 70.625 297.188 60C291.875 71.875 285.469 83.9062 280.781 96.5625L200.781 307.812C199.844 310.156 199.219 311.094 198.125 311.094Z" fill="white" fill-opacity="0.85"/>
 </g>
</svg>
            </a>
        `;

        // Re-attach event listeners after DOM is rebuilt
        this.attachEventListeners();
    }

    attachEventListeners() {
        const copyBtn = this.shadowRoot.querySelector('#copy-button');
        
        if (copyBtn) {
            const emailToCopy = copyBtn.getAttribute('data-email');

            copyBtn.addEventListener('click', () => {
                navigator.clipboard.writeText(emailToCopy).then(() => {
                    copyBtn.classList.add('show-tooltip');
                    
                    setTimeout(() => {
                        copyBtn.classList.remove('show-tooltip');
                    }, 2000);
                }).catch(err => {
                    console.error('Failed to copy text: ', err);
                });
            });
        }
    }
}

customElements.define('email-contact', EmailContact);
