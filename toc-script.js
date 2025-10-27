/**
 * Table of Contents (TOC) Script
 * Version: 1.0.0
 * SOLID principles implementation
 */

// Debug settings
const DEBUG_CROSSHAIR = false; // Set to true to show debug crosshair

// Single Responsibility: Handles configuration
class TOCConfig {
    constructor(options = {}) {
        this.contentSelector = options.contentSelector || '[data-toc-content]';
        this.tocContainerSelector = options.tocContainerSelector || '[data-toc-container]';
        this.scrollOffset = options.scrollOffset || 80;
    }
}

// Single Responsibility: Handles DOM element selection
class ElementSelector {
    static getContentElement(selector) {
        return document.querySelector(selector);
    }
    
    static getTOCContainer(selector) {
        return document.querySelector(selector);
    }
    
    static getHeadings(element) {
        return Array.from(element.querySelectorAll('h2'));
    }
}

// Single Responsibility: Handles heading analysis
class HeadingAnalyzer {
    static findTopLevel(headings) {
        return Math.min(...headings.map(h => parseInt(h.tagName.charAt(1))));
    }
    
    static getHeadingLevel(heading) {
        return parseInt(heading.tagName.charAt(1));
    }
    
    static getHeadingCenter(heading) {
        const rect = heading.getBoundingClientRect();
        const scrollTop = window.pageYOffset;
        return rect.top + scrollTop + (rect.height / 2);
    }
}

// Single Responsibility: Handles ID generation
class IdGenerator {
    static generate(text) {
        return text.toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .trim();
    }
}

// Single Responsibility: Handles scroll behavior
class ScrollManager {
    constructor(config) {
        this.config = config;
        this.ticking = false;
    }
    
