-- Sync hero images for legacy AI blog posts with assets in /public (see blog-posts.ts).
update blog_post_versions v
set cover_image_url = '/cold.jpg'
from blog_posts p
where p.slug = 'winter-trail-running-guide'
  and v.id = p.published_version_id;

update blog_post_versions v
set cover_image_url = '/brain.avif'
from blog_posts p
where p.slug = 'ultrarunning-science-sleep-deprivation'
  and v.id = p.published_version_id;
