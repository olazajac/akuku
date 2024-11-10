"use client"; // Mark this component as a client component

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchSinglePost } from "../../../lib/api";
import QuestionManager from "../../../components/QuestionManager";

const SinglePost = () => {
  const { id } = useParams(); // Get post ID from dynamic route 
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeQuestions, setActiveQuestions] = useState<any[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(
    new Set()
  );

  useEffect(() => {
    const loadPost = async () => {
      try {
        // Ensure id is treated as a string
        const postId = Array.isArray(id) ? id[0] : id; // Take the first element if it's an array
        const fetchedPost = await fetchSinglePost(postId);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Failed to fetch post", error);
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  useEffect(() => {
    // Initialize active questions when post is loaded
    if (post && post.acf && post.acf.test) {
      const initialQuestions = post.acf.test
        .sort(() => 0.5 - Math.random()) // Shuffle questions
        .slice(0, 4); // Pick the first 4 random questions
      setActiveQuestions(initialQuestions);
    }
  }, [post]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{post.title.rendered}</h1>
      <p className="mb-4">{post.acf.test.length} Questions</p>

      <QuestionManager
  questions={post.acf.test}
  setActiveQuestions={setActiveQuestions}
  activeQuestions={activeQuestions}
  answeredQuestions={answeredQuestions}
  setAnsweredQuestions={setAnsweredQuestions}
/>

      {/* <ul className="mt-4">
        {post.acf.test.map((q, index) => (
          <li
            key={index}
            className={`p-2 ${
              answeredQuestions.has(q.pytanie) ? "bg-green-300" : "bg-white"
            }`}
          >
            {q.pytanie}
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default SinglePost;
