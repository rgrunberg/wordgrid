import React, { useState, useEffect } from "react";
import classNames from "classnames";
import "./App.css";

const GAME_TIME = 180;

const DICE = [
  "AAEEGN",
  "ELRTTY",
  "AOOTTW",
  "ABBJOO",
  "EHRTVW",
  "CIMOTU",
  "DISTTY",
  "EIOSST",
  "DELRVY",
  "ACHOPS",
  "HIMNQU",
  "EEINSU",
  "EEGHNW",
  "AFFKPS",
  "HLNNRZ",
  "DEILRX",
];

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

const randomLetter = (dieLetters) => {
  const i = Math.floor(Math.random() * dieLetters.length);
  return dieLetters.split("")[i];
};

const getLetters = (gridSize) => {
  const shuffledDice = [...DICE];

  const letters = [];
  for (let i = 0; i < gridSize; i++) {
    const row = [];
    for (let j = 0; j < gridSize; j++) {
      row.push(randomLetter(shuffledDice.pop()));
    }
    letters.push(row);
  }
  return letters;
};

const LetterSquare = ({ letter }) => {
  return (
    <div className="letter-square">
      <a>{letter}</a>
    </div>
  );
};

const LetterRow = ({ letters, visible }) => {
  return (
    <div className="letter-row">
      {letters.map((letter, i) => (
        <LetterSquare key={i} letter={visible ? letter : "?"} />
      ))}
    </div>
  );
};

const LetterGrid = ({ letters, visible }) => {
  return (
    <div className="letter-grid-container">
      {letters.map((row, i) => (
        <LetterRow key={i} letters={row} visible={visible} />
      ))}
    </div>
  );
};

const Countdown = ({ time }) => {
  const minutes = Math.floor(time / 60);
  const seconds = time - minutes * 60;
  return (
    <div className="timer-countdown">
      {minutes}:{seconds.toString().padStart(2, "0")}
    </div>
  );
};

const GameButton = ({ label, onClick, extraClass }) => {
  return (
    <div className={"button" + " " + extraClass} onClick={onClick}>
      {label}
    </div>
  );
};

const Timer = ({ time, timerDone, active, resetTimer, toggleStart }) => {
  return (
    <div
      className={classNames({
        "timer-container": true,
        "timer-done": timerDone,
      })}
    >
      <div className="timer-description">time remaining</div>
      <Countdown time={time} />

      {timerDone ? (
        <GameButton
          extraClass="full-width"
          label="reset timer"
          onClick={resetTimer}
        />
      ) : (
        <div className="timer-button-row">
          <GameButton
            label={active ? "pause" : "start"}
            onClick={toggleStart}
          />
          <GameButton label="reset" onClick={resetTimer} />
        </div>
      )}
    </div>
  );
};

const SizeSelector = ({ size, setSize }) => {
  const sizeList = ["auto", "small", "medium", "large"];
  return (
    <div className="size-selector">
      {sizeList.map((i) => {
        return (
          <SettingOption
            key={i}
            label={i}
            active={size === i}
            handleClick={() => {
              setSize(i);
            }}
          />
        );
      })}
    </div>
  );
};

const SettingOption = ({ label, active, handleClick }) => {
  return (
    <div
      className={classNames({
        "setting-option": true,
        "setting-option--active": active,
      })}
      onClick={handleClick}
    >
      {label}
    </div>
  );
};

const ColorSelector = ({ color, setColor }) => {
  const colorList = ["dark", "light"];
  return (
    <div className="color-selector">
      {colorList.map((i) => {
        return (
          <SettingOption
            key={i}
            label={i}
            active={color === i}
            handleClick={() => {
              setColor(i);
            }}
          />
        );
      })}
    </div>
  );
};

const GameControls = (props) => {
  return (
    <div className="game-controls">
      <Timer {...props} />
      <div className="hint-text">
        {!props.lettersVisible && "letters will reveal on start"}
      </div>
      <GameButton
        label="new game"
        extraClass="full-width"
        onClick={() => {
          props.startNewGame();
        }}
      />
    </div>
  );
};

const DoneModal = ({ setShowDoneModal }) => {
  const [text, setText] = useState("done!");
  return (
    <div
      className="done-modal"
      onMouseEnter={() => {
        setText("okay");
      }}
      onMouseLeave={() => {
        setText("done!");
      }}
    >
      {text}
    </div>
  );
};

function App() {
  const timePerGame = GAME_TIME;

  const [size, setSize] = useState("auto");
  const [color, setColor] = useState("dark");
  const [showDoneModal, setShowDoneModal] = useState(false);
  const [letters, setLetters] = useState(getLetters(4));
  const [lettersVisible, setLettersVisible] = useState(false);
  const [time, setTime] = useState(timePerGame);
  const [active, setActive] = useState(false);
  const [timerDone, setTimerDone] = useState(false);

  useEffect(() => {
    let interval = null;
    if (active) {
      if (time <= 0) {
        setActive(false);
        setShowDoneModal(true);
        return setTimerDone(true);
      }
      interval = setInterval(() => {
        setTime((seconds) => seconds - 1);
      }, 1000);
    } else if (!active && time !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [active, time]);

  const resetTimer = () => {
    setTime(timePerGame);
    setTimerDone(false);
    setActive(false);
  };

  const toggleStart = () => {
    setActive(!active);
    if (!active) {
      setLettersVisible(true);
    }
  };

  const startNewGame = () => {
    setLetters(getLetters(4));
    setLettersVisible(false);
    resetTimer();
  };

  return (
    <div
      className={classNames({
        app: true,
        "size-auto": size === "auto",
        "size-small": size === "small",
        "size-large": size === "large",
        "color-light": color === "light",
      })}
      onClick={
        showDoneModal
          ? () => {
              setShowDoneModal(false);
            }
          : undefined
      }
    >
      <ColorSelector color={color} setColor={setColor} />
      <SizeSelector size={size} setSize={setSize} />
      <LetterGrid letters={letters} visible={lettersVisible} />
      <GameControls
        time={time}
        active={active}
        timerDone={timerDone}
        toggleStart={toggleStart}
        resetTimer={resetTimer}
        startNewGame={startNewGame}
        lettersVisible={lettersVisible}
        setLettersVisible={setLettersVisible}
      />
      {showDoneModal && <DoneModal setShowDoneModal={setShowDoneModal} />}
    </div>
  );
}

export default App;
