"use client"; // Client-side rendering for hooks

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { fetchPosts } from "../lib/api"; // Make sure the path and function name are correct
import '../styles/globals.css';
import Button from "@/components/Button";

const HomePage = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchPosts();
        setPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts", error);
        // Safely assign error to `setError` if it’s an `Error` type
        setError(error instanceof Error ? error : new Error("An unknown error occurred"));
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
    <div className=" container mx-auto p-4">
      <h1 className="text-4xl font-bold text-center mb-8">Test Posts</h1>
      <Button
        text="Make test"
        backgroundColor="max-w-full m-2 bg-green-500 hover:bg-green-700 w-48 py-8"
        textColor="text-white"
        link={`/create-test-bulk`}
        
      />
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

 
        
      
        {posts.map((post) => (
          <li
            key={post.id}
            className="border border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300"
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
