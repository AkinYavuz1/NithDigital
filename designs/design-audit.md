# Nith Digital -- Design Audit

*Conducted 15 April 2026 across 18 design files (akin-yavuz designs 1--15, joiner-client designs 1--3)*

---

## 1. Summary -- Biggest Patterns & Risks

- **Gold/amber accent is becoming a house colour, not a deliberate choice.** Some shade of gold (#C8963E, #C9A84C, #B8860B, #D4A73C, #D97706, #E8C872, #D4A03C) appears in 10 of 18 designs. It was appropriate for the joinery client ("Forge" theme), but it has leaked into most of the portfolio site designs too. Any client browsing our portfolio will see the same warmth everywhere.

- **DM Serif Display, Inter, DM Sans, and Space Grotesk are on heavy rotation.** These four fonts account for 70%+ of all heading/body slots. DM Serif Display appears in 4 designs, Inter in 5, DM Sans in 4, Space Grotesk in 3. We are reaching for the same shelf every time.

- **Every design with JS uses the same IntersectionObserver scroll-reveal pattern:** `.animate-on-scroll` class, `opacity: 0; transform: translateY(20-24px)`, observed with threshold 0.1, adds `.visible` class. 9 of 18 designs use this exact implementation. It is no longer a design decision -- it is muscle memory.

- **Section order is nearly identical across all portfolio designs:** Hero > (Ticker) > About > Skills > Experience > Projects > Testimonials > Contact/CTA. This is the order in 12 of 15 akin-yavuz designs. The joiner designs follow a similar pattern: Hero > How We Work > Services > Gallery > Testimonials > FAQ > Contact. We are not rethinking information architecture per project.

- **Dark backgrounds dominate.** 10 of 18 designs use dark/near-black backgrounds (#0A-#14 range). Light designs exist but are the minority. For a company criticising generic AI designs, defaulting to "dark = premium" is itself a cliche.

---

## 2. Colour Audit

### Background colours used

| Hex         | Description          | Designs using it                               | Dark/Light |
|-------------|---------------------|-------------------------------------------------|------------|
| #0E0E0E     | Near-black          | akin-7                                          | Dark       |
| #0C0C0C     | Near-black          | akin-5                                          | Dark       |
| #0A0F1E     | Navy-black          | akin-9                                          | Dark       |
| #111111     | Dark charcoal       | akin-15, joiner-1                               | Dark       |
| #141210     | Dark warm           | (akin-8 text, akin-14 surface)                  | Dark       |
| #F7F5F2     | Warm off-white      | akin-8                                          | Light      |
| #F8F6F3     | Warm cream          | akin-10                                         | Light      |
| #F5F7FA     | Cool grey           | akin-1                                          | Light      |
| #FAF8F6     | Warm linen          | akin-2                                          | Light      |
| #FAFAFA     | Clean white         | akin-3                                          | Light      |
| #F0EDE6     | Paper beige         | akin-4                                          | Light      |
| #F2EFE9     | Parchment           | akin-6                                          | Light      |
| #F4F5F7     | Cool light grey     | akin-12                                         | Light      |
| #FAFAF9     | Warm white          | akin-13                                         | Light      |
| #FFFFFF     | Pure white          | akin-11, akin-14                                | Light      |
| #FAF8F5     | Warm cream          | joiner-2                                        | Light      |
| #F5F3EF     | Warm stone          | joiner-3                                        | Light      |

**Split:** 5 dark, 13 light (when including all 18 designs). Correcting my summary: the dark designs are concentrated in the later akin-yavuz batch (7, 9, 15) and joiner-1, but overall light backgrounds are more common. The issue is that the dark designs are the ones most recently produced, suggesting a drift toward dark.

### Accent/primary colours used

| Colour family   | Hex values                                                       | Count | Designs                                    |
|-----------------|------------------------------------------------------------------|-------|--------------------------------------------|
| Gold/amber      | #C8963E, #C9A84C, #B8860B, #D4A73C, #D97706, #E8C872, #D4A03C, #C4773B | 10    | akin-4, 3, 6, 12, 13, 15, joiner-1, 2, 3   |
| Blue             | #1B3A6B, #3B82F6, #1D5FA8, #4A90D9, #3D8EF0, #2C5282, #4F46E5   | 7     | akin-1, 7, 8, 9, 10                         |
| Green            | #7EE8A2, #2D5A3D, #0D6B6E, #2C4A3E                              | 4     | akin-5, 6, 11, joiner-3                    |
| Red/burgundy     | #8B3A3A, #C0392B                                                 | 1     | akin-2                                      |
| Black            | #0D0D0D, #1A1A1A                                                 | 2     | akin-3, akin-14                             |

**Finding:** Gold/amber is far and away the most-used accent family. Blue is second. Red/burgundy was tried once (design 2) and never revisited. We have almost no experience with purple, orange, teal-blue, or any saturated accent that isn't warm.

### Recurring exact hex values

| Hex       | Appearances | Context                          |
|-----------|-------------|----------------------------------|
| #1A1A1A   | 11 designs  | Text colour or surface colour    |
| #C8963E   | 3 designs   | Gold accent (akin-13, joiner-1)  |
| #B8860B   | 3 designs   | Dark gold (akin-8, 12, joiner-2) |
| #111111   | 2 designs   | Background (akin-15, joiner-1)   |
| #E8E6E3   | 2 designs   | Light text on dark               |

---

## 3. Typography Audit

### Heading fonts

| Font                   | Appearances | Designs                                    |
|------------------------|-------------|--------------------------------------------|
| DM Serif Display       | 4           | akin-9, akin-15, joiner-1, (akin-9 secondary) |
| Space Grotesk          | 3           | akin-4, akin-11, joiner-3                   |
| Playfair Display       | 2           | akin-4, akin-10                             |
| Syne                   | 2           | akin-5, akin-12                             |
| Cormorant Garamond     | 2           | akin-14, joiner-2                           |
| Instrument Serif       | 1           | akin-7                                      |
| Cabinet Grotesk        | 1           | akin-8                                      |
| Unbounded              | 1           | akin-9                                      |
| Libre Baskerville      | 2           | akin-8 (secondary), akin-13                 |
| Manrope                | 1           | akin-2                                      |
| Outfit                 | 2           | akin-3, akin-15                             |
| Fraunces               | 1           | akin-6                                      |
| DM Sans (as heading)   | 1           | akin-1                                      |

### Body fonts

| Font                   | Appearances | Designs                                    |
|------------------------|-------------|--------------------------------------------|
| Inter                  | 5           | akin-1 (body), akin-7 (implicit), akin-10 (implied), joiner-1, akin-12 (implied) |
| DM Sans                | 4           | akin-1 (heading), akin-6, akin-14, joiner-2 |
| Instrument Sans        | 1           | akin-7                                      |
| IBM Plex Mono          | 1           | akin-5                                      |
| Lora                   | 1           | akin-2                                      |
| Merriweather           | 1           | akin-3                                      |
| Source Serif 4          | 2           | akin-11, joiner-3                           |
| Outfit                 | 1           | akin-15                                     |

### Heading/body pairings repeated

| Pairing                               | Count | Designs                   |
|----------------------------------------|-------|---------------------------|
| DM Serif Display + Inter               | 2     | joiner-1, (akin-9 partial)|
| Space Grotesk + Source Serif 4          | 2     | akin-11, joiner-3         |
| Cormorant Garamond + DM Sans           | 2     | akin-14, joiner-2         |
| Syne + DM Sans                         | 2     | akin-5 (partial), akin-12 |

**Finding:** We are repeating pairings across client projects. The Cormorant Garamond + DM Sans and DM Serif Display + Inter pairings were used for both the portfolio site AND the joinery client. This means different clients could end up with the same typographic voice. That is a serious differentiation problem.

### Monospace fonts

| Font            | Appearances | Designs          |
|-----------------|-------------|------------------|
| JetBrains Mono  | 1           | akin-13          |
| IBM Plex Mono   | 2           | akin-5, akin-14  |
| Fira Code       | 1           | akin-15          |

Only 4 of 18 designs include a monospace font. For a data/BI portfolio this is surprisingly low.

---

## 4. Layout Audit

### Hero patterns

| Hero type                              | Count | Designs                                           |
|----------------------------------------|-------|---------------------------------------------------|
| Full-height, name stacked large, stats bar at bottom | 5 | akin-7, 8, 9, 11, 15                          |
| Split layout (image left, content right or vice-versa) | 2 | akin-10, joiner-3                              |
| Grid with sidebar stats panel          | 2     | akin-8, akin-9                                    |
| Centred statement headline             | 4     | akin-1, 2, 3, 12                                  |
| Typography-led, no image               | 13    | Nearly all (only akin-10 has a hero image slot)    |
| Dark hero with large serif name        | 5     | akin-5, 7, 9, 15, joiner-1                        |

**Finding:** The dominant hero is a full-height block with a large name in display type, a short bio paragraph, 1-2 CTA buttons, and a stats strip at the bottom showing "10+ years", "50+ reports", etc. This is becoming the Nith Digital hero template.

### Section order (akin-yavuz portfolio designs)

| Design   | Section order                                                    |
|----------|------------------------------------------------------------------|
| akin-1   | Hero > Services > Experience > Skills > Testimonials > Contact   |
| akin-2   | Hero > About > Experience > Skills > Testimonials > Contact      |
| akin-3   | Hero > About > Experience > Skills > Projects > Contact          |
| akin-4   | Hero > About > Experience > Skills > Projects > Contact          |
| akin-5   | Hero > About > Experience > Skills > Projects > Contact          |
| akin-6   | Hero > About > Experience > Skills > Contact                     |
| akin-7   | Hero > Ticker > About > Skills > Experience > Projects > Contact |
| akin-8   | Hero > Ticker > Skills > Experience > Projects > Contact         |
| akin-9   | Hero > Ticker > Experience > Skills > Projects > Certs > Contact |
| akin-10  | Hero > About > Skills > Experience > Projects > Testimonials > Certs > Contact |
| akin-11  | Hero > About > Experience > Skills > Projects > Testimonials > Contact |
| akin-12  | Hero > About > Skills > Experience > Projects > Testimonials > Contact |
| akin-13  | Hero > About > Experience > Projects > Testimonials > Contact    |
| akin-14  | Hero > About > Skills > Career > Projects > Testimonials > Contact |
| akin-15  | Hero > About > Skills > Experience > Projects > Testimonials > Contact |

**Finding:** 13 of 15 designs start with Hero then About within the first 2 sections. The rest of the order is essentially a shuffle of {Skills, Experience, Projects} followed by Testimonials then Contact. There is no design that breaks this convention -- no design that, for example, leads with a project case study, or puts testimonials second, or uses a non-linear narrative.

### Section order (joiner-client designs)

| Design    | Section order                                                     |
|-----------|-------------------------------------------------------------------|
| joiner-1  | Hero > How We Work > Services > Gallery > Testimonials > FAQ > Contact |
| joiner-2  | Hero > Services > How We Work > Gallery > Testimonials > FAQ > About > Contact |
| joiner-3  | Hero > Services > How We Work > Gallery > About > Testimonials > FAQ > Contact |

These are more consistent with each other, which is expected (same brief), but the pattern matches the portfolio layout philosophy: linear top-to-bottom, same blocks, same order.

### Grid patterns

- **3-column grid for skills/tech tags:** Used in akin-7, 8, 10, 11, 12, 15 (6 designs)
- **2-column experience layout (company left, details right):** Used in akin-7, 8, 10, 13, 14 (5 designs)
- **Timeline with vertical line + dots for experience:** Used in akin-9, 11, 13, 15 (4 designs)
- **Card grid for projects (2 or 3 columns):** Used in akin-7, 8, 10, 11, 12, 13 (6 designs)

### Ticker/marquee strip

5 of 18 designs include a CSS-animated horizontal ticker showing tech skills. All use the same pattern: `animation: tick [20-25]s linear infinite`, `translateX(-50%)`, duplicate content for seamless loop.

### Stats bar in hero

11 of 15 akin-yavuz designs include stat counters (years of experience, reports built, hours saved, certifications). This nearly always appears as a 4-column grid. The numbers are almost always: **10+ years**, **50+ reports**, **40 hours saved**, **5 certifications**.

---

## 5. Interaction Audit

### Scroll reveal (IntersectionObserver)

| Pattern                                 | Files using it |
|-----------------------------------------|----------------|
| `.animate-on-scroll` + `opacity:0; translateY(20-24px)` + `.visible` | 9 of 18 |
| `threshold: 0.1` or `0.15`             | All 9 that use IO |
| `prefers-reduced-motion` check          | 8 of 9 (akin-7 does not) |

All 9 implementations are functionally identical. The CSS transition is always `0.6s ease-out`. The translateY value is always 20px or 24px. There is zero variation.

### Hover effects

| Hover pattern                            | Count |
|------------------------------------------|-------|
| Card lift: `translateY(-2px to -4px)` + increased `box-shadow` | 8 designs |
| Border-colour change on hover            | 6 designs |
| Background-colour swap on hover          | 5 designs |
| Scale on image hover: `scale(1.02-1.03)` | 4 designs |
| Underline expand (`width: 0` to `width: 100%`) | 3 designs |

**Finding:** Card-lift + shadow is the default hover state. We have not used any of: colour-shift, clip-path reveal, border-radius morph, text-weight animation, cursor-following effects, or magnetic buttons.

### Unique interactions (rare)

- **akin-15:** Diamond rotation on scroll, timeline dot glow -- genuinely different
- **akin-9:** Gradient background with grid-line overlay -- visual but not interactive
- **akin-14:** Horizontal rule width animation on scroll -- subtle but distinct
- **joiner-3:** Step circle fill on scroll (How We Work section) -- the only non-fade scroll interaction in the joiner designs

These are the exceptions. The remaining 14 designs rely on fade-up + card-lift exclusively.

### Pulsing "Available" dot

9 of 18 designs include a green pulsing dot in the navbar with text like "Available for work" or "Available now". The pulse animation is always a 2-2.5s ease-in-out infinite loop with either opacity change or box-shadow spread. This is becoming a signature -- which is fine for the portfolio site but should not carry over to client work. (It has not appeared in joiner designs, which is correct.)

---

## 6. Content Audit

### CTA wording

| CTA text                    | Count | Designs                                |
|-----------------------------|-------|----------------------------------------|
| "Get in Touch"              | 9     | akin-1, 2, 3, 4, 5, 6, 11, 12 (nav/buttons) |
| "Let's talk about your data"| 4     | akin-4, 7, 13, 15                      |
| "Let's talk."               | 1     | akin-14                                |
| "Let's work together"       | 1     | akin-12                                |
| "Get a Free Quote"          | 2     | joiner-1, 3                            |
| "Discuss your project"      | 3     | joiner-2                               |
| "Get a Quote"               | 1     | joiner-3                               |

**Finding:** "Get in Touch" is the default CTA in 9 of 15 portfolio designs. It is generic, passive, and doesn't tell the visitor what happens next. "Let's talk about your data" is better but is now also becoming formulaic.

### Section title patterns

Portfolio designs overwhelmingly use one of these patterns:
- **Noun only:** "About", "Skills", "Experience", "Projects", "Testimonials", "Contact"
- **"The full [noun]":** "The full stack" (appears in 3 designs)
- **"Where I've [verb]":** "Where I've worked" (appears in 3 designs)
- **"What [people/colleagues] say":** (appears in 3 designs)
- **Italic emphasis on the last word:** "Who I *am*", "Technical *expertise*", "Where I've *worked*" -- this pattern appears in akin-7, 8, 9 consistently

Joiner designs use:
- **"How We Work"** (all 3)
- **"What We Do"** / "Our Services" (all 3)
- **"Our Work"** (all 3)
- **"Common Questions"** (2 of 3)

### "How We Work" structure

All 3 joiner designs use a 4-step process:

| Design    | Steps                                           |
|-----------|--------------------------------------------------|
| joiner-1  | Discuss > Design > Build > Deliver               |
| joiner-2  | Talk it through > Plan and quote > Build and craft > Handover |
| joiner-3  | Discuss > Design > Build > Deliver               |

2 of 3 use the exact same 4 words. The third varies the wording but follows the same 4-step structure. This is already a rigid template.

---

## 7. Recommendations

### Stop defaulting to:

1. **Gold/amber accent.** Impose a rule: no gold/amber in the next 3 client projects. Force exploration of other warm tones (terracotta, wine, olive) or cool accents (slate blue, deep teal, muted violet). The joinery client earned gold because it matched the craft narrative. Other clients should not inherit it by default.

2. **DM Serif Display + Inter.** Ban this pairing for at least 2 projects. Try: Fraunces + Switzer, General Sans + Newsreader, Satoshi + Lora, Bricolage Grotesque + Source Serif Pro. The best design in the set (akin-7 with Instrument Serif + Instrument Sans) succeeded precisely because it used an unfamiliar pairing.

3. **The same scroll-reveal.** If every section fades up from 20px with 0.6s ease-out, the animation is invisible -- visitors won't notice it because every site does it. Alternatives: clip-path wipe, blur-to-sharp, stagger children instead of revealing the whole section, scroll-linked transforms (CSS `animation-timeline: scroll()`), or simply no animation at all (let the layout speak).

4. **"Get in Touch" as the CTA.** Replace with action-specific CTAs: "Book a 15-minute call", "See my availability", "Start a project brief", "Request a callback". For trade clients: "Get a same-day quote", "Send us your plans".

5. **The fixed section order.** Try at least one design that leads with a case study, or puts testimonials above the fold, or uses a non-linear layout (e.g., bento grid homepage, single long-scroll with no section breaks, or a sidebar-driven navigation).

### Vary in future designs:

6. **Background temperature.** We lean warm (#FAF8F5, #F7F5F2). Try a cool light background (#F0F4F8, #EEF2FF) or a coloured background (pale sage, dusty blue) for at least one design per batch.

7. **Hover interactions.** Move beyond card-lift. Try: outline stroke animation, text underline slide, background gradient shift, border-radius morph on hover, or cursor-aware tilt (Vanilla Tilt). Even just varying the translateY direction (slide left instead of up) would break the pattern.

8. **Stats presentation.** The 4-column stats bar is in nearly every design. Alternatives: inline stats within prose ("10 years and 50+ reports later..."), a single large number with context, or no stats at all -- let the work speak.

9. **Type scale.** Most designs use a 1.25 ratio (16/20/25/31/39/49). This is fine mathematically but means every design has the same proportional rhythm. Try a 1.333 (perfect fourth) or 1.5 (perfect fifth) scale occasionally, or use non-systematic sizing to create deliberate tension.

10. **Interaction variety per client.** Each client should get at least one interaction that no previous client has. The joiner designs' step-circle-fill was a good example. Future clients could get: parallax depth layers (if done subtly), scroll-snap sections, a before/after slider for portfolio work, or FLIP-animated page transitions.

### What we're doing well (keep):

- `prefers-reduced-motion` checks in almost all JS -- accessible by default
- Each design file is self-contained (single HTML, no external deps beyond Google Fonts) -- excellent for PDF/review workflows
- The joiner design research JSON correctly identified and avoided industry cliches (green palette, wood-grain backgrounds, trust badge strips)
- Typography scale is always systematically defined with CSS custom properties
- Responsive considerations are present in all recent designs
- The design-research.json "avoid" lists show genuine critical thinking about what not to do -- the problem is we need to apply the same scrutiny to our own emerging defaults

---

*This audit should be revisited after every 5 new client designs. Add new designs to the tracking tables above.*
