import { DEFAULT_VIDEOS, DEFAULT_ALTS } from '../../shared-assets.js';

class VideoPlayer extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['desc', 'videosrc'];
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
        const videosrc = this.getAttribute('videosrc') || DEFAULT_VIDEOS.errorvideo;
        this.shadowRoot.innerHTML = `
 <style>
 * {
     margin: 0;
     padding: 0;
     box-sizing: border-box;
     font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
 }
 :host {
     width: 90%;
 }
 .video-wrapper {
    position: relative;
    display: inline-block;
    cursor: pointer;
    overflow: hidden;
    line-height: 0;                          /* ← eliminates descender gap */
    transition: transform 0.3s ease, border-color 0.3s ease;
    border-radius: 1rem;
    border: 0.5rem solid var(--card-color-primary-patch);
    padding: 0.075rem;
    background-color: var(--card-border-primary);
    outline: 0.075rem solid var(--card-border-secondary);
    box-shadow: 0 4px 8px var(--close-shadow), 0 16px 32px var(--far-shadow);
}
    .video-wrapper video {
    width: 100%;
    display: block;
    vertical-align: top;                     /* ← belt-and-suspenders with display:block */
    outline: none;
    border-radius: 0.5rem;
}
 .video-wrapper:hover {
     transform: scale(1.05);
 }
 .video-controls {
     position: absolute;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     overflow: visible;
     z-index: 10;
     pointer-events: none;
 }

 /* ── Button base state: resting at bottom, hidden ─────────────── */
 .video-controls button {
     position: absolute;
     top: 100%;
     left: 50%;
     transform: translate(-50%, -50%) scale(1);
     margin: 0;
     background: transparent;
     border: none;
     border-radius: 4px;
     pointer-events: none;
     opacity: 0;
     transition: top 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                 left 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                 transform 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                 opacity 0.3s ease;
     will-change: transform, opacity, top, left;
 }

 /* Suppress transitions during scroll-triggered auto play/pause */
 .video-controls button.no-transition {
     transition: none !important;
 }

 /* ── Hovering + playing: button rises to centre ──────────────── */
 .video-wrapper:hover .video-controls button:not(.paused) {
     opacity: 1;
     top: 50%;
     left: 50%;
     transform: translate(-50%, -50%) scale(1.2);
 }

 /* ── Paused: button moves to top-left corner ──────────────────── */
 /* Visible even when not hovering so user knows video is paused   */
 .video-controls button.paused {
     opacity: 1;
     top: 5%;
     left: 2%;
     transform: translate(0, 0) scale(1);
 }

 /* Hovering + paused: slight scale-up */
 .video-wrapper:hover .video-controls button.paused {
     opacity: 1;
     transform: translate(0, 0) scale(1.2);
 }

 /* ── Touch devices: no hover, hide play button while playing ── */
 @media (pointer: coarse) {
     .video-wrapper:hover .video-controls button:not(.paused) {
         opacity: 0;
     }
 }

 .pause-icon {
     width: 5rem;
     display: block;
     filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.5));
     transition: all 0.3s ease-in-out;
 }

 /* Shimmer sweep effect */
 .video-wrapper::after {
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
     pointer-events: none;
 }
 .video-wrapper:hover::after {
     left: 150%;
     transition: left 0.8s ease-in-out;
     width: 350%;
 }

 .video-desc {
     opacity: 0.33;
     font-size: 0.66rem;
     margin-bottom: 1rem;
     padding: 0.5rem 1.5rem 0 1rem;
     text-align: left;
 }

 @media (max-width: 768px) {
     .pause-icon {
         width: 2rem;
     }
     .video-wrapper:hover .video-controls button:not(.paused) {
         transform: translate(-50%, -50%) scale(1);
     }
     .video-wrapper:hover .video-controls button.paused {
         transform: translate(0, 0) scale(1);
     }
 }
 </style>
 <div class="video-wrapper" id="videoWrapper">
     <video id="myVideo" autoplay muted loop playsinline>
         <source src="${videosrc}" type="video/mp4">
     </video>
     <div class="video-controls">
         <button id="pauseBtn" tabindex="-1" aria-hidden="true">
             <svg class="pause-icon icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                 <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
             </svg>
         </button>
     </div>
 </div>
 <p class="video-desc">${desc}</p>
 `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        const video = this.shadowRoot.querySelector('#myVideo');
        const videoWrapper = this.shadowRoot.querySelector('#videoWrapper');
        const pauseBtn = this.shadowRoot.querySelector('#pauseBtn');

        if (!video || !videoWrapper || !pauseBtn) {
            return;
        }

        const img = pauseBtn.querySelector('path');
        if (!img) {
            return;
        }

        // Remove old listeners first
        if (this._boundTogglePlayback) {
            videoWrapper.removeEventListener('click', this._boundTogglePlayback);
            pauseBtn.removeEventListener('click', this._boundTogglePlayback);
            video.removeEventListener('play', this._boundUpdatePauseIcon);
            video.removeEventListener('pause', this._boundUpdatePauseIcon);
        }

        const PLAY_ICON = 'M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z';
        const PAUSE_ICON = 'M6.75 5.25a.75.75 0 0 1 .75-.75H9a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H7.5a.75.75 0 0 1-.75-.75V5.25Zm7.5 0A.75.75 0 0 1 15 4.5h1.5a.75.75 0 0 1 .75.75v13.5a.75.75 0 0 1-.75.75H15a.75.75 0 0 1-.75-.75V5.25Z';

        const updatePauseIcon = () => {
            if (!video || !img) return;

            /*
             * When the state change is triggered by the browser (e.g. scroll
             * auto-play / auto-pause) the cursor is NOT hovering. We suppress
             * the CSS transition so the button jumps instantly to its new
             * position instead of visibly sliding across the video.
             */
            const isHovered = videoWrapper.matches(':hover');

            if (!isHovered) {
                pauseBtn.classList.add('no-transition');
            }

            if (video.paused) {
                pauseBtn.classList.add('paused');
                img.setAttribute('d', PAUSE_ICON);
                pauseBtn.setAttribute('aria-label', 'Play');
            } else {
                pauseBtn.classList.remove('paused');
                img.setAttribute('d', PLAY_ICON);
                pauseBtn.setAttribute('aria-label', 'Pause');
            }

            if (!isHovered) {
                // Re-enable transitions after the browser commits the change
                requestAnimationFrame(() => {
                    requestAnimationFrame(() => {
                        pauseBtn.classList.remove('no-transition');
                    });
                });
            }
        };

        const togglePlayback = (e) => {
            e?.stopPropagation();
            if (video.paused) {
                video.play().catch(err => console.error('Play failed:', err));
            } else {
                video.pause();
            }
        };

        this._boundTogglePlayback = togglePlayback;
        this._boundUpdatePauseIcon = updatePauseIcon;

        videoWrapper.addEventListener('click', this._boundTogglePlayback);
        pauseBtn.addEventListener('click', this._boundTogglePlayback);
        video.addEventListener('play', this._boundUpdatePauseIcon);
        video.addEventListener('pause', this._boundUpdatePauseIcon);

        updatePauseIcon();
    }

    disconnectedCallback() {
        if (this._boundTogglePlayback) {
            const videoWrapper = this.shadowRoot.querySelector('#videoWrapper');
            const pauseBtn = this.shadowRoot.querySelector('#pauseBtn');
            const video = this.shadowRoot.querySelector('#myVideo');

            videoWrapper?.removeEventListener('click', this._boundTogglePlayback);
            pauseBtn?.removeEventListener('click', this._boundTogglePlayback);
            video?.removeEventListener('play', this._boundUpdatePauseIcon);
            video?.removeEventListener('pause', this._boundUpdatePauseIcon);

            this._boundTogglePlayback = null;
            this._boundUpdatePauseIcon = null;
        }
    }
}

customElements.define('video-player', VideoPlayer);