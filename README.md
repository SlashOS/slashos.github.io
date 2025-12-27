# SlashOS Website

A modern, responsive website for SlashOS - Unified Desktop and Mobile Experience.

## Structure

- `index.html` - Main landing page
- `releases.html` - Release archive page
- `css/` - Stylesheets
  - `style.css` - Main stylesheet (imports others)
  - `base.css` - Base styles, variables, glass effect
  - `header.css` - Header and navigation
  - `components.css` - Reusable components (buttons, pills)
  - `sections.css` - Page sections (hero, features, etc.)
  - `footer.css` - Footer styles
  - `responsive.css` - Media queries
- `js/` - JavaScript modules
  - `script.js` - Main initialization
  - `release.js` - GitHub releases API handling
  - `menu.js` - Mobile menu functionality
  - `utils.js` - Utility functions
- `assets/` - Static assets
  - `images/` - Image files and integrity hashes

## Development

This is a static website hosted on GitHub Pages. No build process required.

## Deployment

Push to the `main` branch to deploy via GitHub Pages.
You don't need any special things to deploy this yourself, just opening the index.html is enough :)
