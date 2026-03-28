import "./App.css";
import { useState } from "react";
import { Knowledge } from "./types/knowledge";
import { EditMenu } from "./EditMenu";
import { TimerMenu } from "./TimerMenu";

function parseLatex(str: string) {
  return str
    .split("$")
    .map((segment, index) => (index % 2 === 0 ? `\\text{${segment}}` : segment))
    .join("");
}

function App() {
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
    <div className="flex-row space-y-2 w-60">
      <h1 className="pl-5">Kunnskap</h1>
      <TimerMenu />
      <EditMenu knowledgeBase={knowledgeBase} onDelete={handleDeleteEntries} />
    </div>
  );
}

export default App;
