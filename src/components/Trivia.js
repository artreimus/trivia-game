import React from "react";
import Choice from "./Choice";

export default function Trivia(props) {
  const choiceElements = props.trivia.choices.map((choice) => (
    <Choice
      choice={choice}
      isPlaying={props.isPlaying}
      selectChoice={() => props.selectChoice(choice.id)}
    />
  ));

  console.log(props.trivia.isCorrect);
  return (
    <div className="trivia">
      <h3 className="trivia__header">
        {decodeURIComponent(props.trivia.question)}
      </h3>
      <div className="trivia__choices">{choiceElements}</div>
      {!props.isPlaying && !props.trivia.isCorrect && (
        <h4 className="trivia__answer">
          Correct Answer: {decodeURIComponent(props.trivia.correctAnswer)}
        </h4>
      )}
      <hr className="trivia__divider" />
    </div>
  );
}
