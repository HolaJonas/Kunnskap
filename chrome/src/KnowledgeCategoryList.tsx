import { useEffect, useRef, useState } from "react";
import { AddButton } from "./AddButton";
import { KnowledgeList } from "./KnowledgeList";
import { KnowledgeCategory } from "./types/knowledgeCategory";
import { Knowledge } from "./types/knowledge";

interface KnowledgeCategoryListProps {
  knowledgeBase: KnowledgeCategory[];
  onSelect: (index: number) => void;
  selected: (index: number) => boolean;
  onSelectCategory: (index: number) => void;
  selectedCategory: (index: number) => boolean;
  onToggleActive: (index: number) => void;
  setKnowledgeBase: (knowledgeBase: KnowledgeCategory[]) => void;
  editMode: boolean;
}

function KnowledgeCategoryList(props: KnowledgeCategoryListProps) {
  let [creatingNew, setCreatingNew] = useState(false);
  let [proposedName, setProposedName] = useState("");
  let runningOffset = 0;
  const createNewInputFocus = useRef<HTMLInputElement | null>(null);
  const normalizedProposedName = proposedName.trim();
  const duplicateName =
    normalizedProposedName.length > 0 && nameExists(normalizedProposedName);

  function nameExists(text: string) {
    const normalizedName = text.trim().toLowerCase();
    return props.knowledgeBase.some(
      (category) => category.name.trim().toLowerCase() === normalizedName,
    );
  }

  function resetInput() {
    setCreatingNew(false);
    setProposedName("");
  }

  useEffect(() => {
    if (creatingNew) {
      createNewInputFocus.current?.focus();
    }
  }, [creatingNew]);

  return (
    <ul className="divide-y divide divide-tropic-green/15">
      {props.knowledgeBase.map((category, categoryIndex) => {
        const categoryStartIndex = runningOffset;
        runningOffset += category.knowledgeBase.length;

        return (
          <li key={`${category.name}-${categoryIndex}`} className="pb-2">
            <KnowledgeList
              knowledgeBase={category.knowledgeBase}
              onSelect={(idx) => props.onSelect(categoryStartIndex + idx)}
              selected={(idx) => props.selected(categoryStartIndex + idx)}
              onToggleActive={(idx) =>
                props.onToggleActive(categoryStartIndex + idx)
              }
              onSelectCategory={() => props.onSelectCategory(categoryIndex)}
              selectedCategory={
                props.editMode && props.selectedCategory(categoryIndex)
              }
              name={category.name}
              setName={(name: string) =>
                props.setKnowledgeBase([
                  ...props.knowledgeBase.filter(
                    (e) => e.name !== category.name,
                  ),
                  { ...category, name: name },
                ])
              }
              editMode={props.editMode}
              setKnowledgeBase={(knowledge: Knowledge[]) => {
                props.setKnowledgeBase(
                  props.knowledgeBase.map((currentCategory, index) =>
                    index === categoryIndex
                      ? { ...currentCategory, knowledgeBase: knowledge }
                      : currentCategory,
                  ),
                );
              }}
            />
          </li>
        );
      })}
      {props.editMode && !creatingNew && (
        <AddButton onClick={() => setCreatingNew(true)} />
      )}
      {props.editMode && creatingNew && (
        <div className="relative mt-3">
          {duplicateName && (
            <span className="absolute -top-2 right-2 rounded bg-tropic-red px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
              Already exists
            </span>
          )}
          <input
            ref={createNewInputFocus}
            value={proposedName}
            onChange={(e) => setProposedName(e.target.value)}
            className={`flex w-full items-center justify-between rounded border px-2 py-1 text-left text-sm font-semibold text-tropic-green transition-colors hover:bg-tropic-lime/15 focus:outline-none ${
              duplicateName
                ? "border-tropic-red focus:ring-2 focus:ring-tropic-red/30"
                : "border-tropic-green/20 focus:ring-2 focus:ring-tropic-green/20"
            }`}
            onBlur={resetInput}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !duplicateName) {
                props.setKnowledgeBase([
                  ...props.knowledgeBase,
                  { name: normalizedProposedName, knowledgeBase: [] },
                ]);
                resetInput();
              }
            }}
          />
        </div>
      )}
    </ul>
  );
}

export { KnowledgeCategoryList };
