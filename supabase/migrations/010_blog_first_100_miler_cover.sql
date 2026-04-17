update blog_post_versions v
set cover_image_url = '/first-100-miler.avif'
from blog_posts p
where p.slug = 'first-100-miler-guide'
  and v.id = p.published_version_id;
