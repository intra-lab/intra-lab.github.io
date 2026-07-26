// ========================================
// ⚙️ GLOBAL FLAG: Toggle encryption
// ========================================
const ENCRYPTED = true;

// ========================================
// Configuration
// ========================================
const CONTENT_PIPELINE = [
    { name: 'Essentials',   file: '1Work', trigger: 'dom',             fatal: true,  showErrors: true  },
    { name: 'Core Media',   file: '2Info',         trigger: 'after-previous',  fatal: false, showErrors: false },
    { name: 'Core Media',   file: '3Project1Core',         trigger: 'after-previous',  fatal: false, showErrors: false },
    { name: 'Core Media',   file: '4Project2Core',         trigger: 'after-previous',  fatal: false, showErrors: false },
    { name: 'Core Media',   file: '5Project1Other',         trigger: 'after-previous',  fatal: false, showErrors: false },
    { name: 'Core Media',   file: '6Project1Other2',         trigger: 'after-previous',  fatal: false, showErrors: false },
    { name: 'Core Media',   file: '7Project2Other',         trigger: 'after-previous',  fatal: false, showErrors: false }

    // { name: 'Core Media',   file: 'core-media',         trigger: 'after-previous',  fatal: false, showErrors: false },
    // { name: 'Large Images', file: 'large-images',       trigger: 'after-previous',  fatal: false, showErrors: false },
    // { name: 'Videos',       file: 'videos',             trigger: 'load',            fatal: false, showErrors: false }
];

// ========================================
// Apply a Single Component
// ========================================
function applyComponent(comp) {
    const element = document.getElementById(comp.id);
    if (!element) {
        console.warn(`Element "${comp.id}" not found - skipping`);
        return;
    }
    for (const [attr, value] of Object.entries(comp.attributes)) {
        element.setAttribute(attr, value);
    }
}

// ========================================
// Key Derivation (called once, reused for all lines)
// ========================================
async function deriveKey(keyString) {
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
        'raw', encoder.encode(keyString), 'PBKDF2', false, ['deriveKey']
    );
    return crypto.subtle.deriveKey(
        {
            name: 'PBKDF2',
            salt: encoder.encode('website-encryption-salt-v1'),
            iterations: 100000,
            hash: 'SHA-256'
        },
        keyMaterial,
        { name: 'AES-GCM', length: 256 },
        false,
        ['decrypt']
    );
}

// ========================================
// Get Decryption Key from URL
// ========================================
function getDecryptionKeyFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('utm') || params.get('u');
}

// ========================================
// Decrypt a single line: base64(IV || ciphertext) → JSON object
// ========================================
async function decryptLine(base64Line, key) {
    // Decode base64 → bytes
    const combined = atob(base64Line)
        .split('')
        .map(c => c.charCodeAt(0));
    const combinedArr = new Uint8Array(combined);

    // First 12 bytes = IV, rest = ciphertext
    const iv = combinedArr.slice(0, 12);
    const ciphertext = combinedArr.slice(12);

    const plaintext = await crypto.subtle.decrypt(
        { name: 'AES-GCM', iv: iv },
        key,
        ciphertext
    );

    return JSON.parse(new TextDecoder().decode(plaintext));
}

// ========================================
// URL resolver
// ========================================
function getContentUrl(fileName) {
    return ENCRYPTED ? `data/${fileName}.dat` : `data/${fileName}.ndjson`;
}

// ========================================
// Stream + Decrypt line-by-line (encrypted mode)
// ========================================
// ========================================
// Stream + Decrypt line-by-line (encrypted mode)
// ========================================
async function streamEncrypted(url, key) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url} (${response.status})`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let count = 0;
    let firstLineProcessed = false;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
            const line = buffer.slice(0, newlineIndex).trim();
            buffer = buffer.slice(newlineIndex + 1);

            if (line) {
                try {
                    const comp = await decryptLine(line, key);
                    applyComponent(comp);
                    count++;
                    firstLineProcessed = true;
                } catch (e) {
                    if (!firstLineProcessed) {
                        // Very first line failed = almost certainly wrong key
                        throw new Error('Decryption failed: invalid key');
                    }
                    console.warn('Skipped malformed/undecryptable line:', e.message);
                }
            }
        }
    }

    // Flush remaining buffer
    const remainder = buffer.trim();
    if (remainder) {
        try {
            const comp = await decryptLine(remainder, key);
            applyComponent(comp);
            count++;
        } catch (e) {
            if (!firstLineProcessed && count === 0) {
                throw new Error('Decryption failed: invalid key');
            }
            console.warn('Skipped malformed final line:', e.message);
        }
    }

    return count;
}

// ========================================
// Stream plain NDJSON (unencrypted mode)
// ========================================
async function streamPlain(url) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url} (${response.status})`);

    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let count = 0;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });

        let newlineIndex;
        while ((newlineIndex = buffer.indexOf('\n')) !== -1) {
            const line = buffer.slice(0, newlineIndex).trim();
            buffer = buffer.slice(newlineIndex + 1);

            if (line) {
                try {
                    const comp = JSON.parse(line);
                    applyComponent(comp);
                    count++;
                } catch (e) {
                    console.warn('Skipped malformed line:', line);
                }
            }
        }
    }

    const remainder = buffer.trim();
    if (remainder) {
        try {
            const comp = JSON.parse(remainder);
            applyComponent(comp);
            count++;
        } catch (e) {
            console.warn('Skipped malformed final line:', remainder);
        }
    }

    return count;
}

