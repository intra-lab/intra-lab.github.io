import './EmailContact.js';
import { smoothScrollToTop, attachScrollListener } from '../scroll-utils.js';

class MyFooter extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['heading1', 'heading2', 'shortcut1', 'shortcut2', 'datatarget1', 'datatarget2', 'email', 'bottom-text'];
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
        const heading1 = this.getAttribute('heading1') || 'Default Subtitle';
        const heading2 = this.getAttribute('heading2') || 'Default Subtitle';
        const shortcut1 = this.getAttribute('shortcut1') || 'Default Subtitle';
        const shortcut2 = this.getAttribute('shortcut2') || 'Default Subtitle';
        const datatarget1 = this.getAttribute('datatarget1') || 'Default Subtitle';
        const datatarget2 = this.getAttribute('datatarget2') || 'Default Subtitle';
        const email = this.getAttribute('email') || 'Default Subtitle';
        const bottomtext = this.getAttribute('bottom-text') || 'Default Subtitle';

        this.shadowRoot.innerHTML = `
            <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                                        font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;

            }

            
            /* Base Footer Styling */

            /* Flexbox Container for Columns */
            .footer-container {
                margin: 0 auto;
                display: flex;
                justify-content: space-between;
                flex-wrap: wrap;
                gap: 30px;
                width: 90%;
                
            }

            /* Individual Columns */
            .footer-column {
                flex: 1;
                min-width: 200px;
            }

            .footer-column h3, 
            .footer-column h4 {
                color: var(--text-color-secondary);
                margin-bottom: 15px;
                font-size: 0.5rem;
                opacity: 0.75;
                font-weight: 700;
            }

            .footer-column h4 {
                            margin-bottom: 10px;
}

            .footer-column ul {
            display:flex;
            flex-direction:column;
                list-style: none;
                padding: 0;
                margin: 0;
                gap:0.5rem;
            }

           

            .footer-column ul a {
                color: var(--text-color-primary);
                cursor: pointer;
                text-decoration: none;
                transition: color 0.2s ease, opacity 0.3s ease;
                opacity: 0.75;
                font-weight:400;
            }

            .footer-column ul a:hover {
                opacity: 1;
            }

            .footer-column :has(ul a:hover) ul a:not(:hover) {
                opacity: 0.5;
                color: #999;
            }

            /* Bottom Copyright Bar */
            .footer-bottom {
                max-width: 1200px;
                margin: 40px auto 0;
                padding-top: 20px;
                border-top: 1px solid var(--card-border-secondary);
                display: flex;
                justify-content: center;
                flex-wrap: wrap;
                gap: 15px;
                font-size: 14px;
                color: var(--text-color-secondary);
            }

            /* Mobile Responsiveness */
            @media (max-width: 768px) {
                .footer-container {
                    flex-direction: column;
                }
                
                .footer-bottom {
                    flex-direction: column;
                    text-align: center;
                    padding-top: 10px;
                    margin: 60px auto 0;
                }
            }

            @media (min-width: 768px) {
                .footer-column {
                    width: 60%;
                    display: flex;
                    justify-content: center;
                }
            }
                .footer-image {
                width:12rem;
                align-self:center;
                user-select: none;
                -webkit-user-drag: none;
                    filter: brightness(var(--icon-brightness));

                }
            </style>

            <div class="footer-container">

                <!-- Column 1: Quick Links -->
                <div class="footer-column">
                    <div class="footer-text">
                        <h4>${heading1}</h4>
                        <ul>
                            <li><a class="tab-shortcut scroll-to-top" data-target="${datatarget1}">${shortcut1}</a></li>
                            <li><a class="tab-shortcut scroll-to-top" data-target="${datatarget2}">${shortcut2}</a></li>
                        </ul>
                    </div>
                </div>

                <!-- Column 2: Company -->
                <div class="footer-column">
                    <div class="footer-text">
                        <h4>${heading2}</h4>
                        <email-contact id="email-contact" email="${email}">
                        </email-contact>
                    </div>
                </div>

            </div>

            <!-- Bottom Bar: Copyright & Legal -->
            <div class="footer-bottom">
                         <img class="  footer-image " src="data:image/png;base64,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">

            </div>
        `;

        // Re-attach event listeners after DOM is rebuilt
        this.attachEventListeners();
    }

    attachEventListeners() {
        const shortcuts = this.shadowRoot.querySelectorAll('.tab-shortcut');

        shortcuts.forEach(shortcut => {
            shortcut.addEventListener('click', (event) => {
                const targetId = event.currentTarget.dataset.target;

                // Find the tab slider in the light DOM (outside shadow DOM)
                const navbar = document.querySelector('my-navbar');
                const slider = navbar ? navbar.shadowRoot.querySelector('tab-slider') : document.querySelector('tab-slider');

                if (slider) {
                    slider.setActiveTab(targetId);
                } else {
                    console.warn('Tab slider component not found.');
                }
            });
        });

        attachScrollListener(this.shadowRoot, 'scroll-to-top', 1500);
    }
}

customElements.define('my-footer', MyFooter);
