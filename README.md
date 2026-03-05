# TrustFeed MVP

Mobile-first MVP for **TrustFeed**: a trust-based local business discovery experience for **roofing companies only**.

This concept is inspired by trust-directory patterns while remaining visually and legally distinct. It focuses on transparent trust signals, complaint handling, and quote workflows in a fast, swipe-friendly feed.

## Tech Stack

- Next.js (App Router)
- React
- TypeScript
- Tailwind CSS
- Local mock data only (no backend)

## Run Locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Production check:

```bash
npm run lint
npm run build
```

## MVP Features

- Mobile phone-sized centered app shell
- TikTok-style vertical Discover feed with snap scrolling
- Save / Hide actions on business cards
- Optional swipe actions: right to Save, left to Hide
- Full trust profile screen with segmented tabs:
  - Overview
  - Reviews
  - Complaints
  - Quote
  - About
- Quote request flow with local state submission
- Consumer Quotes screen with request statuses
- Saved screen with compare-and-act workflow
- Business dashboard showing:
  - Incoming quote leads
  - Open complaint issues
  - Recent reviews
  - Trust strength meter and profile improvement suggestions
- Subtle motion, toasts, and loading skeletons

## Data Structure Notes

All fictional data is in:

- `src/data/businesses.ts`

Primary entity:

- `RoofingBusiness` (`src/types/index.ts`)

Key fields include:

- `id`, `name`, `slug`, `logoInitials`
- `city`, `state`, `serviceArea`
- `trustGrade`, `accreditedStyleStatus`
- `yearsInBusiness`, `foundedYear`
- `verifiedLicense`, `insured`, `emergencyService`, `financingAvailable`
- `quoteSpeed`, `quoteTurnaround`, `responseTime`
- `reviewAverage`, `reviewCount`
- `complaintsClosed`, `complaintsOpen`, `complaintResolutionRate`
- `specialties`, `roofTypes`
- `summary`, `about`, `ownerStory`
- `badges`, `featuredTrustReason`, `quoteCTA`
- nested `reviews[]`, `complaints[]`, `gallery[]`

The dataset includes **24 distinct fictional roofing businesses** spanning premium, family-owned, storm-focused, commercial, bilingual, newer entrants, mixed-history legacy players, and fast-response high-volume profiles.

Quote state model:

- `QuoteRequest` in `src/types/index.ts`
- Seeded in `initialQuoteRequests` and updated locally in UI state

## Design Choices

- **Trust-forward hierarchy:** grade, verification status, complaint resolution, and credentials are surfaced before marketing copy.
- **Calm blue-forward visual language:** deep trust blues, white surfaces, restrained accents, and subtle shadows.
- **Mobile-first interaction:** vertical feed cards with large tap targets and sticky bottom navigation.
- **Transparency over hype:** complaints and response behavior are visible, not hidden.
- **Demo realism over backend complexity:** rich local data and complete user/business flows without auth or external services.

## Project Structure

- `src/app/` - App Router entrypoints and global styles
- `src/components/` - Reusable UI components and app container
- `src/data/` - Mock roofing businesses and initial quote requests
- `src/lib/` - Filtering and trust scoring utilities
- `src/types/` - Shared TypeScript domain models
- `src/styles/` - Theme tokens and shell/motion styles
