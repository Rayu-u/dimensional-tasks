import React, { useRef, useState } from "react";
import { useVisualEditorContext } from "../../visualEditorContext";

interface TextInputProps {
  value: string;
  setValue: (value: string) => void;
}

const TextInput: React.FC<TextInputProps> = ({ value, setValue }) => {
  const [activeInput, setActive] = useState(false);
  const { mode } = useVisualEditorContext();

  return (
    <div>
      {activeInput ? (
        <input
          onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) => {
            if (event.key === "Enter") {
              setValue(event.currentTarget.value);
              setActive(false);
            }
          }}
          type="text"
          defaultValue={value}
          autoFocus
          onBlur={() => {
            setActive(false);
          }}
        />
      ) : (
        <p
          style={{
            fontSize: "12px",
            color: "black",
            userSelect: mode === "animate" ? "none" : "auto",
          }}
          onDoubleClick={() => {
            if (mode === "animate") {
              return;
            }
            setActive(true);
          }}
        >
          {value}
        </p>
      )}
    </div>
  );
};

export default TextInput;
