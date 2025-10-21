# Custom Table of Contents (TOC) Script

**Version: 1.0.0**

A reliable, reusable Table of Contents solution for Webflow websites that's more dependable than third-party solutions.

## Features

- ✅ **Automatic heading detection** - Scans content for H2-H6 headings
- ✅ **Smooth scrolling** - Configurable smooth scroll behavior
- ✅ **Active state management** - Highlights current section using Intersection Observer
- ✅ **URL hash support** - Updates browser URL with current section
- ✅ **Responsive design** - Works on all device sizes
- ✅ **Customizable styling** - Multiple theme options included
- ✅ **No dependencies** - Pure JavaScript, no external libraries
- ✅ **Webflow compatible** - Works seamlessly with Webflow sites
- ✅ **Accessibility friendly** - Proper focus management and keyboard navigation

## Quick Start

### 1. Include the Files

Add these files to your Webflow project:

```html
<!-- In your page's <head> -->
<link rel="stylesheet" href="toc-styles.css">
<script src="toc-script.js"></script>
```

### 2. HTML Structure

```html
<!-- Your content area -->
<main data-toc-content>
    <h2>Section 1</h2>
    <p>Content here...</p>
    
    <h3>Subsection 1.1</h3>
    <p>More content...</p>
    
    <h2>Section 2</h2>
    <p>More content...</p>
</main>

<!-- TOC container -->
<aside>
    <div data-toc-container>
        <!-- TOC will be generated here automatically -->
    </div>
</aside>
```

### 3. That's it!

The TOC will automatically generate based on your headings and provide smooth navigation.

## Configuration Options

### Data Attributes (Simple Configuration)

Add these attributes to your `[data-toc-container]` element:

```html
<div data-toc-container 
     data-toc-offset="100" 
     data-toc-smooth="true"
     data-toc-numbers="false"
     data-toc-hide-hash="false">
</div>
```

| Attribute | Values | Description |
|-----------|--------|-------------|
| `data-toc-offset` | Number (px) | Scroll offset from top (default: 80) |
| `data-toc-smooth` | true/false | Enable smooth scrolling (default: true) |
| `data-toc-numbers` | true/false | Show numbers in TOC (default: false) |
| `data-toc-hide-hash` | true/false | Hide URL hash (default: false) |

### JavaScript Configuration (Advanced)

```javascript
const toc = new TableOfContents({
    // Selectors
    contentSelector: '[data-toc-content]',
    tocContainerSelector: '[data-toc-container]',
    
    // Heading levels to include
    headingLevels: ['h2', 'h3', 'h4', 'h5', 'h6'],
    
    // Scroll behavior
    scrollOffset: 100, // pixels from top
    smoothScroll: true,
    
    // Active state classes
    activeClass: 'toc-active',
    currentClass: 'toc-current',
    
    // URL hash handling
    updateUrlHash: true,
    hideUrlHash: false,
    
    // Styling options
    showNumbers: false,
    collapseSubItems: false,
    
    // Callbacks
    onInit: (toc) => {
        console.log('TOC initialized');
    },
    onScroll: (toc) => {
        // Custom scroll handling
    },
    onLinkClick: (heading, link) => {
        console.log('Clicked:', heading.textContent);
    }
});
```

## Styling Options

### Built-in Themes

Add these classes to your `[data-toc-container]`:

```html
<!-- Minimal theme -->
<div data-toc-container class="toc-theme-minimal">

<!-- Card theme -->
<div data-toc-container class="toc-theme-card">
```

### Custom CSS

The TOC uses semantic CSS classes that you can easily customize:

```css
/* TOC container */
[data-toc-container] {
    background: #f8f9fa;
    border-radius: 8px;
    padding: 20px;
}

/* TOC links */
.toc-link {
    color: #333;
    text-decoration: none;
    padding: 8px 12px;
    border-radius: 4px;
    transition: all 0.2s ease;
}

/* Active state */
.toc-link.toc-active {
    background-color: #007bff;
    color: white;
}

/* Current section */
.toc-link.toc-current {
    font-weight: bold;
}

/* Level-based indentation */
.toc-level-2 { padding-left: 0; }
.toc-level-3 { padding-left: 20px; }
.toc-level-4 { padding-left: 40px; }
.toc-level-5 { padding-left: 60px; }
.toc-level-6 { padding-left: 80px; }
```

## Webflow Integration

### Method 1: Custom Code (Recommended)

1. Go to your Webflow project settings
2. Navigate to "Custom Code"
3. Add the CSS to the "Head Code" section
4. Add the JavaScript to the "Footer Code" section
5. Add the HTML structure to your page

### Method 2: HTML Embed

1. Add an HTML Embed element to your page
2. Include the script and styles inline
3. Add your content and TOC structure

### Method 3: External Files

1. Host the files on your own server or CDN
2. Link to them in your Webflow project
3. Add the HTML structure to your page

## API Reference

### TableOfContents Class

#### Constructor Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `contentSelector` | string | `'[data-toc-content]'` | Selector for content area |
| `tocContainerSelector` | string | `'[data-toc-container]'` | Selector for TOC container |
| `headingLevels` | array | `['h2','h3','h4','h5','h6']` | Heading levels to include |
| `scrollOffset` | number | `80` | Scroll offset in pixels |
| `smoothScroll` | boolean | `true` | Enable smooth scrolling |
| `activeClass` | string | `'toc-active'` | CSS class for active link |
| `currentClass` | string | `'toc-current'` | CSS class for current section |
| `updateUrlHash` | boolean | `true` | Update browser URL |
| `hideUrlHash` | boolean | `false` | Hide URL hash |
| `showNumbers` | boolean | `false` | Show numbers in TOC |
| `collapseSubItems` | boolean | `false` | Collapse sub-items |

#### Methods

```javascript
// Update configuration
toc.updateConfig({
    scrollOffset: 120,
    showNumbers: true
});

// Refresh TOC (useful for dynamic content)
toc.refresh();

// Destroy TOC instance
toc.destroy();
```

#### Callbacks

```javascript
const toc = new TableOfContents({
    onInit: (tocInstance) => {
        console.log('TOC initialized with', tocInstance.headings.length, 'headings');
    },
    onScroll: (tocInstance) => {
        // Called on scroll events
    },
    onLinkClick: (headingElement, linkElement) => {
        console.log('User clicked on:', headingElement.textContent);
    }
});
```

## Browser Support

- ✅ Chrome 60+
- ✅ Firefox 55+
- ✅ Safari 12+
- ✅ Edge 79+
- ✅ Mobile browsers

## Troubleshooting

### TOC Not Generating

1. Check that your content has the `data-toc-content` attribute
2. Ensure your TOC container has the `data-toc-container` attribute
3. Verify that your content has H2-H6 headings
4. Check browser console for errors

### Styling Issues

1. Make sure `toc-styles.css` is loaded
2. Check for CSS conflicts with your existing styles
3. Use browser dev tools to inspect the generated HTML

### Smooth Scrolling Not Working

1. Ensure `smoothScroll: true` in your configuration
2. Check that your browser supports `scroll-behavior: smooth`
3. Verify no CSS is overriding the scroll behavior

## Examples

See `toc-example.html` for a complete working example with all features demonstrated.

## License

This project is open source and available under the MIT License.

## Support

For issues and questions:
1. Check the troubleshooting section above
2. Review the example HTML file
3. Test with the provided example to ensure everything works
4. Check browser console for any JavaScript errors
