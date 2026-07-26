import { DEFAULT_IMAGES, DEFAULT_ALTS } from '../../shared-assets.js';

class ImageSlider extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['desc', 'image1', 'image1Alt', 'image2', 'image2Alt'];
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
        const desc = this.getAttribute('desc') || 'Default Subtitle';
const image1 = this.getAttribute('image1') || DEFAULT_IMAGES.errorimage;
        const image1Alt = this.getAttribute('image1Alt') || 'View Project';
const image2 = this.getAttribute('image2') || DEFAULT_IMAGES.errorimage;
        const image2Alt = this.getAttribute('image2Alt') || 'View Project';

        this.shadowRoot.innerHTML = `
        <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
                                    font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;

        }
        
        :host {
            width: 90%;
        }
        
        .slider-container {
            position: relative;
            max-width: 800px;
            // aspect-ratio: 16 / 9;
            overflow: hidden;
            user-select: none;
            container-type: inline-size; 
            transition: transform 0.3s ease, border-color 0.3s ease;
            border-radius: 1rem;
            border: 1px solid var(--card-border-secondary);
            box-shadow: 0 4px 8px var(--close-shadow), 0 16px 32px var(--far-shadow);
            border: 0.5rem solid var(--card-color-primary-patch);
            padding: 0.075rem;
            background-color: #0f0f1a;
            outline: 0.075rem solid var(--card-border-secondary);
        }

        .slider-container img {
          display: block;

            top: 0;
            left: 0;
            width: 100%;
            height: auto;
            object-fit: contain;
        }

        .image-after-wrap {
            position: absolute;
            top: 0;
            left: 0;
            width: 50%;
            height: 100%;
            overflow: hidden;
        }

        .image-after-wrap img {
            width: 100cqw !important;
            max-width: none !important;
        }

        .slider-handle {
            position: absolute;
            top: 0;
            left: 50%; 
            width: 4px;
            height: 100%; 
            background: var(--image-slider-primary);
            box-shadow: 0 0 10px rgba(0,0,0,0.3);
            transform: translateX(-50%);
            pointer-events: none; 
            z-index: 5;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: transform 0.3s ease, background-color 0.3s ease;
        }

        .slider-handle::before {
            content: '';
            position: absolute;
            width: 44px;
            height: 44px;
            background: var(--image-slider-primary);
            border-radius: 50%;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            z-index: 5;
            transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease-in-out, background-color 0.3s ease;
            box-shadow: 0 4px 8px var(--close-shadow), 0 16px 32px var(--far-shadow);
        }

        .arrow-left, .arrow-right {
            position: relative;
            width: 14px !important;  
            height: 14px !important; 
            min-width: 14px;
            min-height: 14px;
            background-repeat: no-repeat;
            background-position: center;
            background-size: contain;
            z-index: 10;
            transition: translate 0.3s ease, transform 0.3s ease;
        }
.arrow-left {
    margin-right: 2px;
    filter: brightness(0);
    
    /* Add these properties for the SVG */
    width: 24px;
    height: 24px;
    display: block;
}

.arrow-right {
    margin-left: 2px;
    filter: brightness(0);
    
    /* Add these properties for the SVG */
    width: 24px;
    height: 24px;
    display: block;
}

        .slider {
            position: absolute;
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 100%;
            background: transparent;
            outline: none;
            margin: 0;
            top: 0;
            left: 0;
            cursor: ew-resize;
            z-index: 10;
        }

        .slider::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 40px;
            height: 40px;
            background: transparent;
        }

        .slider::-moz-range-thumb {
            width: 40px;
            height: 40px;
            background: transparent;
            border: none;
        }

        .slider-container:hover {
            transform: scale(1.05);
        }

        .slider-container:hover .slider-handle {
            transform: scale(1.5);
        }

        .slider-container:hover .arrow-left {
            translate: 0.25rem;
            transform: scale(1.1);
        }

        .slider-container:hover .arrow-right {
            translate: -0.25rem;
            transform: scale(1.1);
        }

        .slider-container::after {
            content: '';
            position: absolute;
            top: 0;
            left: -150%;
            width: 150%;
            height: 100%;
            background: linear-gradient(
                to right, 
                rgba(255, 255, 255, 0) 0%, 
                rgba(255, 255, 255, 0.05) 50%, 
                rgba(255, 255, 255, 0) 100%
            );
            transform: skewX(-25deg); 
        }

        .slider-container:hover::after {
            left: 150%;
            transition: left 0.8s ease-in-out;
            width: 350%;
        }

        p {
          opacity: 0.33;
                font-size: 0.66rem;
            margin-bottom: 1rem;
            padding: 0.5rem 1.5rem 0 1rem;
            text-align: left;
        }

        .slider-container.active .slider-handle {
            background: var(--image-slider-secondary);
        }

        .slider-container.active .slider-handle::before {
            background: var(--image-slider-secondary);
        }

        .slider-container.active .arrow-left,
        .slider-container.active .arrow-right {
            filter: brightness(0.25);
        }
        </style>

        <div class="slider-container">
            <img class="image-before" src="${image1}" alt="${image1Alt}">

            <div class="image-after-wrap">
                <img class="image-after" src="${image2}" alt="${image2Alt}">
            </div>

            <div class="slider-handle">
                
    <svg class="arrow-right" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
    </svg>
     <svg class="arrow-left" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
    </svg>
            </div>

            <input type="range" min="0" max="100" value="50" class="slider">
        </div>

        <p>${desc}</p>
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        this.sliderInput = this.shadowRoot.querySelector('.slider');
        this.afterImageWrap = this.shadowRoot.querySelector('.image-after-wrap');
        this.handle = this.shadowRoot.querySelector('.slider-handle');
        this.sliderContainer = this.shadowRoot.querySelector('.slider-container');

        if (this.sliderInput) {
            this.sliderInput.addEventListener('input', () => this.updatePositions());
            this.sliderInput.addEventListener('mousedown', () => this.sliderContainer.classList.add('active'));
            this.sliderInput.addEventListener('mouseup', () => this.sliderContainer.classList.remove('active'));
            this.sliderInput.addEventListener('touchstart', () => this.sliderContainer.classList.add('active'));
            this.sliderInput.addEventListener('touchend', () => this.sliderContainer.classList.remove('active'));

            // Initial run
            this.updatePositions();
        }
    }

    updatePositions() {
        const value = this.sliderInput.value;
        this.afterImageWrap.style.width = `${value}%`;
        this.handle.style.left = `${value}%`;
    }
}

customElements.define('image-slider', ImageSlider);
