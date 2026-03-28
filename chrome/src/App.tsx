import "./App.css";
import { useState } from "react";
import { Knowledge } from "./types/knowledge";
import { EditMenu } from "./EditMenu";

function parseLatex(str: string) {
  return str
    .split("$")
    .map((segment, index) => (index % 2 === 0 ? `\\text{${segment}}` : segment))
    .join("");
}

function App() {
  let [showKnowledgeList, setShowKnowledgeList] = useState(false);
  let [knowledgeBase, setKnowledgeBase] = useState<Knowledge[]>([
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
  ]);

  function handleDeleteEntries(indicesToDelete: number[]) {
    setKnowledgeBase((prev) =>
      prev.filter((_, currentIndex) => !indicesToDelete.includes(currentIndex)),
    );
  }

  return (
    <div className="p-4">
      <h1>Kunnskap</h1>
      <div
        className="w-auto h-auto p-2"
        onClick={() => setShowKnowledgeList(!showKnowledgeList)}
      >
        Edit Knowledge
      </div>
      <EditMenu
        knowledgeBase={knowledgeBase}
        hide={showKnowledgeList}
        onDelete={handleDeleteEntries}
      />
    </div>
  );
}

export default App;
