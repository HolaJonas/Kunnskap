import "./App.css";
import { useState } from "react";
import { KnowledgeCategory } from "./types/knowledgeCategory";
import { EditMenu } from "./EditMenu";
import { TimerMenu } from "./TimerMenu";

function parseLatex(str: string) {
  return str
    .split("$")
    .map((segment, index) => (index % 2 === 0 ? `\\text{${segment}}` : segment))
    .join("");
}

function App() {
  let [knowledgeBase, setKnowledgeBase] = useState<KnowledgeCategory[]>([
    {
      name: "test",
      knowledgeBase: [
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
      ],
    },
    {
      name: "test2",
      knowledgeBase: [
        {
          question: parseLatex("Solve $1 + 1$"),
          answer: parseLatex("$2$"),
          bidirectional: false,
          category: "Math",
        },
      ],
    },
  ]);

  function handleDeleteEntries(indicesToDelete: number[]) {
    setKnowledgeBase((prev) => {
      const toDelete = new Set(indicesToDelete);
      let flatIndex = 0;

      return prev
        .map((category) => ({
          ...category,
          knowledgeBase: category.knowledgeBase.filter(() => {
            const keep = !toDelete.has(flatIndex);
            flatIndex += 1;
            return keep;
          }),
        }))
        .filter((category) => category.knowledgeBase.length > 0);
    });
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
