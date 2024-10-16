import React from "react";

interface IntroCardProps {
  mode: string;
  setMode: (mode: string) => void;
  status: string;
  setStatus: (status: string) => void;
}

const IntroCard: React.FC<IntroCardProps> = ({
  setMode,
  setStatus,
  mode,
  status,
}) => {
  return (
    <div className="mb-4 p-4 border rounded-md shadow-md bg-green-100">
      <button
        onClick={() => {
          setStatus("active");
          setMode("test");
          console.log(mode);
        }}
      >
        {" "}
        Test
      </button>
      <button
        onClick={() => {
          setStatus("active");
          setMode("learn");
          console.log(mode);
        }}
      >
        {" "}
        Learn
      </button>
    </div>
  );
};

export default IntroCard;
