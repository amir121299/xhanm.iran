// Morse Code Converter - JavaScript Implementation
class MorseConverter {
    constructor() {
        this.currentMode = 'fa'; // 'fa' for Persian, 'en' for English
        this.isPlaying = false;
        this.audioContext = null;
        this.currentSource = null;
        
        // Morse code mappings
        this.morseMap = {
            // English letters and numbers
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..',
            '0': '-----', '1': '.----', '2': '..---', '3': '...--', '4': '....-',
            '5': '.....', '6': '-....', '7': '--...', '8': '---..', '9': '----.',
            
            // Persian letters
            'آ': '.-', 'ا': '.-', 'ب': '-...', 'پ': '.--.', 'ت': '-', 'ث': '-...',
            'ج': '.---', 'چ': '---.', 'ح': '....', 'خ': '----', 'د': '-..',
            'ذ': '..--..', 'ر': '.-.', 'ز': '--..', 'ژ': '---.', 'س': '...',
            'ش': '----', 'ص': '...-.', 'ض': '-..-.', 'ط': '-.--', 'ظ': '-.--.',
            'ع': '...-..', 'غ': '--..-.', 'ف': '..-.', 'ق': '--.-', 'ک': '-.-',
            'گ': '--.', 'ل': '.-..', 'م': '--', 'ن': '-.', 'و': '.--', 'ه': '....',
            'ی': '-.--', 'ئ': '.--..', 'ء': '.', 'ة': '-', 'ة': '..-.',
            
            // Common punctuation
            '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
            '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
            '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
            '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
            '$': '...-..-', '@': '.--.-.', '¿': '..-.-', '¡': '--...-'
        };
        
        // Reverse mapping
        this.textMap = {};
        Object.keys(this.morseMap).forEach(key => {
            this.textMap[this.morseMap[key]] = key;
        });
        
        this.initializeEventListeners();
        this.generateReferenceTable();
        this.updatePlaceholders();
    }
    
