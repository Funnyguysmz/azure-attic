import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';

export async function GET(context) {
  const posts = await getCollection('blog');
  return rss({
    title: 'Roxy.dev | Personal Digital Garden',
    description: 'A personal website, technical blog, and digital learning lab designed with geek aesthetics and inspired by a quiet traveler\'s path.',
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      // Compute link based on post id
      link: `/blog/${post.id}/`,
    })),
    customData: `<language>en-us</language>`,
  });
}
