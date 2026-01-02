// index.js (Consolidated and Updated with all features and fixes)

document.addEventListener('DOMContentLoaded', () => {
    
    // ====================================================================
    // --- GLOBAL UTILITIES ---
    // ====================================================================

    // 1. Current year in Footer
    const yearSpan = document.getElementById("year");
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

    // --- SMOOTH SCROLL LOGIC ---
    // Note: The smooth scroll logic here is the core logic that fixes the header overlap.
    const HEADER_OFFSET = 96; // 96px offset ensures heading does not clip under the fixed header (h-16 + margin).

    // Helper Function for scrolling to section
    function scrollToSection(id) {
        const el = document.getElementById(id);
        if (el) {
            window.scrollTo({
                top: el.offsetTop - HEADER_OFFSET,
                behavior: "smooth"
            });
        }
    }

    // Make the helper function globally accessible for inline 'onclick' (like the 'কোর্স সম্পর্কে জানুন' button)
    window.scrollToSection = scrollToSection;

    // --- MOBILE MENU & ANCHOR FIXES ---
    const mobileMenuBtn = document.getElementById("mobileMenuBtn");
    const mobileMenu = document.getElementById("mobileMenu");

    // Function to handle anchor clicks and apply scroll offset
    function handleAnchorClick(event) {
        const targetId = event.currentTarget.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            event.preventDefault(); 
            
            // Close the mobile menu if open
            if (mobileMenu && mobileMenu.classList.contains('flex')) {
                mobileMenu.classList.remove('flex');
                mobileMenu.classList.add('hidden');
            }
            
            // Scroll using the fixed offset
            scrollToSection(targetId);
        }
    }

    // Attach smooth scroll to all internal links with #
    document.querySelectorAll('header a[href^="#"]').forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick); // Prevent duplicates
        anchor.addEventListener('click', handleAnchorClick);
    });

    // Mobile Menu Toggle
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener("click", () => {
            mobileMenu.classList.toggle("hidden");
            mobileMenu.classList.toggle("flex");
        });
    }

    // ====================================================================
    // --- 1. COUNTER ANIMATION LOGIC ---
    // ====================================================================

    const counters = document.querySelectorAll('.counter');
    let animationStarted = false;

    const animateCounter = (counter) => {
        const target = +counter.getAttribute('data-target');
        const isDecimal = target % 1 !== 0; // Check for decimal numbers like 2.5
        let start = 0;

        const updateCount = () => {
            // Adjust increment for speed
            let increment;
            if (target > 100) {
                increment = Math.ceil(target / 100);
            } else if (isDecimal) {
                increment = 0.1; // Small increment for decimals
            } else {
                increment = 1;
            }

            if (start < target) {
                start += increment;
                // Format decimal numbers correctly
                counter.innerText = isDecimal ? start.toFixed(1) : Math.floor(start);
                requestAnimationFrame(updateCount);
            } else {
                counter.innerText = isDecimal ? target.toFixed(1) : target;
            }
        };
        updateCount();
    };

    // Intersection Observer to start the animation when the section is visible
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!animationStarted) {
                    counters.forEach(animateCounter);
                    animationStarted = true;
                }
                observer.unobserve(entry.target); 
            }
        });
    }, { threshold: 0.1 }); 

    const counterSection = document.querySelector('.counter')?.closest('section');
    if (counterSection) {
        observer.observe(counterSection);
    }
});


// ====================================================================
// --- 2. COUNTDOWN TIMER LOGIC (Local Storage Persistent with 3s Delay) ---
// ====================================================================

const DURATION = 10 * 60; // 10 minutes in seconds
const STORAGE_KEY = 'offerEndTime'; 

// Core function that manages the timer state and local storage
function startTimerCoreLogic() {
    const timerElement = document.getElementById('offer-timer'); 
    const fixedTimerElement = document.getElementById('fixed-timer-display'); 
    
    let endTime;
    const savedEndTime = localStorage.getItem(STORAGE_KEY);
    const currentTime = Math.floor(Date.now() / 1000); 

    if (savedEndTime && savedEndTime > currentTime) {
        endTime = parseInt(savedEndTime);
    } else {
        endTime = currentTime + DURATION;
        localStorage.setItem(STORAGE_KEY, endTime);
    }

    function formatTime(seconds) {
        const minutes = String(Math.floor(seconds / 60)).padStart(2, '0');
        const secs = String(seconds % 60).padStart(2, '0');
        return `${minutes}:${secs}`;
    }

    function updateTimer() {
        const current = Math.floor(Date.now() / 1000);
        let remainingTime = endTime - current;
        let formattedTime;

        if (remainingTime <= 0) {
            clearInterval(timerInterval);
            formattedTime = "00:00";
            
            if(timerElement) timerElement.textContent = `অফার শেষ: ${formattedTime}`;
            if(fixedTimerElement) fixedTimerElement.textContent = formattedTime; 
            
            localStorage.removeItem(STORAGE_KEY); 

            // Restart after 5 seconds
            setTimeout(startTimer, 5000); 

        } else {
            formattedTime = formatTime(remainingTime);

            if(timerElement) timerElement.textContent = `অফার শেষ হচ্ছে: ${formattedTime}`;
            if(fixedTimerElement) fixedTimerElement.textContent = formattedTime; 
        }
    }

    const timerInterval = setInterval(updateTimer, 1000);
    updateTimer();
}

