import React, { useEffect, useState } from "react";
import Button from "./Button";

type ScoreEntry = {
  date: string;
  time: string;
  score: string;
  test_id: string;
  mistakes: { pytanie: string; odpowiedz: string }[];
};

const ScoreTable: React.FC<{
  testId: string; // Current test ID
  onRedoMistakes: (mistakes: { pytanie: string; odpowiedz: string }[], mode: string) => void;
}> = ({ testId, onRedoMistakes }) => {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        const pageId = 24737; // ID of the scores page
        const response = await fetch(`https://akuku.club/wp-json/wp/v2/pages/${pageId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        const entries = data.acf?.single_entry || [];
        setScores(entries);
      } catch (error) {
        console.error("Error fetching scores:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchScores();
  }, []);

  const filteredScores = scores.filter((entry) => entry.test_id === testId).reverse();

  if (loading) {
    return <p>Loading scores...</p>;
  }

  if (filteredScores.length === 0) {
    return <p>No scores available for this test.</p>;
  }

  return (
    <div className="mt-8">
      
      <table className="table-auto border-collapse border border-gray-300 w-full">
        <thead>
          <tr>
            <th className="border border-gray-300 px-4 py-2">Date</th>
            <th className="border border-gray-300 px-4 py-2">Time</th>
            <th className="border border-gray-300 px-4 py-2">Score</th>
            <th className="border border-gray-300 px-4 py-2">Test ID</th>
            <th className="border border-gray-300 px-4 py-2">Redo</th>
          </tr>
        </thead>
        <tbody>
          {filteredScores.map((entry, index) => (
            <React.Fragment key={index}>
              <tr>
                <td className="border border-gray-300 px-4 py-2">{entry.date}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.time}</td>
                <td className="border border-gray-300 px-4 py-2">{entry.score}%</td>
                <td className="border border-gray-300 px-4 py-2">{entry.test_id}</td>
                <td className="border border-gray-300 px-4 py-2">


                <Button
        text="Test"
        backgroundColor="bg-gray-200 hover:bg-green-700 p-1 m-1"
        textColor="text-gray-800"
        onClick={() => onRedoMistakes(entry.mistakes, "test")}
      />


<Button
        text="Learn"
        backgroundColor="bg-gray-200 hover:bg-green-700 p-1 m-1"
        textColor="text-gray-800"
        onClick={() => onRedoMistakes(entry.mistakes, "learn")}
      />

                 
                </td>
              </tr>
              {/* Display mistakes as a sublist */}
              {entry.mistakes && entry.mistakes.length > 0 && (
                <tr>
                  <td colSpan={5} className="border border-gray-300 px-4 py-2">
                    <ul className="list-disc pl-5 list-none text-gray-500 text-xs">
                      {entry.mistakes.map((mistake, mistakeIndex) => (
                        <li key={mistakeIndex}>
                          {mistake.pytanie} -   
                          <strong> {mistake.odpowiedz}</strong> 
                        </li>
                      ))}
                    </ul>
                  </td>
                </tr>
              )}
            </React.Fragment>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ScoreTable;
