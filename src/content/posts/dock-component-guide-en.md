---
title: Dock Component Integration Guide
published: 2025-12-19
description: 'Show how to add dock component into fuwari'
image: ''
tags: [开发, 博客, fuwari]
category: '开发'
draft: false 
lang: 'en'
---

# Dock Component Integration Guide

The Dock component is a newly added bottom navigation toolbar in the mSpace project that provides quick navigation and search functionality. It automatically appears when users scroll to a specific position, offering convenient access to key features.

## Component Overview

### Main Features

1. **Responsive Display**: Automatically shows when scrolling down beyond 150px, hides when scrolling up or returning to top
2. **Quick Navigation**: Provides quick access buttons for Home, Archive, and About pages
3. **Scroll to Top**: One-click smooth scroll to the top of the page
4. **Integrated Search**: Full-text search functionality supporting Pagefind and development environment mock data

### File Structure

```
src/components/dock/
├── Dock.svelte          # Main Dock component
└── DockSearch.svelte     # Search functionality sub-component
```

## Installation Steps

### 1. Create Component Files

Create a `dock` folder in your project's `src/components/` directory and add the following two files:

1. **Dock.svelte** - The main Dock component that handles scroll detection and navigation
   - Reference: [src/components/dock/Dock.svelte](https://github.com/melody39/mSpace/blob/main/src/components/dock/Dock.svelte)

2. **DockSearch.svelte** - Search functionality component
   - Reference: [src/components/dock/DockSearch.svelte](https://github.com/melody39/mSpace/blob/main/src/components/dock/DockSearch.svelte)

### 2. Add to Layout

Import and add the Dock component to your main layout file (usually `src/layouts/Layout.astro`):

```astro
---
import Dock from "@components/dock/Dock.svelte";
---

<!-- Add this before the closing body tag -->
<Dock client:only="svelte" />
```

## Customization

### Configuration Options

The Dock component includes a configuration object that makes customization easy:

```javascript
const config = {
	scrollThreshold: 150,  // Show dock after scrolling this many pixels
	homePath: "/",
	archivePath: "/archive/",
	aboutPath: "/about/"
};
```

Modify these values to match your site's structure and preferences. This centralized configuration makes it easier to adapt the component to different projects.

### Search Configuration

The search component uses Pagefind for production and mock data for development. To configure:

1. **Production**: Ensure Pagefind is properly set up in your build process
2. **Development**: The mock data in `DockSearch.svelte` can be customized to match your content

### Styling

The Dock uses Tailwind CSS classes and CSS variables for styling. Key style classes to customize:

- `.btn-dock-primary` - Main button style (e.g., back to top)
- `#dock` - Main container positioning
- `#dock-search-panel` - Search panel appearance

## Dependencies

The Dock component relies on:

- **@iconify/svelte** - For icon rendering
- **@utils/url-utils.ts** - For URL handling
- **@i18n/** - For internationalization
- **Svelte** - Component framework
- **Pagefind** (production) - Search functionality

## Browser Support

The Dock component supports all modern browsers. For older browsers, you may need to add polyfills for:

- CSS custom properties (CSS variables)
- backdrop-filter effect
- CSS transforms and transitions

## Troubleshooting

### Dock Not Showing

1. Check if the scroll threshold is set too high
2. Verify that the component is properly imported in your layout
3. Ensure there are no z-index conflicts with other fixed elements

### Search Not Working

1. Verify Pagefind is correctly installed and configured
2. Check browser console for any JavaScript errors
3. Ensure your content is properly indexed for search

### Styling Issues

1. Verify all CSS custom properties are defined
2. Check for conflicts with existing styles
3. Ensure Tailwind CSS is properly configured in your project

## Performance Considerations

The Dock component is optimized for performance with:

- Throttled search requests (300ms delay)
- Throttled CSS variable updates (50ms delay)
- Efficient DOM manipulation using Svelte's reactivity
- Proper cleanup of event listeners and timeouts

## Contributing

If you're contributing to the Dock component, please follow these guidelines:

1. Maintain consistent code style with the rest of the project
2. Ensure all new features are responsive and accessible
3. Add appropriate error handling and fallbacks
4. Test across different screen sizes and browsers