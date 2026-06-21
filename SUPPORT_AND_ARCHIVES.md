# PG-65 archive and monetization notes

## Blog year archives
Blog years are generated automatically from each blog item's `uploadDate`. Routes supported:
- `/blog`
- `/blogs`
- `/blog/year/YYYY`
- `/blogs/year/YYYY`

## Publication year archives
Publication years are generated automatically from each publication item's `publicationDate`. Routes supported:
- `/publications`
- `/publications/year/YYYY`

## Videos
Videos were intentionally kept simple. No extra folder/category system was added.

## Podcasts
Podcast year archive support can use the same `src/utils/archive.js` and `src/components/archive/YearArchiveNav.jsx` helpers later. This was not overbuilt into folders because the owner requested a simple structure.

## Donations
The `/support` and `/donate` routes are active. Donation buttons call the backend endpoint `/api/donations/create-checkout-session`, which creates a secure Stripe Checkout session. The backend must have `STRIPE_SECRET_KEY` and `SITE_URL` configured before real donations can be accepted.

## Future ad-free supporters
`src/utils/subscriber.js` contains:
- `isSubscriber(user)`
- `shouldShowAds(user, adsEnabled)`

`src/components/ads/AdSlot.jsx` is centrally controlled by `VITE_ENABLE_ADS` and hides ads for subscribers.
