# Design Guidelines: AI Chatbot Platform SaaS Homepage

## Design Approach
**Reference-Based Approach**: Drawing inspiration from premium SaaS platforms like Linear, Stripe, and Vercel for modern, conversion-focused design with emphasis on clarity and visual polish.

## Core Design Principles
1. **Premium SaaS Aesthetic**: Clean, spacious, professional with subtle sophistication
2. **Conversion-Focused**: Clear hierarchy guiding users toward CTAs
3. **Trust-Building**: Visual elements that establish credibility and ease
4. **Scannable Content**: Easy-to-digest information architecture

## Typography System

**Font Stack**:
- Primary: Inter (Google Fonts) - for UI, body text, and buttons
- Accent: Cal Sans or similar modern display font for hero headline impact

**Hierarchy**:
- Hero Headline: text-5xl lg:text-7xl, font-bold, tracking-tight
- Section Headlines: text-3xl lg:text-4xl, font-bold
- Subheadings: text-xl lg:text-2xl, font-medium
- Feature Titles: text-lg font-semibold
- Body Text: text-base lg:text-lg, leading-relaxed
- Small Text/Badges: text-sm, font-medium

## Layout System

**Spacing Primitives**: Use Tailwind units of 4, 6, 8, 12, 16, 20, 24
- Section vertical spacing: py-20 lg:py-32
- Card padding: p-8 lg:p-10
- Element gaps: gap-6 to gap-12

**Container Strategy**:
- Max-width wrapper: max-w-7xl mx-auto px-6 lg:px-8
- Content max-width: max-w-4xl for text-heavy sections
- Full-bleed sections where appropriate (hero, testimonials background)

## Section-Specific Guidelines

### 1. Hero Section
**Layout**: Full viewport height section with centered content
**Images**: Large hero background - subtle gradient mesh or abstract AI-themed illustration (geometric neural network patterns, flowing data streams) as background treatment, semi-transparent overlay for text readability
**Structure**:
- Centered headline with gradient text effect (subtle blue-to-purple)
- Subtitle with max-w-2xl constraint
- Dual CTA buttons (horizontal flex on desktop, stacked on mobile)
- Trust badge below CTAs with checkmark icon
- Optional: Animated product screenshot/demo preview below fold

### 2. How It Works Section
**Layout**: 3-column grid (grid-cols-1 md:grid-cols-3) with gap-8
**Components**:
- Large circular icon containers (w-16 h-16) with gradient backgrounds
- Step numbers prominently displayed
- Connecting arrows between steps (hidden on mobile)
- Each step card with minimal border, subtle shadow on hover

### 3. Features Section
**Layout**: 2-column grid on tablet (md:grid-cols-2), 3-column on desktop (lg:grid-cols-3)
**Components**:
- Feature cards with icon, title, description
- Icons from Heroicons (outline style)
- Subtle card backgrounds with border
- Equal height cards using auto-fit grid

### 4. Why Choose Us Section
**Layout**: 4-column grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-4)
**Design**: Compact benefit cards, icon + short title + minimal description

### 5. Use Cases Section
**Layout**: 2x2 grid (md:grid-cols-2)
**Design**: Larger cards with industry-specific icons, use case title, and description. Consider light background differentiators per card.

### 6. Pricing Section
**Layout**: 3-column pricing table (responsive: stacked on mobile, horizontal on lg+)
**Components**:
- Featured "Pro" plan with elevated styling (border accent, subtle scale)
- Rounded-xl cards with pricing, feature lists, CTA buttons
- Checkmark icons for included features
- Visual hierarchy: plan name → price → features → CTA

### 7. Testimonials Section
**Layout**: 3-column grid (grid-cols-1 md:grid-cols-3) or horizontal scroll on mobile
**Components**: Quote cards with avatar placeholder, name, role, company, and testimonial text

### 8. Footer
**Layout**: Multi-column grid with branding on left, link columns in middle, social/legal on right
**Design**: Dark or light treatment with clear link organization

## Component Library

### Buttons
- Primary CTA: Solid background, rounded-lg, px-8 py-4, font-semibold, text-base
- Secondary CTA: Border style, transparent bg, same padding
- Buttons on hero image: backdrop-blur-sm with semi-transparent background

### Cards
- Border radius: rounded-xl or rounded-2xl
- Shadows: shadow-sm default, shadow-lg on hover
- Borders: Subtle border colors, 1px width
- Padding: p-8 for content cards

### Icons
- Library: Heroicons (outline for features, solid for accents)
- Size: w-6 h-6 for inline, w-12 h-12 for feature icons
- Container: Gradient backgrounds for icon containers in How It Works

### Gradients & Visual Effects
- Subtle background gradients: from-blue-50 to-purple-50 (light mode)
- Hero headline gradient text treatment
- Mesh gradient backgrounds where appropriate
- Soft shadows and glows for depth

## Images

**Hero Section**: Large background image - abstract AI/technology theme (neural networks, data flows, geometric patterns). Use semi-transparent gradient overlay (from-black/60 to-black/30) to ensure text readability.

**Feature/Use Case Illustrations**: Optional modern line illustrations or icons to supplement text content. Keep minimal and purposeful.

## Animations
**Use Sparingly**:
- Subtle fade-in on scroll for sections
- Gentle hover lift on cards (transform: translateY(-4px))
- CTA button subtle scale on hover
- No complex scroll-driven animations

## Responsive Behavior
- Mobile-first approach
- Stack multi-column layouts to single column on mobile
- Adjust typography scale (reduce by ~20% on mobile)
- Maintain comfortable tap targets (min 44px)
- Horizontal scrolling testimonials on mobile if needed

## Accessibility
- Maintain WCAG AA contrast ratios
- Clear focus states on interactive elements
- Semantic HTML structure
- Alt text for all images and icons