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
            this.splitBrandIntoLetters();

    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (this.isConnected) {
            this.render();
                this.splitBrandIntoLetters();

        }
    }

splitBrandIntoLetters() {
 const brandH2 = this.shadowRoot.querySelector('.footer-bottom p');
 if (!brandH2) return;

 const text = brandH2.textContent;
 brandH2.innerHTML = '';

 // Define which positions get special styling
 const highlightPositions = [7, 8, 10, 12, 14, 16, 18, 20, 22, 24, 26, 28, 30, 32];
 const accentPositions = [1, 6, 19, 34, 38, 45];

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




.brand-letter {
  display: inline-block;
  letter-spacing: inherit;
  font-weight: 400;
  letter-spacing: -1px;
  font-size:0.75rem;


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
  <p class="bottom-text">${bottomtext}</p>

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
