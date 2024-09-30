"use client"; // This line marks the file as a Client Component

import React, { useEffect, useState } from "react";

// Define the type of the data you expect
type DataType = {
  id: number;
  title: string;
  content: string;
};

// Simulated function to fetch data (replace this with actual fetch call)
const fetchData = async (): Promise<DataType[]> => {
  // Replace this mock data with a real API call if necessary
  return [
    { id: 1, title: "First Post", content: "This is the first post." },
    { id: 2, title: "Second Post", content: "This is the second post." },
  ];
};

const Page: React.FC = () => {
  const [data, setData] = useState<DataType[]>([]); // Specify type of data
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch the data when the component mounts
  useEffect(() => {
    const loadData = async () => {
      try {
        const fetchedData = await fetchData();
        setData(fetchedData);
      } catch (err) {
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h1>Posts</h1>
      <ul>
        {data.map((item) => (
          <li key={item.id}>
            <h2>{item.title}</h2>
            <p>{item.content}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Page;
