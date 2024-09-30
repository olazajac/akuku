"use client"; // Mark this component as a client component

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchSinglePost } from "../../../lib/api";
import QuestionManager from "../../../components/QuestionManager";

// Define the structure of a post
type Post = {
  title: { rendered: string };
  acf: {
    test: Question[]; // Ensure Question type is defined
  };
};

// Ensure Question type is defined (can be imported if defined elsewhere)
type Question = {
  pytanie: string;
  odpowiedz: string;
};

const SinglePost: React.FC = () => {
  const { id } = useParams(); // Get post ID from dynamic route
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);

  useEffect(() => {
    const loadPost = async () => {
      try {
        // Ensure id is treated as a string
        const postId = Array.isArray(id) ? id[0] : id;
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
        questions={post.acf.test} // Pass the array of questions from the post
        setActiveQuestions={setActiveQuestions}
        activeQuestions={activeQuestions}
      />
    </div>
  );
};

export default SinglePost;
