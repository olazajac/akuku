"use client";

import { useState } from "react";

const CreateTestPage = () => {
  const [title, setTitle] = useState(""); // Title of the post
  const [fields, setFields] = useState<{ pytanie: string; odpowiedz: string }[]>([]); // Questions and answers
  const [bulkInput, setBulkInput] = useState(""); // For pasting questions and answers in bulk
  const [jezykPytania, setJezykPytania] = useState("polski"); // Language of the questions
  const [jezykOdpowiedzi, setJezykOdpowiedzi] = useState("polski"); // Language of the answers

  // Function to handle bulk input parsing
  const handleBulkInput = () => {
    const parsedFields = bulkInput
      .split("\n") // Split each line
      .map((line) => {
        // Split by tab if present; fallback to comma if no tabs found
        const [pytanie, odpowiedz] = line.includes("\t")
          ? line.split("\t")
          : line.split(","); // Fallback to comma
  
        return {
          pytanie: pytanie?.trim() || "",
          odpowiedz: odpowiedz?.trim() || "",
        };
      })
      .filter((field) => field.pytanie && field.odpowiedz); // Ensure both question and answer are present
  
    setFields(parsedFields); // Set parsed fields
    setBulkInput(""); // Clear the bulk input field
  };
  

  // Function to handle form submission and create a new post
  const handleSubmit = async () => {
    const postData = {
      title,
      content: "",
      status: "publish",
      type: "test",
      acf: {
        test: fields,
        "jezyk-pytanie": jezykPytania,
        "jezyk-odpowiedzi": jezykOdpowiedzi,
      },
    };

    try {
      const response = await fetch("https://akuku.club/wp-json/wp/v2/test", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Basic " + btoa("ola:F0JP 6SLF Dk6n JaMJ Jr3O v1lj"), // Replace with your credentials
        },
        body: JSON.stringify(postData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      console.log("Post created successfully:", result);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h1 className="text-3xl font-bold mb-6 text-center">Create a New Test</h1>

      {/* Input for Title */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">Title:</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Enter the test title"
        />
      </div>

      {/* Bulk Input for Questions and Answers */}
      <div className="mb-6">
        <label className="block text-gray-700 font-medium mb-2">
          Paste Questions and Answers:
        </label>
        <textarea
          value={bulkInput}
          onChange={(e) => setBulkInput(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
          placeholder="Paste questions and answers separated by a tab or comma (e.g., Question1\tAnswer1)"
          rows={6}
        />
        <button
          onClick={handleBulkInput}
          className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300"
        >
          Add Questions
        </button>
      </div>

      {/* Display parsed questions and answers */}
      <h2 className="text-xl font-semibold mb-4">Questions and Answers</h2>
      {fields.map((field, index) => (
        <div key={index} className="mb-2">
          <p>
            <strong>Q{index + 1}:</strong> {field.pytanie}
          </p>
          <p>
            <strong>A:</strong> {field.odpowiedz}
          </p>
        </div>
      ))}

      {/* Radio Buttons for Language Selection */}
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Language Settings</h2>

        {/* Language of Questions */}
        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">
            Language of Questions:
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="polski"
                checked={jezykPytania === "polski"}
                onChange={() => setJezykPytania("polski")}
                className="mr-2"
              />
              Polish
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="angielski"
                checked={jezykPytania === "angielski"}
                onChange={() => setJezykPytania("angielski")}
                className="mr-2"
              />
              English
            </label>
          </div>
        </div>

        {/* Language of Answers */}
        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Language of Answers:
          </label>
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="radio"
                value="polski"
                checked={jezykOdpowiedzi === "polski"}
                onChange={() => setJezykOdpowiedzi("polski")}
                className="mr-2"
              />
              Polish
            </label>
            <label className="flex items-center">
              <input
                type="radio"
                value="angielski"
                checked={jezykOdpowiedzi === "angielski"}
                onChange={() => setJezykOdpowiedzi("angielski")}
                className="mr-2"
              />
              English
            </label>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="text-center">
        <button
          onClick={handleSubmit}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition duration-300"
        >
          Submit Test
        </button>
      </div>
    </div>
  );
};

export default CreateTestPage;
