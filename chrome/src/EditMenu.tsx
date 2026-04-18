import { useEffect, useState } from "react";
import { KnowledgeCategory } from "./types/knowledgeCategory";
import { KnowledgeCategoryList } from "./KnowledgeCategoryList";
import { SHOW_KNOWLEDGE_MENU_STORAGE_KEY } from "./storageKeys";
import { EditSelectionActions } from "./EditSelectionActions";
import {
  buildCategoryRanges,
  getCategoryIndexForEntry,
  getDisplayedSelectedEntriesCount,
  getEntryIndicesForCategory,
} from "./utils/knowledgeSelection";

interface EditMenuProps {
  knowledgeBase: KnowledgeCategory[];
  setKnowledgeBase: (knowledgeBase: KnowledgeCategory[]) => void;
  onDeleteEntries: (indices: number[]) => void;
  onDeleteCategories: (indices: number[]) => void;
  onToggleActive: (index: number) => void;
  onImport: (importedCategories: KnowledgeCategory[]) => void;
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

  const categoryRanges = buildCategoryRanges(props.knowledgeBase);

  function handleSelection(idx: number) {
    if (!editMode) return;

    const selectedCategoryIndex = getCategoryIndexForEntry(categoryRanges, idx);

    if (
      selectedCategoryIndex !== -1 &&
      selectedCategories.includes(selectedCategoryIndex)
    ) {
      const categoryEntries = getEntryIndicesForCategory(
        categoryRanges,
        selectedCategoryIndex,
      );

      setSelectedCategories((prev) =>
        prev.filter((categoryIndex) => categoryIndex !== selectedCategoryIndex),
      );

      setSelectedKnowledge((prev) => {
        const next = new Set(prev.filter((entryIndex) => entryIndex !== idx));

        categoryEntries.forEach((entryIndex) => {
          if (entryIndex !== idx) next.add(entryIndex);
        });

        return [...next];
      });
      return;
    }

    setSelectedKnowledge((prev) =>
      prev.includes(idx) ? prev.filter((v) => v !== idx) : [...prev, idx],
    );
  }

  function handleCategorySelection(idx: number) {
    if (!editMode) return;

    setSelectedCategories((prev) => {
      if (prev.includes(idx)) return prev.filter((v) => v !== idx);

      const categoryEntries = new Set(
        getEntryIndicesForCategory(categoryRanges, idx),
      );
      setSelectedKnowledge((prevKnowledge) =>
        prevKnowledge.filter((entryIndex) => !categoryEntries.has(entryIndex)),
      );

      return [...prev, idx];
    });
  }

  const totalSelected = selectedKnowledge.length + selectedCategories.length;
  const displayedSelectedEntriesCount = getDisplayedSelectedEntriesCount(
    props.knowledgeBase,
    selectedKnowledge,
    selectedCategories,
  );

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
            <EditSelectionActions
              editMode={editMode}
              onEditModeChange={setEditMode}
              displayedSelectedEntriesCount={displayedSelectedEntriesCount}
              totalSelected={totalSelected}
              onImport={props.onImport}
              onDeleteSelected={() => {
                props.onDeleteEntries(selectedKnowledge);
                props.onDeleteCategories(selectedCategories);
                setSelectedKnowledge([]);
                setSelectedCategories([]);
              }}
            />
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
