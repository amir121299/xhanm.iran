class MorseConverter {
    constructor() {
        this.currentMode = 'en';
        this.isPlaying = false;
        this.audioContext = null;
        this.currentSource = null;
        this.flashElement = document.createElement('div');
        this.flashElement.style.position = 'fixed';
        this.flashElement.style.top = 0;
        this.flashElement.style.left = 0;
        this.flashElement.style.width = '100%';
        this.flashElement.style.height = '100%';
        this.flashElement.style.background = 'yellow';
        this.flashElement.style.opacity = 0;
        this.flashElement.style.pointerEvents = 'none';
        this.flashElement.style.transition = 'opacity 0.05s ease';
        document.body.appendChild(this.flashElement);

        this.farsiMap = {
            'آ': '.-', 'ا': '.-', 'ب': '-...', 'پ': '.--.', 'ت': '-', 'ث': '-...',
            'ج': '.---', 'چ': '---.', 'ح': '....', 'خ': '----', 'د': '-..',
            'ذ': '..--..', 'ر': '.-.', 'ز': '--..', 'ژ': '---.', 'س': '...',
            'ش': '----', 'ص': '...-.', 'ض': '-..-.', 'ط': '-.--', 'ظ': '-.--.',
            'ع': '...-..', 'غ': '--..-.', 'ف': '..-.', 'ق': '--.-', 'ک': '-.-',
            'گ': '--.', 'ل': '.-..', 'م': '--', 'ن': '-.', 'و': '.--', 'ه': '....',
            'ی': '-.--', 'ء': '.', 'ئ': '.--..', 'ة': '-'
        };

        this.englishMap = {
            'A': '.-', 'B': '-...', 'C': '-.-.', 'D': '-..', 'E': '.', 'F': '..-.',
            'G': '--.', 'H': '....', 'I': '..', 'J': '.---', 'K': '-.-', 'L': '.-..',
            'M': '--', 'N': '-.', 'O': '---', 'P': '.--.', 'Q': '--.-', 'R': '.-.',
            'S': '...', 'T': '-', 'U': '..-', 'V': '...-', 'W': '.--', 'X': '-..-',
            'Y': '-.--', 'Z': '--..',
            '0': '-----','1': '.----','2': '..---','3': '...--','4': '....-',
            '5': '.....','6': '-....','7': '--...','8': '---..','9': '----.',
            '.': '.-.-.-', ',': '--..--', '?': '..--..', "'": '.----.',
            '!': '-.-.--', '/': '-..-.', '(': '-.--.', ')': '-.--.-',
            '&': '.-...', ':': '---...', ';': '-.-.-.', '=': '-...-',
            '+': '.-.-.', '-': '-....-', '_': '..--.-', '"': '.-..-.',
            '$': '...-..-', '@': '.--.-.'
        };

        this.reverseFarsiMap = this.reverseMap(this.farsiMap);
        this.reverseEnglishMap = this.reverseMap(this.englishMap);

        this.init();
    }

    reverseMap(map){
        const rev = {};
        for (const key in map) rev[map[key]] = key;
        return rev;
    }

    init() {
        this.updatePlaceholders();
        this.generateReferenceTable();
        this.addEventListeners();
    }

    addEventListeners() {
        document.querySelectorAll('.toggle-btn').forEach(btn=>{
            btn.addEventListener('click',()=>this.switchLanguage(btn.dataset.lang));
        });
        document.getElementById('input-text').addEventListener('input',()=>this.convertText());
        document.getElementById('copy-btn').addEventListener('click',()=>this.copyOutput());
        document.getElementById('swap-btn').addEventListener('click',()=>this.swapDirection());
        document.getElementById('clear-btn').addEventListener('click',()=>this.clearFields());
        document.getElementById('play-btn').addEventListener('click',()=>this.togglePlay());
    }

    switchLanguage(lang){
        this.currentMode = lang;
        document.querySelectorAll('.toggle-btn').forEach(btn=>btn.classList.toggle('active',btn.dataset.lang===lang));
        document.body.classList.toggle('english-mode', lang==='en');
        document.body.style.direction = lang==='en'?'ltr':'rtl';
        this.updatePlaceholders();
        this.convertText();
        this.generateReferenceTable();
    }

    updatePlaceholders(){
        const input=document.getElementById('input-text');
        const inputLabel=document.getElementById('input-label');
        const outputLabel=document.getElementById('output-label');
        if(this.currentMode==='fa'){
            input.placeholder='اینجا تایپ کنید...';
            input.dir='rtl';
            inputLabel.textContent='متن خود را وارد کنید';
            outputLabel.textContent='کد مورس';
        }else{
            input.placeholder='Type here...';
            input.dir='ltr';
            inputLabel.textContent='Enter your text';
            outputLabel.textContent='Morse code';
        }
    }

    convertText(){
        const input=document.getElementById('input-text').value.trim();
        const output=document.getElementById('output-text');
        if(!input){ output.value=''; return; }
        const isMorse=/^[.\-\/\s]+$/.test(input);
        if(isMorse) output.value=this.morseToText(input);
        else output.value=this.textToMorse(input);
    }

    textToMorse(text){
        const map=this.currentMode==='fa'?this.farsiMap:this.englishMap;
        return text.split('').map(c=>{
            const ch=this.currentMode==='fa'?c:c.toUpperCase();
            if(map[ch]) return map[ch];
            else if(c===' ') return '/';
            return c;
        }).join(' ');
    }

    morseToText(morse){
        const revMap=this.currentMode==='fa'?this.reverseFarsiMap:this.reverseEnglishMap;
        return morse.split(' / ').map(word=>{
            return word.trim().split(/\s+/).map(symbol=>revMap[symbol]||symbol).join('');
        }).join(' ');
    }

    async togglePlay(){
        if(this.isPlaying){ this.stopAudio(); return; }
        const morse=document.getElementById('output-text').value.trim();
        if(!morse){ this.showToast(this.currentMode==='fa'?'متنی برای پخش وجود ندارد':'No text to play','error'); return; }
        this.isPlaying=true;
        document.getElementById('play-btn').classList.add('playing');

        this.audioContext=new (window.AudioContext||window.webkitAudioContext)();
        await this.audioContext.resume();

        const chars=morse.split('');
        let currentTime=this.audioContext.currentTime;

        for(let i=0;i<chars.length && this.isPlaying;i++){
            const c=chars[i];
            if(c==='.'){ await this.playTone(currentTime,0.15); currentTime+=0.25; }
            else if(c==='-'){ await this.playTone(currentTime,0.45); currentTime+=0.55; }
            else if(c===' '){ currentTime+=0.2; }
            else if(c==='/'){ currentTime+=0.6; }
            currentTime+=0.05;
        }

        this.isPlaying=false;
        document.getElementById('play-btn').classList.remove('playing');
    }

    playTone(start,duration){
        return new Promise(resolve=>{
            const osc=this.audioContext.createOscillator();
            const gain=this.audioContext.createGain();
            osc.connect(gain); gain.connect(this.audioContext.destination);
            osc.type='sine';
            osc.frequency.setValueAtTime(600,start);
            gain.gain.setValueAtTime(0,start);
            gain.gain.linearRampToValueAtTime(0.3,start+0.01);
            gain.gain.exponentialRampToValueAtTime(0.001,start+duration);
            osc.start(start); osc.stop(start+duration);

            // نور چشمک زن
            this.flashElement.style.opacity = 0.6;
            setTimeout(()=>this.flashElement.style.opacity=0, duration*1000);

            osc.onended=resolve;
        });
    }

    stopAudio(){
        this.isPlaying=false;
        if(this.audioContext){ this.audioContext.close(); this.audioContext=null; }
        document.getElementById('play-btn').classList.remove('playing');
    }

    copyOutput(){
        const text=document.getElementById('output-text').value;
        if(!text) return this.showToast(this.currentMode==='fa'?'متنی برای کپی وجود ندارد':'No text to copy','error');
        navigator.clipboard.writeText(text).then(()=>this.showToast(this.currentMode==='fa'?'کپی شد!':'Copied!'));
    }

    swapDirection(){
        const input=document.getElementById('input-text');
        const output=document.getElementById('output-text');
        [input.value,output.value]=[output.value,input.value];
        this.convertText();
        this.showToast(this.currentMode==='fa'?'تغییر جهت انجام شد':'Direction swapped');
    }

    clearFields(){
        document.getElementById('input-text').value='';
        document.getElementById('output-text').value='';
        this.showToast(this.currentMode==='fa'?'پاک شد':'Cleared');
    }

    showToast(msg,type='success'){
        const toast=document.getElementById('toast');
        toast.textContent=msg;
        toast.className=`toast ${type} show`;
        setTimeout(()=>toast.classList.remove('show'),3000);
    }

    generateReferenceTable(){
        const grid=document.getElementById('reference-grid');
        grid.innerHTML='';
        const chars=this.currentMode==='fa'?Object.keys(this.farsiMap):Object.keys(this.englishMap);
        chars.forEach(c=>{
            const card=document.createElement('div');
            card.className='reference-card';
            card.tabIndex=0;
            card.innerHTML=`<div class="reference-letter">${c}</div><div class="reference-morse">${this.currentMode==='fa'?this.farsiMap[c]:this.englishMap[c]}</div>`;
            grid.appendChild(card);
        });
    }
}

document.addEventListener('DOMContentLoaded',()=>window.morseConverter=new MorseConverter());
