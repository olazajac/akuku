"use client"; // Mark this component as a client component

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchSinglePost } from "../../../lib/api";
import QuestionManager from "../../../components/QuestionManager";

// Define the base structure of a post
type Post = {
  title: { rendered: string };
  acf: {
    test: BaseQuestion[]; // Ensure BaseQuestion type is used here
  };
};

// Define the base structure of a question from the API
type BaseQuestion = {
  pytanie: string;
  odpowiedz: string;
};

// Extended Question type for the QuestionManager
type ExtendedQuestion = BaseQuestion & {
  guessed: number;
  errors: number;
  active: number;
  IsCurrent: number;
};

const SinglePost: React.FC = () => {
  const { id } = useParams(); // Get post ID from dynamic route
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeQuestions, setActiveQuestions] = useState<ExtendedQuestion[]>([]);

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
      // Add the missing properties to each question
      const initializedQuestions: ExtendedQuestion[] = post.acf.test.map((q) => ({
        ...q,
        guessed: 0, // Initialize as not guessed
        errors: 0, // Initialize as no errors
        active: 0, // Initialize as inactive
        IsCurrent: 0, // Initialize as not current
      }));

      const shuffledQuestions = initializedQuestions.sort(() => 0.5 - Math.random()).slice(0, 4);
      setActiveQuestions(shuffledQuestions);
    }
  }, [post]);

  if (loading) return <div>Loading...</div>;
  if (!post) return <div>Post not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{post.title.rendered}</h1>
      <p className="mb-4">{post.acf.test.length} Questions</p>

      <QuestionManager
        questions={activeQuestions} // Pass the initialized and extended array of questions
        setActiveQuestions={setActiveQuestions}
        activeQuestions={activeQuestions}
      />
    </div>
  );
};

export default SinglePost;