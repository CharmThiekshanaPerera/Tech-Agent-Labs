

# Mobile Hero Section and Social Media Improvements

## Overview
Fix three issues on the mobile home page: social media icons hidden behind a toggle, CTA buttons potentially clipped or hard to tap, and overall hero section visual polish for small screens.

## Changes

### 1. Social Media Widget -- Always Visible on Mobile
**File: `src/components/SocialMediaWidget.tsx`**

- Replace the current mobile floating button (hidden behind a toggle tap) with a **fixed horizontal bar** at the bottom of the screen showing all 5 social icons in a row.
- Each icon will have its brand background color always visible (not just on hover), making them eye-catching and immediately tappable.
- Remove the expand/collapse toggle logic for mobile -- icons are always shown.
- Desktop sidebar widget stays unchanged.
- Position the bar so it doesn't overlap with WhatsApp or ChatBot buttons (e.g., fixed bottom-0 with a slim bar spanning full width).

### 2. Hero Section -- Mobile-Optimized Layout
**File: `src/components/HeroSection.tsx`**

- Reduce the logo/mascot size further on very small screens (< 375px) to free up vertical space for buttons.
- Ensure the 3 CTA buttons stack vertically with full width on mobile so they are clearly visible and easy to tap.
- Add `w-full` to each button on small screens to make them span the container.
- Tighten vertical spacing (margins/paddings) on mobile so all content -- badge, title, subtitle, buttons, and trust indicators -- fits within the viewport without excessive scrolling.
- Make the hero section use `min-h-[100svh]` instead of `min-h-screen` for better mobile browser viewport handling (accounts for address bar).

### 3. Button Sizing for Mobile
**File: `src/components/ui/button.tsx`**

- No changes needed -- the existing `responsive` size variant already handles mobile vs desktop sizing. The fix is in how HeroSection applies widths.

### 4. WhatsApp and ChatBot Positioning Adjustment
**Files: `src/components/WhatsAppButton.tsx`, `src/components/ChatBot.tsx`**

- Adjust bottom positioning to account for the new fixed social media bar at the bottom (shift both up by the bar height, roughly `bottom-16` instead of current values).

---

## Technical Details

**SocialMediaWidget mobile rewrite:**
- Mobile section becomes a `fixed bottom-0 left-0 right-0` horizontal flex bar with `justify-around`.
- Each icon gets its brand `bgColor` applied directly (always visible, not just on hover).
- Bar has a `bg-background/90 backdrop-blur-sm border-t border-border/50` background.
- `useState` for `isExpanded` can be removed entirely since mobile icons are always shown.

**HeroSection CTA button wrapper:**
- Change from `flex flex-col sm:flex-row` to include `[&>*]:w-full sm:[&>*]:w-auto` so buttons take full width on mobile but auto-size on larger screens.

**Positioning chain (bottom of screen, mobile):**
- Social bar: `bottom-0` (full-width bar, ~48px tall)
- WhatsApp button: `bottom-16` (above social bar)
- ChatBot button: positioned at `bottom-16 right-4` (above social bar)

