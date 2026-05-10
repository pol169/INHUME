/* ============================================
   INHUME WEBSITE - SCRIPT.JS
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

    // ===========================================
    // CUSTOM CURSOR WITH LERP + SNAP-TO-CIRCLE
    // ===========================================
    const cursorBall = document.getElementById('cursor-ball');
    const scrollCircle = document.querySelector('.scroll-circle');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let ballX = mouseX;
    let ballY = mouseY;
    const lerpFactor = 0.12;
    let isSnappedToCircle = false;
    let snapTarget = null; // The element to snap cursor to

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    document.addEventListener('mouseleave', () => {
        cursorBall.classList.add('hidden');
    });
    document.addEventListener('mouseenter', () => {
        cursorBall.classList.remove('hidden');
    });

    // Snap cursor to scroll circle on hover
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('mouseenter', () => {
            isSnappedToCircle = true;
            snapTarget = scrollCircle;
            cursorBall.classList.add('snapped');
            cursorBall.classList.remove('hovering', 'hovering-link');
        });
        scrollIndicator.addEventListener('mouseleave', () => {
            isSnappedToCircle = false;
            snapTarget = null;
            cursorBall.classList.remove('snapped');
        });
    }

    // Snap cursor to wishlist button on hover
    const wishlistBtn = document.querySelector('.wishlist-btn');
    if (wishlistBtn) {
        wishlistBtn.addEventListener('mouseenter', () => {
            isSnappedToCircle = true;
            snapTarget = wishlistBtn;
            const rect = wishlistBtn.getBoundingClientRect();
            cursorBall.style.setProperty('--snap-w', (rect.width + 20) + 'px');
            cursorBall.style.setProperty('--snap-h', (rect.height + 20) + 'px');
            cursorBall.classList.add('snapped-wishlist');
            cursorBall.classList.remove('hovering', 'hovering-link');
        });
        wishlistBtn.addEventListener('mouseleave', () => {
            isSnappedToCircle = false;
            snapTarget = null;
            cursorBall.classList.remove('snapped-wishlist');
        });
    }

    // Animation loop
    function animateCursor() {
        if (isSnappedToCircle && snapTarget) {
            // Snap to center of target element
            const rect = snapTarget.getBoundingClientRect();
            const targetX = rect.left + rect.width / 2;
            const targetY = rect.top + rect.height / 2;
            ballX += (targetX - ballX) * 0.2;
            ballY += (targetY - ballY) * 0.2;
        } else {
            ballX += (mouseX - ballX) * lerpFactor;
            ballY += (mouseY - ballY) * lerpFactor;
        }
        cursorBall.style.left = ballX + 'px';
        cursorBall.style.top = ballY + 'px';
        requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Grow cursor on interactive elements (excluding scroll indicator — handled separately)
    const hoverTargets = document.querySelectorAll('.portfolio-item, .portfolio-link, .portfolio-image-wrapper');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => cursorBall.classList.add('hovering'));
        el.addEventListener('mouseleave', () => cursorBall.classList.remove('hovering'));
    });

    // Slightly grow on links and buttons
    const linkTargets = document.querySelectorAll('a, button, .burger-menu, .back-to-top, .socials-trigger, input');
    linkTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            if (!cursorBall.classList.contains('hovering') && !isSnappedToCircle) {
                cursorBall.classList.add('hovering-link');
            }
        });
        el.addEventListener('mouseleave', () => cursorBall.classList.remove('hovering-link'));
    });

    // ===========================================
    // VIEW SWITCHING (HOME vs LORE)
    // ===========================================
    const homeView = document.getElementById('home-view');
    const loreView = document.getElementById('lore-view');
    const navLinks = document.querySelectorAll('.main-nav a[data-view]');
    const backHomeLinks = document.querySelectorAll('.back-to-home');

    function switchView(viewName) {
        if (!homeView || !loreView) return;

        if (viewName === 'home') {
            homeView.classList.remove('view-hidden');
            loreView.classList.add('view-hidden');
            document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
            const homeNavLink = document.querySelector('.main-nav a[data-view="home"]');
            if (homeNavLink) homeNavLink.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'instant' });
        } else if (viewName === 'lore') {
            homeView.classList.add('view-hidden');
            loreView.classList.remove('view-hidden');
            document.querySelectorAll('.main-nav a').forEach(a => a.classList.remove('active'));
            const loreNavLink = document.querySelector('.main-nav a[data-view="lore"]');
            if (loreNavLink) loreNavLink.classList.add('active');
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const view = link.getAttribute('data-view');
            const href = link.getAttribute('href');
            
            if (view === 'lore') {
                e.preventDefault();
                switchView('lore');
            } else if (view === 'home') {
                if (href && href.startsWith('#')) {
                    // It's a scroll target
                    if (loreView && !loreView.classList.contains('view-hidden')) {
                        switchView('home');
                        // Small delay to allow layout to settle
                        setTimeout(() => {
                            const target = document.querySelector(href);
                            if (target) target.scrollIntoView({ behavior: 'smooth' });
                        }, 50);
                    }
                } else if (href === 'javascript:void(0)') {
                    e.preventDefault();
                    switchView('home');
                }
            }
        });
    });

    if (backHomeLinks) {
        backHomeLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                switchView('home');
            });
        });
    }


    // ===========================================
    // HEADER SCROLL EFFECT
    // ===========================================
    const header = document.getElementById('header');

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 80) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });


    // ===========================================
    // MOBILE MENU
    // ===========================================
    // Mobile Menu logic removed



    // ===========================================
    // SCROLL REVEAL ANIMATIONS
    // ===========================================
    const revealElements = document.querySelectorAll(
        '.about-heading, .about-text, .newsletter-desc, .newsletter-form-wrapper, .cta-heading, .portfolio-item'
    );

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

    revealElements.forEach((el, i) => {
        el.classList.add('reveal-up');
        el.style.transitionDelay = `${(i % 4) * 0.08}s`;
        revealObserver.observe(el);
    });


    // ===========================================
    // BACK TO TOP
    // ===========================================
    const backToTop = document.getElementById('back-to-top');
    if (backToTop) {
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ===========================================
    // SCROLL DOWN INDICATOR
    // ===========================================
    const scrollIndicatorBtn = document.querySelector('.scroll-indicator');
    if (scrollIndicatorBtn) {
        scrollIndicatorBtn.addEventListener('click', () => {
            const gamesSection = document.getElementById('games');
            if (gamesSection) gamesSection.scrollIntoView({ behavior: 'smooth' });
        });
    }


    // ===========================================
    // NEWSLETTER FORM
    // ===========================================
    const newsletterForm = document.getElementById('newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = document.getElementById('email-input').value;
            const gdpr = document.getElementById('gdpr-consent').checked;
            if (email && gdpr) {
                const btn = newsletterForm.querySelector('.subscribe-btn span');
                const btnEl = newsletterForm.querySelector('.subscribe-btn');
                btn.textContent = 'Synced! ✓';
                btnEl.style.borderColor = '#49f292';
                btnEl.style.background = '#49f292';
                setTimeout(() => {
                    btn.textContent = 'Subscribe';
                    btnEl.style.borderColor = '';
                    btnEl.style.background = '';
                    newsletterForm.reset();
                }, 3000);
            }
        });
    }


    // ===========================================
    // SMOOTH ANCHOR LINKS
    // ===========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const target = this.getAttribute('href');
            if (target && target !== '#') {
                e.preventDefault();
                const el = document.querySelector(target);
                if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });


    // ===========================================
    // 3D TILT + VIDEO PLAY ON PORTFOLIO ITEMS
    // ===========================================
    document.querySelectorAll('.portfolio-item').forEach(item => {
        const video = item.querySelector('.portfolio-video');
        const link = item.querySelector('.portfolio-link');

        item.addEventListener('mousemove', (e) => {
            if (!link) return;
            const rect = item.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = (e.clientY - rect.top) / rect.height;

            const maxTilt = 4;
            const rotateY = (x - 0.5) * maxTilt * 2;
            const rotateX = (0.5 - y) * maxTilt * 2;

            link.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        item.addEventListener('mouseenter', () => {
            if (video) {
                video.play().catch(() => { });
            }
        });

        item.addEventListener('mouseleave', () => {
            if (link) link.style.transform = '';
            if (video) {
                video.pause();
                video.currentTime = 0;
            }
        });
    });


    // ===========================================
    // MARQUEE PAUSE ON HOVER
    // ===========================================
    const marqueeTrack = document.querySelector('.marquee-track');
    if (marqueeTrack) {
        marqueeTrack.addEventListener('mouseenter', () => {
            marqueeTrack.style.animationPlayState = 'paused';
        });
        marqueeTrack.addEventListener('mouseleave', () => {
            marqueeTrack.style.animationPlayState = 'running';
        });
    }


    // ===========================================
    // MAGNETIC BUTTONS — follow cursor on hover
    // ===========================================
    const magneticElements = document.querySelectorAll(
        '.main-nav a, .subscribe-btn, .back-to-top, .scroll-indicator, .social-links a, .about-link-text, .cta-link, .burger-menu'
    );

    magneticElements.forEach(el => {
        // Ensure the element can be transformed
        el.style.transition = (el.style.transition ? el.style.transition + ', ' : '') +
            'transform 0.35s cubic-bezier(0.215, 0.610, 0.355, 1)';
        el.style.display = el.style.display || 'inline-block';

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;

            // How far from center the mouse is (normalized)
            const deltaX = (e.clientX - centerX);
            const deltaY = (e.clientY - centerY);

            // Strength of the pull (adjust multiplier for more/less movement)
            const strength = 0.3;
            el.style.transform = `translate(${deltaX * strength}px, ${deltaY * strength}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = 'translate(0, 0)';
        });
    });

    // ===========================================
    // CHAOTIC GLITCH TITLE (Random Min/Maj)
    // ===========================================
    const heroTitle = document.querySelector('.hero-title');
    const titleLine = document.querySelector('.hero-title .title-line');

    if (heroTitle && titleLine) {
        let glitchTimeout;
        const originalText = "INHUME";

        const runGlitchIteration = () => {
            let corruptedText = "";
            for (let i = 0; i < originalText.length; i++) {
                if (Math.random() > 0.5) {
                    corruptedText += originalText[i].toUpperCase();
                } else {
                    corruptedText += originalText[i].toLowerCase();
                }
            }
            titleLine.textContent = corruptedText;
            heroTitle.setAttribute('data-text', corruptedText);
        };

        const triggerBurst = () => {
            // Start the glitch visual burst
            heroTitle.classList.add('glitching');

            // Quick rapid-fire text changes (sporadic)
            runGlitchIteration();

            setTimeout(() => {
                runGlitchIteration();
                if (Math.random() > 0.3) {
                    setTimeout(runGlitchIteration, 40);
                }
            }, 70);

            // End burst after 200ms
            setTimeout(() => {
                heroTitle.classList.remove('glitching');
                titleLine.textContent = originalText;
                heroTitle.setAttribute('data-text', originalText);

                // Schedule next burst with random long delay (2s to 6s)
                const nextDelay = 2000 + Math.random() * 4000;
                glitchTimeout = setTimeout(triggerBurst, nextDelay);
            }, 200);
        };

        const startGlitch = () => {
            heroTitle.classList.remove('paused');
            triggerBurst();
        };

        const stopGlitch = () => {
            clearTimeout(glitchTimeout);
            // Reset to clean state
            titleLine.textContent = originalText;
            heroTitle.setAttribute('data-text', originalText);
            heroTitle.classList.add('paused');
            heroTitle.classList.remove('glitching');
        };

        // Start initially
        startGlitch();

        // Pause on hover (Title)
        heroTitle.addEventListener('mouseenter', stopGlitch);
        heroTitle.addEventListener('mouseleave', startGlitch);

        // Pause on hover (Wishlist Button)
        const wishlistBtn = document.querySelector('.wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('mouseenter', stopGlitch);
            wishlistBtn.addEventListener('mouseleave', startGlitch);
        }
    }

    // ===========================================
    // LIVE HUD CLOCK (Date + Time)
    // ===========================================
    const hudDateTime = document.getElementById('hud-datetime');
    if (hudDateTime) {
        const updateHUDClock = () => {
            const now = new Date();

            // Format Date: DD.MM.YYYY
            const day = String(now.getDate()).padStart(2, '0');
            const month = String(now.getMonth() + 1).padStart(2, '0');
            const year = now.getFullYear();

            // Format Time: HH:MM:SS
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');
            const seconds = String(now.getSeconds()).padStart(2, '0');

            hudDateTime.textContent = `${day}.${month}.${year} ${hours}:${minutes}:${seconds}`;
        };

        // Update immediately and then every second
        updateHUDClock();
        setInterval(updateHUDClock, 1000);
    }

    // ===========================================
    // MULTI-LANGUAGE SYSTEM
    // ===========================================
    const translations = {
        en: {
            nav_home: "Home",
            nav_features: "Features",
            nav_story: "Story",
            nav_archive: "Archive",
            hero_tagline: "Expendable. Underpaid. Still Alive.",
            hero_blurb: "INHUME is a co-op procedural survival horror game set in a restricted research archipelago where everything is unstable—the environment, the wildlife, and your employment status.",
            hero_unit_label: 'You are "UNIT-5"',
            hero_unit_line1: "You were not chosen because you're qualified.",
            hero_unit_line2: "You were chosen because you're ",
            hero_unit_disposable: "disposable.",
            wishlist_btn_top: "WISH LIST",
            wishlist_btn_bottom: "NOW!!",
            scroll_text: "SCROLL TO DESCEND",
            info_transmission: "the transmission is live",
            feat_chars_title: "Characters",
            feat_chars_desc: "The Deprived: Guards, Plumbers, Divers, and Employees.",
            feat_monst_title: "Taxonomy",
            feat_monst_desc: "The Drowned, Whisperspine, and the Doerh.",
            feat_env_title: "Environement",
            feat_env_desc: "Unpredictable environmental storytelling.",
            feat_coop_title: "COOP",
            feat_coop_desc: "A journey into the depths of a broken reality.",
            marquee_text: "WISH LIST NOW WISH LIST NOW WISH LIST NOW WISH LIST NOW WISH LIST NOW ",
            story_link: "THE STORY SO FAR",
            about_who_title: "WHO ARE YOU?",
            about_who_text1: "You are one of the **'Deprived'**. Recruited not for your prestige, but for your specialized, yet utterly expendable skills.",
            about_who_text2: "Whether you were a **Night-Club Guard**, a **Plumber**, a **Deep Diver**, or a **Fast Food Employee**, you are now just a cog in a machine that views you as a budget line item.",
            about_who_text3: "You signed the **Kolyma-Pacific Contract**. You came for the 'great pay'. You stayed because they won't let you leave.",
            about_who_text4: "Each of you has a special skill.<br> Individually? A liability.<br> Together? A contractual obligation.",
            about_safe_title: "YOUR ONLY SAFE PLACE",
            about_safe_text1: "Your rusted boat is your mobile base.",
            about_safe_text2: "Upgrade the hull.<br> Repair the engine.<br> Install terminals.<br> Stabilize cargo mid-storm.",
            about_safe_text3: "Out on these waters, something always watches from below.",
            about_job_title: "THE JOB",
            about_job_text1: "You work for the **INHUME Research Facility** in **Classified Zone 4**. A 32x32km laboratory where the laws of physics are mere variables.",
            about_job_text2: "Your task sounds simple:",
            about_job_text3: "Recover the copper wire.<br>Scavenge the classified logs.<br>Don't look for the horizon.",
            news_title: "Stay synced with the transmission",
            news_legal: "Find all information regarding privacy practices on our website. We use Mailchimp as our marketing platform. By clicking below to subscribe, you acknowledge that your information will be transferred to Mailchimp for processing. You can unsubscribe at any time.",
            news_email_label: "Email Address:",
            news_gdpr: "I agree to receive the project newsletter via Email.",
            news_sub_btn: "Subscribe",
            cta_join: "Join our ",
            cta_discord: "discord community",
            cta_visit: " or visit our ",
            cta_steam: "steam page",
            back_top: "Back Top",
            footer_imprint: "Imprint",
            footer_press: "Press Kit",
            footer_follow: "FOLLOW US"
        },
        de: {
            nav_home: "Startseite",
            nav_features: "Features",
            nav_story: "Story",
            nav_archive: "Archiv",
            hero_tagline: "Entbehrlich. Unterbezahlt. Noch am Leben.",
            hero_blurb: "INHUME ist ein prozedurales Koop-Survival-Horrorspiel, das in einem gesperrten Forschungs-Archipel spielt, in dem alles instabil ist – die Umgebung, die Tierwelt und Ihr Beschäftigungsstatus.",
            hero_unit_label: 'Sie sind "UNIT-5"',
            hero_unit_line1: "Sie wurden nicht ausgewählt, weil Sie qualifiziert sind.",
            hero_unit_line2: "Sie wurden ausgewählt, weil Sie ",
            hero_unit_disposable: "ersetzbar sind.",
            wishlist_btn_top: "WUNSCHLISTE",
            wishlist_btn_bottom: "JETZT!!",
            scroll_text: "SCROLLEN ZUM ABSTIEG",
            info_transmission: "die übertragung ist live",
            feat_chars_title: "Charaktere",
            feat_chars_desc: "Die 'Deprived': Wärter, Klempner, Taucher und Angestellte.",
            feat_monst_title: "Taxonomie",
            feat_monst_desc: "Die Ertrunkenen, Whisperspine und der Doerh.",
            feat_env_title: "Umgebung",
            feat_env_desc: "Unvorhersehbares Umwelt-Storytelling.",
            feat_coop_title: "KOOP",
            feat_coop_desc: "Eine Reise in die Tiefen einer zerbrochenen Realität.",
            marquee_text: "JETZT AUF DIE WUNSCHLISTE JETZT AUF DIE WUNSCHLISTE ",
            story_link: "DIE AKTUELLE GESCHICHTE",
            about_who_title: "WER SEID IHR?",
            about_who_text1: "Sie gehören zu den **'Deprived'**. Rekrutiert nicht wegen Ihres Prestiges, sondern wegen Ihrer spezialisierten, aber völlig entbehrlichen Fähigkeiten.",
            about_who_text2: "Ob Sie nun ein **Nachtclub-Wächter**, ein **Klempner**, ein **Tiefseetaucher** oder ein **Fast-Food-Mitarbeiter** waren – Sie sind jetzt nur noch ein Rädchen in einer Maschine, die Sie als Budgetposten betrachtet.",
            about_who_text3: "Sie haben den **Kolyma-Pazifik-Vertrag** unterschrieben. Sie kamen wegen der 'großartigen Bezahlung'. Sie blieben, weil man Sie nicht gehen lässt.",
            about_who_text4: "Jeder von euch hat eine besondere Fähigkeit.<br> Einzeln? Ein Risiko.<br> Zusammen? Eine vertragliche Verpflichtung.",
            about_safe_title: "EUER EINZIGER SICHERER ORT",
            about_safe_text1: "Euer verrostetes Boot ist eure mobile Basis.",
            about_safe_text2: "Rumpf verbessern.<br> Motor reparieren.<br> Terminals installieren.<br> Fracht mitten im Sturm stabilisieren.",
            about_safe_text3: "Hier draußen auf dem Wasser beobachtet einen immer etwas von unten.",
            about_job_title: "DER JOB",
            about_job_text1: "Sie arbeiten für die **INHUME-Forschungseinrichtung** in der **Classified Zone 4**. Ein 32x32 km großes Labor, in dem die Gesetze der Physik nur Variablen sind.",
            about_job_text2: "Eure Aufgabe klingt einfach:",
            about_job_text3: "Kupferdraht bergen.<br>Klassifizierte Protokolle sammeln.<br>Suchen Sie nicht nach dem Horizont.",
            news_title: "Bleiben Sie mit der Übertragung synchron",
            news_legal: "Alle Informationen zu Datenschutzpraktiken finden Sie auf unserer Website. Wir nutzen Mailchimp als Marketingplattform. Indem Sie unten auf „Abonnieren“ klicken, bestätigen Sie, dass Ihre Daten zur Verarbeitung an Mailchimp übertragen werden. Sie können es jederzeit abbestellen.",
            news_email_label: "E-Mail Addresse:",
            news_gdpr: "Ich stimme zu, den Projekt-Newsletter per E-Mail zu erhalten.",
            news_sub_btn: "Abonnieren",
            cta_join: "Besuchen Sie unser ",
            cta_discord: "Discord-Community",
            cta_visit: " oder unsere ",
            cta_steam: "Steam-Seite",
            back_top: "Nach Oben",
            footer_imprint: "Impressum",
            footer_press: "Pressemappe",
            footer_follow: "FOLGE UNS"
        }
    };

    let currentLang = localStorage.getItem('inhume-lang') || 'en';

    function updateContent() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            if (translations[currentLang][key]) {
                el.innerHTML = translations[currentLang][key];
            }
        });
        document.querySelector('.lang-text').textContent = currentLang.toUpperCase();
    }

    const langToggle = document.getElementById('lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('click', () => {
            currentLang = currentLang === 'en' ? 'de' : 'en';
            localStorage.setItem('inhume-lang', currentLang);
            updateContent();

            // Trigger glitch effect on button
            langToggle.classList.add('active');
            setTimeout(() => langToggle.classList.remove('active'), 200);
        });
    }

    // Initialize content on load
    updateContent();

});
