/**
 * Display limits for the Works section.
 * Replace these values with per-category admin settings from Supabase.
 */
export const VIDEO_CATEGORY_INITIAL_VISIBLE = 3;

/** Videos revealed each time "Load More" is clicked */
export const VIDEO_CATEGORY_LOAD_MORE_STEP = 3;

/** Max mock items per category — mirrors future admin cap per category */
export const VIDEO_CATEGORY_MOCK_COUNT = 6;

/** Stills shown in masonry — future: paginate or lazy-load from Supabase */
export const STILLS_MOCK_COUNT = 40;

/** First batch on the mobile stills grid (2×4), then Load more */
export const STILLS_MOBILE_INITIAL_VISIBLE = 8;

export const STILLS_MOBILE_LOAD_MORE_STEP = 8;
