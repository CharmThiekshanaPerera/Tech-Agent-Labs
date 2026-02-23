

# Combined Mobile + Desktop SEO Audit Report

## Problem
The current "Download Report" only includes results from the last audit run (either mobile or desktop). You want a single downloadable report that contains results from both strategies, plus the SEO Checklist and Page SEO Status.

## Solution
Update the `SEOAuditRunner` component to store results for both mobile and desktop strategies separately, and generate a combined report when downloading.

## Changes

### 1. Update `SEOAuditRunner.tsx` state management
- Change from storing a single `result` to storing two results: `mobileResult` and `desktopResult`
- When an audit completes, save it to the appropriate slot based on strategy
- Display whichever result matches the currently selected strategy tab
- Show indicators for which strategies have been run (e.g., green dot next to "Mobile" / "Desktop" buttons)

### 2. Add "Run Both" button
- Add a new button option: "Run Both" that sequentially runs mobile then desktop audits
- Shows a combined progress indicator ("Running mobile... 1/2", "Running desktop... 2/2")

### 3. Update the Download Report function
- If both mobile and desktop results exist, include both in a single report file
- Report structure:
  - Header (URL, date)
  - Mobile Results section (category scores + opportunities)
  - Desktop Results section (category scores + opportunities)
  - SEO Checklist Results (from props)
  - Page SEO Status (from props)
- If only one strategy has been run, include just that one with a note

### 4. UI indicators
- Show small badges on Mobile/Desktop buttons indicating if results are cached (e.g., a checkmark or timestamp)
- The Download Report button label updates to reflect what's included ("Download Full Report" when both are available vs "Download Report (Mobile only)")

## Technical Details

**File: `src/components/admin/SEOAuditRunner.tsx`**

State changes:
```
// Before
const [result, setResult] = useState<AuditResult | null>(null);

// After  
const [mobileResult, setMobileResult] = useState<AuditResult | null>(null);
const [desktopResult, setDesktopResult] = useState<AuditResult | null>(null);
const [runningBoth, setRunningBoth] = useState(false);
```

The `runAudit` function saves to the correct state slot based on strategy. A new `runBothAudits` function runs mobile first, then desktop sequentially.

The `downloadReport` function iterates over both results (if available), writing separate sections for each strategy into the same text file.

The displayed result is derived from whichever strategy tab is currently selected: `const displayResult = strategy === "mobile" ? mobileResult : desktopResult`.

No changes needed to `AdminSEO.tsx` or the edge functions.
