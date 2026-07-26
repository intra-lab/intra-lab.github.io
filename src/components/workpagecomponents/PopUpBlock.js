import { DEFAULT_IMAGES, DEFAULT_ALTS } from '../../shared-assets.js';

class PopUpBlock extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    static get observedAttributes() {
        return ['title', 'desc', 'icon', 'iconAlt', 'barcolor', 'video', 'videocaption', 'image1', 'image1caption',  'image2', 'image2caption',  'image3', 'image3caption'];
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
        const title = this.getAttribute('title') || 'Default Title';
        const desc = this.getAttribute('desc') || 'Default Subtitle';
        const icon = this.getAttribute('icon') || DEFAULT_IMAGES.errorimage;
        const iconAlt = this.getAttribute('iconAlt') || 'View Project';

        const video = this.getAttribute('video');
        const videocaption = this.getAttribute('videocaption') || '';

        const image1 = this.getAttribute('image1');
        const image1caption = this.getAttribute('image1caption') || '';

        const image2 = this.getAttribute('image2') || DEFAULT_IMAGES.errorimage;
        const image2caption = this.getAttribute('image2caption') || '';

        const image3 = this.getAttribute('image3') || DEFAULT_IMAGES.errorimage;
        const image3caption = this.getAttribute('image3caption') || '';
        const barcolor = this.getAttribute('barcolor') || '#6d4aff';

        this.shadowRoot.innerHTML = `
        <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
            font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif !important;
        }

        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 2rem 2rem 2rem 2rem !important;
            width: 90%;
            background-color: var(--card-color-primary);
            background:
                linear-gradient(to right,
                    transparent 20%,
                    ${barcolor} 50%,
                    transparent 80%);
            background-position: top;
            background-size: 100% 1px;
            background-repeat: no-repeat;
            box-shadow: 0 4px 8px var(--close-shadow), 0 16px 32px var(--far-shadow);
            overflow: hidden;
            position: relative;
            border-radius: 1rem;
            gap: 1rem;
        }

        .pop-up-icon {
            width: 2rem;
            user-select: none;
            -webkit-user-drag: none;
        }

        .pop-up-title {
            opacity: 0.5;
            font-size: 0.75rem;
        }

        .pop-up-desc {
            font-size: 1.5rem;
            text-align: center;
            font-weight: 500;
        }

        :host::after {
            content: "";
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            z-index: -1;
            background-image: radial-gradient(circle 200vw at 50% 10%,
                    ${barcolor}25 0%,
                    var(--card-color-primary) 60%);
        }

        ::slotted([slot="pop-up-image"]) {
            user-select: none;
            -webkit-user-drag: none;
        }

        .pop-up-image {
            user-select: none;
            -webkit-user-drag: none;
            width: 100%;
            border-radius: 1rem;
            border: 1px solid var(--card-border-secondary);
        }

        figcaption {
            opacity: 0.33;
            text-align: right;
            font-size: 0.66rem;
            padding-top: 0.25rem;
            padding-right: 0.5rem;
            font-weight: 500;
            padding-bottom: 0.25rem;
        }

        /* ── Video player styles ─────────────────────────────────── */

        .video-wrapper {
            position: relative;
            display: inline-block;
            cursor: pointer;
            overflow: hidden;
            line-height: 0;
            transition: transform 0.3s ease, border-color 0.3s ease;
            border-radius: 1rem;
            border: 1px solid #00000005;
            background-color: var(--card-border-primary);
        }

        .video-wrapper video {
            width: 100%;
            display: block;
            vertical-align: top;
            outline: none;
            border-radius: 0.4rem;
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

        /* ── Button base state: resting at bottom, hidden ─────────── */
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

        /* ── Hovering + playing: button rises to centre ──────────── */
        .video-wrapper:hover .video-controls button:not(.paused) {
            opacity: 1;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(1.2);
        }

        /* ── Paused: button moves to top-left corner ──────────────── */
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
            opacity: 0.5;
            font-size: 0.75rem;
            margin-bottom: 1rem;
            padding: 0.5rem 1.5rem 0 1rem;
            text-align: right;
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

        .pop-up-title-icon {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
        }
        </style>

        <div class="pop-up-title-icon">
            <div class="pop-up-icon" alt="${iconAlt}">${icon}</div>
            <p class="pop-up-title">${title}</p>
        </div>
        <p class="pop-up-desc">${desc}</p>

        ${video ? `
            <figure slot="pop-up-image">
                <div class="video-wrapper" id="videoWrapper">
                    <video id="myVideo" autoplay muted loop playsinline>
                        <source src="${video}" type="video/mp4">
                    </video>
                    <div class="video-controls">
                        <button id="pauseBtn" tabindex="-1" aria-hidden="true">
                            <svg class="pause-icon icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white">
                                <path fill-rule="evenodd" d="M4.5 5.653c0-1.427 1.529-2.33 2.779-1.643l11.54 6.347c1.295.712 1.295 2.573 0 3.286L7.28 19.99c-1.25.687-2.779-.217-2.779-1.643V5.653Z" clip-rule="evenodd" />
                            </svg>
                        </button>
                    </div>
                </div>
                <figcaption>${videocaption}</figcaption>
            </figure>
        ` : ''}

        ${image1 ? `
            <figure slot="pop-up-image">
                <div class="pop-up-image-container">
                    <img class="pop-up-image" style="user-select: none; -webkit-user-drag: none;" src="${image1}" alt="">
                </div>
                <figcaption>${image1caption}</figcaption>
            </figure>

            <figure slot="pop-up-image">
                <div class="pop-up-image-container">
                    <img class="pop-up-image" style="user-select: none; -webkit-user-drag: none;" src="${image2}" alt="">
                </div>
                <figcaption>${image2caption}</figcaption>
            </figure>

            <figure slot="pop-up-image">
                <div class="pop-up-image-container">
                    <img class="pop-up-image" style="user-select: none; -webkit-user-drag: none;" src="${image3}" alt="">
                </div>
                <figcaption>${image3caption}</figcaption>
            </figure>
        ` : ''}
        `;

        this.attachEventListeners();
    }

    attachEventListeners() {
        const video = this.shadowRoot.querySelector('#myVideo');
        const videoWrapper = this.shadowRoot.querySelector('#videoWrapper');
        const pauseBtn = this.shadowRoot.querySelector('#pauseBtn');

        // Early return if video elements don't exist
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

customElements.define('pop-up-block', PopUpBlock);