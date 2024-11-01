"use client";

import { useState } from "react";

const CreateTestPage = () => {
  const [title, setTitle] = useState(""); // Title of the post
  const [fields, setFields] = useState([{ pytanie: "", odpowiedz: "" }]); // ACF Repeater for questions and answers
  const [jezykPytania, setJezykPytania] = useState("polski"); // Language of the questions
  const [jezykOdpowiedzi, setJezykOdpowiedzi] = useState("polski"); // Language of the answers

  // Function to add a new question-answer pair
  const handleAddField = () => {
    setFields([...fields, { pytanie: "", odpowiedz: "" }]);
  };

  // Function to handle the input changes for each question-answer pair
  const handleFieldChange = (
    index: number,
    event: React.ChangeEvent<HTMLInputElement>,
    field: "pytanie" | "odpowiedz"
  ) => {
    const newFields = [...fields];
    newFields[index][field] = event.target.value;
    setFields(newFields);
  };

  // Function to remove a question-answer pair
  const handleRemoveField = (index: number) => {
    const newFields = fields.filter((_, i) => i !== index);
    setFields(newFields);
  };

  // Function to handle form submission and create a new post
  const handleSubmit = async () => {
    const postData = {
      title, // Title of the post
      content: "", // You can add additional content if needed
      status: "publish", // Publish status
      type: "test", // Custom post type 'test'
      acf: {
        test: fields, // ACF Repeater for questions and answers
        "jezyk-pytanie": jezykPytania, // Language of the questions
        "jezyk-odpowiedzi": jezykOdpowiedzi, // Language of the answers
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
      // Optionally reset form fields or redirect after successful submission
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

      {/* Repeater Fields for Questions and Answers */}
      <h2 className="text-xl font-semibold mb-4">Questions and Answerssssss</h2>
      {fields.map((field, index) => (
        <div key={index} className="mb-6 flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">
              Question {index + 1}:
            </label>
            <input
              type="text"
              value={field.pytanie}
              onChange={(e) => handleFieldChange(index, e, "pytanie")}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder={`Enter question ${index + 1}`}
            />
          </div>
          <div className="flex-1">
            <label className="block text-gray-700 font-medium mb-1">
              Answer {index + 1}:
            </label>
            <input
              type="text"
              value={field.odpowiedz}
              onChange={(e) => handleFieldChange(index, e, "odpowiedz")}
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
              placeholder={`Enter answer ${index + 1}`}
            />
          </div>
          <button
            onClick={() => handleRemoveField(index)}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
          >
            Remove
          </button>
        </div>
      ))}
      <button
        onClick={handleAddField}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition duration-300 mb-6"
      >
        Add More Questions
      </button>

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
