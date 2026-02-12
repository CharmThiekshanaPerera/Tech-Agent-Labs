

## Update Blog Automation Info Text

### What's Already Working
The existing edge functions (`share-blog-social` and `admin-generate-blog-now`) already send a complete webhook payload with all the fields you need: `title`, `excerpt`, `postUrl`, `imageUrl`, `twitterText`, `linkedinText`, and `facebookText`. No backend changes are required.

### What Needs to Change
One small UI update: the "How it works" info box on the Social Automation admin page lists the webhook fields but omits `imageUrl`. This should be added so admins know the field is available for mapping.

### Change Details

**File: `src/pages/admin/AdminSocialAutomation.tsx`**
- Update the info box text (around line 338-343) to include `imageUrl` in the listed webhook payload fields.

### Make.com / Buffer Configuration Reminder
After approving this plan, you should verify your Make.com scenario has:
- **Buffer Text field** mapped to `twitterText`
- **Buffer Photo field** mapped to `imageUrl` (this makes the image display as native media, not just a link)

No changes to cron, logging, notification logic, or edge functions are needed.
