import "./App.css";
import { useEffect, useState } from "react";
import { KnowledgeCategory } from "./types/knowledgeCategory";
import { EditMenu } from "./EditMenu";
import { TimerMenu } from "./TimerMenu";

function App() {
  let [knowledgeBase, setKnowledgeBase] = useState<KnowledgeCategory[]>([]);

  useEffect(() => {
    const flattenedKnowledge = knowledgeBase.flatMap(
      (category) => category.knowledgeBase,
    );

    chrome.runtime.sendMessage({
      type: "storage:update",
      payload: { knowledgeBase: knowledgeBase, flatten: flattenedKnowledge },
    });
  }, [knowledgeBase]);

  useEffect(() => {
    chrome.storage.local.get("knowledgeBase").then((result) => {
      setKnowledgeBase(result.knowledgeBase as KnowledgeCategory[]);
    });
  }, []);

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

  function handleToggleActive(indexToToggle: number) {
    setKnowledgeBase((prev) => {
      let flatIndex = 0;

      return prev.map((category) => ({
        ...category,
        knowledgeBase: category.knowledgeBase.map((knowledge) => {
          const next =
            flatIndex === indexToToggle
              ? { ...knowledge, active: !knowledge.active }
              : knowledge;
          flatIndex += 1;
          return next;
        }),
      }));
    });
  }

  return (
    <div className="flex-row space-y-2 w-60">
      <h1 className="pl-5">Kunnskap</h1>
      <TimerMenu />
      <EditMenu
        knowledgeBase={knowledgeBase}
        onDelete={handleDeleteEntries}
        onToggleActive={handleToggleActive}
      />
    </div>
  );
}

export default App;
