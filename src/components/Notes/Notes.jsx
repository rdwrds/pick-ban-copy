import { useState, useRef } from "react";
import "./Notes.css";

const Notes = () => {
  const [text, setText] = useState("");
  const textAreaRef = useRef(null);

  //this function was sponsored by stackoverflow
  //and google gemini
  const handleKeyDown = (e) => {
    if (e.key === "Tab") {
      e.preventDefault();
      const { selectionStart, selectionEnd } = textAreaRef.current;
      const newText =
        text.substring(0, selectionStart) + "\t" + text.substring(selectionEnd);
      setText(newText);
      textAreaRef.current.selectionStart = selectionStart + 1;
      textAreaRef.current.selectionEnd = selectionStart;
    }
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  return (
    <div className="notes-container">
      <h1 className="notes-title">Notes</h1>
      <form action="">
        <textarea
          className="notes-area"
          ref={textAreaRef}
          value={text}
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        ></textarea>
      </form>
    </div>
  );
};
export default Notes;
