import { useState } from "react";
import { Knowledge } from "./types/knowledge";
import { KnowledgeList } from "./KnowledgeList";

interface EditMenuProps {
  knowledgeBase: Knowledge[];
  onDelete: (indices: number[]) => void;
}

function EditMenu(props: EditMenuProps) {
  let [showKnowledgeList, setShowKnowledgeList] = useState(false);
  let [selectedKnowledge, setSelectedKnowledge] = useState<number[]>([]);

  function handleSelection(idx: number) {
    if (selectedKnowledge.includes(idx))
      setSelectedKnowledge(selectedKnowledge.filter((v) => v !== idx));
    else setSelectedKnowledge([...selectedKnowledge, idx]);
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
          <KnowledgeList
            knowledgeBase={props.knowledgeBase}
            onDelete={props.onDelete}
            onSelect={handleSelection}
            selected={(idx) => selectedKnowledge.includes(idx)}
          />
        </div>
      )}
    </section>
  );
}

export { EditMenu };
