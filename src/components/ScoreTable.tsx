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
    return  <div className="text-center w-full h-full justify-center align-center" > <p>Loading scores...</p> </div>;
  }

  if (filteredScores.length === 0) {
    return <p>No scores available for this test.</p>;
  }

  const tableStyles = "bg-gray-200 rounded-lg border border-white border-xl px-4 py-2 text-xs";
  

  return (
    <div className="mt-8 p-3">
      
      <table className="table-auto border-collapse border border-gray-100 rounded-md w-[500px] max-w-full m-auto text-gray-700 text-left ">
        <thead>
          <tr>
            <th className={tableStyles}>Date</th>
            <th className={tableStyles}>Time</th>
            <th className={tableStyles}>Score</th>
            {/* <th className="border border-gray-300 px-4 py-2">Test ID</th> */}
            <th className={tableStyles}>Mistakes</th>
          </tr>
        </thead>
        <tbody>
          {filteredScores.map((entry, index) => (
            <React.Fragment key={index}>
              <tr>
                <td className={tableStyles}>{entry.date}</td>
                <td className={tableStyles}>{entry.time}</td>
                <td className={tableStyles}>{entry.score}%</td>
                {/* <td className="border border-gray-300 px-4 py-2">{entry.test_id}</td> */}
                <td className={tableStyles}>
                

{entry.mistakes &&  <> <Button
                    text="Test"
                    backgroundColor="bg-gray-300 hover:bg-gray-700 py-2 px-4 m-1"
                    textColor="text-white"
                    onClick={() => onRedoMistakes(entry.mistakes, "test")} /><Button
                      text="Learn"
                      backgroundColor="bg-gray-300 hover:bg-gray-700 py-2 px-4 m-1"
                      textColor="text-white"
                      onClick={() => onRedoMistakes(entry.mistakes, "learn")} /> - {entry.mistakes?.length} </>  }
                

                 
                </td>
              </tr>
      
               {entry.mistakes && entry.mistakes.length > 0 && (
                <tr>
                  <td colSpan={5} className={tableStyles}>
                    <ul className="list-disc pl-5 list-none text-xs">
                      {entry.mistakes.map((mistake, mistakeIndex) => (
                        <li key={mistakeIndex}>
                          <strong> {mistake.odpowiedz} -   
                          </strong> {mistake.pytanie}
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
