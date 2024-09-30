import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

type Post = {
  id: number;
  title: string;
  content: string;
};

const PostPage: React.FC = () => {
  const router = useRouter();
  const { id } = router.query;

  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async (postId: number) => {
      try {
        const fetchedPost = await fetchPostData(postId);
        setPost(fetchedPost);
      } catch (err) {
        setError("Error fetching the post");
      } finally {
        setLoading(false);
      }
    };

    if (id && typeof id === "string") {
      fetchData(Number(id));
    }
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>{post?.title}</h1>
      <p>{post?.content}</p>
    </div>
  );
};

export default PostPage;
