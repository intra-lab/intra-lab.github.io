class InfoPageCard extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['title', 'caption', 'image', 'imageAlt', 'text', 'animation'];
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
        // const title = this.getAttribute('title') || 'Default Title';
        const caption = this.getAttribute('caption') || 'Default Subtitle';
        const image = this.getAttribute('image');
        const imageAlt = this.getAttribute('imageAlt') || 'View Project';
        const text = this.getAttribute('text') || '';
                const animation = this.getAttribute('animation') || 'View Project';

    const isAnimationEnabled = animation === 'enabled';

        this.shadowRoot.innerHTML = `
            <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                                        font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;

            }

            :host {
              flex: 1;
}
            
            .image-container {
                perspective: 1200px;
                display: inline-block;
                transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
                transform-style: preserve-3d;
                
            }

            img {
                width: 100%;
                border-radius: 1rem;
                border: 0.5rem solid var(--card-color-primary-patch);
                padding: 0.075rem;
                background-color: var(--card-border-primary);
                outline: 0.075rem solid var(--card-border-secondary);
                box-shadow: 0 4px 8px var(--close-shadow), 0 16px 32px var(--far-shadow);
                transform-style: preserve-3d;
                transform: rotateX(0deg) rotateY(0deg) scale(1);
                transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1), box-shadow 0.8s ease;
                user-select: none;
                -webkit-user-drag: none; 
            }

            .image-container:hover {
                transform: scale(1.04);
            }

            .image-container.animation-enabled:hover img {
                animation: perfectCircle3D 6s infinite linear;
                box-shadow: 0 25px 50px rgba(0, 0, 0, 0.18);
            }

            @keyframes perfectCircle3D {
                0% { transform: rotateX(6deg) rotateY(0deg); }
                25% { transform: rotateX(0deg) rotateY(6deg); }
                50% { transform: rotateX(-6deg) rotateY(0deg); }
                75% { transform: rotateX(0deg) rotateY(-6deg); }
                100% { transform: rotateX(6deg) rotateY(0deg); }
            }

            figcaption {
                opacity: 0.33;
                font-size: 0.66rem;
                margin-bottom: 1rem;
                padding: 0.25rem 1rem 0 1rem;
            }

            p {
                padding: 0.25rem 1rem 0 1rem;
                margin: 0;
                opacity:0.5;
                font-weight:400;
                                font-size:0.75rem;

            }

            /* Trigger the 1-second flash animation on hover */
            .image-container:hover {
                animation: whiteFlash 1s ease-out;
            }

            /* The Flash Animation */
            @keyframes whiteFlash {
                0% {
                    filter: brightness(1) saturate(1);
                }
                10% {
                    filter: brightness(1.2) saturate(1.2);
                }
                100% {
                    filter: brightness(1) saturate(1);
                }
            }

            @media (min-width: 768px) {
                div {
                    align-self: center;
                }

                .info-card-container {
                    flex-direction: row;
                    gap: 2rem;
                }
            }
            </style>

            <div class="info-card-container">
             ${image ? `

                <figure>
                    <div class="image-container ${isAnimationEnabled ? 'animation-enabled' : ''}">
                        <img class="info-image" src="${image}" alt="${imageAlt}">
                    </div>
                    <figcaption>${caption}</figcaption>
                </figure>
                 ` : ''}

                <p>${text}</p>
            </div>
        `;
    }
}

customElements.define('info-page-card', InfoPageCard);
