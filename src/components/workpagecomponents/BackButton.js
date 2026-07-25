import { smoothScrollToTop, attachScrollListener } from '../../scroll-utils.js';

class BackButton extends HTMLElement {
    constructor() {
        super();
        // Attach a shadow DOM to encapsulate styles and structure
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        // Read attributes passed to the component (with fallbacks)


        // Render the internal HTML structure and scoped styles
        this.shadowRoot.innerHTML = `
      <style>
      * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
                                    font-family:system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;

        }
     

        .back-btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            background-color: var(--glass-color-primary);
            cursor: pointer;
            border-radius: 2rem;
            border: 1px solid var(--glass-border-primary);
            color: var(--text-color-primary);
            padding: 0.75rem 1.25rem;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            /* For Safari support */
            align-self: flex-start;
            font-weight: 300;
                        font-size: 0.9rem;

            transition: background-color 0.3s ease, border-color 0.3s ease;


              position: fixed;
  top: 8rem;
  left: calc(50% - 400px); /* 800px / 2 = 400px */
  /* OR top/left depending on where you want it */
  z-index: 1000;
        }

        .back-btn svg {
            width: 1rem;
            transition: transform 0.3s ease,filter 0.3s ease-in-out;
              user-select: none;
  -webkit-user-drag: none; 
;
            
                              filter: brightness(var(--icon-brightness));

        }

        .back-btn:hover svg {
            transform: translateX(-2px);
        }

        .back-btn:hover {
            background-color: var(--glass-color-secondary);
            border-color: var(--glass-border-secondary);
        }



@media (max-width: 800px) {

          .back-btn {
left: 1rem;
          }
        }


      </style>

    <button class="back-btn hidden scroll-to-top" id="global-back-btn">
    <svg id="work-card-arrow-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
</svg>

                    Back</button>
    `;

        // Find the button inside the Shadow DOM
        const cardButton = this.shadowRoot.querySelector('.back-btn');

        // Listen for a click inside the component
        cardButton.addEventListener('click', () => {
            // Dispatch a custom event that bubbles up to the main page
            this.dispatchEvent(new CustomEvent('card-clicked', {
                bubbles: true,      // Allows the event to travel up the DOM tree
                composed: true,     // Allows the event to cross the Shadow DOM boundary
                // detail: { title: title } // Optional: pass along data about which card was clicked
            }));
        });

        attachScrollListener(this.shadowRoot, 'scroll-to-top', 1500);

    }
}

// Register the custom element
customElements.define('back-button', BackButton);