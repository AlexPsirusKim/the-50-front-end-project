// ===== User Profile Data =====
let userProfile = {
    name: 'John Doe',
    title: 'Full Stack Developer',
    location: 'San Francisco, CA',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    website: 'https://example.com',
    bio: 'Passionate developer with 5+ years of experience in building web applications. Specialized in React, Node.js, and modern JavaScript frameworks.',
    joinDate: 'January 15, 2020',
    image: 'https://via.placeholder.com/150',
    skills: ['JavaScript', 'React', 'Node.js', 'CSS', 'HTML', 'MongoDB'],
    stats: {
        projects: 24,
        followers: 1250,
        likes: 842,
        achievements: 15
    },
    activities: [
        { icon: 'fa-code', title: 'Completed a project', time: '2 days ago' },
        { icon: 'fa-star', title: 'Earned a badge', time: '1 week ago' },
        { icon: 'fa-users', title: 'Made a connection', time: '2 weeks ago' }
    ]
};

// ===== DOM Elements =====
const editProfileBtn = document.getElementById('editProfileBtn');
const shareProfileBtn = document.getElementById('shareProfileBtn');
const editAvatarBtn = document.getElementById('editAvatarBtn');
const logoutBtn = document.getElementById('logoutBtn');
const deleteAccountBtn = document.getElementById('deleteAccountBtn');
const editModal = document.getElementById('editModal');
const closeModalBtn = document.getElementById('closeModalBtn');
const editForm = document.getElementById('editForm');
const cancelEditBtn = document.getElementById('cancelEditBtn');
const darkModeToggle = document.getElementById('darkMode');
const navLinks = document.querySelectorAll('.nav-link');

// ===== Initialize Page =====
document.addEventListener('DOMContentLoaded', function() {
    loadUserProfile();
    initializeEventListeners();
    initializeNavigation();
    loadSettings();
});

// ===== Load User Profile =====
function loadUserProfile() {
    // Update profile header
    document.getElementById('userName').textContent = userProfile.name;
    document.getElementById('userTitle').textContent = userProfile.title;
    document.getElementById('userLocation').textContent = `📍 ${userProfile.location}`;
    document.getElementById('profileImage').src = userProfile.image;

    // Update about section
    document.getElementById('userBio').textContent = userProfile.bio;
    document.getElementById('userEmail').textContent = userProfile.email;
    document.getElementById('userPhone').textContent = userProfile.phone;
    document.getElementById('userWebsite').innerHTML = `<a href="${userProfile.website}" target="_blank">${userProfile.website}</a>`;
    document.getElementById('userJoined').textContent = userProfile.joinDate;

    // Update skills
    updateSkills();

    // Update activity
    updateActivity();

    // Populate edit form
    document.getElementById('editName').value = userProfile.name;
    document.getElementById('editTitle').value = userProfile.title;
    document.getElementById('editLocation').value = userProfile.location;
    document.getElementById('editBio').value = userProfile.bio;
    document.getElementById('editEmail').value = userProfile.email;
    document.getElementById('editPhone').value = userProfile.phone;
    document.getElementById('editWebsite').value = userProfile.website;
}

// ===== Update Skills =====
function updateSkills() {
    const skillsList = document.getElementById('skillsList');
    skillsList.innerHTML = '';
    userProfile.skills.forEach(skill => {
        const skillTag = document.createElement('span');
        skillTag.className = 'skill-tag';
        skillTag.textContent = skill;
        skillsList.appendChild(skillTag);
    });
}

// ===== Update Activity =====
function updateActivity() {
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';
    userProfile.activities.forEach(activity => {
        const activityItem = document.createElement('div');
        activityItem.className = 'activity-item';
        activityItem.innerHTML = `
            <div class="activity-icon">
                <i class="fas ${activity.icon}"></i>
            </div>
            <div class="activity-content">
                <p class="activity-title">${activity.title}</p>
                <p class="activity-time">${activity.time}</p>
            </div>
        `;
        activityList.appendChild(activityItem);
    });
}

