const MORSE_CODE = {
    // حروف انگلیسی
    A: '.-', B: '-...', C: '-.-.', D: '-..', E: '.', F: '..-.', G: '--.',
    H: '....', I: '..', J: '.---', K: '-.-', L: '.-..', M: '--', N: '-.',
    O: '---', P: '.--.', Q: '--.-', R: '.-.', S: '...', T: '-', U: '..-',
    V: '...-', W: '.--', X: '-..-', Y: '-.--', Z: '--..',
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
    ' ': '/',

  a: '.-', b: '-...', c: '-.-.', d: '-..', e: '.', f: '..-.', g: '--.',
    h: '....', i: '..', j: '.---', k: '-.-', l: '.-..', m: '--', n: '-.',
    o: '---', p: '.--.', q: '--.-', r: '.-.', s: '...', t: '-', u: '..-',
    v: '...-', w: '.--', x: '-..-', y: '-.--', z: '--..',
    '1': '.----', '2': '..---', '3': '...--', '4': '....-', '5': '.....',
    '6': '-....', '7': '--...', '8': '---..', '9': '----.', '0': '-----',
    ' ': '/',


    // حروف فارسی
    'ا': '.-', 'ب': '-...', 'پ': '.--.', 'ت': '-', 'ث': '-.-.', 'ج': '.---',
    'چ': '---.', 'ح': '....', 'خ': '----', 'د': '-..', 'ذ': '--..', 'ر': '.-.',
    'ز': '--..', 'ژ': '.--..', 'س': '...', 'ش': '---', 'ص': '-..-', 'ض': '..-..',
    'ط': '-.', 'ظ': '-.-', 'ع': '...-', 'غ': '--.-', 'ف': '..-.', 'ق': '--.-',
    'ک': '-.-', 'گ': '--.', 'ل': '.-..', 'م': '--', 'ن': '-.', 'و': '.--',
    'ه': '.', 'ی': '..', ' ': '/'
};

const lamp = document.getElementById('lamp');
const beep = document.getElementById('beep');
const textInput = document.getElementById('textInput');
const output = document.getElementById('output');

// تشخیص زبان
function detectLanguage(text) {
    const persianRegex = /[\u0600-\u06FF]/;
    return persianRegex.test(text) ? 'FA' : 'EN';
}

document.getElementById('toMorse').addEventListener('click', () => {
    const text = textInput.value.trim();
    if (text === '') {
        output.textContent = 'خطا: ورودی خالی است.';
        return;
    }
    const language = detectLanguage(text);
    if (language === 'FA') {
        if (!/^[\u0600-\u06FF\s]+$/.test(text)) {
            output.textContent = 'خطا: فقط حروف فارسی و فاصله مجاز است.';
            return;
        }
    } else {
        if (!/^[A-Z0-9 ]*$/i.test(text)) {
            output.textContent = 'خطا: فقط حروف انگلیسی، اعداد و فاصله مجاز است.';
            return;
        }
    }

    const morse = text.split('').map(char => MORSE_CODE[char] || '').join(' ');
    output.textContent = morse || 'خطا: تبدیل انجام نشد.';
    if (morse) playMorse(morse);
});

document.getElementById('toText').addEventListener('click', () => {
    const morse = textInput.value.trim();
    if (morse === '') {
        output.textContent = 'خطا: ورودی خالی است.';
        return;
    }
    if (!/^[.\- /]*$/.test(morse)) {
        output.textContent = 'خطا: فقط نقطه (.)، خط تیره (-)، و فاصله مجاز است.';
        return;
    }

    const text = morse.split(' ').map(code => {
        return Object.keys(MORSE_CODE).find(key => MORSE_CODE[key] === code) || '؟';
    }).join('');
    output.textContent = text || 'خطا: تبدیل انجام نشد.';
});

document.getElementById('copyOutput').addEventListener('click', () => {
    const outputText = output.textContent.trim();
    if (outputText === '' || outputText.startsWith('خطا')) {
        alert('خروجی خالی است یا خطا دارد.');
        return;
    }
    navigator.clipboard.writeText(outputText).then(() => {
        alert('خروجی با موفقیت کپی شد!');
    }).catch(err => {
        alert('خطا در کپی کردن: ' + err);
    });
});

function playMorse(morse) {
    let i = 0;

    function toggleLamp(state) {
        lamp.classList.toggle('on', state);
        if (state) beep.play();
    }

    function next() {
        if (i >= morse.length) return;

        const char = morse[i];
        if (char === '.') {
            toggleLamp(true);
            setTimeout(() => toggleLamp(false), 300);
        } else if (char === '-') {
            toggleLamp(true);
            setTimeout(() => toggleLamp(false), 700);
        }
        i++;
        setTimeout(next, char === ' ' ? 300 : 1000);
    }
    next();
}

