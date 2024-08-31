import React, { useState, useEffect } from "react";
import "./TextualTask.module.css";
import { useTaskContext } from "../TaskContext";

const TextualTask: React.FC = () => {
  const [imgOptChecked, setImgOptChecked] = useState(false);
  const [answerAmount, setAnswerAmount] = useState(2); // Initial value set to 2 as per your HTML
  const [answers, setAnswers] = useState([
    { text: "", url: "" },
    { text: "", url: "" },
  ]);
  const { task, setTask } = useTaskContext();

  useEffect(() => {
    adjustAnswers(answerAmount);
  }, [answerAmount]);

  const handleImageOptionsToggle = () => {
    setImgOptChecked(!imgOptChecked);
  };

  const handleAnswerAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newAmount = parseInt(e.target.value);
    setAnswerAmount(newAmount);
  };

  const adjustAnswers = (newAmount: number) => {
    if (newAmount > answers.length) {
      setAnswers([
        ...answers,
        ...Array(newAmount - answers.length).fill({ text: "", url: "" }),
      ]);
    } else {
      setAnswers(answers.slice(0, newAmount));
    }
  };

  const handleAnswerChange = (index: number, field: string, value: string) => {
    const updatedAnswers = answers.map((answer, i) =>
      i === index ? { ...answer, [field]: value } : answer
    );
    setAnswers(updatedAnswers);
  };

  const createTask = (event: React.FormEvent) => {
    event.preventDefault();
    const answerTexts = answers.map((answer) => answer.text);
    const answerImageUrls = imgOptChecked
      ? answers.map((answer) => answer.url)
      : [];
    setTask({
      ...task,
      answerTexts,
      answerImageUrls,
    });
  };

  return (
    <form onSubmit={createTask}>
      <h1>Task Configurator for Dimensional Tasks</h1>
      <p>This can configure and save a single task for now</p>

      <div id="imageOptions">
        <label>Use Image Options</label>
        <input
          type="checkbox"
          id="imgOptCheckbox"
          name="imgOpt"
          checked={imgOptChecked}
          onChange={handleImageOptionsToggle}
        />
      </div>

      <div>
        <label>Answer Amount</label>
        <input
          type="number"
          id="answerAmount"
          style={{ width: "40px" }}
          value={answerAmount}
          min="2"
          max="5"
          onChange={handleAnswerAmountChange}
        />
      </div>

      <div id="question">
        <label>Question:</label>
        <input
          type="text"
          value={task.question}
          onChange={(e) => setTask({ ...task, question: e.target.value })}
        />
      </div>

      <div>
        {answers.map((answer, index) => (
          <div
            key={index}
            className={`answer ${index === 0 ? "" : "false"}`}
            style={{ marginBottom: "5px" }}
          >
            <label>{index === 0 ? "Correct Answer:" : "False Answer:"}</label>
            <input
              type="text"
              value={answer.text}
              onChange={(e) =>
                handleAnswerChange(index, "text", e.target.value)
              }
            />
            {imgOptChecked && (
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <input
                  type="text"
                  placeholder="Image URL"
                  value={answer.url}
                  onChange={(e) =>
                    handleAnswerChange(index, "url", e.target.value)
                  }
                />
                <img
                  src={
                    answer.url ||
                    "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
                  }
                  alt="Preview"
                  style={{
                    width: "50px",
                    height: "50px",
                    backgroundColor: "black",
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      <button type="submit">Create Task</button>
      {/* <button type="button" onClick={copyToClipboard}>
        Copy JSON to Clipboard
      </button>

      <textarea
        id="jsonOutput"
        value={JSON.stringify(task, null, 2)}
        readOnly
      /> */}
    </form>
  );
};

export default TextualTask;
