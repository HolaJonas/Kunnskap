import { useState } from "react";
import { KnowledgeCategory } from "./types/knowledgeCategory";
import { KnowledgeCategoryList } from "./KnowledgeCategoryList";

interface EditMenuProps {
  knowledgeBase: KnowledgeCategory[];
  onDelete: (indices: number[]) => void;
  onToggleActive: (index: number) => void;
}

function EditMenu(props: EditMenuProps) {
  let [showKnowledgeMenu, setShowKnowledgeMenu] = useState(false);
  let [selectedKnowledge, setSelectedKnowledge] = useState<number[]>([]);

  function handleSelection(idx: number) {
    setSelectedKnowledge((prev) =>
      prev.includes(idx) ? prev.filter((v) => v !== idx) : [...prev, idx],
    );
  }

  return (
    <section className="flex w-full flex-col gap-3 border-t border-tropic-green/15 pt-2">
      <button
        className="flex w-full rounded items-center justify-between px-3 py-1 text-left text-sm font-medium text-tropic-green transition-colors hover:bg-tropic-lime/15"
        onClick={() => setShowKnowledgeMenu(!showKnowledgeMenu)}
      >
        <span>Knowledge Editor</span>
        <span
          className={`text-xs transition-transform ${showKnowledgeMenu ? "rotate-180" : "rotate-0"}`}
        >
          ▼
        </span>
      </button>
      {showKnowledgeMenu && (
        <section className="flex w-full flex-col justify-center rounded-lg border border-tropic-green/25 bg-tropic-eggwhite/65 p-3">
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between gap-2 text-xs text-tropic-green/80">
              {`${selectedKnowledge.length} entries selected`}
              <button
                className="rounded-md border border-tropic-orange/45 bg-tropic-orange px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-tropic-orange/90 focus:outline-none focus:ring-2 focus:ring-tropic-orange/40 disabled:cursor-not-allowed disabled:border-tropic-orange/20 disabled:bg-tropic-orange/40"
                disabled={selectedKnowledge.length === 0}
                onClick={() => {
                  props.onDelete(selectedKnowledge);
                  setSelectedKnowledge([]);
                }}
              >
                Delete Selected
              </button>
            </div>
            <KnowledgeCategoryList
              knowledgeBase={props.knowledgeBase}
              onSelect={handleSelection}
              selected={(idx) => selectedKnowledge.includes(idx)}
              onToggleActive={props.onToggleActive}
            />
          </div>
        </section>
      )}
    </section>
  );
}

export { EditMenu };
