# User Profile Page

A comprehensive, fully-featured user profile page built with HTML, CSS, and vanilla JavaScript. This project provides a modern, responsive interface for displaying and managing user profile information.

## Features

### 1. **Profile Display**
   - User avatar with edit capability
   - User name, title, and location
   - Cover image with gradient background
   - Quick action buttons (Edit Profile, Share Profile)

### 2. **Profile Sections**
   - **About Section**: Bio, contact information, skills, and joined date
   - **Activity Section**: Recent user activities with timestamps
   - **Statistics Section**: Display key metrics (projects, followers, likes, achievements)
   - **Settings Section**: User preferences including dark mode toggle

### 3. **Interactive Features**
   - **Edit Profile Modal**: Full-featured form to update all profile information
   - **Avatar Upload**: Change profile picture with file picker
   - **Share Profile**: Share profile URL via Web Share API or clipboard
   - **Dark Mode**: Toggle between light and dark themes (saved to localStorage)
   - **Notifications**: Toast-style notifications for user feedback
   - **Smooth Navigation**: Smooth scrolling between sections

### 4. **Data Management**
   - **LocalStorage Integration**: Automatically saves profile changes
   - **Session Persistence**: User preferences and profile data persist across sessions
   - **Profile Export**: Export profile data as JSON
   - **Skill Management**: Add and remove skills dynamically
   - **Activity Tracking**: Add new activities to the timeline

### 5. **Responsive Design**
   - Mobile-first approach
   - Breakpoints for tablets (768px) and phones (480px)
   - Adaptive layouts for all screen sizes
   - Touch-friendly interface

### 6. **Accessibility Features**
   - Semantic HTML structure
   - ARIA labels and descriptions
   - Keyboard navigation support
   - Color contrast compliance
   - Focus management in modals

## File Structure

```
51.User Profile Page/
├── index.html          # Main HTML structure
├── style.css           # Complete styling with CSS variables
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## How to Use

### Opening the Page
1. Open `index.html` in a web browser
2. The page will load with default user profile data

### Editing Profile
1. Click the "Edit Profile" button
2. Fill in the form fields with new information
3. Click "Save Changes" to update
4. Changes are automatically saved to localStorage

### Uploading Avatar
1. Click the camera icon on the profile picture
2. Select an image file from your computer
3. The avatar updates immediately

### Managing Skills
In the browser console, you can use:
```javascript
addSkill('New Skill Name');
removeSkill('Skill Name');
```

### Adding Activities
In the browser console:
```javascript
addActivity('Activity Title', 'fa-code');
```

### Exporting Profile
In the browser console:
```javascript
exportProfile();
```

This will download your profile data as a JSON file.

### Dark Mode
Toggle dark mode using the Settings section or use the checkbox in the Settings card. Your preference is saved automatically.

## Technical Details

### CSS Features
- CSS Custom Properties (variables) for easy theming
- Gradient backgrounds
- Flexbox and CSS Grid layouts
- Smooth transitions and animations
- Box shadows for depth
- Responsive design with media queries

### JavaScript Features
- Event delegation and listener management
- Modal dialogs with backdrop
- File upload and FileReader API
- Web Share API with fallback
- LocalStorage for persistence
- Custom notification system
- Keyboard event handling (Escape key support)

## Browser Compatibility

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support
- IE11: Partial support (missing CSS variables)

## Customization

### Color Scheme
Edit the CSS variables at the top of `style.css`:
```css
:root {
    --primary-color: #6366f1;
    --secondary-color: #8b5cf6;
    /* ... more variables ... */
}
```

### Default User Data
Modify the `userProfile` object in `script.js` to change default values:
```javascript
let userProfile = {
    name: 'Your Name',
    title: 'Your Title',
    // ... more fields ...
};
```

### Skills and Activities
Pre-populate with custom data by editing the arrays in the `userProfile` object.

## Functions Reference

### Core Functions
- `loadUserProfile()` - Load and display user profile data
- `openEditModal()` - Open the edit profile modal
- `handleEditSubmit()` - Handle form submission
- `shareProfile()` - Share profile link
- `toggleDarkMode()` - Toggle dark mode theme

### Utility Functions
- `showNotification(message, type)` - Display notification
- `saveUserProfile()` - Save profile to localStorage
- `addSkill(skillName)` - Add a new skill
- `removeSkill(skillName)` - Remove a skill
- `addActivity(title, icon)` - Add a new activity
- `exportProfile()` - Export profile as JSON

## Future Enhancement Ideas

1. Backend Integration
   - Connect to a REST API for data persistence
   - User authentication system
   - Profile image hosting

2. Additional Features
   - Portfolio/project showcase
   - Experience timeline
   - Education section
   - Recommendation/endorsement system
   - Profile completion percentage

3. Social Features
   - Follow/unfollow users
   - Connection requests
   - Direct messaging
   - Profile views counter

4. Analytics
   - Profile view statistics
   - Click tracking
   - Engagement metrics

## License

This project is open source and available for personal and commercial use.

## Author

Created as part of a comprehensive web development portfolio project.

---

**Version**: 1.0.0  
**Last Updated**: December 2024
