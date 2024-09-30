"use client"; // Client-side rendering for hooks

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPosts } from "../lib/api"; // Make sure the path and function name are correct

// Define interfaces for Post and ACF
interface ACF {
  test: any[]; // Define this based on the structure of your ACF data
}

interface Post {
  id: number;
  title: { rendered: string };
  acf: ACF; // Add other fields as necessary
}

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]); // Specify Post type
  const [loading, setLoading] = useState<boolean>(true); // Specify boolean type for loading
  const [error, setError] = useState<Error | null>(null); // Specify error type

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts", error);
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error("An unknown error occurred."));
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
