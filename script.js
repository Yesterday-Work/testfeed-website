// JavaScript for TestFeed landing page
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Lucide Icons
    lucide.createIcons();
    
    // Mobile menu toggle
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    
    if (mobileMenuBtn && navMenu) {
      mobileMenuBtn.addEventListener('click', function() {
        this.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
      });
      
      // Close mobile menu when clicking a nav link
      navMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
          mobileMenuBtn.classList.remove('active');
          navMenu.classList.remove('active');
          document.body.classList.remove('menu-open');
        });
      });
    }
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
          window.scrollTo({
            top: targetElement.offsetTop - 80, // Offset for header
            behavior: 'smooth'
          });
        }
      });
    });
    
    // Animation for simulation display
    setTimeout(() => {
      document.body.classList.add('loaded');
      
      // Update meter text
      const meterPercentage = document.querySelector('.meter-percentage');
      if (meterPercentage) {
        let count = 0;
        const interval = setInterval(() => {
          count += 1;
          meterPercentage.textContent = `${count}%`;
          if (count >= 100) {
            clearInterval(interval);
          }
        }, 30);
      }
      
      // Update stats counters
      const profilesCounter = document.querySelector('.stat:nth-child(1) .stat-value');
      const reactionsCounter = document.querySelector('.stat:nth-child(2) .stat-value');
      const engagementCounter = document.querySelector('.stat:nth-child(3) .stat-value');
      
      if (profilesCounter) {
        let count = 0;
        const interval = setInterval(() => {
          count += 100;
          profilesCounter.textContent = count.toLocaleString();
          if (count >= 10000) {
            clearInterval(interval);
          }
        }, 30);
      }
      
      if (reactionsCounter) {
        let count = 0;
        const interval = setInterval(() => {
          count += 300;
          reactionsCounter.textContent = count.toLocaleString();
          if (count >= 30000) {
            clearInterval(interval);
          }
        }, 30);
      }
      
      if (engagementCounter) {
        let count = 0;
        const interval = setInterval(() => {
          count += 2;
          engagementCounter.textContent = `${count}%`;
          if (count >= 84) {
            clearInterval(interval);
          }
        }, 30);
      }
    });
    
    // Animation sequence for the TestFeed hero section
    // Create profile dots programmatically for the animation
    const profileIcons = document.querySelector('.profile-icons');
    if (profileIcons) {
      // Create 30 profile dots
      for (let i = 0; i < 30; i++) {
        const dot = document.createElement('div');
        dot.className = 'profile-dot';
        dot.style.width = '15px';
        dot.style.height = '15px';
        dot.style.backgroundColor = 'rgba(255, 255, 255, 0.2)';
        dot.style.borderRadius = '50%';
        dot.style.margin = '3px';
        dot.style.display = 'inline-block';
        // Random animation delay for more natural effect
        const delay = Math.random() * 1.5;
        dot.style.animation = `fade-in-out 1.5s infinite ${delay}s`;
        profileIcons.appendChild(dot);
      }
    }

    // Refined TestFeed hero animation
    const mockupContainer = document.querySelector('.mockup-container');
    if (!mockupContainer) return;
    
    // Function to animate a counter
    function animateCounter(elementId, targetValue, duration, isPercentage = false) {
      const element = document.getElementById(elementId);
      if (!element) return;
      
      let startValue = 0;
      let increment = targetValue > 1000 ? 100 : (targetValue > 100 ? 1 : 0.1);
      let stepTime = Math.abs(Math.floor(duration / (targetValue / increment)));
      
      let currentValue = startValue;
      
      const timer = setInterval(function() {
        currentValue += increment;
        
        if (currentValue >= targetValue) {
          clearInterval(timer);
          currentValue = targetValue;
        }
        
        // Format the displayed value
        if (isPercentage) {
          element.textContent = currentValue.toFixed(1);
        } else if (targetValue >= 1000) {
          element.textContent = Math.round(currentValue).toLocaleString();
        } else {
          element.textContent = currentValue.toFixed(0);
        }
        
      }, stepTime);
    }
    
    // Animation sequence function
    function runAnimation() {
      // Initial state reset
      const testingIndicator = document.querySelector('.testing-indicator');
      const resultsPanel = document.querySelector('.results-panel');
      
      testingIndicator.classList.remove('active');
      resultsPanel.classList.remove('active');
      
      // Reset counters and bars
      document.getElementById('reach-value').textContent = '0';
      document.getElementById('engagement-value').textContent = '0';
      
      document.getElementById('reach-bar').style.width = '0%';
      document.getElementById('engagement-bar').style.width = '0%';
      
      document.getElementById('sentiment-negative').style.width = '0%';
      document.getElementById('sentiment-neutral').style.width = '0%';
      document.getElementById('sentiment-positive').style.width = '0%';
      
      // Animation sequence
      setTimeout(() => {
        // Step 1: Show testing indicator
        testingIndicator.classList.add('active');
        
        // Step 2: Hide testing, show results
        setTimeout(() => {
          testingIndicator.classList.remove('active');
          
          setTimeout(() => {
            resultsPanel.classList.add('active');
            
            // Animate reach
            setTimeout(() => {
              document.getElementById('reach-bar').style.width = '78%';
              animateCounter('reach-value', 10000, 1500);
            }, 300);
            
            // Animate engagement
            setTimeout(() => {
              document.getElementById('engagement-bar').style.width = '84%';
              animateCounter('engagement-value', 5.2, 1500, true);
            }, 600);
            
            // Animate sentiment
            setTimeout(() => {
              document.getElementById('sentiment-negative').style.width = '20%';
              
              setTimeout(() => {
                document.getElementById('sentiment-neutral').style.width = '30%';
                
                setTimeout(() => {
                  document.getElementById('sentiment-positive').style.width = '50%';
                }, 200);
              }, 200);
            }, 900);
          }, 400);
        }, 2500);
        
        // Reset and restart animation
        setTimeout(() => {
          runAnimation();
        }, 10000);
      }, 1000);
    }
    
    // Start animation when in viewport
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runAnimation();
          observer.unobserve(mockupContainer);
        }
      });
    }, { threshold: 0.3 });
    
    observer.observe(mockupContainer);

    // FAQ toggle functionality
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
      faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        
        question.setAttribute('aria-expanded', 'false');
        const answer = item.querySelector('.faq-answer');
        answer.setAttribute('aria-hidden', 'true');
        
        question.addEventListener('click', () => {
          const expanded = item.classList.contains('active');
          question.setAttribute('aria-expanded', !expanded);
          answer.setAttribute('aria-hidden', expanded);
          
          item.classList.toggle('active');
          
          // Close other items (optional - for accordion style)
          faqItems.forEach(otherItem => {
            if (otherItem !== item && otherItem.classList.contains('active')) {
              otherItem.classList.remove('active');
            }
          });
        });
      });
    }
});   