    initializeEventListeners() {
        // Language toggle
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchLanguage(e.target.dataset.lang));
        });
        
        // Input field
        const inputText = document.getElementById('input-text');
        inputText.addEventListener('input', () => this.convertText());
        
        // Control buttons
        document.getElementById('play-btn').addEventListener('click', () => this.togglePlay());
        document.getElementById('copy-btn').addEventListener('click', () => this.copyOutput());
        document.getElementById('swap-btn').addEventListener('click', () => this.swapDirection());
        document.getElementById('clear-btn').addEventListener('click', () => this.clearFields());
        
        // Reference cards
        document.addEventListener('click', (e) => {
            if (e.target.closest('.reference-card')) {
                const card = e.target.closest('.reference-card');
                const letter = card.querySelector('.reference-letter').textContent;
                const morse = card.querySelector('.reference-morse').textContent;
                this.insertToInput(letter, morse);
            }
        });
    }
    
    switchLanguage(lang) {
        if (this.currentMode === lang) return;
        
        this.currentMode = lang;
        
        // Update toggle buttons
        document.querySelectorAll('.toggle-btn').forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.lang === lang) {
                btn.classList.add('active');
            }
        });
        
        // Update body direction and font
        const body = document.body;
        if (lang === 'en') {
            body.classList.add('english-mode');
            body.style.direction = 'ltr';
        } else {
            body.classList.remove('english-mode');
            body.style.direction = 'rtl';
        }
        
        this.updatePlaceholders();
        this.convertText();
        this.generateReferenceTable();
    }
    
    updatePlaceholders() {
        const inputField = document.getElementById('input-text');
        const outputField = document.getElementById('output-text');
        const inputLabel = document.getElementById('input-label');
        const outputLabel = document.getElementById('output-label');
        
        if (this.currentMode === 'fa') {
            inputField.placeholder = 'اینجا تایپ کنید...';
            inputField.dir = 'rtl';
            inputLabel.textContent = 'متن خود را وارد کنید';
            outputLabel.textContent = 'کد مورس';
        } else {
            inputField.placeholder = 'Type here...';
            inputField.dir = 'ltr';
            inputLabel.textContent = 'Enter your text';
            outputLabel.textContent = 'Morse code';
        }
        
        outputField.dir = 'ltr';
    }
    
    convertText() {
        const inputText = document.getElementById('input-text').value.trim();
        const outputField = document.getElementById('output-text');
        
        if (!inputText) {
            outputField.value = '';
            return;
        }
        
        if (this.isMorseCode(inputText)) {
            // Convert Morse to text
            outputField.value = this.morseToText(inputText);
        } else {
            // Convert text to Morse
            outputField.value = this.textToMorse(inputText);
        }
    }
    
    textToMorse(text) {
        const words = text.split(' ');
        const morseWords = words.map(word => {
            const morseChars = Array.from(word.toUpperCase()).map(char => {
                if (this.morseMap[char]) {
                    return this.morseMap[char];
                } else if (char === ' ') {
                    return '/';
                } else {
                    // Return the character itself if not found in mapping
                    return char;
                }
            });
            return morseChars.join(' ');
        });
        return morseWords.join('   '); // Triple space for word separation
    }
    
    morseToText(morse) {
        const words = morse.split(' / ');
        const textWords = words.map(word => {
            const chars = word.trim().split(/\s+/);
            const textChars = chars.map(code => {
                return this.textMap[code] || code;
            });
            return textChars.join('');
        });
        return textWords.join(' ');
    }
    
    isMorseCode(text) {
        // Check if text contains only valid Morse characters
        const morsePattern = /^[.\-\/\s]+$/;
        return morsePattern.test(text) && text.includes('.') || text.includes('-');
    }
    
    generateReferenceTable() {
        const grid = document.getElementById('reference-grid');
        grid.innerHTML = '';
        
        let characters = [];
        if (this.currentMode === 'fa') {
            characters = ['آ', 'ا', 'ب', 'پ', 'ت', 'ث', 'ج', 'چ', 'ح', 'خ', 'د', 'ذ', 'ر', 'ز', 'ژ', 'س', 'ش', 'ص', 'ض', 'ط', 'ظ', 'ع', 'غ', 'ف', 'ق', 'ک', 'گ', 'ل', 'م', 'ن', 'و', 'ه', 'ی', 'ئ', 'ء', 'ة'];
        } else {
            characters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
        }
        
        characters.forEach(char => {
            if (this.morseMap[char]) {
                const card = document.createElement('div');
                card.className = 'reference-card';
                card.tabIndex = 0;
                card.innerHTML = `
                    <div class="reference-letter">${char}</div>
                    <div class="reference-morse">${this.morseMap[char]}</div>
                `;
                grid.appendChild(card);
            }
        });
    }
    
    insertToInput(letter, morse) {
        const inputField = document.getElementById('input-text');
        const currentValue = inputField.value;
        const cursorPos = inputField.selectionStart;
        
        if (this.currentMode === 'en' && letter.match(/[A-Z0-9]/)) {
            inputField.value = currentValue.slice(0, cursorPos) + letter + currentValue.slice(cursorPos);
        } else if (this.currentMode === 'fa' && letter.match(/[آ-ی]/)) {
            inputField.value = currentValue.slice(0, cursorPos) + letter + currentValue.slice(cursorPos);
        }
        
        inputField.focus();
        inputField.selectionStart = inputField.selectionEnd = cursorPos + 1;
        this.convertText();
    }
    
    async togglePlay() {
        if (this.isPlaying) {
            this.stopAudio();
        } else {
            await this.playMorse();
        }
    }
    
    async playMorse() {
        const outputText = document.getElementById('output-text').value;
        if (!outputText.trim()) {
            this.showToast(this.currentMode === 'fa' ? 'متنی برای پخش وجود ندارد' : 'No text to play', 'error');
            return;
        }
        
        this.isPlaying = true;
        const playBtn = document.getElementById('play-btn');
        playBtn.classList.add('playing');
        
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            await this.audioContext.resume();
            
            const morseChars = outputText.split('');
            let currentTime = this.audioContext.currentTime;
            
            for (let i = 0; i < morseChars.length && this.isPlaying; i++) {
                const char = morseChars[i];
                
                if (char === '.') {
                    await this.playTone(currentTime, 0.1, 600);
                    currentTime += 0.2;
                } else if (char === '-') {
                    await this.playTone(currentTime, 0.3, 600);
                    currentTime += 0.4;
                } else if (char === ' ') {
                    currentTime += 0.3; // Gap between letters
                } else if (char === '/') {
                    currentTime += 0.7; // Gap between words
                }
                
                // Small gap between symbols
                currentTime += 0.1;
            }
            
        } catch (error) {
            console.error('Audio playback error:', error);
            this.showToast(this.currentMode === 'fa' ? 'خطا در پخش صدا' : 'Audio playback error', 'error');
        } finally {
            this.isPlaying = false;
            playBtn.classList.remove('playing');
        }
    }
    
    async playTone(startTime, duration, frequency) {
        return new Promise((resolve) => {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            oscillator.frequency.setValueAtTime(frequency, startTime);
            oscillator.type = 'sine';
            
            gainNode.gain.setValueAtTime(0, startTime);
            gainNode.gain.linearRampToValueAtTime(0.3, startTime + 0.01);
            gainNode.gain.exponentialRampToValueAtTime(0.001, startTime + duration);
            
            oscillator.start(startTime);
            oscillator.stop(startTime + duration);
            
            oscillator.onended = resolve;
        });
    }
    
    stopAudio() {
        this.isPlaying = false;
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
        const playBtn = document.getElementById('play-btn');
        playBtn.classList.remove('playing');
    }
    
    async copyOutput() {
        const outputText = document.getElementById('output-text').value;
        if (!outputText.trim()) {
            this.showToast(this.currentMode === 'fa' ? 'متنی برای کپی وجود ندارد' : 'No text to copy', 'error');
            return;
        }
        
        try {
            await navigator.clipboard.writeText(outputText);
            this.showToast(this.currentMode === 'fa' ? 'کپی شد!' : 'Copied!', 'success');
        } catch (error) {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = outputText;
            document.body.appendChild(textArea);
            textArea.select();
            document.execCommand('copy');
            document.body.removeChild(textArea);
            this.showToast(this.currentMode === 'fa' ? 'کپی شد!' : 'Copied!', 'success');
        }
    }
    
    swapDirection() {
        const inputField = document.getElementById('input-text');
        const outputField = document.getElementById('output-text');
        
        if (inputField.value && outputField.value) {
            const temp = inputField.value;
            inputField.value = outputField.value;
            outputField.value = temp;
            this.convertText();
            this.showToast(this.currentMode === 'fa' ? 'تغییر جهت انجام شد' : 'Direction swapped', 'success');
        }
    }
    
    clearFields() {
        document.getElementById('input-text').value = '';
        document.getElementById('output-text').value = '';
        this.showToast(this.currentMode === 'fa' ? 'پاک شد' : 'Cleared', 'success');
    }
    
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = `toast ${type}`;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
}

// Initialize the converter when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new MorseConverter();
});

// Handle keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Ctrl/Cmd + C to copy output
    if ((e.ctrlKey || e.metaKey) && e.key === 'c') {
        e.preventDefault();
        document.getElementById('copy-btn').click();
    }
    
    // Escape to stop audio
    if (e.key === 'Escape') {
        const converter = window.morseConverter;
        if (converter && converter.isPlaying) {
            converter.stopAudio();
        }
    }
    
    // Space to play/pause (when not typing in input)
    if (e.key === ' ' && !e.target.matches('input, textarea')) {
        e.preventDefault();
        document.getElementById('play-btn').click();
    }
});

// Service Worker for PWA (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then((registration) => {
                console.log('SW registered: ', registration);
            })
            .catch((registrationError) => {
                console.log('SW registration failed: ', registrationError);
            });
    });
}