"use client"; // Mark this component as a client component

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchSinglePost } from "../../../lib/api";
import QuestionManager from "../../../components/QuestionManager";

// Define types for the post and questions (you can adjust these according to your actual data structure)
interface Question {
  pytanie: string; // Adjust according to your question structure
  // Add any other properties of your question here
}

interface Post {
  title: { rendered: string };
  acf: {
    test: Question[]; // Array of questions
  };
}

const SinglePost: React.FC = () => {
  const { id } = useParams(); // Get post ID from dynamic route
  const [post, setPost] = useState<Post | null>(null); // Specify Post type or null
  const [loading, setLoading] = useState<boolean>(true);
  const [activeQuestions, setActiveQuestions] = useState<Question[]>([]);
  const [answeredQuestions, setAnsweredQuestions] = useState<Set<string>>(
    new Set()
  );
  const [error, setError] = useState<Error | null>(null); // State for error handling

  useEffect(() => {
    const loadPost = async () => {
      try {
        const fetchedPost = await fetchSinglePost(id);
        setPost(fetchedPost);
      } catch (error) {
        console.error("Failed to fetch post", error);
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error("An unknown error occurred."));
        }
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
  if (error) return <div>Error: {error.message}</div>; // Handle the error display
  if (!post) return <div>Post not found</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{post.title.rendered}</h1>
      <p className="mb-4">{post.acf.test.length} Questions</p>

      <QuestionManager
        questions={post.acf.test} // Pass the array of questions from the post
        setActiveQuestions={setActiveQuestions}
        activeQuestions={activeQuestions}
        answeredQuestions={answeredQuestions}
        setAnsweredQuestions={setAnsweredQuestions}
      />

      {/* Uncomment if needed to display answered questions */}
      {/* <ul className="mt-4">
        {post.acf.test.map((q, index) => (
          <li
            key={index}
            className={`p-2 ${answeredQuestions.has(q.pytanie) ? "bg-green-300" : "bg-white"}`}
          >
            {q.pytanie}
          </li>
        ))}
      </ul> */}
    </div>
  );
};

export default SinglePost;
