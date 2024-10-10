import React from "react";

interface SettingsProps {
  isRepeatChecked: boolean;
  setIsRepeatChecked: (checked: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({
  isRepeatChecked,
  setIsRepeatChecked,
}) => {
  const handleToggle = () => {
    setIsRepeatChecked(!isRepeatChecked); // Toggle the state
  };

  return (
    <div className="flex items-center mt-4">
      <label className="mr-2">Repeat Errors</label>
      <input
        type="checkbox"
        checked={isRepeatChecked}
        onChange={handleToggle}
        className="toggle-checkbox"
      />
    </div>
  );
};

export default Settings;
