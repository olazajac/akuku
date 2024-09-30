"use client"; // Ensure this is a Client Component

import React from "react";
import { useRouter } from "next/router";

// Define the type for the post data
type PostType = {
  id: number;
  title: string;
  content: string;
};

// Simulated function to fetch post data
const fetchPostData = async (id: number): Promise<PostType> => {
  return {
    id,
    title: `Post ${id}`,
    content: `This is the content of post ${id}.`,
  };
};

const PostPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  // Ensure id is a number before fetching post data
  if (!id || typeof id !== "string") {
    return <div>Invalid post ID</div>;
  }

  const [post, setPost] = React.useState<PostType | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const loadPost = async () => {
      try {
        const postData = await fetchPostData(Number(id));
        setPost(postData);
      } catch {
        setError("Failed to load post");
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>{post?.title}</h1>
      <p>{post?.content}</p>
    </div>
  );
};

export default PostPage;
