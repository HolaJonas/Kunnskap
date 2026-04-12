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
    <div className="w-64 space-y-2 border border-tropic-green/20 bg-tropic-eggwhite p-3 shadow-sm select-none">
      <h1 className="pl-1 text-lg font-bold text-tropic-green">Kunnskap</h1>
      <section className="space-y-2 rounded-xl border border-tropic-green/25 bg-white p-3">
        <TimerMenu />
        <EditMenu
          knowledgeBase={knowledgeBase}
          onDelete={handleDeleteEntries}
          onToggleActive={handleToggleActive}
        />
      </section>
    </div>
  );
}

export default App;
