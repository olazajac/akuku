import React from "react";

interface SettingsProps {
  isRepeatChecked: boolean;
  setIsRepeatChecked: (checked: boolean) => void;
  random: boolean;
  setRandom: (checked: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({
  isRepeatChecked,
  setIsRepeatChecked,
  random,
  setRandom,
}) => {
  const handleToggle = () => {
    setIsRepeatChecked(!isRepeatChecked); // Toggle the state
  };

  const handleToggleRandom = () => {
    setRandom(!random); // Toggle the state
  };

  return (
    <div className="flex items-center m-auto mt-4">
      <label className="mr-2">Don't Repeat Errors</label>
      <input
        type="checkbox"
        checked={isRepeatChecked}
        onChange={handleToggle}
        className="toggle-checkbox"
      />

<label className="mr-2">Random 20</label>
      <input
        type="checkbox"
        checked={random}
        onChange={handleToggleRandom}
        className="toggle-checkbox"
      />
    </div>
  );
};

export default Settings;
