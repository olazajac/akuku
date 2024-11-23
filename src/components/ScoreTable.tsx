import React, { useEffect, useState } from "react";

type ScoreEntry = {
  date: string;
  time: string;
  score: string;
  test_id: string;
  mistakes: { pytanie: string; odpowiedz: string }[];
};

const ScoreTable: React.FC<{ onRedoMistakes: (mistakes: { pytanie: string; odpowiedz: string }[]) => void }> = ({
  onRedoMistakes,
}) => {
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

  if (loading) {
    return <p>Loading scores...</p>;
  }

  if (scores.length === 0) {
    return <p>No scores available.</p>;
  }

  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-4">Score Table</h3>
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
  {scores.map((entry, index) => (
    <React.Fragment key={index}>
      <tr>
        <td className="border border-gray-300 px-4 py-2">{entry.date}</td>
        <td className="border border-gray-300 px-4 py-2">{entry.time}</td>
        <td className="border border-gray-300 px-4 py-2">{entry.score}</td>
        <td className="border border-gray-300 px-4 py-2">{entry.test_id}</td>
        <td className="border border-gray-300 px-4 py-2">
          <button
            onClick={() => onRedoMistakes(entry.mistakes)}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Redo
          </button>
        </td>
      </tr>
      {/* Display mistakes as a sublist */}
      {entry.mistakes && entry.mistakes.length > 0 && (
        <tr>
          <td colSpan={5} className="border border-gray-300 px-4 py-2">
            <ul className="list-disc pl-5">
              {entry.mistakes.map((mistake, mistakeIndex) => (
                <li key={mistakeIndex}>
                  <strong>Question:</strong> {mistake.pytanie}, <strong>Answer:</strong> {mistake.odpowiedz}
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