// ========================================
// Wait Helpers
// ========================================
function waitForLoad() {
    return new Promise(resolve => {
        if (document.readyState === 'complete') {
            resolve();
        } else {
            window.addEventListener('load', resolve, { once: true });
        }
    });
}

// ========================================
// Pipeline Runner
// ========================================
class ContentPipeline {
    constructor(config) {
        this.config = config;
        this.completed = new Set();
        this.aborted = false;
        this.decrKey = null;
        this.derivedKey = null;
    }
    async run() {
        if (ENCRYPTED) {
            this.decrKey = getDecryptionKeyFromURL();
            if (!this.decrKey) {
                console.warn('No decryption key found in URL.');
                this.showBlackScreen(
                    'Error',
                    'There was an error loading this page. Please check you entered the full link you were given and that it is correct. If the problem persists, please contact me.'
                );
                return;
            }
            // Test the key by trying to derive it — if wrong, decryption
            // will fail on the first line and trigger the black screen there
            try {
                this.derivedKey = await deriveKey(this.decrKey);
            } catch (e) {
                this.showBlackScreen(
                    'Error',
                    'There was an error loading this page. Please check you entered the full link you were given and that it is correct. If the problem persists, please contact me.'
                );
                return;
            }
        }

        for (const stage of this.config) {
            if (this.aborted) {
                console.log(`⏸ Pipeline aborted — skipping "${stage.name}"`);
                return;
            }
            await this.runStage(stage);
        }
        window.dispatchEvent(new CustomEvent('pipeline-complete'));
    }

    async runStage(stage) {
        switch (stage.trigger) {
            case 'dom': break;
            case 'load': await waitForLoad(); break;
            case 'after-previous': break;
            default:
                if (typeof stage.trigger === 'function') await stage.trigger();
                else if (typeof stage.trigger === 'number')
                    await new Promise(r => setTimeout(r, stage.trigger));
        }

        try {
            const url = getContentUrl(stage.file);
            const modeLabel = ENCRYPTED ? '🔓 stream-decrypt' : '📄 stream';
            console.log(`▶ Loading "${stage.name}" (${modeLabel}) from ${url}…`);

            const startTime = performance.now();
            const count = ENCRYPTED
                ? await streamEncrypted(url, this.derivedKey)
                : await streamPlain(url);
            const elapsed = (performance.now() - startTime).toFixed(0);

            console.log(`✓ "${stage.name}" done — ${count} components in ${elapsed}ms`);
            this.completed.add(stage.name);
            
            window.dispatchEvent(
                new CustomEvent(`${stage.name.toLowerCase().replace(/\s+/g, '-')}-loaded`)
            );

                  } catch (error) {
            console.error(`✗ "${stage.name}" failed:`, error);

            if (stage.fatal) {
                if (error.message.includes('invalid key') || error.message.includes('Decryption failed')) {
                    this.showBlackScreen(
                        'Error',
                        'There was an error loading this page. Please check you entered the full link you were given and that it is correct. If the problem persists, please contact me.'
                    );
                } else if (stage.showErrors) {
                    this.showBlackScreen(
                        'Something Went Wrong',
                        'There was an error loading this page. Please check your connection and try again. If the problem persists, please contact me.'
                    );
                }
            }
        
        }
    }

       showBlackScreen(title, message) {
        this.aborted = true;

        if (window.location.hash === '#debug-mode') return;

        document.body.innerHTML =
            '<div style="' +
                'position:fixed;inset:0;' +
                'background:#000;color:#fff;' +
                'display:flex;flex-direction:column;' +
                'align-items:center;justify-content:center;' +
                'font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;' +
                'padding:2rem;text-align:center;' +
                'z-index:99999;' +
            '">' +
                '<h2 style="font-size:1.8rem;margin-bottom:1rem;font-weight:400;letter-spacing:0.02em;">' +
                    title +
                '</h2>' +
                '<p style="font-size:1rem;max-width:420px;line-height:1.6;opacity:0.7;">' +
                    message +
                '</p>' +
            '</div>';

        document.body.style.margin = '0';
        document.documentElement.style.background = '#000';
    }
}

// ========================================
// Boot
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    const pipeline = new ContentPipeline(CONTENT_PIPELINE);
    pipeline.run();
});