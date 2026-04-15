-- Add 'publishing' as an allowed status to prevent duplicate Facebook/Instagram posts.
--
-- Context: the publish cron (cron/publish-social) and the weekly facebook-post cron
-- both SELECT scheduled posts, call the Graph API, then UPDATE to 'published'.
-- If two invocations overlap, both publish the same row — we saw this happen on
-- the Nith Digital page where the Sanquhar Directory post showed up twice.
-- The code now atomically claims a row by flipping status to 'publishing' before
-- hitting the Graph API; this migration allows that status value.

alter table social_posts
  drop constraint if exists social_posts_status_check;

alter table social_posts
  add constraint social_posts_status_check
  check (status in ('scheduled', 'publishing', 'published', 'failed'));

alter table facebook_posts
  drop constraint if exists facebook_posts_status_check;

alter table facebook_posts
  add constraint facebook_posts_status_check
  check (status in ('scheduled', 'publishing', 'published', 'failed', 'skipped'));
