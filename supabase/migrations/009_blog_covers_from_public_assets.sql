-- Blog hero images served from /public (see src/lib/content/blog-posts.ts).
-- first-100-miler-guide keeps legacy /images/blog/100-miler.jpg (no matching asset in public).

update blog_post_versions v
set cover_image_url = m.url
from blog_posts p
join (
  values
    ('how-hard-is-a-50k', '/how_hard.avif'),
    ('choosing-first-ultra', '/choose.avif'),
    ('first-50k-training-guide', '/No-BS.avif'),
    ('strength-training-ultra-runners', '/strength_training.avif'),
    ('what-to-wear-first-ultra', '/wear.jpg'),
    ('hoka-speedgoat-6-review', '/shoe.avif'),
    ('best-running-vests-2025', '/vest.jpg'),
    ('trail-shoe-rotation', '/shoe.avif'),
    ('ultra-nutrition-beginners', '/nutrition.jpg'),
    ('electrolyte-guide-ultra-runners', '/electrolytes.avif'),
    ('real-food-ultra-marathon', '/eating.avif'),
    ('race-day-checklist', '/checklist.jpg'),
    ('summer-ultra-survival-guide', '/heat.avif'),
    ('winter-trail-running-guide', '/cold.jpg'),
    ('western-states-course-guide', '/western_states.avif'),
    ('ultrarunning-science-sleep-deprivation', '/brain.avif'),
    ('beginner-mistakes-ultra-marathon', '/mistakes.jpg')
) as m(slug, url) on m.slug = p.slug
where v.id = p.published_version_id;
