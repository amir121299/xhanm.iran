// XH OS Enhanced - سیستم عامل بهبود یافته شبیه One UI 8
class XHOSEnhanced {
    constructor() {
        this.currentScreen = 'boot-screen';
        this.isLocked = true;
        this.apps = {};
        this.isInitialized = false;
        this.touchStartY = 0;
        this.touchStartTime = 0;
        this.bootStartTime = Date.now();
        
        this.init();
    }

    async init() {
        try {
            await this.setupEventListeners();
            await this.initializeApps();
            this.startBootSequence();
            this.updateClocks();
            this.startClockUpdater();
            this.startAnimations();
            this.isInitialized = true;
            console.log('XH OS Enhanced initialized successfully');
        } catch (error) {
            console.error('Initialization error:', error);
        }
    }

    // تنظیم رویدادها
    async setupEventListeners() {
        // رویداد لمس و ماوس
        const handleTouchStart = (e) => {
            this.touchStartY = e.touches ? e.touches[0].clientY : e.clientY;
            this.touchStartTime = Date.now();
        };

        const handleTouchEnd = (e) => {
            if (!this.touchStartY) return;
            
            const touchEndY = e.changedTouches ? e.changedTouches[0].clientY : e.clientY;
            const deltaY = this.touchStartY - touchEndY;
            const deltaTime = Date.now() - this.touchStartTime;
            
            this.touchStartY = null;
            
            // باز کردن قفل
            if (this.currentScreen === 'lock-screen' && 
                deltaY > 80 && 
                deltaTime < 1000) {
                this.unlockDevice();
            }
        };

        // اضافه کردن رویدادها
        document.addEventListener('touchstart', handleTouchStart, { passive: true });
        document.addEventListener('touchend', handleTouchEnd, { passive: true });
        document.addEventListener('mousedown', handleTouchStart);
        document.addEventListener('mouseup', handleTouchEnd);

        // دکمه بازگشت
        const backBtn = document.getElementById('back-btn');
        if (backBtn) {
            backBtn.addEventListener('click', () => {
                this.navigateBack();
            });
        }

        // دکمه‌های صفحه قفل
        const cameraBtn = document.getElementById('camera-btn');
        if (cameraBtn) {
            cameraBtn.addEventListener('click', () => {
                this.launchApp('camera');
            });
        }

        // رویدادهای آیکون‌ها
        this.setupAppIconEvents();

        // رویداد کیبورد
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.currentScreen === 'app-screen') {
                this.navigateBack();
            }
        });

        // جلوگیری از زوم
        document.addEventListener('gesturestart', (e) => e.preventDefault());
        document.addEventListener('gesturechange', (e) => e.preventDefault());
        document.addEventListener('gestureend', (e) => e.preventDefault());

        // رویداد تغییر اندازه صفحه
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    setupAppIconEvents() {
        const appIcons = document.querySelectorAll('.app-icon, .dock-app');
        appIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.preventDefault();
                const appName = icon.getAttribute('data-app');
                if (appName) {
                    this.animateIconClick(icon);
                    setTimeout(() => {
                        this.launchApp(appName);
                    }, 200);
                }
            });

            // انیمیشن hover
            icon.addEventListener('mouseenter', () => {
                if (window.innerWidth > 768) {
                    this.animateIconHover(icon);
                }
            });
        });
    }

    // انیمیشن کلیک آیکون
    animateIconClick(icon) {
        const bg = icon.querySelector('.app-bg');
        if (bg) {
            bg.style.transform = 'scale(0.9)';
            bg.style.filter = 'brightness(1.2)';
            setTimeout(() => {
                bg.style.transform = '';
                bg.style.filter = '';
            }, 200);
        }
        
        // افکت موجی
        this.createRippleEffect(icon);
    }

    // انیمیشن hover آیکون
    animateIconHover(icon) {
        const bg = icon.querySelector('.app-bg');
        if (bg && window.innerWidth > 768) {
            bg.style.transform = 'translateY(-4px) scale(1.05)';
            bg.style.boxShadow = '0 12px 40px rgba(0, 0, 0, 0.3)';
        }
    }

    // افکت موجی
    createRippleEffect(element) {
        const ripple = document.createElement('div');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: 50%;
            top: 50%;
            transform: translate(-50%, -50%);
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: translate(-50%, -50%) scale(0);
            animation: ripple 0.6s ease-out;
            pointer-events: none;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    }

    // شروع دنباله بوت
    startBootSequence() {
        setTimeout(() => {
            this.fadeToScreen('lock-screen');
        }, 4000);

        // انیمیشن‌های بوت
        this.animateBootElements();
    }

    animateBootElements() {
        const logo = document.querySelector('.boot-logo');
        const subtitle = document.querySelector('.boot-subtitle');
        const loader = document.querySelector('.boot-loader');
        const version = document.querySelector('.boot-version');
        const particles = document.querySelector('.boot-particles');

        if (logo) {
            // انیمیشن پیشرفته لوگو
            setTimeout(() => {
                logo.style.animation = 'logoBounce 2s ease-in-out infinite, logoGlow 3s ease-in-out infinite';
            }, 200);
        }

        if (subtitle) {
            setTimeout(() => {
                subtitle.style.opacity = '1';
                subtitle.style.transform = 'translateY(0)';
            }, 500);
        }

        if (loader) {
            setTimeout(() => {
                loader.style.opacity = '1';
                loader.style.transform = 'translateY(0)';
            }, 1000);
        }

        if (version) {
            setTimeout(() => {
                version.style.opacity = '1';
                version.style.transform = 'translateY(0)';
            }, 1500);
        }

        if (particles) {
            // شروع انیمیشن ذرات
            particles.style.animation = 'particlesFloat 8s linear infinite';
        }
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
        
        // ویژگی‌های خاص
        if (screenId === 'home-screen') {
            this.onHomeScreenActivated();
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

    // باز کردن قفل دستگاه
    unlockDevice() {
        this.isLocked = false;
        const homeScreen = document.getElementById('home-screen');
        const lockScreen = document.getElementById('lock-screen');
        
        if (homeScreen && lockScreen) {
            // افکت محو قفل
            lockScreen.style.transform = 'translateY(-100vh)';
            lockScreen.style.transition = 'transform 0.6s ease';
            
            // فعال کردن والپیپر تار
            setTimeout(() => {
                homeScreen.classList.add('unlocked');
                this.switchScreen('home-screen');
            }, 300);
        }
        
        // صدای باز کردن (شبیه‌سازی)
        this.playSystemSound('unlock');
    }

    // فعال شدن صفحه اصلی
    onHomeScreenActivated() {
        this.updateAllClocks();
        this.animateHomeScreenElements();
    }

    animateHomeScreenElements() {
        // انیمیشن ورود آیکون‌ها با تأخیر
        const appIcons = document.querySelectorAll('.app-icon');
        appIcons.forEach((icon, index) => {
            setTimeout(() => {
                icon.style.opacity = '1';
                icon.style.transform = 'translateY(0) scale(1)';
                icon.style.animation = `fadeInUp 0.6s ease-out ${index * 0.1}s both`;
            }, 100 + (index * 80));
        });

        // انیمیشن ویجت سلامتی
        const widget = document.querySelector('.health-widget');
        if (widget) {
            setTimeout(() => {
                widget.style.opacity = '1';
                widget.style.transform = 'translateX(0)';
                widget.style.animation = 'slideInRight 0.8s ease-out 0.3s both';
            }, 400);
        }

        // انیمیشن داک
        const dockApps = document.querySelectorAll('.dock-app');
        dockApps.forEach((app, index) => {
            setTimeout(() => {
                app.style.opacity = '1';
                app.style.transform = 'scale(1)';
                app.style.animation = `bounceIn 0.6s ease-out ${1 + (index * 0.2)}s both`;
            }, 1200 + (index * 200));
        });

        // انیمیشن نوار وضعیت
        const statusBar = document.querySelector('.status-bar');
        if (statusBar) {
            statusBar.style.animation = 'fadeInDown 0.5s ease-out both';
        }

        // افکت شروع انیمیشن‌های پس‌زمینه
        this.startBackgroundAnimations();
    }

    // انیمیشن‌های پس‌زمینه
    startBackgroundAnimations() {
        const wallpaper = document.querySelector('.wallpaper-image');
        if (wallpaper) {
            wallpaper.style.animation = 'wallpaperShift 8s ease-in-out infinite';
        }

        // انیمیشن نوار وضعیت
        this.startStatusBarAnimation();
    }

    // انیمیشن نوار وضعیت
    startStatusBarAnimation() {
        const timeElements = document.querySelectorAll('.time-display');
        timeElements.forEach(element => {
            setInterval(() => {
                element.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    element.style.transform = 'scale(1)';
                }, 200);
            }, 60000); // هر دقیقه
        });
    }

    // راه‌اندازی برنامه‌ها
    async initializeApps() {
        this.apps = {
            phone: {
                name: 'تلفن',
                icon: 'fas fa-phone',
                content: this.createPhoneApp()
            },
            contacts: {
                name: 'مخاطبین',
                icon: 'fas fa-address-book',
                content: this.createContactsApp()
            },
            messages: {
                name: 'پیام‌رسان',
                icon: 'fas fa-comment',
                content: this.createMessagesApp()
            },
            browser: {
                name: 'اینترنت',
                icon: 'fas fa-globe',
                content: this.createBrowserApp()
            },
            camera: {
                name: 'دوربین',
                icon: 'fas fa-camera',
                content: this.createCameraApp()
            },
            gallery: {
                name: 'گالری',
                icon: 'fas fa-images',
                content: this.createGalleryApp()
            },
            music: {
                name: 'موسیقی',
                icon: 'fas fa-music',
                content: this.createMusicApp()
            },
            weather: {
                name: 'آب و هوا',
                icon: 'fas fa-cloud-sun',
                content: this.createWeatherApp()
            },
            clock: {
                name: 'ساعت',
                icon: 'fas fa-clock',
                content: this.createClockApp()
            },
            calendar: {
                name: 'تقویم',
                icon: 'fas fa-calendar',
                content: this.createCalendarApp()
            },
            calculator: {
                name: 'ماشین حساب',
                icon: 'fas fa-calculator',
                content: this.createCalculatorApp()
            },
            settings: {
                name: 'تنظیمات',
                icon: 'fas fa-cog',
                content: this.createSettingsApp()
            },
            notes: {
                name: 'یادداشت',
                icon: 'fas fa-sticky-note',
                content: this.createNotesApp()
            },
            maps: {
                name: 'نقشه',
                icon: 'fas fa-map',
                content: this.createMapsApp()
            },
            files: {
                name: 'فایل‌ها',
                icon: 'fas fa-folder',
                content: this.createFilesApp()
            },
            store: {
                name: 'فروشگاه',
                icon: 'fas fa-store',
                content: this.createStoreApp()
            }
        };
    }

    // راه‌اندازی برنامه
    async launchApp(appName) {
        if (!this.apps[appName]) {
            console.warn(`App ${appName} not found`);
            return;
        }
        
        const app = this.apps[appName];
        const appContent = document.querySelector('.app-content');
        const headerTitle = document.querySelector('.header-title');
        
        if (!appContent || !headerTitle) {
            console.error('App screen elements not found');
            return;
        }
        
        // تنظیم عنوان
        headerTitle.textContent = app.name;
        
        // بارگذاری محتوا با انیمیشن
        appContent.innerHTML = `<div class="app-page">${app.content}</div>`;
        
        // انتقال به صفحه برنامه
        this.switchScreen('app-screen');
        
        // اجرای عملیات خاص هر برنامه
        setTimeout(() => {
            this.initializeAppFeatures(appName);
        }, 100);
        
        // صدای اجرا
        this.playSystemSound('app-launch');
    }

    // عملیات خاص هر برنامه
    initializeAppFeatures(appName) {
        switch (appName) {
            case 'clock':
                this.startAdvancedClock();
                break;
            case 'calculator':
                this.initializeEnhancedCalculator();
                break;
            case 'music':
                this.initializeMusicPlayer();
                break;
            case 'camera':
                this.initializeCamera();
                break;
            // سایر برنامه‌ها...
        }
    }

    // ================== محتوای برنامه‌ها ==================

    // تلفن
    createPhoneApp() {
        return `
            <div class="enhanced-app">
                <h3>📞 تلفن</h3>
                <p>تماس‌های صوتی با کیفیت HD</p>
                <div style="margin-top: 30px;">
                    <input type="tel" placeholder="شماره تلفن را وارد کنید" 
                           style="width: 100%; padding: 16px; border: 1px solid rgba(255,255,255,0.2); 
                                  border-radius: 12px; background: rgba(255,255,255,0.1); 
                                  color: white; font-size: 18px; text-align: center; margin-bottom: 20px;">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom: 30px;">
                        ${['۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹', '*', '۰', '#'].map(num => 
                            `<button onclick="xhOSEnhanced.inputPhone('${num}')" 
                                    style="padding: 16px; background: var(--bg-card); border: 1px solid rgba(255,255,255,0.1); 
                                           border-radius: 12px; color: white; cursor: pointer; font-size: 18px;
                                           transition: all 0.3s ease;">${num}</button>`
                        ).join('')}
                    </div>
                    <button onclick="xhOSEnhanced.makeCall()" 
                            style="width: 100%; padding: 16px; background: linear-gradient(135deg, var(--primary-blue), var(--accent-purple)); 
                                   color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 18px;">
                        📞 تماس
                    </button>
                </div>
            </div>
        `;
    }

    // مخاطبین
    createContactsApp() {
        return `
            <div class="enhanced-app">
                <h3>👥 مخاطبین</h3>
                <p>دفترچه تلفن هوشمند با جستجوی پیشرفته</p>
                <div style="margin-top: 30px;">
                    <input type="text" placeholder="جستجو در مخاطبین..." 
                           style="width: 100%; padding: 12px; border: 1px solid rgba(255,255,255,0.2); 
                                  border-radius: 8px; background: rgba(255,255,255,0.1); 
                                  color: white; margin-bottom: 20px;">
                    <div style="text-align: right;">
                        <div style="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); 
                                    display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: var(--accent-blue); 
                                        border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                👤
                            </div>
                            <div>
                                <div style="font-weight: 600;">علی احمدی</div>
                                <div style="color: var(--text-secondary); font-size: 14px;">۰۹۱۲۳۴۵۶۷۸۹</div>
                            </div>
                        </div>
                        <div style="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); 
                                    display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: var(--accent-green); 
                                        border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                👤
                            </div>
                            <div>
                                <div style="font-weight: 600;">فاطمه رضایی</div>
                                <div style="color: var(--text-secondary); font-size: 14px;">۰۹۱۲۳۴۵۶۷۸۹</div>
                            </div>
                        </div>
                        <div style="padding: 16px; display: flex; align-items: center; gap: 12px;">
                            <div style="width: 40px; height: 40px; background: var(--accent-orange); 
                                        border-radius: 50%; display: flex; align-items: center; justify-content: center;">
                                👤
                            </div>
                            <div>
                                <div style="font-weight: 600;">محمد کریمی</div>
                                <div style="color: var(--text-secondary); font-size: 14px;">۰۹۱۲۳۴۵۶۷۸۹</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // پیام‌رسان
    createMessagesApp() {
        return `
            <div class="enhanced-app">
                <h3>💬 پیام‌رسان</h3>
                <p>پیام‌رسان امن با رمزنگاری end-to-end</p>
                <div style="margin-top: 30px; text-align: right;">
                    <div style="background: var(--bg-card); padding: 16px; border-radius: 12px; 
                                margin: 8px 0; max-width: 80%;">
                        <strong>علی:</strong> سلام! چطوری؟
                    </div>
                    <div style="background: linear-gradient(135deg, var(--primary-blue), var(--accent-purple)); 
                                color: white; padding: 16px; border-radius: 12px; 
                                margin: 8px 0; margin-left: auto; max-width: 80%;">
                        <strong>شما:</strong> سلام! خوبم، ممنون 😊
                    </div>
                    <div style="background: var(--bg-card); padding: 16px; border-radius: 12px; 
                                margin: 8px 0; max-width: 80%;">
                        <strong>علی:</strong> امروز هوا خیلی خوبه!
                    </div>
                    <div style="margin-top: 20px; display: flex; gap: 12px;">
                        <input type="text" placeholder="پیام خود را بنویسید..." 
                               style="flex: 1; padding: 12px; border: 1px solid rgba(255,255,255,0.2); 
                                      border-radius: 20px; background: rgba(255,255,255,0.1); 
                                      color: white;">
                        <button style="padding: 12px 20px; background: var(--primary-blue); 
                                       color: white; border: none; border-radius: 20px; cursor: pointer;">
                            📤
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // اینترنت
    createBrowserApp() {
        return `
            <div class="enhanced-app">
                <h3>🌐 اینترنت</h3>
                <p>مرورگر سریع و امن با حالت تاریک</p>
                <div style="margin-top: 30px;">
                    <div style="display: flex; gap: 8px; margin-bottom: 20px;">
                        <input type="text" placeholder="آدرس سایت را وارد کنید..." 
                               style="flex: 1; padding: 12px; border: 1px solid rgba(255,255,255,0.2); 
                                      border-radius: 20px; background: rgba(255,255,255,0.1); 
                                      color: white;">
                        <button style="padding: 12px 16px; background: var(--primary-blue); 
                                       color: white; border: none; border-radius: 20px; cursor: pointer;">
                            🔍
                        </button>
                    </div>
                    <div style="background: var(--bg-card); padding: 20px; border-radius: 12px; text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 16px;">🌐</div>
                        <div style="color: var(--text-secondary);">صفحه وب نمایش داده می‌شود</div>
                    </div>
                </div>
            </div>
        `;
    }

    // دوربین
    createCameraApp() {
        return `
            <div class="enhanced-app">
                <h3>📷 دوربین</h3>
                <p>دوربین ۱۰۸ مگاپیکسل با HDR</p>
                <div style="margin-top: 30px;">
                    <div style="width: 100%; height: 250px; background: linear-gradient(135deg, #333, #555); 
                                border-radius: 12px; margin: 20px 0; display: flex; 
                                align-items: center; justify-content: center; position: relative; overflow: hidden;">
                        <div style="font-size: 64px; opacity: 0.6;">📷</div>
                        <div style="position: absolute; top: 16px; right: 16px; 
                                    background: rgba(0,0,0,0.5); padding: 8px 12px; border-radius: 8px;">
                            ۱۰۸MP
                        </div>
                    </div>
                    <div style="display: flex; justify-content: center; gap: 20px; margin-top: 20px;">
                        <button style="padding: 12px; background: var(--bg-card); border: 1px solid rgba(255,255,255,0.2); 
                                       border-radius: 50%; color: white; cursor: pointer; font-size: 20px;">
                            🔄
                        </button>
                        <button onclick="xhOSEnhanced.takePhoto()" 
                                style="padding: 16px; background: var(--primary-blue); 
                                       color: white; border: none; border-radius: 50%; 
                                       cursor: pointer; font-size: 24px; width: 80px; height: 80px;">
                            📷
                        </button>
                        <button style="padding: 12px; background: var(--bg-card); border: 1px solid rgba(255,255,255,0.2); 
                                       border-radius: 50%; color: white; cursor: pointer; font-size: 20px;">
                            ⚡
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // گالری
    createGalleryApp() {
        return `
            <div class="enhanced-app">
                <h3>🖼️ گالری</h3>
                <p>گالری عکس‌های شما با سازماندهی هوشمند</p>
                <div style="margin-top: 30px;">
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                        ${Array.from({length: 12}, (_, i) => `
                            <div style="aspect-ratio: 1; background: var(--bg-card); 
                                        border-radius: 8px; display: flex; 
                                        align-items: center; justify-content: center; cursor: pointer;
                                        transition: all 0.3s ease;" onmouseover="this.style.transform='scale(1.05)'" 
                                        onmouseout="this.style.transform='scale(1)'">
                                📷
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    // موسیقی
    createMusicApp() {
        return `
            <div class="music-player">
                <div class="album-art">🎵</div>
                <div class="track-info">
                    <div class="track-title">آهنگ در حال پخش</div>
                    <div class="track-artist">خواننده محبوب</div>
                </div>
                <div class="progress-bar">
                    <div class="progress-fill"></div>
                </div>
                <div style="display: flex; justify-content: space-between; margin: 8px 0; font-size: 12px; color: var(--text-secondary);">
                    <span>۱:۲۳</span>
                    <span>۳:۴۵</span>
                </div>
                <div class="music-controls">
                    <button class="control-btn" onclick="xhOSEnhanced.previousTrack()">
                        <i class="fas fa-step-backward"></i>
                    </button>
                    <button class="control-btn play-pause" onclick="xhOSEnhanced.togglePlay()">
                        <i class="fas fa-play" id="play-icon"></i>
                    </button>
                    <button class="control-btn" onclick="xhOSEnhanced.nextTrack()">
                        <i class="fas fa-step-forward"></i>
                    </button>
                </div>
            </div>
        `;
    }

    // آب و هوا
    createWeatherApp() {
        return `
            <div class="enhanced-app">
                <h3>☀️ آب و هوا</h3>
                <p>پیش‌بینی دقیق آب و هوا</p>
                <div style="margin-top: 30px;">
                    <div style="text-align: center; background: var(--bg-card); padding: 30px; border-radius: 16px;">
                        <div style="font-size: 64px; margin-bottom: 16px;">☀️</div>
                        <div style="font-size: 48px; font-weight: 300; margin-bottom: 8px;">۲۵°C</div>
                        <div style="color: var(--text-secondary); margin-bottom: 20px;">تهران - آفتابی</div>
                        <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin-top: 20px;">
                            <div>
                                <div style="font-size: 24px; font-weight: 600;">۳۰°</div>
                                <div style="color: var(--text-secondary); font-size: 12px;">حداکثر</div>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: 600;">۱۸°</div>
                                <div style="color: var(--text-secondary); font-size: 12px;">حداقل</div>
                            </div>
                            <div>
                                <div style="font-size: 24px; font-weight: 600;">۶۵%</div>
                                <div style="color: var(--text-secondary); font-size: 12px;">رطوبت</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ساعت
    createClockApp() {
        return `
            <div class="clock-app">
                <div class="main-clock">${this.getCurrentTime()}</div>
                <div class="date-display">${this.getCurrentDate()}</div>
                <div class="analog-clock-large">
                    <div class="clock-hand-large hour-hand-large" id="hour-hand-large"></div>
                    <div class="clock-hand-large minute-hand-large" id="minute-hand-large"></div>
                    <div class="analog-center"></div>
                </div>
            </div>
        `;
    }

    // تقویم
    createCalendarApp() {
        return `
            <div class="enhanced-app">
                <h3>📅 تقویم</h3>
                <p>تقویم هوشمند با یادآوری‌ها</p>
                <div style="margin-top: 30px;">
                    <div style="text-align: center; background: var(--bg-card); padding: 20px; border-radius: 12px;">
                        <div style="font-size: 48px; margin-bottom: 16px;">${new Date().getDate()}</div>
                        <div style="color: var(--text-secondary); margin-bottom: 16px;">${this.getCurrentDate()}</div>
                        <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 16px;">
                            <div style="text-align: right;">
                                <div style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.05);">
                                    <div style="font-weight: 600;">جلسه کاری</div>
                                    <div style="color: var(--text-secondary); font-size: 14px;">۱۴:۰۰ - ۱۵:۰۰</div>
                                </div>
                                <div style="padding: 8px 0;">
                                    <div style="font-weight: 600;">قرار ملاقات</div>
                                    <div style="color: var(--text-secondary); font-size: 14px;">۱۸:۳۰</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ماشین حساب
    createCalculatorApp() {
        return `
            <div class="calculator-enhanced">
                <input type="text" class="calculator-display-enhanced" id="calc-display-enhanced" readonly value="0">
                <div class="calculator-keys-enhanced">
                    <button class="calc-key-enhanced function" onclick="xhOSEnhanced.calcClear()">AC</button>
                    <button class="calc-key-enhanced function" onclick="xhOSEnhanced.calcBackspace()">⌫</button>
                    <button class="calc-key-enhanced operator" onclick="xhOSEnhanced.calcOperator('/')">÷</button>
                    <button class="calc-key-enhanced operator" onclick="xhOSEnhanced.calcOperator('*')">×</button>
                    
                    <button class="calc-key-enhanced number" onclick="xhOSEnhanced.calcNumber('7')">۷</button>
                    <button class="calc-key-enhanced number" onclick="xhOSEnhanced.calcNumber('8')">۸</button>
                    <button class="calc-key-enhanced number" onclick="xhOSEnhanced.calcNumber('9')">۹</button>
                    <button class="calc-key-enhanced operator" onclick="xhOSEnhanced.calcOperator('-')">-</button>
                    
                    <button class="calc-key-enhanced number" onclick="xhOSEnhanced.calcNumber('4')">۴</button>
                    <button class="calc-key-enhanced number" onclick="xhOSEnhanced.calcNumber('5')">۵</button>
                    <button class="calc-key-enhanced number" onclick="xhOSEnhanced.calcNumber('6')">۶</button>
                    <button class="calc-key-enhanced operator" onclick="xhOSEnhanced.calcOperator('+')">+</button>
                    
                    <button class="calc-key-enhanced number" onclick="xhOSEnhanced.calcNumber('1')">۱</button>
                    <button class="calc-key-enhanced number" onclick="xhOSEnhanced.calcNumber('2')">۲</button>
                    <button class="calc-key-enhanced number" onclick="xhOSEnhanced.calcNumber('3')">۳</button>
                    <button class="calc-key-enhanced equals" onclick="xhOSEnhanced.calcEquals()" rowspan="2">=</button>
                    
                    <button class="calc-key-enhanced number" onclick="xhOSEnhanced.calcNumber('0')">۰</button>
                    <button class="calc-key-enhanced number" onclick="xhOSEnhanced.calcNumber('.')">.</button>
                </div>
            </div>
        `;
    }

    // تنظیمات
    createSettingsApp() {
        return `
            <div class="enhanced-app">
                <h3>⚙️ تنظیمات</h3>
                <p>تنظیمات پیشرفته سیستم</p>
                <div style="margin-top: 30px; text-align: right;">
                    <div style="background: var(--bg-card); border-radius: 12px; overflow: hidden;">
                        <div style="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); 
                                    display: flex; justify-content: space-between; align-items: center;">
                            <span>تم تیره</span>
                            <div style="width: 50px; height: 28px; background: var(--primary-blue); 
                                        border-radius: 14px; position: relative; cursor: pointer;">
                                <div style="width: 24px; height: 24px; background: white; 
                                            border-radius: 50%; position: absolute; top: 2px; right: 2px;
                                            transition: all 0.3s ease;"></div>
                            </div>
                        </div>
                        <div style="padding: 16px; border-bottom: 1px solid rgba(255,255,255,0.1); 
                                    display: flex; justify-content: space-between; align-items: center;">
                            <span>صدا</span>
                            <div style="width: 50px; height: 28px; background: rgba(255,255,255,0.2); 
                                        border-radius: 14px; position: relative; cursor: pointer;">
                                <div style="width: 24px; height: 24px; background: white; 
                                            border-radius: 50%; position: absolute; top: 2px; left: 2px;
                                            transition: all 0.3s ease;"></div>
                            </div>
                        </div>
                        <div style="padding: 16px; display: flex; justify-content: space-between; align-items: center;">
                            <span>اعلان‌ها</span>
                            <i class="fas fa-chevron-left" style="color: var(--text-secondary);"></i>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // یادداشت
    createNotesApp() {
        return `
            <div class="enhanced-app">
                <h3>📝 یادداشت</h3>
                <p>یادداشت‌برداری سریع و هوشمند</p>
                <div style="margin-top: 30px;">
                    <textarea placeholder="یادداشت خود را اینجا بنویسید..." 
                              style="width: 100%; height: 250px; padding: 20px; 
                                     border: 1px solid rgba(255,255,255,0.2); 
                                     border-radius: 12px; background: rgba(255,255,255,0.1); 
                                     color: white; resize: none; font-size: 16px; line-height: 1.6;"></textarea>
                    <button onclick="xhOSEnhanced.saveNote()" 
                            style="margin-top: 16px; padding: 12px 24px; 
                                   background: linear-gradient(135deg, var(--primary-blue), var(--accent-purple)); 
                                   color: white; border: none; border-radius: 12px; cursor: pointer; font-size: 16px;">
                        💾 ذخیره یادداشت
                    </button>
                </div>
            </div>
        `;
    }

    // نقشه
    createMapsApp() {
        return `
            <div class="enhanced-app">
                <h3>🗺️ نقشه</h3>
                <p>ناوبری GPS با مسیریابی هوشمند</p>
                <div style="margin-top: 30px;">
                    <div style="width: 100%; height: 300px; background: linear-gradient(135deg, #2d5016, #4a7c59); 
                                border-radius: 12px; margin-bottom: 20px; position: relative; overflow: hidden;">
                        <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                                    font-size: 48px;">🗺️</div>
                        <div style="position: absolute; top: 16px; left: 16px; 
                                    background: rgba(255,255,255,0.9); padding: 8px 12px; border-radius: 8px; color: #333;">
                            📍 تهران
                        </div>
                    </div>
                    <div style="display: flex; gap: 12px;">
                        <input type="text" placeholder="مقصد را وارد کنید" 
                               style="flex: 1; padding: 12px; border: 1px solid rgba(255,255,255,0.2); 
                                      border-radius: 8px; background: rgba(255,255,255,0.1); color: white;">
                        <button style="padding: 12px 16px; background: var(--primary-blue); 
                                       color: white; border: none; border-radius: 8px; cursor: pointer;">
                            🔍
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    // فایل‌ها
    createFilesApp() {
        return `
            <div class="enhanced-app">
                <h3>📁 فایل‌ها</h3>
                <p>مدیریت فایل‌ها و پوشه‌ها</p>
                <div style="margin-top: 30px;">
                    <div style="text-align: right;">
                        <div style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); 
                                    display: flex; align-items: center; gap: 12px;">
                            <i class="fas fa-folder" style="color: var(--accent-orange);"></i>
                            <span>Documents</span>
                        </div>
                        <div style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); 
                                    display: flex; align-items: center; gap: 12px;">
                            <i class="fas fa-folder" style="color: var(--accent-blue);"></i>
                            <span>Pictures</span>
                        </div>
                        <div style="padding: 12px; border-bottom: 1px solid rgba(255,255,255,0.1); 
                                    display: flex; align-items: center; gap: 12px;">
                            <i class="fas fa-music" style="color: var(--accent-pink);"></i>
                            <span>Music</span>
                        </div>
                        <div style="padding: 12px; display: flex; align-items: center; gap: 12px;">
                            <i class="fas fa-download" style="color: var(--accent-green);"></i>
                            <span>Downloads</span>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // فروشگاه
    createStoreApp() {
        return `
            <div class="enhanced-app">
                <h3>🏪 فروشگاه</h3>
                <p>فروشگاه برنامه‌های XH OS</p>
                <div style="margin-top: 30px;">
                    <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 16px;">
                        <div style="background: var(--bg-card); padding: 20px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 32px; margin-bottom: 12px;">🎮</div>
                            <div style="font-weight: 600; margin-bottom: 8px;">بازی‌ها</div>
                            <div style="color: var(--text-secondary); font-size: 14px;">۱,۲۳۴ برنامه</div>
                        </div>
                        <div style="background: var(--bg-card); padding: 20px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 32px; margin-bottom: 12px;">📚</div>
                            <div style="font-weight: 600; margin-bottom: 8px;">کتاب‌ها</div>
                            <div style="color: var(--text-secondary); font-size: 14px;">۸۵۶ کتاب</div>
                        </div>
                        <div style="background: var(--bg-card); padding: 20px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 32px; margin-bottom: 12px;">🎬</div>
                            <div style="font-weight: 600; margin-bottom: 8px;">فیلم‌ها</div>
                            <div style="color: var(--text-secondary); font-size: 14px;">۴۵۶ فیلم</div>
                        </div>
                        <div style="background: var(--bg-card); padding: 20px; border-radius: 12px; text-align: center;">
                            <div style="font-size: 32px; margin-bottom: 12px;">🎵</div>
                            <div style="font-weight: 600; margin-bottom: 8px;">موسیقی</div>
                            <div style="color: var(--text-secondary); font-size: 14px;">۲,۱۰۰ آهنگ</div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    // ================== عملکردهای پیشرفته ==================

    // ساعت پیشرفته
    startAdvancedClock() {
        setInterval(() => {
            const now = new Date();
            const hours = now.getHours() % 12;
            const minutes = now.getMinutes();
            
            const hourHand = document.getElementById('hour-hand-large');
            const minuteHand = document.getElementById('minute-hand-large');
            
            if (hourHand && minuteHand) {
                const hourAngle = (hours * 30) + (minutes * 0.5);
                const minuteAngle = minutes * 6;
                
                hourHand.style.transform = `translate(-50%, -100%) rotate(${hourAngle}deg)`;
                minuteHand.style.transform = `translate(-50%, -100%) rotate(${minuteAngle}deg)`;
            }
        }, 1000);
    }

    // ماشین حساب پیشرفته
    initializeEnhancedCalculator() {
        this.calcExpression = '';
        this.calcResult = 0;
        this.calcOperator = null;
        this.calcWaiting = false;
    }

    calcNumber(num) {
        const display = document.getElementById('calc-display-enhanced');
        if (!display) return;
        
        if (this.calcWaiting) {
            display.value = num;
            this.calcWaiting = false;
        } else {
            display.value = display.value === '0' ? num : display.value + num;
        }
    }

    calcOperator(operator) {
        const display = document.getElementById('calc-display-enhanced');
        if (!display) return;
        
        const inputVal = parseFloat(display.value);
        
        if (this.calcResult === 0) {
            this.calcResult = inputVal;
        } else if (this.calcOperator) {
            const currentValue = this.calcResult || 0;
            const newValue = this.performCalculation(currentValue, inputVal, this.calcOperator);
            
            display.value = String(newValue);
            this.calcResult = newValue;
        }
        
        this.calcWaiting = true;
        this.calcOperator = operator;
    }

    calcEquals() {
        const display = document.getElementById('calc-display-enhanced');
        if (!display) return;
        
        const inputVal = parseFloat(display.value);
        
        if (this.calcResult !== 0 && this.calcOperator) {
            const newValue = this.performCalculation(this.calcResult, inputVal, this.calcOperator);
            display.value = String(newValue);
            this.calcResult = newValue;
            this.calcOperator = null;
            this.calcWaiting = true;
        }
    }

    calcClear() {
        const display = document.getElementById('calc-display-enhanced');
        if (display) {
            display.value = '0';
            this.calcResult = 0;
            this.calcOperator = null;
            this.calcWaiting = false;
        }
    }

    calcBackspace() {
        const display = document.getElementById('calc-display-enhanced');
        if (display) {
            display.value = display.value.slice(0, -1) || '0';
        }
    }

    performCalculation(val1, val2, operator) {
        switch (operator) {
            case '+': return val1 + val2;
            case '-': return val1 - val2;
            case '*': return val1 * val2;
            case '/': return val1 / val2;
            default: return val2;
        }
    }

    // موزیک پلیر
    initializeMusicPlayer() {
        this.isPlaying = false;
        this.currentTrack = 0;
        this.tracks = [
            { title: 'آهنگ اول', artist: 'خواننده ۱' },
            { title: 'آهنگ دوم', artist: 'خواننده ۲' },
            { title: 'آهنگ سوم', artist: 'خواننده ۳' }
        ];
    }

    togglePlay() {
        this.isPlaying = !this.isPlaying;
        const playIcon = document.getElementById('play-icon');
        if (playIcon) {
            playIcon.className = this.isPlaying ? 'fas fa-pause' : 'fas fa-play';
        }
    }

    nextTrack() {
        this.currentTrack = (this.currentTrack + 1) % this.tracks.length;
        this.updateTrackInfo();
    }

    previousTrack() {
        this.currentTrack = (this.currentTrack - 1 + this.tracks.length) % this.tracks.length;
        this.updateTrackInfo();
    }

    updateTrackInfo() {
        const track = this.tracks[this.currentTrack];
        const titleElement = document.querySelector('.track-title');
        const artistElement = document.querySelector('.track-artist');
        
        if (titleElement) titleElement.textContent = track.title;
        if (artistElement) artistElement.textContent = track.artist;
    }

    // دوربین
    initializeCamera() {
        this.isRecording = false;
        this.cameraMode = 'photo';
    }

    takePhoto() {
        // شبیه‌سازی گرفتن عکس
        console.log('Photo taken!');
        
        // افکت فلش
        const cameraView = document.querySelector('#app-screen .enhanced-app div');
        if (cameraView) {
            cameraView.style.background = 'white';
            setTimeout(() => {
                cameraView.style.background = '';
            }, 100);
        }
    }

    // ================== ابزارهای کمکی ==================

    updateClocks() {
        this.updateAllClocks();
    }

    updateAllClocks() {
        const timeElements = document.querySelectorAll('.time-display, .time-digital, .main-clock');
        timeElements.forEach(element => {
            element.textContent = this.getCurrentTime();
        });

        const dateElements = document.querySelectorAll('.lock-date, .date-display');
        dateElements.forEach(element => {
            element.textContent = this.getCurrentDate();
        });
    }

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

    startClockUpdater() {
        setInterval(() => {
            this.updateAllClocks();
        }, 60000);
    }

    startAnimations() {
        // انیمیشن ذرات بوت
        this.startBootParticles();
        
        // انیمیشن والپیپر
        this.startWallpaperAnimation();
    }

    startBootParticles() {
        const particles = document.querySelector('.boot-particles');
        if (particles) {
            particles.style.animation = 'particlesFloat 10s linear infinite';
        }
    }

    startWallpaperAnimation() {
        const wallpaper = document.querySelector('.wallpaper-image');
        if (wallpaper) {
            wallpaper.style.animation = 'wallpaperShift 8s ease-in-out infinite';
        }
    }

    // بازگشت
    navigateBack() {
        if (this.currentScreen === 'app-screen') {
            this.switchScreen('home-screen');
        }
    }

    // مدیریت تغییر اندازه
    handleResize() {
        // بهینه‌سازی برای دسکتاپ
        if (window.innerWidth > 768) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'hidden';
        }
    }

    // پخش صدای سیستم
    playSystemSound(type) {
        // شبیه‌سازی صدا
        console.log(`Playing ${type} sound`);
        
        // در پیاده‌سازی واقعی می‌توانید فایل‌های صوتی اضافه کنید
        try {
            const audioContext = new (window.AudioContext || window.webkitAudioContext)();
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(audioContext.destination);
            
            // تنظیم فرکانس بر اساس نوع صدا
            switch (type) {
                case 'unlock':
                    oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
                    oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
                    break;
                case 'app-launch':
                    oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                    break;
            }
            
            gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
            
            oscillator.start(audioContext.currentTime);
            oscillator.stop(audioContext.currentTime + 0.3);
        } catch (error) {
            console.log('Audio not supported');
        }
    }

    // عملیات تلفن
    inputPhone(num) {
        const phoneInput = document.querySelector('input[type="tel"]');
        if (phoneInput) {
            phoneInput.value += num;
        }
    }

    makeCall() {
        const phoneInput = document.querySelector('input[type="tel"]');
        if (phoneInput && phoneInput.value) {
            alert(`تماس با ${phoneInput.value} برقرار شد!`);
        }
    }

    // عملیات یادداشت
    saveNote() {
        const textarea = document.querySelector('textarea');
        if (textarea) {
            alert('یادداشت ذخیره شد! 💾');
        }
    }
}

// راه‌اندازی سیستم
let xhOSEnhanced;
document.addEventListener('DOMContentLoaded', () => {
    xhOSEnhanced = new XHOSEnhanced();
});

// جلوگیری از کلیک راست در موبایل
document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
});

// بهینه‌سازی عملکرد
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // می‌توانید service worker اضافه کنید
    });
}