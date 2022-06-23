import React from "react";

export default function Homepage(props) {
  return (
    <div className="homepage">
      <h1 className="homepage__title">Quizwiz</h1>
      <p className="homepage__text">
        Play a fun game Quizwiz and learn something new!
      </p>
      <button
        type="button"
        className="button homepage__button"
        onClick={props.startGame}
      >
        Start Quiz
      </button>
    </div>
  );
}
