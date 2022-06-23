import React, { useState, useEffect } from "react";
import Homepage from "./components/Homepage";
import Trivia from "./components/Trivia";
import { nanoid } from "nanoid";
import { useWindowSize } from "./useWindowsize";
import Confetti from "react-confetti";

export default function App() {
  const [isPlaying, setIsPlaying] = useState(true);
  const [trivias, setTrivias] = useState([]);
  const [score, setScore] = useState(0);
  const [playCount, setPlayCount] = useState(0);
  const [triviaData, setTriviaData] = useState({});

  const { width, height } = useWindowSize();

  function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
  }

  function generateTrivias(data, index) {
    const allChoices = shuffle([
      data[index].correct_answer,
      ...data[index].incorrect_answers,
    ]);

    return {
      id: nanoid(),
      question: data[index].question,
      correctAnswer: data[index].correct_answer,
      choices: setChoices(allChoices),
      isCorrect: false,
    };
  }

  function setChoices(array) {
    const choicesArray = array.map((item) => {
      return { id: nanoid(), choice: item, isSelected: false, isCorrect: "" };
    });
    return choicesArray;
  }

  //Store data in Trivia Data to prepare data in advance (UX friendly)
  useEffect(() => {
    async function getQuestions() {
      const response = await fetch(
        "https://opentdb.com/api.php?amount=10&difficulty=easy&type=multiple&encode=url3986",
        { mode: "cors" }
      );
      const data = await response.json();
      const trivias = data.results;
      const newArray = [];
      for (let i = 0; i < 5; i++) {
        newArray.push(generateTrivias(trivias, i));
      }
      setTriviaData(newArray);
    }
    getQuestions();
  }, [trivias]);

  const triviaElements = trivias.map((trivia) => (
    <Trivia
      key={trivia.id}
      trivia={trivia}
      isPlaying={isPlaying}
      selectChoice={(id) => selectChoice(id)}
    />
  ));

  function selectChoice(id) {
    setTrivias((prevTrivia) => {
      //Loop over the prevTrivia array and return a new array that sets user choices
      return prevTrivia.map((trivia) => {
        //Check if the current trivia's choice is the one being selected
        let containsId = trivia.choices
          .map((choice) => {
            return choice.id === id ? true : false;
          })
          .includes(true);

        //Selects a choice, if user hasn't yet selected a choice
        const newArray = [];
        trivia.choices.forEach((choice) => {
          if (choice.id === id) {
            newArray.push({
              ...choice,
              isSelected: !choice.isSelected,
            });
          } else if (containsId) {
            newArray.push({ ...choice, isSelected: false });
          } else newArray.push(choice);
        });

        return {
          ...trivia,
          choices: newArray,
        };
      });
    });
  }

  function setIsCorrect() {
    setTrivias((prevTrivia) => {
      return prevTrivia.map((trivia) => {
        const newArray = [];
        let isCorrect = false;
        trivia.choices.forEach((choice) => {
          if (choice.isSelected) {
            if (choice.choice === trivia.correctAnswer) {
              newArray.push({
                ...choice,
                isCorrect: true,
              });
              isCorrect = true;
            } else {
              newArray.push({
                ...choice,
                isCorrect: false,
              });
            }
          } else newArray.push(choice);
        });

        return {
          ...trivia,
          isCorrect: isCorrect,
          choices: newArray,
        };
      });
    });
  }

  function calculateScore() {
    let scoreCounter = 0;
    trivias.forEach((trivia) => {
      trivia.choices.forEach((choice) => {
        if (choice.isSelected) {
          choice.choice === trivia.correctAnswer
            ? scoreCounter++
            : (scoreCounter += 0);
        }
      });
    });
    setScore(scoreCounter);
  }

  console.log(trivias);

  function startGame() {
    setPlayCount((prevPlayCount) => (prevPlayCount += 1));
    setTrivias(triviaData);
    setIsPlaying(true);
  }

  function endGame() {
    setIsPlaying(false);
    setIsCorrect();
    calculateScore();
  }

  return (
    <main className="main">
      {!isPlaying && score >= 3 && <Confetti width={width} height={height} />}
      {playCount === 0 ? (
        <Homepage startGame={startGame} />
      ) : (
        <div className="game__container">
          {triviaElements}
          {!isPlaying && (
            <div className="container">
              <h3 className="game__score">
                You scored {score} / {trivias.length} correct answer
                {score > 0 ? "s" : ""}
              </h3>
              <button
                type="button"
                className="button button__restart"
                onClick={startGame}
              >
                Play Again
              </button>
            </div>
          )}
          {isPlaying && (
            <button
              type="button"
              className="button button__submit"
              onClick={endGame}
            >
              Check Answers
            </button>
          )}
        </div>
      )}
    </main>
  );
}
