import "./App.css";
import { KnowledgeList } from "./KnowledgeList";
import { useState } from "react";

function parseLatex(str: string) {
  return str
    .split("$")
    .map((segment, index) => (index % 2 === 0 ? `\\text{${segment}}` : segment))
    .join("");
}

function App() {
  let [showKnowledgeList, setShowKnowledgeList] = useState(false);

  return (
    <div className="p-4">
      <h1>Kunnskap</h1>
      <div
        className="w-auto h-auto p-2"
        onClick={() => setShowKnowledgeList(!showKnowledgeList)}
      >
        Edit Knowledge
      </div>
      <KnowledgeList
        hide={!showKnowledgeList}
        knowledgeBase={[
          {
            question: parseLatex("Solve $1 + 1$"),
            answer: parseLatex("$2$"),
            bidirectional: false,
            category: "Math",
          },
          {
            question: parseLatex("Solve $2 + 2$"),
            answer: parseLatex("$4$"),
            bidirectional: false,
            category: "Math",
          },
          {
            question: parseLatex("Solve $1 + 1$"),
            answer: parseLatex("$2$"),
            bidirectional: false,
            category: "Math",
          },
        ]}
      ></KnowledgeList>
    </div>
  );
}

export default App;
