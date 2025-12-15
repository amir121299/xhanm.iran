// XH OS - سیستم عامل موبایل
class XHOS {
    constructor() {
        this.currentScreen = 'boot-screen';
        this.isLocked = true;
        this.apps = {};
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.initializeApps();
        this.startBootSequence();
        this.updateClock();
        this.startClockUpdater();
    }

    // تنظیم رویدادها
    setupEventListeners() {
        // رویداد باز کردن قفل
        document.addEventListener('touchstart', this.handleTouchStart.bind(this));
        document.addEventListener('touchend', this.handleTouchEnd.bind(this));
        document.addEventListener('mousedown', this.handleTouchStart.bind(this));
        document.addEventListener('mouseup', this.handleTouchEnd.bind(this));

        // کلیک روی دکمه بازگشت
        document.getElementById('back-to-home').addEventListener('click', () => {
            this.switchScreen('home-screen');
        });

        // کلیک روی آیکون‌های برنامه‌ها
        document.querySelectorAll('.app-icon, .dock-app').forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                const appName = icon.getAttribute('data-app');
                if (appName) {
                    this.launchApp(appName);
                }
            });
        });

        // رویداد کیبورد
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentScreen === 'app-screen') {
                this.switchScreen('home-screen');
            }
        });
    }

    // شروع دنباله بوت
    startBootSequence() {
        setTimeout(() => {
            this.fadeToScreen('lock-screen');
        }, 3000);

        // انیمیشن لوگو
        this.animateLogo();
    }

    // انیمیشن لوگو
    animateLogo() {
        const logo = document.querySelector('.logo-text');
        const bootAnimation = document.querySelector('.boot-animation');
        
        setTimeout(() => {
            logo.style.animation = 'logoGlow 1s ease-in-out infinite alternate';
            if (bootAnimation) {
                bootAnimation.style.animation = 'bootPulse 2s ease-out infinite';
            }
        }, 500);
    }

    // انتقال بین صفحات
    switchScreen(screenId) {
        const currentScreen = document.getElementById(this.currentScreen);
        const newScreen = document.getElementById(screenId);
        
        if (currentScreen) {
            currentScreen.classList.remove('active');
        }
        
        if (newScreen) {
            newScreen.classList.add('active');
        }
        
        this.currentScreen = screenId;
        
        // ویژگی‌های خاص برای هر صفحه
        if (screenId === 'home-screen') {
            this.unlockDevice();
        }
    }

    // انتقال با افکت محو
    fadeToScreen(screenId) {
        const currentScreen = document.getElementById(this.currentScreen);
        
        if (currentScreen) {
            currentScreen.style.opacity = '0';
            setTimeout(() => {
                this.switchScreen(screenId);
                const newScreen = document.getElementById(screenId);
                if (newScreen) {
                    newScreen.style.opacity = '1';
                }
            }, 600);
        } else {
            this.switchScreen(screenId);
        }
    }

    // مدیریت لمس
    handleTouchStart(e) {
        this.touchStartY = e.touches ? e.touches[0].clientY : e.clientY;
        this.touchStartTime = Date.now();
    }

    handleTouchEnd(e) {
        if (!this.touchStartY) return;
        
        const touchEndY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
        const touchStartY = this.touchStartY;
        const deltaY = touchStartY - touchEndY;
        const deltaTime = Date.now() - this.touchStartTime;
        
        this.touchStartY = null;
        
        // اگر در صفحه قفل و به اندازه کافی به بالا کشیده شده
        if (this.currentScreen === 'lock-screen' && 
            deltaY > 100 && 
            deltaTime < 1000) {
            this.unlockDevice();
        }
    }

    // باز کردن قفل دستگاه
    unlockDevice() {
        this.isLocked = false;
        const homeScreen = document.getElementById('home-screen');
        const lockScreen = document.getElementById('lock-screen');
        
        if (homeScreen && lockScreen) {
            homeScreen.classList.add('unlocked');
            lockScreen.style.transform = 'translateY(-100vh)';
            
            setTimeout(() => {
                this.switchScreen('home-screen');
            }, 300);
        }
        
        // افکت صوتی (اختیاری)
        this.playSound('unlock');
    }

    // راه‌اندازی برنامه‌ها
    initializeApps() {
        this.apps = {
            clock: {
                name: 'ساعت',
                content: this.createClockApp()
            },
            calculator: {
                name: 'ماشین حساب',
                content: this.createCalculatorApp()
            },
            calendar: {
                name: 'تقویم',
                content: this.createCalendarApp()
            },
            weather: {
                name: 'آب و هوا',
                content: this.createWeatherApp()
            },
            messages: {
                name: 'پیام‌رسان',
                content: this.createMessagesApp()
            },
            camera: {
                name: 'دوربین',
                content: this.createCameraApp()
            },
            music: {
                name: 'موزیک',
                content: this.createMusicApp()
            },
            contacts: {
                name: 'مخاطبین',
                content: this.createContactsApp()
            },
            browser: {
                name: 'مرورگر',
                content: this.createBrowserApp()
            },
            photos: {
                name: 'گالری',
                content: this.createPhotosApp()
            },
            settings: {
                name: 'تنظیمات',
                content: this.createSettingsApp()
            },
            notes: {
                name: 'یادداشت',
                content: this.createNotesApp()
            },
            phone: {
                name: 'تلفن',
                content: this.createPhoneApp()
            }
        };
    }

    // راه‌اندازی برنامه
    launchApp(appName) {
        if (!this.apps[appName]) return;
        
        const app = this.apps[appName];
        const appScreen = document.getElementById('app-screen');
        const appContent = document.getElementById('app-content');
        const appTitle = document.querySelector('.app-title');
        
        // تنظیم عنوان
        appTitle.textContent = app.name;
        
        // بارگذاری محتوا
        appContent.innerHTML = app.content;
        
        // انتقال به صفحه برنامه
        this.switchScreen('app-screen');
        
        // اجرای عملیات خاص هر برنامه
        this.initializeAppSpecificFeatures(appName);
        
        // افکت صوتی
        this.playSound('app-launch');
    }

    // عملیات خاص هر برنامه
    initializeAppSpecificFeatures(appName) {
        switch (appName) {
            case 'clock':
                this.startAnalogClock();
                break;
            case 'calculator':
                this.initializeCalculator();
                break;
            case 'music':
                this.initializeMusicPlayer();
                break;
            // سایر برنامه‌ها...
        }
    }

    // ================== محتوای برنامه‌ها ==================

    // ساعت
    createClockApp() {
        return `
            <div class="clock-app">
                <div class="main-clock">${this.getCurrentTime()}</div>
                <div class="date-display">${this.getCurrentDate()}</div>
                <div class="analog-clock">
                    <div class="clock-hand hour-hand" id="hour-hand"></div>
                    <div class="clock-hand minute-hand" id="minute-hand"></div>
                </div>
            </div>
        `;
    }

    // ماشین حساب
    createCalculatorApp() {
        return `
            <div class="calculator">
                <input type="text" class="calculator-display" id="calc-display" readonly value="0">
                <div class="calculator-keys">
                    <button class="calc-key number" onclick="xhOS.inputNumber('7')">۷</button>
                    <button class="calc-key number" onclick="xhOS.inputNumber('8')">۸</button>
                    <button class="calc-key number" onclick="xhOS.inputNumber('9')">۹</button>
                    <button class="calc-key operator" onclick="xhOS.inputOperator('/')">÷</button>
                    
                    <button class="calc-key number" onclick="xhOS.inputNumber('4')">۴</button>
                    <button class="calc-key number" onclick="xhOS.inputNumber('5')">۵</button>
                    <button class="calc-key number" onclick="xhOS.inputNumber('6')">۶</button>
                    <button class="calc-key operator" onclick="xhOS.inputOperator('*')">×</button>
                    
                    <button class="calc-key number" onclick="xhOS.inputNumber('1')">۱</button>
                    <button class="calc-key number" onclick="xhOS.inputNumber('2')">۲</button>
                    <button class="calc-key number" onclick="xhOS.inputNumber('3')">۳</button>
                    <button class="calc-key operator" onclick="xhOS.inputOperator('-')">-</button>
                    
                    <button class="calc-key number" onclick="xhOS.inputNumber('0')">۰</button>
                    <button class="calc-key number" onclick="xhOS.inputNumber('.')">.</button>
                    <button class="calc-key equals" onclick="xhOS.calculate()">=</button>
                    <button class="calc-key operator" onclick="xhOS.inputOperator('+')">+</button>
                    
                    <button class="calc-key" onclick="xhOS.clear()" style="grid-column: span 2;">پاک کردن</button>
                    <button class="calc-key" onclick="xhOS.backspace()" style="grid-column: span 2;">حذف</button>
                </div>
            </div>
        `;
    }

    // سایر برنامه‌ها
    createCalendarApp() {
        return `
            <div class="simple-app">
                <h3>📅 تقویم</h3>
                <p>تقویم هوشمند XH OS</p>
                <p style="margin-top: 20px;">امروز: ${this.getCurrentDate()}</p>
            </div>
        `;
    }

    createWeatherApp() {
        return `
            <div class="simple-app">
                <h3>☀️ آب و هوا</h3>
                <p>اطلاعات آب و هوای لحظه‌ای</p>
                <p style="margin-top: 20px;">تهران: ۲۵°C | آفتابی</p>
            </div>
        `;
    }

    createMessagesApp() {
        return `
            <div class="simple-app">
                <h3>💬 پیام‌رسان</h3>
                <p>پیام‌رسان امن XH OS</p>
                <div style="margin-top: 20px; text-align: right;">
                    <div style="background: var(--glass-light); padding: 10px; border-radius: 10px; margin: 5px 0;">
                        <strong>علی:</strong> سلام! چطوری؟
                    </div>
                    <div style="background: var(--neon-blue); color: white; padding: 10px; border-radius: 10px; margin: 5px 0;">
                        <strong>شما:</strong> سلام! خوبم، ممنون
                    </div>
                </div>
            </div>
        `;
    }

    createCameraApp() {
        return `
            <div class="simple-app">
                <h3>📷 دوربین</h3>
                <p>دوربین ۱۰۸ مگاپیکسل XH OS</p>
                <div style="margin-top: 20px; width: 200px; height: 150px; background: #333; border-radius: 10px; margin: 20px auto; display: flex; align-items: center; justify-content: center; font-size: 48px;">
                    📷
                </div>
                <button style="padding: 10px 20px; background: var(--neon-blue); color: white; border: none; border-radius: 8px; cursor: pointer;">عکس بگیر</button>
            </div>
        `;
    }

    createMusicApp() {
        return `
            <div class="simple-app">
                <h3>🎵 موزیک پلیر</h3>
                <p>پخش موسیقی با کیفیت بالا</p>
                <div style="margin-top: 20px; text-align: center;">
                    <div style="width: 150px; height: 150px; background: linear-gradient(135deg, #F43F5E, #EF4444); border-radius: 10px; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; font-size: 48px;">
                        🎵
                    </div>
                    <div><strong>آهنگ در حال پخش</strong></div>
                    <div style="color: var(--secondary-text); margin: 10px 0;">خواننده</div>
                    <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
                        <button style="padding: 10px; background: var(--glass-light); border: none; border-radius: 50%; color: white; cursor: pointer;">⏮️</button>
                        <button style="padding: 10px 15px; background: var(--neon-blue); border: none; border-radius: 50%; color: white; cursor: pointer;">⏸️</button>
                        <button style="padding: 10px; background: var(--glass-light); border: none; border-radius: 50%; color: white; cursor: pointer;">⏭️</button>
                    </div>
                </div>
            </div>
        `;
    }

    createContactsApp() {
        return `
            <div class="simple-app">
                <h3>👥 مخاطبین</h3>
                <p>دفترچه تلفن هوشمند</p>
                <div style="margin-top: 20px; text-align: right;">
                    <div style="padding: 10px; border-bottom: 1px solid var(--glass-light);">👤 علی احمدی</div>
                    <div style="padding: 10px; border-bottom: 1px solid var(--glass-light);">👤 فاطمه رضایی</div>
                    <div style="padding: 10px;">👤 محمد کریمی</div>
                </div>
            </div>
        `;
    }

    createBrowserApp() {
        return `
            <div class="simple-app">
                <h3>🌐 مرورگر</h3>
                <p>مرورگر سریع و امن</p>
                <div style="margin-top: 20px;">
                    <input type="text" placeholder="آدرس سایت را وارد کنید..." style="width: 100%; padding: 10px; border: 1px solid var(--glass-light); border-radius: 8px; background: var(--glass-light); color: white; margin-bottom: 10px;">
                    <button style="width: 100%; padding: 10px; background: var(--neon-blue); color: white; border: none; border-radius: 8px; cursor: pointer;">جستجو</button>
                </div>
            </div>
        `;
    }

    createPhotosApp() {
        return `
            <div class="simple-app">
                <h3>🖼️ گالری</h3>
                <p>گالری عکس‌های شما</p>
                <div style="margin-top: 20px; display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px;">
                    <div style="aspect-ratio: 1; background: var(--glass-light); border-radius: 8px; display: flex; align-items: center; justify-content: center;">📷</div>
                    <div style="aspect-ratio: 1; background: var(--glass-light); border-radius: 8px; display: flex; align-items: center; justify-content: center;">📷</div>
                    <div style="aspect-ratio: 1; background: var(--glass-light); border-radius: 8px; display: flex; align-items: center; justify-content: center;">📷</div>
                    <div style="aspect-ratio: 1; background: var(--glass-light); border-radius: 8px; display: flex; align-items: center; justify-content: center;">📷</div>
                    <div style="aspect-ratio: 1; background: var(--glass-light); border-radius: 8px; display: flex; align-items: center; justify-content: center;">📷</div>
                    <div style="aspect-ratio: 1; background: var(--glass-light); border-radius: 8px; display: flex; align-items: center; justify-content: center;">📷</div>
                </div>
            </div>
        `;
    }

    createSettingsApp() {
        return `
            <div class="simple-app">
                <h3>⚙️ تنظیمات</h3>
                <p>تنظیمات سیستم عامل</p>
                <div style="margin-top: 20px; text-align: right;">
                    <div style="padding: 15px; border-bottom: 1px solid var(--glass-light); display: flex; justify-content: space-between; align-items: center;">
                        <span>تم تیره</span>
                        <div style="width: 50px; height: 25px; background: var(--neon-blue); border-radius: 12px; position: relative;">
                            <div style="width: 21px; height: 21px; background: white; border-radius: 50%; position: absolute; top: 2px; right: 2px;"></div>
                        </div>
                    </div>
                    <div style="padding: 15px; border-bottom: 1px solid var(--glass-light); display: flex; justify-content: space-between; align-items: center;">
                        <span>صدا</span>
                        <div style="width: 50px; height: 25px; background: var(--glass-light); border-radius: 12px; position: relative;">
                            <div style="width: 21px; height: 21px; background: white; border-radius: 50%; position: absolute; top: 2px; left: 2px;"></div>
                        </div>
                    </div>
                    <div style="padding: 15px;">🔔 اعلان‌ها</div>
                </div>
            </div>
        `;
    }

    createNotesApp() {
        return `
            <div class="simple-app">
                <h3>📝 یادداشت</h3>
                <p>یادداشت‌برداری سریع</p>
                <div style="margin-top: 20px;">
                    <textarea placeholder="یادداشت خود را اینجا بنویسید..." style="width: 100%; height: 200px; padding: 15px; border: 1px solid var(--glass-light); border-radius: 8px; background: var(--glass-light); color: white; resize: none;"></textarea>
                    <button style="margin-top: 10px; padding: 10px 20px; background: var(--neon-blue); color: white; border: none; border-radius: 8px; cursor: pointer;">ذخیره</button>
                </div>
            </div>
        `;
    }

    createPhoneApp() {
        return `
            <div class="simple-app">
                <h3>📞 تلفن</h3>
                <p>تماس‌های صوتی</p>
                <div style="margin-top: 20px; text-align: center;">
                    <input type="tel" placeholder="شماره تلفن را وارد کنید" style="width: 100%; padding: 15px; border: 1px solid var(--glass-light); border-radius: 8px; background: var(--glass-light); color: white; margin-bottom: 20px; font-size: 18px; text-align: center;">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 20px;">
                        ${['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '*', '۰', '#'].map(num => 
                            `<button onclick="xhOS.inputPhone('${num}')" style="padding: 15px; background: var(--glass-light); border: none; border-radius: 8px; color: white; cursor: pointer; font-size: 18px;">${num}</button>`
                        ).join('')}
                    </div>
                    <button style="padding: 15px 30px; background: var(--neon-blue); color: white; border: none; border-radius: 8px; cursor: pointer; font-size: 18px;">📞 تماس</button>
                </div>
            </div>
        `;
    }

    // ================== عملکرد ماشین حساب ==================
    initializeCalculator() {
        this.calcExpression = '';
        this.calcResult = 0;
    }

    inputNumber(num) {
        const display = document.getElementById('calc-display');
        if (display.value === '0' || display.value === 'خطا') {
            display.value = num;
        } else {
            display.value += num;
        }
        this.calcExpression = display.value;
    }

    inputOperator(operator) {
        const display = document.getElementById('calc-display');
        display.value += ` ${operator} `;
        this.calcExpression = display.value;
    }

    calculate() {
        try {
            const display = document.getElementById('calc-display');
            // تبدیل اعداد فارسی به انگلیسی
            let expression = display.value.replace(/[۰-۹]/g, d => '۰۱۲۳۴۵۶۷۸۹'.indexOf(d));
            // ارزیابی عبارت
            const result = eval(expression);
            display.value = result;
            this.calcResult = result;
        } catch (error) {
            document.getElementById('calc-display').value = 'خطا';
        }
    }

    clear() {
        document.getElementById('calc-display').value = '0';
        this.calcExpression = '';
    }

    backspace() {
        const display = document.getElementById('calc-display');
        display.value = display.value.slice(0, -1) || '0';
        this.calcExpression = display.value;
    }

    // ================== عملکرد ساعت ==================
    startAnalogClock() {
        setInterval(() => {
            const now = new Date();
            const hours = now.getHours() % 12;
            const minutes = now.getMinutes();
            const seconds = now.getSeconds();
            
            const hourHand = document.getElementById('hour-hand');
            const minuteHand = document.getElementById('minute-hand');
            
            if (hourHand && minuteHand) {
                const hourAngle = (hours * 30) + (minutes * 0.5);
                const minuteAngle = minutes * 6;
                
                hourHand.style.transform = `translate(-50%, -100%) rotate(${hourAngle}deg)`;
                minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteAngle}deg)`;
            }
        }, 1000);
    }

    // ================== عملکرد موزیک ==================
    initializeMusicPlayer() {
        // اینجا می‌توانید عملکرد پخش موسیقی را اضافه کنید
    }

    // ================== ابزارهای کمکی ==================
    getCurrentTime() {
        const now = new Date();
        return now.toLocaleTimeString('fa-IR', { 
            hour12: false,
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    getCurrentDate() {
        const now = new Date();
        return now.toLocaleDateString('fa-IR', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    updateClock() {
        const timeElements = document.querySelectorAll('.time, .clock');
        timeElements.forEach(element => {
            if (element.classList.contains('clock')) {
                element.textContent = this.getCurrentTime();
            } else {
                element.textContent = this.getCurrentTime().split(':')[0] + ':' + this.getCurrentTime().split(':')[1];
            }
        });
    }

    startClockUpdater() {
        setInterval(() => {
            this.updateClock();
        }, 60000); // هر دقیقه
    }

    // پخش صدا (شبیه‌سازی)
    playSound(type) {
        // در پیاده‌سازی واقعی، می‌توانید فایل‌های صوتی اضافه کنید
        console.log(`Playing ${type} sound`);
    }

    inputPhone(num) {
        const phoneInput = document.querySelector('input[type="tel"]');
        if (phoneInput) {
            phoneInput.value += num;
        }
    }
}

// راه‌اندازی سیستم
let xhOS;
document.addEventListener('DOMContentLoaded', () => {
    xhOS = new XHOS();
});

// جلوگیری از زوم در موبایل
document.addEventListener('gesturestart', function (e) {
    e.preventDefault();
});

// جلوگیری از اسکرول در موبایل
document.addEventListener('touchmove', function(e) {
    if (e.scale !== 1) {
        e.preventDefault();
    }
}, { passive: false });