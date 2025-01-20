"use client"; // Mark this component as a client component

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { fetchSinglePost } from "../../../lib/api";
import QuestionManager from "../../../components/QuestionManager";

const SinglePost = () => {
  const { id } = useParams(); // Get post ID from dynamic route 
  const [post, setPost] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [testId, setTestId] = useState<number>(0)

  useEffect(() => {
    const loadPost = async () => {
      try {
        // Ensure id is treated as a string
        const postId = Array.isArray(id) ? id[0] : id; // Take the first element if it's an array
        const fetchedPost = await fetchSinglePost(postId);
        setTestId(Number(postId))
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
    <div className=" flex flex-col flex-grow align-center">
      {/* <h1 className="text-2xl font-bold">{post.title.rendered}</h1>
      <p className="mb-4">{post.acf.test.length} Questions</p> */}

      <QuestionManager
  questions={post.acf.test}
  testName={post.title.rendered}
 
  testId={testId}

/>

  
    </div>
  );
};

export default SinglePost;