    setupListener(updateCallback) {
        window.addEventListener('scroll', () => {
            if (!this.ticking) {
                requestAnimationFrame(() => {
                    updateCallback();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        });
    }
    
    scrollToHeading(id, offset) {
        const heading = document.getElementById(id);
        if (heading) {
            // Calculate the center of the heading, similar to how active state tracking works
            const headingCenter = HeadingAnalyzer.getHeadingCenter(heading);
            const viewportHeight = window.innerHeight;
            const targetScrollTop = headingCenter - (viewportHeight / 2);
            window.scrollTo({ top: targetScrollTop, behavior: 'smooth' });
        }
    }
}

// Single Responsibility: Handles active state management
class ActiveStateManager {
    constructor(tocLinks) {
        this.tocLinks = tocLinks;
    }
    
    updateActiveState(headings, viewportCenter) {
        const activeHeading = this.findClosestHeading(headings, viewportCenter);
        
        this.clearActiveStates();
        if (activeHeading) {
            this.setActiveState(activeHeading);
        }
    }
    
    findClosestHeading(headings, viewportCenter) {
        let activeHeading = null;
        let closestDistance = Infinity;
        
        headings.forEach(heading => {
            const headingCenter = HeadingAnalyzer.getHeadingCenter(heading);
            
            // Only consider headings that are above or at the viewport center
            if (headingCenter <= viewportCenter) {
                const distance = viewportCenter - headingCenter;
                
                if (DEBUG_CROSSHAIR) {
                    console.log(`Heading: ${heading.textContent}, Center: ${headingCenter}, Distance: ${distance.toFixed(2)}`);
                }
                
                if (distance < closestDistance) {
                    closestDistance = distance;
                    activeHeading = heading;
                }
            }
        });
        
        if (DEBUG_CROSSHAIR) {
            console.log(`Viewport Center: ${viewportCenter}, Active: ${activeHeading?.textContent}`);
        }
        
        return activeHeading;
    }
    
    clearActiveStates() {
        this.tocLinks.forEach(link => {
            link.classList.remove('toc-active');
        });
    }
    
    setActiveState(activeHeading) {
        const activeLink = this.tocLinks.find(link => 
            link.getAttribute('data-heading-id') === activeHeading.id
        );
        if (activeLink) {
            activeLink.classList.add('toc-active');
        }
    }
}

// Single Responsibility: Handles TOC generation
class TOCGenerator {
    constructor(config) {
        this.config = config;
    }
    
    generate(contentElement, tocContainer) {
        const headings = ElementSelector.getHeadings(contentElement);
        if (headings.length === 0) return [];
        
        const topLevel = HeadingAnalyzer.findTopLevel(headings);
        const tocLinks = this.createTOCStructure(headings, topLevel, tocContainer);
        
        return tocLinks;
    }
    
    createTOCStructure(headings, topLevel, tocContainer) {
        tocContainer.innerHTML = '';
        const list = document.createElement('ul');
        list.className = 'toc-list';
        
        headings.forEach((heading, index) => {
            const tocItem = this.createTOCItem(heading, index, topLevel);
            list.appendChild(tocItem);
        });
        
        tocContainer.appendChild(list);
        return Array.from(list.querySelectorAll('.toc-link'));
    }
    
    createTOCItem(heading, index, topLevel) {
        const id = heading.id || IdGenerator.generate(heading.textContent);
        if (!heading.id) heading.id = id;
        
        const item = document.createElement('li');
        const level = HeadingAnalyzer.getHeadingLevel(heading) - topLevel + 1;
        item.className = `toc-item toc-level-${level}`;
        
        // Add line div for levels 2 and above
        if (level >= 2) {
            const lineDiv = document.createElement('div');
            lineDiv.className = `toc-line toc-line-level-${level}`;
            item.appendChild(lineDiv);
        }
        
        const link = this.createTOCLink(id, heading.textContent);
        item.appendChild(link);
        
        return item;
    }
    
    createTOCLink(id, text) {
        const link = document.createElement('a');
        link.href = `#${id}`;
        link.textContent = text;
        link.className = 'toc-link';
        link.setAttribute('data-heading-id', id);
        
        return link;
    }
}

// Single Responsibility: Handles debug crosshair
class DebugCrosshair {
    static create() {
        if (!DEBUG_CROSSHAIR) return;
        
        this.createHorizontalLine();
        this.createVerticalLine();
        this.setupToggle();
    }
    
    static createHorizontalLine() {
        const crosshair = document.createElement('div');
        crosshair.id = 'toc-debug-crosshair';
        crosshair.className = 'toc-debug-crosshair';
        document.body.appendChild(crosshair);
    }
    
    static createVerticalLine() {
        const verticalLine = document.createElement('div');
        verticalLine.className = 'toc-debug-crosshair-vertical';
        document.body.appendChild(verticalLine);
    }
    
    static setupToggle() {
        let visible = true;
        document.addEventListener('keydown', (e) => {
            if (e.key === 'd' && e.ctrlKey) {
                e.preventDefault();
                visible = !visible;
                const crosshair = document.getElementById('toc-debug-crosshair');
                const verticalLine = document.querySelector('.toc-debug-crosshair-vertical');
                
                if (crosshair) {
                    // Remove any inline styles that might interfere
                    crosshair.removeAttribute('style');
                    if (visible) {
                        crosshair.classList.remove('toc-debug-crosshair-hidden');
                    } else {
                        crosshair.classList.add('toc-debug-crosshair-hidden');
                    }
                }
                
                if (verticalLine) {
                    // Remove any inline styles that might interfere
                    verticalLine.removeAttribute('style');
                    if (visible) {
                        verticalLine.classList.remove('toc-debug-crosshair-hidden');
                    } else {
                        verticalLine.classList.add('toc-debug-crosshair-hidden');
                    }
                }
            }
        });
    }
}

// Open/Closed Principle: Main class that orchestrates everything
class TableOfContents {
    constructor(options = {}) {
        this.config = new TOCConfig(options);
        this.contentElement = ElementSelector.getContentElement(this.config.contentSelector);
        this.tocContainer = ElementSelector.getTOCContainer(this.config.tocContainerSelector);
        
        if (!this.contentElement || !this.tocContainer) return;
        
        this.initialize();
    }
    
    initialize() {
        this.tocGenerator = new TOCGenerator(this.config);
        this.scrollManager = new ScrollManager(this.config);
        
        this.tocLinks = this.tocGenerator.generate(this.contentElement, this.tocContainer);
        this.activeStateManager = new ActiveStateManager(this.tocLinks);
        
        this.setupEventListeners();
        DebugCrosshair.create();
        
        // Set initial active state on page load
        this.updateActiveState();
    }
    
    setupEventListeners() {
        this.scrollManager.setupListener(() => this.updateActiveState());
        this.setupClickListeners();
    }
    
    setupClickListeners() {
        this.tocLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const headingId = link.getAttribute('data-heading-id');
                this.scrollManager.scrollToHeading(headingId, this.config.scrollOffset);
            });
        });
    }
    
    updateActiveState() {
        const scrollTop = window.pageYOffset;
        const viewportHeight = window.innerHeight;
        const viewportCenter = scrollTop + (viewportHeight / 2);
        const headings = ElementSelector.getHeadings(this.contentElement);
        
        if (DEBUG_CROSSHAIR) {
            console.log(`Scroll Top: ${scrollTop}, Viewport Height: ${viewportHeight}, Center: ${viewportCenter}`);
        }
        
        this.activeStateManager.updateActiveState(headings, viewportCenter);
    }
}

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    new TableOfContents();
});

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TableOfContents;
}