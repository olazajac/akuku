import React from "react";

interface ButtonProps {
  text: string; // Text displayed on the button
  backgroundColor?: string; // Custom background color
  textColor?: string; // Custom text color
  textSize?: string;
  onClick?: () => void; // Custom onClick handler
  link?: string; // Optional link for navigation
  className?: string; // Additional custom classes
}

const Button: React.FC<ButtonProps> = ({
  text,
  backgroundColor = "bg-blue-500", // Default background color
  textColor = "text-white", // Default text color
  textSize = "text-base",
  onClick,
  link,
  className = "",
}) => {
  const buttonClasses = ` text-center rounded-lg transition-all shadow-2xs  ${backgroundColor} ${textColor} ${textSize} hover:shadow-2xl  hover:-translate-y-px focus:outline-none focus:ring ${className}`;

  // If a link is provided, render a clickable anchor tag
  if (link) {
    return (
      <a
        href={link}
        className={`${buttonClasses} inline-block`}
        onClick={onClick}
        target="_blank"
        rel="noopener noreferrer"
      >
        {text}
      </a>
    );
  }

  // Default button
  return (
    <button className={buttonClasses} onClick={onClick}>
      {text}
    </button>
  );
};

export default Button;
