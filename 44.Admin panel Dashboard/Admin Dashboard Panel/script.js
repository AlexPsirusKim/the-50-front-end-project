const body = document.querySelector("body"),
      modeToggle = body.querySelector(".mode-toggle"),
      sidebar = body.querySelector("nav"),
      sidebarToggle = body.querySelector(".sidebar-toggle"),
      sidebarOverlay = body.querySelector(".sidebar-overlay"),
      navLinks = body.querySelectorAll(".nav-links li a"),
      quickActionBtns = body.querySelectorAll(".quick-action-btn");

// Initialize dark mode from localStorage
let getMode = localStorage.getItem("mode");
if(getMode && getMode ==="dark"){
    body.classList.toggle("dark");
}

// Initialize sidebar status from localStorage
let getStatus = localStorage.getItem("status");
if(getStatus && getStatus ==="close"){
    sidebar.classList.toggle("close");
}

// Dark mode toggle functionality
modeToggle.addEventListener("click", () =>{
    body.classList.toggle("dark");
    if(body.classList.contains("dark")){
        localStorage.setItem("mode", "dark");
    }else{
        localStorage.setItem("mode", "light");
    }
});

// Enhanced sidebar toggle with overlay support
sidebarToggle.addEventListener("click", () => {
    sidebar.classList.toggle("close");
    
    // Handle overlay for mobile screens
    if (window.innerWidth <= 1000) {
        sidebarOverlay.classList.toggle("active");
        body.style.overflow = sidebar.classList.contains("close") ? "auto" : "hidden";
    }
    
    // Save sidebar status
    if(sidebar.classList.contains("close")){
        localStorage.setItem("status", "close");
    }else{
        localStorage.setItem("status", "open");
    }
});

// Close sidebar when clicking overlay
sidebarOverlay.addEventListener("click", () => {
    sidebar.classList.add("close");
    sidebarOverlay.classList.remove("active");
    body.style.overflow = "auto";
    localStorage.setItem("status", "close");
});

// Navigation link active state management
navLinks.forEach((link, index) => {
    link.addEventListener("click", (e) => {
        e.preventDefault();
        
        // Remove active class from all nav items
        navLinks.forEach(navLink => {
            navLink.parentElement.classList.remove("active");
        });
        
        // Add active class to clicked item
        link.parentElement.classList.add("active");
        
        // Store active nav item
        localStorage.setItem("activeNav", index);
        
        // Close sidebar on mobile after selection
        if (window.innerWidth <= 1000) {
            sidebar.classList.add("close");
            sidebarOverlay.classList.remove("active");
            body.style.overflow = "auto";
        }
        
        // Simulate navigation (in real app, this would route to different pages)
        console.log(`Navigating to: ${link.querySelector('.link-name').textContent}`);
    });
});

// Quick action button functionality
quickActionBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        const actionName = btn.querySelector('.action-name').textContent;
        
        // Add visual feedback
        btn.style.transform = "scale(0.95)";
        setTimeout(() => {
            btn.style.transform = "scale(1)";
        }, 150);
        
        // Handle quick actions (in real app, these would trigger specific functions)
        switch(actionName) {
            case "New Post":
                console.log("Creating new post...");
                break;
            case "Upload":
                console.log("Opening file upload...");
                break;
            case "Message":
                console.log("Opening messaging...");
                break;
        }
    });
});

// Restore active navigation item from localStorage
let activeNav = localStorage.getItem("activeNav");
if(activeNav !== null){
    navLinks.forEach(navLink => {
        navLink.parentElement.classList.remove("active");
    });
    if(navLinks[activeNav]){
        navLinks[activeNav].parentElement.classList.add("active");
    }
}

// Handle window resize for responsive behavior
window.addEventListener("resize", () => {
    if (window.innerWidth > 1000) {
        sidebarOverlay.classList.remove("active");
        body.style.overflow = "auto";
    }
});

// Keyboard navigation support for accessibility
sidebar.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        sidebar.classList.add("close");
        sidebarOverlay.classList.remove("active");
        body.style.overflow = "auto";
        localStorage.setItem("status", "close");
    }
});

// Focus management for accessibility
sidebarToggle.addEventListener("focus", () => {
    sidebarToggle.style.outline = "2px solid var(--primary-color)";
});

sidebarToggle.addEventListener("blur", () => {
    sidebarToggle.style.outline = "none";
});