// Function that handles the initial delay and banner visibility
function startTimer() {
    const fixedBanner = document.getElementById('fixedCtaBanner');
    
    // Step 1: Delay the visibility of the banner by 3 seconds
    setTimeout(() => {
        // Show the banner with animation
        if (fixedBanner) {
            fixedBanner.classList.remove('cta-hidden');
            fixedBanner.classList.add('cta-visible');
        }
        
        // Step 2: Start the persistent timer logic
        startTimerCoreLogic(); 
    }, 5000); // 3 second delay
}


// ====================================================================
// --- 3. SOCIAL PROOF LOGIC (50 Random First Names in Loop) ---
// ====================================================================

function initializeSocialProof() {
    const names = [
        "Arif", "Suma", "Rohit", "Chaitali", "Bhaskar", 
        "Farzana", "Ashik", "Nomita", "Soumen", "Priyanka", 
        "Tanvir", "Abir", "Mamata", "Suman", "Reshmi",
        "Joyita", "Kunal", "Meghla", "Subhajit", "Rina",
        "Ananya", "Bikram", "Ishita", "Deepak", "Puja",
        "Shayan", "Riya", "Alok", "Papiya", "Nayan",
        "Swagata", "Koushik", "Sneha", "Debjit", "Liza",
        "Ayesha", "Rajesh", "Shilpi", "Tapas", "Mousumi",
        "Vikram", "Nisha", "Gautam", "Priya", "Mithun",
        "Sayantika", "Amitabha", "Sreeparna", "Aman", "Kajal"
    ];
    
    const container = document.getElementById('socialProofContainer');
    const displayDuration = 3000; 
    const delayBetween = 1000; 
    const initialDelay = 4000; 

    if (!container) return; 

    function createPopup(name) {
        const message = `${name} just registered`;
        const popup = document.createElement('div');
        popup.className = 'social-proof-popup';
        
        const icon = document.createElement('span');
        icon.className = 'social-proof-icon';
        
        // **UPDATED ICON: Using SVG for a professional user/profile icon**
        icon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-user"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;
        
        const text = document.createElement('span');
        text.textContent = message;

        popup.appendChild(icon);
        popup.appendChild(text);
        return popup;
    }

    function showNextPopup() {
        const randomIndex = Math.floor(Math.random() * names.length);
        const randomName = names[randomIndex];
        
        const popup = createPopup(randomName);
        container.appendChild(popup);
        
        void popup.offsetWidth; 

        popup.classList.add('show');

        setTimeout(() => {
            popup.classList.remove('show');
            popup.classList.add('hide');

            setTimeout(() => {
                if(container.contains(popup)) {
                    container.removeChild(popup);
                }
                showNextPopup(); 
            }, 500); 

        }, displayDuration); 
    }

    // Start the recurring loop after the initial 4-second delay
    setTimeout(showNextPopup, initialDelay);
}

// ====================================================================
// --- 4. TESTIMONIAL SCROLL OVERRIDE (Manual Scroll Fix) ---
// ====================================================================

function initializeScrollOverride() {
    const scrollingWrapper = document.querySelector('.scrolling-wrapper');
    const scrollingContents = document.querySelectorAll('.scrolling-content');

    if (!scrollingWrapper || scrollingContents.length === 0) return;

    let userScrollingTimeout;

    function pauseAnimation() {
        scrollingContents.forEach(content => {
            content.style.animationPlayState = 'paused';
        });
    }

    function resumeAnimation() {
        scrollingContents.forEach(content => {
            content.style.animationPlayState = 'running';
        });
    }

    scrollingWrapper.addEventListener('scroll', () => {
        pauseAnimation();
        clearTimeout(userScrollingTimeout);
        userScrollingTimeout = setTimeout(resumeAnimation, 200);
    });
    
    // Ensure animation is running initially
    resumeAnimation();
}


// Global Initialization (All functions start after DOM is ready)
window.addEventListener('load', () => {
    // Note: Scroll fix logic is already attached above inside DOMContentLoaded
    startTimer();
    initializeSocialProof();
    initializeScrollOverride();
});



// Minimalist Hero Animation Logic
window.addEventListener('load', () => {
    const minHero = document.getElementById('minimalist-hero');
    const minCircle = document.getElementById('min-hero-circle');
    const minImage = document.getElementById('min-hero-image');
    const minLeft = document.getElementById('min-hero-left');
    const minRight = document.getElementById('min-hero-right');

    if (minHero) {
        setTimeout(() => {
            // সেকশনটি দৃশ্যমান হবে
            minHero.classList.remove('opacity-0');
            // সার্কেলটি বড় হবে
            minCircle.classList.remove('scale-0');
            minCircle.classList.add('scale-100');
            // ইমেজ এবং টেক্সটগুলো নিচ থেকে উপরে উঠে আসবে
            minImage.classList.remove('opacity-0', 'translate-y-20');
            minLeft.classList.remove('opacity-0', 'translate-y-10');
            minRight.classList.remove('opacity-0', 'translate-y-10');
        }, 300); // পেজ লোড হওয়ার ৩০০ মিলি-সেকেন্ড পর এনিমেশন শুরু হবে
    }
});