import { useEffect, useState } from "react";
import { KnowledgeCategory } from "./types/knowledgeCategory";
import { KnowledgeCategoryList } from "./KnowledgeCategoryList";
import { SHOW_KNOWLEDGE_MENU_STORAGE_KEY } from "./storageKeys";

interface EditMenuProps {
  knowledgeBase: KnowledgeCategory[];
  setKnowledgeBase: (knowledgeBase: KnowledgeCategory[]) => void;
  onDeleteEntries: (indices: number[]) => void;
  onDeleteCategories: (indices: number[]) => void;
  onToggleActive: (index: number) => void;
}

function EditMenu(props: EditMenuProps) {
  let [showKnowledgeMenu, setShowKnowledgeMenu] = useState(
    window.localStorage.getItem(SHOW_KNOWLEDGE_MENU_STORAGE_KEY) === "true",
  );
  let [selectedKnowledge, setSelectedKnowledge] = useState<number[]>([]);
  let [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  let [editMode, setEditMode] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(
      SHOW_KNOWLEDGE_MENU_STORAGE_KEY,
      String(showKnowledgeMenu),
    );
  }, [showKnowledgeMenu]);

  useEffect(() => {
    if (!editMode) {
      setSelectedKnowledge([]);
      setSelectedCategories([]);
    }
  }, [editMode]);

  function handleSelection(idx: number) {
    if (!editMode) return;
    setSelectedKnowledge((prev) =>
      prev.includes(idx) ? prev.filter((v) => v !== idx) : [...prev, idx],
    );
  }

  function handleCategorySelection(idx: number) {
    if (!editMode) return;
    setSelectedCategories((prev) =>
      prev.includes(idx) ? prev.filter((v) => v !== idx) : [...prev, idx],
    );
  }

  const totalSelected = selectedKnowledge.length + selectedCategories.length;
  const selectedCategorySet = new Set(selectedCategories);
  const effectiveSelectedEntries = new Set(selectedKnowledge);
  let flatIndex = 0;

  props.knowledgeBase.forEach((category, categoryIndex) => {
    const includeWholeCategory = selectedCategorySet.has(categoryIndex);
    category.knowledgeBase.forEach(() => {
      if (includeWholeCategory) {
        effectiveSelectedEntries.add(flatIndex);
      }
      flatIndex += 1;
    });
  });

  const displayedSelectedEntriesCount = effectiveSelectedEntries.size;

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
              <label className="flex min-w-0 flex-col gap-1 text-left">
                <span className="text-xs text-tropic-green/80">Edit</span>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={editMode}
                  onChange={(event) => setEditMode(event.target.checked)}
                />
              </label>
              {editMode && (
                <>
                  <span className="ml-3">
                    {`${displayedSelectedEntriesCount} entries selected`}
                  </span>
                  <button
                    className="rounded-md border border-tropic-orange/45 bg-tropic-orange px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-tropic-orange/90 focus:outline-none focus:ring-2 focus:ring-tropic-orange/40 disabled:cursor-not-allowed disabled:border-tropic-orange/20 disabled:bg-tropic-orange/40 text-[10px]"
                    disabled={totalSelected === 0}
                    onClick={() => {
                      props.onDeleteEntries(selectedKnowledge);
                      props.onDeleteCategories(selectedCategories);
                      setSelectedKnowledge([]);
                      setSelectedCategories([]);
                    }}
                  >
                    Delete Selected
                  </button>
                </>
              )}
            </div>
            <KnowledgeCategoryList
              knowledgeBase={props.knowledgeBase}
              onSelect={handleSelection}
              selected={(idx) => selectedKnowledge.includes(idx)}
              onSelectCategory={handleCategorySelection}
              selectedCategory={(idx) => selectedCategories.includes(idx)}
              onToggleActive={props.onToggleActive}
              setKnowledgeBase={props.setKnowledgeBase}
              editMode={editMode}
            />
          </div>
        </section>
      )}
    </section>
  );
}

export { EditMenu };
