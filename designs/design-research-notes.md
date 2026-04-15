# Nith Digital -- Design Research Notes (April 2026)

Research compiled to keep our Next.js sites for UK small businesses ahead of templates and AI-generated slop.

---

## Part 1: Trends

### ADOPT -- Emerging or underused, would differentiate our sites

#### 1. Anti-AI / Handcrafted Aesthetic
The biggest counter-movement of 2026. Designers are deliberately adding hand-drawn elements, wonky serifs, tactile textures, and controlled imperfections to signal "a human made this." Brands using anti-AI aesthetics command 10-50x premium pricing vs AI-generated alternatives. For our clients: custom illustrations, hand-lettered accent text, slight irregularities in spacing or borders, textured backgrounds (grain, paper, fabric).

- Source: [Gatitaa -- Anti-AI Backlash](https://www.gatitaa.com/blogs/web-design-trends-2026/)
- Source: [Design Magazine Australia -- $50M Handmade Rebellion](https://designmagazine.com.au/anti-ai-crafting-the-50-million-handmade-rebellion-reshaping-design-in-2026/)
- Source: [We and the Color -- Human Imperfection](https://weandthecolor.com/why-the-biggest-design-trend-of-2026-is-human-imperfection/207545)

#### 2. Kinetic / Motion Typography
Type that moves: shifts weight on scroll, stretches on hover, animates on load. Variable fonts make this performant (one file, infinite states). Hero headings that react to interaction feel premium without heavy JS. CSS `animation-timeline: scroll()` makes scroll-linked type movement possible without libraries.

- Source: [Envato Elements -- Kinetic Type](https://elements.envato.com/learn/web-design-trends)
- Source: [Wix -- Typography Trends 2026](https://www.wix.com/wixel/resources/typography-trends)

#### 3. CSS Scroll-Driven Animations (No JS)
Native `animation-timeline: scroll()` and `animation-timeline: view()` let elements animate on scroll without AOS.js, GSAP ScrollTrigger, or IntersectionObserver. Runs on the compositor thread (GPU-accelerated, 60fps). Browser support: Chrome 115+, Edge 115+, Safari 18+. Firefox behind flag but progressing. Safe to use with graceful degradation.

- Source: [MDN -- Scroll-Driven Animations](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Scroll-driven_animations)
- Source: [Chrome for Developers -- Scroll-Triggered Animations](https://developer.chrome.com/blog/scroll-triggered-animations)

#### 4. View Transitions API (Next.js 16.2+)
React's `<ViewTransition>` component is now available in Next.js behind `experimental: { viewTransition: true }`. Four patterns: shared element morphing (thumbnail to hero), Suspense reveals (skeleton to content), directional navigation slides, and same-route crossfades. Full browser support in all major engines since late 2025. This eliminates the need for Framer Motion or React Transition Group for page transitions.

- Source: [Next.js Docs -- View Transitions Guide](https://nextjs.org/docs/app/guides/view-transitions)
- Source: [Chrome for Developers -- View Transition API](https://developer.chrome.com/docs/web-platform/view-transitions/)

#### 5. Organic / Anti-Grid Layouts
Breaking away from rigid 12-column grids. Overlapping elements, asymmetrical placement, diagonal movement, irregular shapes. Makes sites feel human and distinctive vs template-generated. CSS Grid's `subgrid`, named grid areas, and `minmax()` with `auto-fill` make complex organic layouts maintainable.

- Source: [Figma -- Web Design Trends 2026](https://www.figma.com/resource-library/web-design-trends/)
- Source: [Gatitaa -- Organic Layouts](https://www.gatitaa.com/blogs/web-design-trends-2026/)

#### 6. Serif Revival with Modern Proportions
Serifs are back -- but sharper, higher-contrast, bolder than traditional serifs. Paired with geometric sans-serif body text, they create editorial gravitas suitable for professional services. Google Fonts picks: Playfair Display, Lora, DM Serif Display paired with Inter or Plus Jakarta Sans.

- Source: [Design Monks -- Typography Trends 2026](https://www.designmonks.co/blog/typography-trends-2026)
- Source: [Creative Boom -- 50 Fonts for 2026](https://www.creativeboom.com/resources/top-50-fonts-in-2026/)

#### 7. Purposeful Micro-interactions
Small animations that confirm actions (button press, form submit, menu open) rather than decorative swooshes. Buttons that pulse, icons that morph on hover, content that loads with a subtle slide. The key word is "functional" -- every animation must answer a user question ("did that work?", "what can I click?").

- Source: [Webflow -- Web Design Trends 2026](https://webflow.com/blog/web-design-trends-2026)

---

### MAINTAIN -- Solid techniques we should keep using

#### 1. Mobile-First, Performance-Obsessed Build
Google's March 2026 Core Update made Core Web Vitals a ranking filter (not just a tiebreaker). Poor CWV can now prevent even good content from ranking. Targets: LCP < 2.5s, CLS < 0.1, INP < 200ms, TTFB < 200ms. 53% of mobile users abandon sites taking > 3 seconds.

- Source: [Sky SEO -- Core Web Vitals 2026](https://skyseodigital.com/core-web-vitals-optimization-complete-guide-for-2026/)
- Source: [ABC Money -- UK Small Business Trends](https://www.abcmoney.co.uk/2026/04/web-design-industry-trends-small-businesses-cant-ignore-in-2026)

#### 2. WCAG 2.2 / EAA Compliance
The European Accessibility Act is now in effect. WCAG 2.2 is the baseline. High contrast, semantic markup, keyboard navigation, screen-reader-friendly content, appropriately sized tap targets. Not optional -- it's legal compliance for UK businesses trading with EU customers.

- Source: [Mapletree Studio -- UK Small Business Trends](https://mapletree.studio/blog/2026-web-design-trends-uk-small-business/)

#### 3. Server Components by Default (Next.js)
Stop defaulting to `"use client"`. Server Components render on the server, send only HTML, have zero impact on client-side JS bundle. Use `@next/bundle-analyzer` to find bloat (moment.js, lodash, icon libraries). Next.js 16.2 improved Server Component payload deserialization by up to 350%.

- Source: [DEV Community -- Next.js Performance 2026](https://dev.to/bean_bean/nextjs-performance-optimization-the-2026-complete-guide-1a9k)
- Source: [Next.js Blog -- 16.2 Release](https://nextjs.org/blog/next-16-2)

#### 4. next/image + AVIF/WebP
Images remain the biggest performance culprit. Always use `next/image` for automatic format conversion (AVIF/WebP), lazy loading, and device-appropriate sizing. Combined with `next/font` for self-hosted fonts with `font-display: swap`.

#### 5. Clean Whitespace and Visual Hierarchy
Minimalism isn't dead -- excessive minimalism is. The 2026 philosophy is "purposeful design": enough whitespace for clarity, enough personality to avoid looking like every other Tailwind template. Clear headlines, obvious CTAs, scannable content.

- Source: [Wazile -- Outdated Trends to Avoid](https://www.wazile.com/blog/outdated-web-design-trends-to-avoid-in-2026/)

#### 6. Dark Mode Support
Still expected by users in 2026. Implement via CSS `prefers-color-scheme` media query and Tailwind's `dark:` variant. Low effort, high perceived quality.

#### 7. Sustainable / Lean Code
Leaner code, optimised images, fewer server requests, efficient user journeys. Part of green web design movement and also just good engineering. Fewer dependencies = faster builds, fewer vulnerabilities.

- Source: [Priority Pixels -- Website Design Trends 2026](https://prioritypixels.co.uk/insights/website-design-trends-2026/)

---

### AVOID -- Overdone, cliched, or signalling "AI-generated"

#### 1. Hero Section with Generic Stock Photo + Gradient Overlay + "We Help You Grow" Headline
The single most common AI-generated template pattern. Instantly signals "we didn't try." Replace with: real photography, custom illustration, typography-led hero, or interactive element.

- Source: [Wazile -- Outdated Trends](https://www.wazile.com/blog/outdated-web-design-trends-to-avoid-in-2026/)

#### 2. Excessive Parallax Scrolling
Heavy parallax effects increase load times, strain older devices, trigger motion sickness, and distract from content. Subtle scroll effects are fine; multi-layer parallax backgrounds are dead.

- Source: [Wazile -- Outdated Trends](https://www.wazile.com/blog/outdated-web-design-trends-to-avoid-in-2026/)

#### 3. Auto-Playing Video Backgrounds
Universally rejected. Frustrates users, wastes data, hurts mobile performance, and accessibility nightmare. If video is needed, make it user-initiated with a clear play button.

#### 4. Cookie-Cutter "About/Services/Contact" Three-Card Grid
Every AI site generator produces this layout. Three cards with icons, centered text, same border radius. Differentiate with asymmetric layouts, editorial-style content blocks, or scrolling case studies.

#### 5. Pop-ups on Page Load
Especially newsletter pop-ups within 3 seconds of arrival. Google penalises intrusive interstitials. If needed, trigger on exit intent or after meaningful engagement (scroll depth, time on page).

- Source: [Wazile -- Outdated Trends](https://www.wazile.com/blog/outdated-web-design-trends-to-avoid-in-2026/)

#### 6. Image Sliders / Carousels
Still declining. Users don't interact with slides beyond the first. Static, well-designed hero content outperforms. If rotation is needed, use a manual gallery with clear navigation.

#### 7. Overcomplicated Mega-Menus
Excessive dropdown options confuse visitors, increase bounce rates, and break on mobile. Small business sites rarely need more than 5-7 top-level nav items. Simplify.

- Source: [Wazile -- Outdated Trends](https://www.wazile.com/blog/outdated-web-design-trends-to-avoid-in-2026/)

#### 8. "Design for Design's Sake"
Flashy animations, complex interactions, or trendy aesthetics that don't serve the user journey. In 2026, sites are judged on how they feel to use, not how they look in a Dribbble screenshot.

- Source: [Elementor -- Web Design Trends 2026](https://elementor.com/blog/web-design-trends-2026/)

---

### WATCH -- Too early to adopt but worth tracking

#### 1. CSS `if()` Function
Inline conditional logic in CSS property values. First time CSS can make decisions without media queries or JS. Still experimental, not production-ready. Watch for baseline browser support.

- Source: [LogRocket -- CSS in 2026](https://blog.logrocket.com/css-in-2026/)

#### 2. CSS Mixins (`@mixin` / `@apply`)
Define reusable blocks of CSS declarations. Would eliminate the last reason to use Sass. Currently in specification phase, not shipped in any browser.

- Source: [LogRocket -- CSS in 2026](https://blog.logrocket.com/css-in-2026/)

#### 3. `sibling-index()` and `sibling-count()`
CSS functions that let elements know their position among siblings. Enables staggered animations and proportional layouts without JS or manual `:nth-child()` rules. Chrome 135+ only. Watch for cross-browser adoption.

- Source: [LogRocket -- CSS in 2026](https://blog.logrocket.com/css-in-2026/)

#### 4. CSS Anchor Positioning
Position elements (tooltips, popovers, dropdowns) relative to any anchor element without Popper.js or Floating UI. Now in Chrome 125+, Safari 26, Firefox 147+. Approaching production-ready for progressive enhancement.

- Source: [MDN -- CSS Anchor Positioning](https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Anchor_positioning/Using)
- Source: [Can I Use -- CSS Anchor Positioning](https://caniuse.com/css-anchor-positioning)

#### 5. `interpolate-size: allow-keywords`
Animate to `height: auto` without JS hacks (measuring `scrollHeight`, setting fixed pixel height). One line in CSS reset enables smooth accordion/expand animations. Currently Chromium-only (~66% of users). Add to CSS reset with `@supports` for progressive enhancement.

- Source: [Chrome for Developers -- Animate to Height Auto](https://developer.chrome.com/docs/css-ui/animate-to-height-auto)

#### 6. AI-Driven Personalisation
Websites that adapt content, layout, and CTAs based on visitor behaviour. Powerful for e-commerce but complex to implement well for small business brochure sites. Watch for simpler implementation patterns.

- Source: [Nu Media Group -- Trends for 2026 Businesses](https://numediagroup.co.uk/top-web-design-trends-for-2026-businesses/)

---

## Part 2: Techniques

### CSS Techniques

#### Container Queries
**What:** Components respond to their parent container's size, not the viewport. Makes components truly reusable across different layout contexts.
**Browser support:** Chrome 105+, Safari 16+, Firefox 110+ -- fully cross-browser, production-ready.
**Tailwind v4:** First-class support with `@container` on parent and `@sm:`, `@md:`, `@lg:` variants on children. No plugin needed.
**Example:** A testimonial card that switches from horizontal to vertical layout based on its container width, not the screen width.

```css
.card-container { container-type: inline-size; }
@container (min-width: 400px) {
  .testimonial { display: grid; grid-template-columns: 120px 1fr; gap: 1rem; }
}
```

#### `:has()` Parent Selector
**What:** Style a parent based on its children's state. Replaces JS event listeners for form validation styling, conditional layouts, and state-driven design.
**Browser support:** Chrome 105+, Safari 15.4+, Firefox 121+ -- fully cross-browser.
**Example:** Style a form group differently when its input is invalid:

```css
.form-group:has(input:invalid) {
  border-color: var(--color-error);
  background: var(--color-error-bg);
}
```

#### Scroll-Driven Animations
**What:** Animate elements based on scroll position using `animation-timeline: scroll()` (whole page progress) or `animation-timeline: view()` (element entering viewport).
**Browser support:** Chrome 115+, Edge 115+, Safari 18+. Firefox behind flag.
**Example:** Fade-in sections as they scroll into view:

```css
.fade-in-section {
  animation: fade-slide-up linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}
@keyframes fade-slide-up {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

#### `@starting-style` for Entry Animations
**What:** Define initial styles for elements transitioning from `display: none`. Enables CSS-only modal/popover/accordion animations without the `setTimeout(0)` hack.
**Browser support:** Chrome 117+, Safari 17.5+, Firefox 129+ -- fully cross-browser.
**Example:**

```css
dialog {
  opacity: 1; transform: scale(1);
  transition: opacity 0.3s, transform 0.3s, display 0.3s allow-discrete;
  @starting-style {
    opacity: 0; transform: scale(0.95);
  }
}
dialog:not([open]) {
  opacity: 0; transform: scale(0.95);
}
```

#### `color-mix()` for Dynamic Palettes
**What:** Derive lighter, darker, and transparent colour variants from a single base colour. Replaces Sass `lighten()`/`darken()` and eliminates hardcoded shade tokens.
**Browser support:** Chrome 111+, Safari 16.2+, Firefox 113+ -- fully cross-browser.
**Example:**

```css
:root {
  --brand: oklch(0.6 0.15 250);
  --brand-light: color-mix(in oklch, var(--brand), white 30%);
  --brand-dark: color-mix(in oklch, var(--brand), black 20%);
  --brand-hover: color-mix(in oklch, var(--brand), black 10%);
}
```

#### CSS Nesting (Native)
**What:** Write Sass-like nested rules directly in CSS. No preprocessor, no build step.
**Browser support:** Chrome 112+, Safari 16.5+, Firefox 117+ -- fully cross-browser.
**Example:**

```css
.card {
  padding: 1.5rem;
  & .title { font-size: 1.25rem; font-weight: 600; }
  & .body { color: var(--text-muted); }
  &:hover { box-shadow: 0 4px 12px rgb(0 0 0 / 0.08); }
}
```

### Tailwind CSS v4 Techniques

#### CSS-First Configuration
Tailwind v4 moves all theme config into CSS using `@theme` directives. No `tailwind.config.js` needed. Runtime theme switching without rebuilds.

#### Rust-Based Oxide Engine
5x faster full builds, 100x faster incremental builds. Dropped PostCSS dependency in favour of Lightning CSS.

#### Container Query Variants
First-class container query support: `@container` on parent, `@sm:`, `@md:`, `@lg:` variants on children. No plugin required.

#### Dynamic Class Safety
Avoid dynamic class construction (`text-${color}-500`). Use complete class name strings or `@source` directive to tell the compiler where to find class names. Critical for tree-shaking.

- Source: [Benjamin Crozat -- Tailwind CSS Best Practices 2026](https://benjamincrozat.com/tailwind-css)
- Source: [LogRocket -- Tailwind CSS Guide 2026](https://blog.logrocket.com/tailwind-css-guide/)

### Next.js Performance

#### Server Components First
Default to Server Components. Only add `"use client"` when you need browser APIs, event handlers, or useState/useEffect. Every client component ships JS to the browser.

#### Bundle Analysis
Run `@next/bundle-analyzer` regularly. Common bloat: moment.js (use date-fns or dayjs), lodash (use individual imports or native methods), icon libraries (import individual icons, not the whole package).

#### Edge Functions for TTFB
Deploy on Vercel Edge Functions or Cloudflare Workers for TTFB under 200ms. Reduces latency by 40-70% vs traditional serverless.

#### next/font Self-Hosting
Always use `next/font` to self-host Google Fonts. Eliminates the external request to fonts.googleapis.com. Automatic `font-display: swap` for no layout shift.

#### Turbopack for Development
Use Turbopack in dev for dramatically faster hot module replacement. Next.js 16.2 improved startup time by ~87% compared to 16.1.

- Source: [DEV Community -- Next.js Performance 2026](https://dev.to/bean_bean/nextjs-performance-optimization-the-2026-complete-guide-1a9k)
- Source: [Next.js Blog -- 16.2](https://nextjs.org/blog/next-16-2)

### View Transitions in Next.js

#### Setup
```ts
// next.config.ts
const nextConfig: NextConfig = {
  experimental: { viewTransition: true },
}
```

#### Four Patterns

1. **Shared Element Morph** -- Same `<ViewTransition name="...">` on both pages. Browser animates between positions automatically.
2. **Suspense Reveal** -- Skeleton exits with `slide-down`, real content enters with `slide-up`. Asymmetric timing (fast exit, slow enter).
3. **Directional Navigation** -- `<Link transitionTypes={['nav-forward']}>` for forward, `['nav-back']` for back. Content slides left/right accordingly. Header stays anchored.
4. **Same-Route Crossfade** -- `<ViewTransition key={slug}>` triggers crossfade when key changes. For tabs, filters, content switches.

#### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  ::view-transition-old(*),
  ::view-transition-new(*),
  ::view-transition-group(*) {
    animation-duration: 0s !important;
    animation-delay: 0s !important;
  }
}
```

- Source: [Next.js Docs -- View Transitions](https://nextjs.org/docs/app/guides/view-transitions)

### Typography Pairings (Google Fonts, 2026)

| Use Case | Heading | Body | Vibe |
|---|---|---|---|
| Professional services | Playfair Display | Inter | Elegant, trustworthy |
| Modern / tech | Space Grotesk | Inter | Creative, clean |
| Editorial / blog | Lora | Nunito | Sophisticated, warm |
| Creative agency | Bebas Neue | Open Sans | Bold, impactful |
| General business | Plus Jakarta Sans | Inter | Modern, approachable |
| Classic / legal | DM Serif Display | Inter | Authoritative, refined |

**Principle:** Variable fonts are mainstream in 2026 with universal browser support. Use them for responsive typography and animation (weight, width, slant transitions).

- Source: [Typewolf -- Best Google Fonts 2026](https://www.typewolf.com/google-fonts)
- Source: [The Brief AI -- Google Font Pairings](https://www.thebrief.ai/blog/google-font-pairings/)

### Core Web Vitals Checklist (2026)

| Metric | Target | Key Fix |
|---|---|---|
| LCP | < 2.5s | Preload hero image, use AVIF, inline critical CSS |
| CLS | < 0.1 | Set explicit width/height on images, use next/font |
| INP | < 200ms | Minimise client-side JS, use `startTransition`, debounce handlers |
| TTFB | < 200ms | Edge deployment, streaming SSR, efficient data fetching |

**March 2026 Google Core Update** reinforced CWV as a ranking filter. Poor scores can now prevent good content from ranking.

- Source: [ALM Corp -- Core Web Vitals 2026](https://almcorp.com/blog/core-web-vitals-2026-technical-seo-guide/)

---

## Part 3: Reference Sites (April 2026)

### Recently Awarded (Awwwards SOTD, April 2026)

| Date | Site | Category | Notable |
|---|---|---|---|
| Apr 15 | The Obsidian Assembly | -- | Latest SOTD |
| Apr 13 | Oryzo AI | AI/Tech | -- |
| Apr 12 | NaughtyDuk | -- | -- |
| Apr 11 | Odd Ritual | E-commerce / Golf | Instrument Serif font, 12-col grid with breakout, accordion animations, Shopify |
| Apr 10 | MERSI | Architecture | Fluid clamp() typography, orange accent (#FA5D29), card-based portfolio |
| Apr 9 | ICOMAT | -- | -- |
| Apr 7 | Maxima Therapy | Healthcare | Colourful illustrations, GSAP + React + Lottie, playful for serious topic |
| Apr 5 | Artem Shcherban | Portfolio | -- |
| Apr 4 | SOM | -- | -- |
| Apr 3 | Artefakt | Production / Agency | Numbered portfolio sections, WordPress, minimalist dark aesthetic |
| Apr 2 | Vast | -- | -- |
| Apr 1 | San Rita | -- | -- |

### Sites of the Month 2026

- **February 2026:** Shopify Renaissance Edition -- generative Renaissance-inspired paintings fused with modern eCommerce UI
- **January 2026:** Bruno Simon portfolio -- browser-based 3D environment where users drive a vehicle to explore content

### Key Awwwards Patterns in April 2026
- Serif fonts used prominently for headings (Instrument Serif, DM Serif Display)
- Fluid typography via `clamp()` on every text element
- 12-column CSS Grid with breakout regions for full-width moments
- GSAP still dominant for complex animations, but simpler sites going CSS-only
- Illustration-heavy designs for healthcare, wellness, and creative sectors
- Dark colour schemes with single bold accent colour

---

## Part 4: Quick Reference -- What Makes a Site Look "AI-Generated" in 2026

Avoid these tells:

1. **Centred three-card grid** with generic icons (lightbulb, handshake, chart)
2. **Blue-purple gradient** hero with stock photo of person on laptop
3. **"Welcome to [Company]"** or **"We help businesses grow"** as hero text
4. **Perfectly uniform spacing** everywhere -- no visual rhythm or hierarchy
5. **Default Tailwind colour palette** without customisation (indigo-600, gray-50)
6. **Identical border-radius** on every element (rounded-xl everywhere)
7. **No photography** -- only abstract geometric shapes or AI-generated people
8. **Testimonials in a slider** with obviously fake names and stock headshots
9. **Zero micro-interactions** -- completely static, no hover states beyond colour change
10. **Footer with every social media icon** even if the business isn't active on those platforms

Instead: real photos, custom colour palette, varied spacing rhythm, editorial typography, purposeful animation, and at least one element that makes someone say "I haven't seen that before."

---

*Research compiled 2026-04-15. Sources linked throughout.*
