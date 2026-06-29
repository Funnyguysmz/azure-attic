---
title: "Building with Astro and Tailwind CSS v4"
description: "A deep dive into how I configured the Roxy-inspired color scheme and modern web integrations on this static site."
pubDate: 2026-06-28
tags: ["tech", "astro", "tailwind"]
featured: false
lang: en
---

# Astro and Tailwind v4 Setup

In this post, I will walk you through the technical foundation of this digital garden. 

## The Stack

This site is powered by **Astro** for Static Site Generation (SSG) and **Tailwind CSS v4** for styling. 

### Why Tailwind CSS v4?

Tailwind v4 introduces a new engine that is incredibly fast and configures theme variables directly in the CSS file (`global.css`) instead of relying on a Javascript config file.

Here is a snippet of my `global.css` theme configuration:

```css
@theme {
  --color-bg-main: var(--bg-main);
  --color-bg-surface: var(--bg-surface);
  --color-primary: var(--color-primary);
  --color-secondary: var(--color-secondary);
  --color-accent: var(--color-accent);
}
```

## Roxy-inspired Color System

The colors are mapped to CSS variables under `:root` (for Dark Mode) and `:root.light` (for Light Mode) to reflect a calm, ice-blue aesthetic.

1.  **Star Sky Blue** (`#0b0f17`): The base background of our night sky.
2.  **Cornflower Blue** (`#5b83c2`): Main headings and branding color.
3.  **Spell Glow** (`#38bdf8`): Glow effects and links.

Stay tuned as we continue building out the timeline and the gallery!
