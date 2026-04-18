import "./App.css";
import { useEffect, useState } from "react";
import { KnowledgeCategory } from "./types/knowledgeCategory";
import { EditMenu } from "./EditMenu";
import { TimerMenu } from "./TimerMenu";
import { KNOWLEDGE_BASE_STORAGE_KEY } from "./storageKeys";
import { mergeImportedCategories } from "./utils/importParser";

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
    chrome.storage.local.get(KNOWLEDGE_BASE_STORAGE_KEY).then((result) => {
      setKnowledgeBase(
        result[KNOWLEDGE_BASE_STORAGE_KEY] as KnowledgeCategory[],
      );
    });
  }, []);

  function handleDeleteEntries(indicesToDelete: number[]) {
    setKnowledgeBase((prev) => {
      const toDelete = new Set(indicesToDelete);
      let flatIndex = 0;

      return prev.map((category) => ({
        ...category,
        knowledgeBase: category.knowledgeBase.filter(() => {
          const keep = !toDelete.has(flatIndex);
          flatIndex += 1;
          return keep;
        }),
      }));
    });
  }

  function handleDeleteCategories(categoryIndicesToDelete: number[]) {
    setKnowledgeBase((prev) => {
      const toDelete = new Set(categoryIndicesToDelete);
      return prev.filter((_, index) => !toDelete.has(index));
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

  function handleImport(importedCategories: KnowledgeCategory[]) {
    setKnowledgeBase((prev) =>
      mergeImportedCategories(prev, importedCategories),
    );
  }

  return (
    <div className="w-64 space-y-2 border border-tropic-green/20 bg-tropic-eggwhite p-3 shadow-sm select-none">
      <h1 className="pl-1 text-lg font-bold text-tropic-green">Kunnskap</h1>
      <section className="space-y-2 rounded-xl border border-tropic-green/25 bg-white p-3">
        <TimerMenu />
        <EditMenu
          knowledgeBase={knowledgeBase}
          onDeleteEntries={handleDeleteEntries}
          onDeleteCategories={handleDeleteCategories}
          onToggleActive={handleToggleActive}
          onImport={handleImport}
          setKnowledgeBase={setKnowledgeBase}
        />
      </section>
    </div>
  );
}

export default App;
