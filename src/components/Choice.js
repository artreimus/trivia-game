import React from "react";

export default function Choice(props) {
  const stylesOne = {
    backgroundColor: props.choice.isSelected ? "#d6dbf5" : "",
    borderColor: props.choice.isSelected ? "transparent" : "#4d5b9e",
    opacity:
      props.choice.isCorrect !== true || props.choice.isCorrect !== false
        ? "1"
        : "0.1",
  };

  const stylesTwo = {
    backgroundColor: props.choice.isSelected
      ? props.choice.isCorrect
        ? "#94d7a2"
        : "#f8bcbc"
      : "",
    opacity: props.choice.isSelected ? "1" : "0.6",
    borderColor: props.choice.isSelected ? "transparent" : "#4d5b9e",
  };

  return (
    <div
      style={props.isPlaying ? stylesOne : stylesTwo}
      className="choice"
      onClick={props.isPlaying ? props.selectChoice : () => {}}
    >
      {decodeURIComponent(props.choice.choice)}
    </div>
  );
}
