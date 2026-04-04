import { useState } from "react";
import { KnowledgeCategory } from "./types/knowledgeCategory";
import { KnowledgeCategoryList } from "./KnowledgeCategoryList";

interface EditMenuProps {
  knowledgeBase: KnowledgeCategory[];
  onDelete: (indices: number[]) => void;
}

function EditMenu(props: EditMenuProps) {
  let [showKnowledgeList, setShowKnowledgeList] = useState(false);
  let [selectedKnowledge, setSelectedKnowledge] = useState<number[]>([]);

  function handleSelection(idx: number) {
    setSelectedKnowledge((prev) =>
      prev.includes(idx) ? prev.filter((v) => v !== idx) : [...prev, idx],
    );
  }

  return (
    <section className="flex w-full flex-col justify-center rounded-xl border-2 border-slate-300 p-2">
      <button
        className="w-auto h-auto p-2"
        onClick={() => setShowKnowledgeList(!showKnowledgeList)}
      >
        Edit Knowledge
      </button>
      {showKnowledgeList && (
        <div>
          <div className="justify-evenly gap-0 flex">
            {`${selectedKnowledge.length} entries selected`}
            <button
              className="bg-red-400 p-0.5 rounded text-white"
              onClick={() => {
                props.onDelete(selectedKnowledge);
                setSelectedKnowledge([]);
              }}
            >
              Delete selected
            </button>
          </div>
          <KnowledgeCategoryList
            knowledgeBase={props.knowledgeBase}
            onSelect={handleSelection}
            selected={(idx) => selectedKnowledge.includes(idx)}
          />
        </div>
      )}
    </section>
  );
}

export { EditMenu };
