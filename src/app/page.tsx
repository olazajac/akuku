"use client"; // Client-side rendering for hooks

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPosts } from "../lib/api"; // Make sure the path and function name are correct

const HomePage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const response = await fetch("https://akuku.club/wp-json/wp/v2/posts");
        const data = await response.json();
        setPosts(data); // Now using setPosts
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError(String(error));
        }
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, []);

  if (loading) return <div className="text-center text-lg">Loading...</div>;
  if (error)
    return <div className="text-center text-red-500">Failed to load posts</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Test Posts</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {posts.map((post) => (
          <li
            key={post.id}
            className="bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
          >
            <Link href={`/post/${post.id}`} className="block p-4">
              <h2 className="text-xl font-semibold text-blue-600 hover:underline">
                {post.title.rendered}
              </h2>
              <p className="text-gray-600">{post.acf.test.length} Questions</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default HomePage;
