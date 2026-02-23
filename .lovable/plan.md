

# Fix SEO Audit Issues

Based on the audit report, here are the issues to fix grouped by category:

## Issues Summary

**Performance Issues (Mobile: 44/100, Desktop: 66/100):**
1. Images not lazy loaded (BlogSection, TestimonialsSection, AgentDetailModal, Footer, Navbar, etc.)
2. Images missing explicit `width` and `height` attributes
3. Large image payloads (need format/size optimization hints)

**Accessibility Issues:**
4. "Buttons do not have an accessible name" - some buttons may lack aria-labels
5. "Links rely on color to be distinguishable" - links styled as `text-primary` without underline

**SEO Checklist:**
6. Lazy loading warning - most images across components lack `loading="lazy"`

**Page SEO Status:**
7. `/blog`, `/privacy-policy`, and `/nonexistent-page-404-test` pages show the same default title/description in the server-rendered HTML (this is a SPA limitation with client-side `<SEOHead>` - the edge function fetches the raw HTML before React hydrates)

---

## Changes

### 1. Add `loading="lazy"` to all below-the-fold images

**Files:** `BlogSection.tsx`, `TestimonialsSection.tsx`, `AgentDetailModal.tsx`, `Footer.tsx`, `ServicesSection.tsx` (agent images if any)

Add `loading="lazy"` attribute to all `<img>` tags that are below the fold. The hero logo should remain without lazy (it's LCP).

### 2. Add explicit `width` and `height` to images missing them

**Files:** `BlogSection.tsx`, `TestimonialsSection.tsx`, `BlogPostModal.tsx`, `Footer.tsx`, `Navbar.tsx`, `AdminSidebar.tsx`, `AgentDetailModal.tsx`

Add `width` and `height` attributes to prevent layout shifts (CLS).

### 3. Fix "Links rely on color to be distinguishable"

**Files:** `NewsletterSubscription.tsx`, `BlogPost.tsx`, `NotFound.tsx`, `CookieConsent.tsx`

Add `underline` or `underline-offset-4` to links that currently only use `text-primary` for differentiation, so they are distinguishable without relying solely on color.

### 4. Add unique SEO meta to the 404 page

**File:** `NotFound.tsx`

Add `<SEOHead>` with a proper title ("Page Not Found - Tech Agent Labs") and `noIndex={true}` so crawlers skip it.

### 5. Ensure all interactive buttons have accessible names

Review and add `aria-label` to any buttons that only contain icons without text content. The ChatBot suggested questions buttons have visible text so they're fine. Verify the close/minimize buttons in modals.

---

## Technical Details

### BlogSection.tsx (line ~138)
- Add `loading="lazy"` and `width={600} height={400}` to blog card images

### TestimonialsSection.tsx (line ~136)
- Add `loading="lazy"` and `width={56} height={56}` to avatar images

### Footer.tsx (line ~91)
- Add `loading="lazy"` and `width/height` to footer logo

### Navbar.tsx (line ~162)
- Logo is above the fold, keep `loading="eager"`, ensure `width/height` are set

### BlogPostModal.tsx (line ~94)
- Add `loading="lazy"` and `width={800} height={400}`

### AgentDetailModal.tsx (line ~72)
- Add `loading="lazy"` and `width/height`

### NotFound.tsx
- Import and add `<SEOHead>` with title "Page Not Found | Tech Agent Labs", noIndex true

### Links accessibility
- In `NewsletterSubscription.tsx`, `BlogPost.tsx`, and other files: change `text-primary hover:underline` to `text-primary underline underline-offset-4 hover:decoration-primary` so links are always visually distinguishable

