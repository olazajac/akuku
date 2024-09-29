// src/app/post/[id]/page.tsx
"use client"; // This ensures client-side rendering for hooks

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchSinglePost } from "../../../lib/api";

const SinglePost = () => {
  const { id } = useParams(); // Get post ID from dynamic route
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const fetchedPost = await fetchSinglePost(id);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Failed to fetch post", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (loading) return <div>Loading...</div>;

  if (!post) return <div>Post not found</div>;

  return (
    <div>
      <h1>{post.title.rendered}</h1>
      <p>{post.acf.test.length} Questions</p>
      <ul>
        {post.acf.test.map((q, index) => (
          <li key={index}>
            <strong>Question:</strong> {q.pytanie}
            <br />
            <strong>Answer:</strong> {q.odpowiedz}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SinglePost;
