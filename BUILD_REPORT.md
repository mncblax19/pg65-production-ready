# PG-65 production-ready update report

## Project analysis
The public website frontend is a Vite + React 19 application using React Router and Redux Toolkit Query. Content is loaded from the API at `https://api.pg-65.com/api/`; blog posts, publications, videos, podcasts, footer text, social links, and image content are API-driven rather than Markdown files. Routing is client-side React Router in `src/App.jsx`. The admin dashboard is a Next.js 15 application. The backend is an Express + TypeScript API using MongoDB/Mongoose and includes Stripe support.

## What changed
- Added automatic year archive navigation for Blog using blog `uploadDate` values.
- Added automatic year archive navigation for Publications using `publicationDate` values.
- Added archive routes for `/blog/year/:year`, `/blogs/year/:year`, and `/publications/year/:year` while preserving existing `/blog`, `/blogs`, `/blog/:blogId`, and `/blogs/:blogId` behavior.
- Added accessible left-side year buttons on desktop and horizontal scrolling year buttons on mobile.
- Added friendly empty-state messages for years with no content.
- Kept Videos simple and did not add unnecessary folders/categories.
- Added reusable archive helpers that can be used for future Podcast year archives.
- Added `/support` and `/donate` frontend routes.
- Added Support navigation link and footer link.
- Added homepage Support PG-65 call-to-action section.
- Added Stripe Checkout donation backend endpoint with server-side amount validation.
- Added future subscriber/ad-free helpers and a centrally controlled `AdSlot` component.
- Removed external Google Font dependency from the dashboard layout so offline/locked-down builds are not blocked by Google font downloads.

## Files created
Frontend:
- `src/components/archive/YearArchiveNav.jsx`
- `src/components/ads/AdSlot.jsx`
- `src/config/monetization.js`
- `src/pages/Support/Support.jsx`
- `src/utils/archive.js`
- `src/utils/subscriber.js`
- `.env.example`
- `SUPPORT_AND_ARCHIVES.md`

Backend:
- `src/app/modules/donations/donations.controller.ts`
- `src/app/modules/donations/donations.routes.ts`
- `src/app/modules/donations/donations.service.ts`
- `src/app/modules/donations/donations.validation.ts`
- `.env.example`

## Files modified
Frontend:
- `src/App.jsx`
- `src/components/Header.jsx`
- `src/components/Footer.jsx`
- `src/pages/Blog/Blog.jsx`
- `src/pages/Publications/Publications.jsx`
- `src/pages/Home/Home.jsx`
- `src/pages/Blog/components/SpecificBlog.jsx`
- `src/pages/Live/SepcificLive.jsx`
- `eslint.config.js`

Backend:
- `src/app/routes/index.ts`
- `src/config/index.ts`

Dashboard:
- `src/app/layout.tsx`

## Environment variables
Frontend:
- `VITE_API_BASE_URL=https://api.pg-65.com/api`
- `VITE_ENABLE_ADS=false`

Backend:
- `STRIPE_SECRET_KEY=`
- `STRIPE_WEBHOOK_SECRET=`
- `SITE_URL=https://www.pg-65.com`
- plus the existing database, JWT, email, storage, and upload variables listed in backend `.env.example`.

## How to run locally
Frontend:
```bash
cd ihamrick_frontend
npm install
npm run dev
npm run build
```

Backend:
```bash
cd iHamrick_backend
npm install
npm run build
npm start
```

Dashboard:
```bash
cd ihamrick_dashboard
npm install
npm run dev
npm run build
```

## How to test
Automated checks completed:
- Frontend `npm run build`: passed.
- Frontend `npm run lint`: completed with warnings only and 0 errors.
- Backend `npm run build`: passed.
- Dashboard compile started successfully after removing external Google Fonts, but full static generation did not finish in this sandbox before timeout.

Manual test checklist:
1. Open `/blog` and verify year buttons appear on the left on desktop.
2. Open `/blog/year/2026` and verify only 2026 posts appear.
3. Open `/blogs` and `/blogs/year/2026` to confirm old plural route support.
4. Open `/publications` and verify year buttons appear on the left on desktop.
5. Open `/publications/year/2026` and verify only 2026 publications appear.
6. Resize to mobile and confirm year buttons become a horizontal scroll row.
7. Open `/videos` and verify no extra folder/category clutter was added.
8. Open `/support` and `/donate`.
9. Configure backend `STRIPE_SECRET_KEY` and `SITE_URL`, then test donation checkout using Stripe test mode.
10. Confirm ads are hidden while `VITE_ENABLE_ADS=false`.

## How to update blog years later
Blog years are automatic. Add or edit each blog post's `uploadDate` in the backend/dashboard and the frontend will generate the year button from that date.

## How to update publication years later
Publication years are automatic. Add or edit each publication's `publicationDate` in the backend/dashboard and the frontend will generate the year button from that date.

## Video section notes
Videos were intentionally kept simple because the owner said there are only about 19 videos. No new video folder system was added.

## Future podcast roadmap
When weekly podcasts expand, reuse `src/utils/archive.js` and `src/components/archive/YearArchiveNav.jsx` inside `src/pages/Podcasts/Podcasts.jsx`. Use podcast `date` values exactly like Blog and Publications.

## How to manage support, donations, and subscriptions
Donations currently use secure Stripe Checkout through the backend route `/api/donations/create-checkout-session`. The frontend never stores card data and the backend validates the amount. Future subscriptions should add authenticated users and set a subscriber flag that works with `isSubscriber(user)` and `shouldShowAds(user)`.

## Deployment notes
- Deploy backend changes before enabling real donation buttons.
- Add `STRIPE_SECRET_KEY` and `SITE_URL` to backend production environment.
- Add `VITE_API_BASE_URL` to frontend production environment if it differs from `https://api.pg-65.com/api`.
- Keep `VITE_ENABLE_ADS=false` until advertisers are approved.

## Important warnings
- Donations will not complete until `STRIPE_SECRET_KEY` is configured in the backend hosting environment.
- Do not put Stripe secret keys in the frontend.
- If blog or publication dates are missing or invalid, those items cannot be assigned to a year archive.
- If your host does not support client-side routing fallback, direct URLs like `/blog/year/2026` need a rewrite to `index.html`.