// ===== Initialize Event Listeners =====
function initializeEventListeners() {
    // Edit Profile
    editProfileBtn.addEventListener('click', openEditModal);
    closeModalBtn.addEventListener('click', closeEditModal);
    cancelEditBtn.addEventListener('click', closeEditModal);
    editForm.addEventListener('submit', handleEditSubmit);

    // Edit Avatar
    editAvatarBtn.addEventListener('click', handleAvatarUpload);

    // Share Profile
    shareProfileBtn.addEventListener('click', shareProfile);

    // Logout
    logoutBtn.addEventListener('click', handleLogout);

    // Delete Account
    deleteAccountBtn.addEventListener('click', handleDeleteAccount);

    // Dark Mode
    darkModeToggle.addEventListener('change', toggleDarkMode);

    // Close modal on background click
    editModal.addEventListener('click', function(event) {
        if (event.target === editModal) {
            closeEditModal();
        }
    });
}

// ===== Modal Functions =====
function openEditModal() {
    editModal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeEditModal() {
    editModal.classList.remove('active');
    document.body.style.overflow = 'auto';
}

function handleEditSubmit(event) {
    event.preventDefault();

    // Update user profile
    userProfile.name = document.getElementById('editName').value;
    userProfile.title = document.getElementById('editTitle').value;
    userProfile.location = document.getElementById('editLocation').value;
    userProfile.bio = document.getElementById('editBio').value;
    userProfile.email = document.getElementById('editEmail').value;
    userProfile.phone = document.getElementById('editPhone').value;
    userProfile.website = document.getElementById('editWebsite').value;

    // Update UI
    loadUserProfile();
    closeEditModal();

    // Show success message
    showNotification('Profile updated successfully!', 'success');

    // Save to localStorage
    saveUserProfile();
}

// ===== Avatar Upload =====
function handleAvatarUpload() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = function(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(e) {
                userProfile.image = e.target.result;
                document.getElementById('profileImage').src = userProfile.image;
                saveUserProfile();
                showNotification('Profile picture updated!', 'success');
            };
            reader.readAsDataURL(file);
        }
    };
    input.click();
}

// ===== Share Profile =====
function shareProfile() {
    const profileURL = window.location.href;
    const shareText = `Check out my profile: ${profileURL}`;

    // Check if Web Share API is available
    if (navigator.share) {
        navigator.share({
            title: 'My Profile',
            text: shareText,
            url: profileURL
        }).catch(err => console.log('Error sharing:', err));
    } else {
        // Fallback: Copy to clipboard
        const textArea = document.createElement('textarea');
        textArea.value = profileURL;
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        showNotification('Profile URL copied to clipboard!', 'success');
    }
}

// ===== Logout =====
function handleLogout() {
    const confirmed = confirm('Are you sure you want to log out?');
    if (confirmed) {
        showNotification('Logging out...', 'info');
        setTimeout(() => {
            alert('You have been logged out. (Demo only)');
            // In a real app, redirect to login page
        }, 1000);
    }
}

// ===== Delete Account =====
function handleDeleteAccount() {
    const confirmed = confirm('Are you sure you want to delete your account? This action cannot be undone.');
    if (confirmed) {
        const doubleConfirm = confirm('This is a permanent action. Are you absolutely sure?');
        if (doubleConfirm) {
            showNotification('Account deleted. (Demo only)', 'warning');
            // In a real app, delete account from backend
        }
    }
}

// ===== Dark Mode Toggle =====
function toggleDarkMode() {
    const isDarkMode = darkModeToggle.checked;
    document.body.classList.toggle('dark-mode', isDarkMode);
    
    // Save preference
    localStorage.setItem('darkMode', isDarkMode);
    
    if (isDarkMode) {
        showNotification('Dark mode enabled', 'info');
    } else {
        showNotification('Dark mode disabled', 'info');
    }
}

// ===== Navigation =====
function initializeNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', function(event) {
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            // Add active class to clicked link
            this.classList.add('active');
        });
    });
}

