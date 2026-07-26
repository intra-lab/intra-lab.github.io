import { smoothScrollToTop, attachScrollListener } from '../scroll-utils.js';
import { DEFAULT_IMAGES, DEFAULT_ALTS } from '../shared-assets.js';

class WorkCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    // Tell the browser to watch these attributes for changes
    static get observedAttributes() {
        return ['title', 'subtitle', 'image', 'aria-label', 'glow-color'];
    }

    connectedCallback() {
        // Initial render when element connects to DOM
        this.render();
    }

    // This fires whenever an observed attribute changes
    attributeChangedCallback(name, oldValue, newValue) {
        // Only re-render if the element is already connected
        if (this.isConnected) {
            this.render();
        }
    }

    render() {
        // Read attributes each time we render
        const title = this.getAttribute('title') || 'Default Title';
        const subtitle = this.getAttribute('subtitle') || 'Default Subtitle';
        const image = this.getAttribute('image') || DEFAULT_IMAGES.errorimage;
        const ariaLabel = this.getAttribute('aria-label') || 'View Project';
        const glowColor = this.getAttribute('glow-color') || 'View Project';

        // Build the shadow DOM
        this.shadowRoot.innerHTML = `
            <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                                        font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;

            }
            
            @property --spotlight-color {
              syntax: '<color>';
              inherits: false;
              initial-value: transparent;
            }

            .work-card {
                background: var(--card-color-primary);
                border-radius: 1.5rem;
                box-shadow: 0 4px 8px var(--close-shadow), 0 16px 32px var(--far-shadow);
                display: flex;
                flex-direction: column;
                cursor: pointer;
                box-sizing: border-box; 
                max-height: 32rem;
                z-index: 1;
                padding: 0.5rem; 
                justify-content: space-between; 
                text-align: left;
                color: var(--text-color-primary);
                border: none;
                width: 100%;
                border: 1px solid var(--card-border-secondary);
                backdrop-filter: blur(10px);
                -webkit-backdrop-filter: blur(10px);
                transition: color 0.3s ease;
            }

            .work-card-container {
                display: flex;
                flex-direction: column;
                gap: 2rem;
                border: 1px solid var(--card-border-primary);
                transition: border-color 0.3s ease;
                padding: 1.5rem 1.5rem 0 1.5rem; 
                border-radius: 1rem;
                overflow: hidden;
                position: relative;
                background: linear-gradient(to bottom, hsla(0, 0%, 12%, 0.00) 50%, var(--card-shadow) 100%);
            }

            .work-card-container::after {
                content: "";
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: -1; 
                background-image: radial-gradient(
                    circle 100vw at 50% -8vw,
                    ${glowColor} 0%,
                    transparent 80%
                );
                opacity: 0; 
                transition: opacity 0.3s ease;
            }

            .work-card-top {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                font-weight: 200;
                animation: pageFadeIn 0.6s ease-out forwards;
                animation-delay: calc(0.4s + (var(--child-index) * 0.2s));
            }

            .work-card h1 {
                            font-weight: 500;
                font-size: 1.5rem;
}
                 .work-card h2 {
                            font-weight: 400;
                font-size: 0.75rem;
                margin-top:0rem;
}
            @keyframes pageFadeIn {
                from { opacity: 0; transform: translateY(32px); }
                to { opacity: 1; transform: translateY(0); }
            }

            .work-card-text {
                display: flex;
                flex-direction: column;
                gap: 0.25rem;
            }

            .work-card-arrow {
    position: relative;
    display: flex;
    align-items: center;
    flex-direction: row-reverse;
    margin-right: 1rem;
    overflow: visible;
    transition: filter 0.3s ease-in-out;
    filter: brightness(var(--icon-brightness));
}

            #work-card-arrow-icon {
                transition: transform 0.3s ease-in-out;
                max-width: 2rem;
                user-select: none;
                -webkit-user-drag: none; 
            }

         .arrow-text {
    position: absolute;
    right: 3rem;
    white-space: nowrap;
    opacity: 0;
    transform: translateX(10px);
    pointer-events: none;
    transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
    font-weight: 400;
    font-size:0.75rem;
}

            .work-card-image {
                width: 90%;
                align-self: center;
                height: auto;
                object-fit: cover;
                display: block;
                transition: transform 0.3s ease;
                margin-bottom: -15%;
                // border-radius: 1rem;
                user-select: none;
                -webkit-user-drag: none; 
            }

            h2 {
                opacity: 0.5;
            }

            @media (min-width: 768px) {
                .work-card-container {
                    padding: 2rem 2rem 0 2rem; 
                }

                .work-card-arrow {
                    padding-right: 1rem;
                }
                #work-card-arrow-icon {

                                width:2rem;
    }
                .work-card-container:hover::after {
                    opacity: 1;
                }

                .work-card:hover .work-card-container {
                    border: 1px solid var(--card-border-highlight);
                }

              .work-card:hover .arrow-text {
    opacity: 0.5;
    transform: translateX(0);
}

                .work-card:hover #work-card-arrow-icon {
                    transform: translateX(15px);
                }

                .work-card:hover .work-card-image {
                    transform: translateY(-1vw);
                }
            }

            @media (max-width: 768px) {
                #work-card-arrow-icon {
                    width: 1.25rem;
                }

                .work-card-arrow {
                    width: 2rem;
                }

                .work-card-container::after {
                    opacity: 1;
                }

                .work-card-container {
                    border: 1px solid var(--card-border-highlight);
                }

                .work-card-image {
                    transform: translateY(-1vw);
                }
            }
            </style>

            <button class="work-card scroll-to-top" aria-label="${ariaLabel}">
                <div class="work-card-container">
                    <div class="work-card-top">
                        <div class="work-card-text">
                            <h1>${title}</h1>
                            <h2>${subtitle}</h2>
                        </div>
                        <div class="work-card-arrow">
                        <svg id="work-card-arrow-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6">
  <path fill-rule="evenodd" d="M12.97 3.97a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 1 1-1.06-1.06l6.22-6.22H3a.75.75 0 0 1 0-1.5h16.19l-6.22-6.22a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
</svg>

                            <span class="arrow-text">View Project</span>
                        </div>
                    </div>
                    <img class="work-card-image" src="${image}" alt="${title} preview">
                </div>
            </button>
        `;

        // Re-attach event listeners after DOM is rebuilt
        this.attachEventListeners();
    }

    attachEventListeners() {
        const cardButton = this.shadowRoot.querySelector('.work-card');
        
        if (cardButton) {
            // Remove old listener to avoid duplicates
            cardButton.replaceWith(cardButton.cloneNode(true));
            const newButton = this.shadowRoot.querySelector('.work-card');
            
            newButton.addEventListener('click', () => {
                const title = this.getAttribute('title') || 'Untitled';
                this.dispatchEvent(new CustomEvent('card-clicked', {
                    bubbles: true,
                    composed: true,
                    detail: { title: title }
                }));
            });

            attachScrollListener(this.shadowRoot, 'scroll-to-top', 1500);
        }
    }
}

customElements.define('work-card', WorkCard);
