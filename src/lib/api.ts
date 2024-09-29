// src/lib/api.ts

const WORDPRESS_URL = "https://akuku.club";

// Fetch all posts
export const fetchPosts = async () => {
  const response = await fetch(
    `${WORDPRESS_URL}/wp-json/wp/v2/test?_embed&acf_format=standard`
  );
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  const posts = await response.json();
  return posts;
};

// Fetch a single post by ID
export const fetchSinglePost = async (id: string) => {
  const response = await fetch(`${WORDPRESS_URL}/wp-json/wp/v2/test/${id}`);
  if (!response.ok) {
    throw new Error("Failed to fetch the post");
  }
  const post = await response.json();
  return post;
};