// ===== Notification System =====
function showNotification(message, type = 'info') {
    // Create notification container if it doesn't exist
    let notificationContainer = document.getElementById('notificationContainer');
    if (!notificationContainer) {
        notificationContainer = document.createElement('div');
        notificationContainer.id = 'notificationContainer';
        notificationContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 2000;
            display: flex;
            flex-direction: column;
            gap: 10px;
        `;
        document.body.appendChild(notificationContainer);
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.style.cssText = `
        padding: 1rem 1.5rem;
        border-radius: 0.5rem;
        background-color: ${getNotificationColor(type)};
        color: white;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
        animation: slideInRight 0.3s ease;
        min-width: 250px;
    `;

    // Add icon based on type
    const icon = getNotificationIcon(type);
    notification.innerHTML = `<i class="${icon}"></i> ${message}`;

    notificationContainer.appendChild(notification);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

function getNotificationColor(type) {
    const colors = {
        'success': '#10b981',
        'error': '#ef4444',
        'warning': '#f59e0b',
        'info': '#3b82f6'
    };
    return colors[type] || colors['info'];
}

function getNotificationIcon(type) {
    const icons = {
        'success': 'fas fa-check-circle',
        'error': 'fas fa-exclamation-circle',
        'warning': 'fas fa-exclamation-triangle',
        'info': 'fas fa-info-circle'
    };
    return icons[type] || icons['info'];
}

// ===== Add Animation Styles =====
function addAnimationStyles() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }

        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    document.head.appendChild(style);
}

addAnimationStyles();

// ===== LocalStorage Functions =====
function saveUserProfile() {
    localStorage.setItem('userProfile', JSON.stringify(userProfile));
}

function loadSavedProfile() {
    const saved = localStorage.getItem('userProfile');
    if (saved) {
        userProfile = JSON.parse(saved);
    }
}

function loadSettings() {
    // Load dark mode preference
    const darkModeEnabled = localStorage.getItem('darkMode') === 'true';
    if (darkModeEnabled) {
        darkModeToggle.checked = true;
        document.body.classList.add('dark-mode');
    }

    // Load saved profile
    loadSavedProfile();
    loadUserProfile();
}

// ===== Add Smooth Scroll Animation =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ===== Window Resize Responsive Check =====
window.addEventListener('resize', function() {
    if (window.innerWidth > 768 && editModal.classList.contains('active')) {
        closeEditModal();
    }
});

// ===== Keyboard Navigation =====
document.addEventListener('keydown', function(event) {
    // Close modal with Escape key
    if (event.key === 'Escape' && editModal.classList.contains('active')) {
        closeEditModal();
    }
});

// ===== Export User Profile (for demonstration) =====
function exportProfile() {
    const dataStr = JSON.stringify(userProfile, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'user-profile.json';
    link.click();
    URL.revokeObjectURL(url);
    showNotification('Profile exported successfully!', 'success');
}

// ===== Add Skill Function =====
function addSkill(skillName) {
    if (skillName && !userProfile.skills.includes(skillName)) {
        userProfile.skills.push(skillName);
        updateSkills();
        saveUserProfile();
        showNotification(`Skill "${skillName}" added!`, 'success');
    }
}

// ===== Remove Skill Function =====
function removeSkill(skillName) {
    const index = userProfile.skills.indexOf(skillName);
    if (index > -1) {
        userProfile.skills.splice(index, 1);
        updateSkills();
        saveUserProfile();
        showNotification(`Skill "${skillName}" removed!`, 'success');
    }
}

// ===== Add Activity Function =====
function addActivity(title, icon = 'fa-star') {
    const activity = {
        icon: icon,
        title: title,
        time: 'just now'
    };
    userProfile.activities.unshift(activity);
    // Keep only recent 10 activities
    if (userProfile.activities.length > 10) {
        userProfile.activities.pop();
    }
    updateActivity();
    saveUserProfile();
    showNotification('Activity added!', 'success');
}

// Make functions globally accessible for console usage
window.exportProfile = exportProfile;
window.addSkill = addSkill;
window.removeSkill = removeSkill;
window.addActivity = addActivity;
