import { useRef, useState, useEffect } from "react";
import { AddButton } from "./AddButton";
import { KnowledgeEntry } from "./KnowledgeEntry";
import { Knowledge } from "./types/knowledge";
import { CheckBox } from "./Checkbox";

interface KnowledgeListProps {
  knowledgeBase: Knowledge[];
  onSelect: (index: number) => void;
  selected: (index: number) => boolean;
  onToggleActive: (index: number) => void;
  onSelectCategory: () => void;
  selectedCategory: boolean;
  name: string;
  editMode: boolean;
  setKnowledgeBase: (knowledgeBase: Knowledge[]) => void;
  setName: (name: string) => void;
  nameExists: (name: string, excludedName?: string) => boolean;
}

function KnowledgeList(props: KnowledgeListProps) {
  let [showKnowledgeList, setShowKnowledgeList] = useState(false);
  let [editingIndex, setEditingIndex] = useState<number | null>(null);
  let [creatingNew, setCreatingNew] = useState(false);
  let [renameCategory, setRenameCategory] = useState(false);
  let [proposedQuestion, setProposedQuestion] = useState<Knowledge | null>(
    null,
  );
  let [editingName, setEditingName] = useState(props.name);
  const categoryRenameRef = useRef<HTMLInputElement | null>(null);

  const normalizedEditingName = editingName.trim();
  const renameNameIsEmpty = normalizedEditingName.length === 0;
  const duplicateName =
    normalizedEditingName.length > 0 &&
    props.nameExists(normalizedEditingName, props.name);
  const renameNameIsInvalid = renameNameIsEmpty || duplicateName;

  useEffect(() => {
    if (renameCategory) {
      categoryRenameRef.current?.focus();
      setEditingName(props.name);
    }
  }, [renameCategory, props.name]);

  function resetNewEntry() {
    setCreatingNew(false);
    setProposedQuestion(null);
  }

  function createKnowledgeProposal() {
    return {
      question: "",
      answer: "",
      bidirectional: false,
      category: props.name,
      active: true,
    };
  }

  function canSaveProposal(knowledge: Knowledge | null) {
    if (!knowledge) return false;
    return (
      knowledge &&
      knowledge.question.trim().length > 0 &&
      knowledge.answer.trim().length > 0
    );
  }

  function saveProposal() {
    if (!props.editMode) return;
    if (!proposedQuestion || !canSaveProposal(proposedQuestion)) return;
    props.setKnowledgeBase([
      ...props.knowledgeBase,
      {
        ...proposedQuestion,
        question: proposedQuestion.question.trim(),
        answer: proposedQuestion.answer.trim(),
        category: props.name,
      },
    ]);
    resetNewEntry();
  }

  useEffect(() => {
    if (!props.editMode) setEditingIndex(null);
  }, [props.editMode]);

  function finishRename() {
    if (!renameNameIsInvalid) props.setName(normalizedEditingName);
    setRenameCategory(false);
  }

  return (
    <article
      className={`mt-3 rounded-md border transition-colors ${
        showKnowledgeList
          ? "border-tropic-lime/60 bg-tropic-lime/10"
          : "border-tropic-green/20 bg-white"
      }`}
    >
      <div
        className={`flex w-full items-center gap-2 rounded-md px-2 py-1.5 transition-colors ${
          props.editMode ? "" : "hover:bg-tropic-lime/15"
        }`}
        onClick={() => {
          if (!props.editMode) setShowKnowledgeList(!showKnowledgeList);
        }}
      >
        {!renameCategory && (
          <button
            type="button"
            className={`flex-1 rounded px-2 py-1 text-left text-sm font-semibold transition-colors ${
              props.selectedCategory
                ? "border border-tropic-lime bg-tropic-lime/25 text-tropic-green"
                : `text-tropic-green ${props.editMode ? "hover:bg-tropic-orange/10" : ""}`
            }`}
            onClick={() => {
              if (props.editMode) props.onSelectCategory();
            }}
            onDoubleClick={() => {
              if (props.editMode) setRenameCategory(true);
            }}
          >
            <span>{props.name}</span>
          </button>
        )}
        {renameCategory && (
          <div className="relative flex-1">
            {renameNameIsInvalid && (
              <span className="absolute -top-2 right-2 rounded bg-tropic-red px-1.5 py-0.5 text-[10px] font-semibold leading-none text-white">
                {renameNameIsEmpty ? "Cannot be empty" : "Already exists"}
              </span>
            )}
            <input
              className={`flex w-full items-center justify-between rounded border-2 px-2 py-1 text-left text-sm font-semibold text-tropic-green transition-colors hover:bg-tropic-lime/15 focus:outline-none ${
                renameNameIsInvalid
                  ? "border-tropic-red focus:ring-2 focus:ring-tropic-red/30"
                  : "border-tropic-green/15 focus:ring-2 focus:ring-tropic-green/20"
              }`}
              ref={categoryRenameRef}
              value={editingName}
              onChange={(e) => setEditingName(e.target.value)}
              onBlur={finishRename}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  finishRename();
                }
              }}
            />
          </div>
        )}
        <CheckBox
          value={
            props.knowledgeBase.length > 0 &&
            props.knowledgeBase.every((entry) => entry.active)
          }
          onChecked={(event) => {
            const nextActive = event.target.checked;
            props.setKnowledgeBase(
              props.knowledgeBase.map((current) => ({
                ...current,
                active: nextActive,
              })),
            );
          }}
        />
        <button
          type="button"
          className={`rounded px-2 py-1 text-left text-sm font-semibold text-tropic-green transition-colors ${props.editMode ? "hover:bg-tropic-lime/15" : ""} transition-transform ${showKnowledgeList ? "rotate-180" : "rotate-0"}`}
          onClick={() => {
            if (props.editMode) setShowKnowledgeList(!showKnowledgeList);
          }}
        >
          <span
            className={`text-xs transition-transform ${showKnowledgeList ? "rotate-180" : "rotate-0"}`}
          >
            ▼
          </span>
        </button>
      </div>
      {showKnowledgeList && (
        <section className="w-full border-t border-tropic-green/15 px-3 pb-3 pt-2">
          {props.knowledgeBase.length === 0 ? (
            <p className="rounded border border-dashed border-tropic-green/20 bg-white/60 px-3 py-2 text-sm text-tropic-green/70">
              No stored knowledge yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {props.knowledgeBase.map((knowledge, index) => (
                <li key={`${knowledge.category}-${index}`}>
                  <KnowledgeEntry
                    knowledge={knowledge}
                    onSelect={() => props.onSelect(index)}
                    selected={
                      props.editMode &&
                      (props.selected(index) || props.selectedCategory)
                    }
                    onToggleActive={() => props.onToggleActive(index)}
                    editable={props.editMode && editingIndex === index}
                    onDoubleClick={() => {
                      if (!props.editMode) return;
                      setEditingIndex((cur) => (cur === index ? null : index));
                    }}
                    setKnowledge={(knowledgeC: Knowledge) =>
                      props.setKnowledgeBase(
                        props.knowledgeBase.map((entry, entryIndex) =>
                          entryIndex === index ? knowledgeC : entry,
                        ),
                      )
                    }
                  />
                </li>
              ))}
            </ul>
          )}
          {props.editMode && !creatingNew && (
            <AddButton
              onClick={() => {
                setCreatingNew(true);
                setProposedQuestion(createKnowledgeProposal());
              }}
              label="Add Knowledge"
            />
          )}
          {props.editMode && creatingNew && (
            <div className="relative mt-3">
              <KnowledgeEntry
                editable={true}
                knowledge={proposedQuestion ?? createKnowledgeProposal()}
                setKnowledge={setProposedQuestion}
                onSelect={() => {}}
                selected={false}
                onToggleActive={() => {}}
              />
              <div className="mt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  className="rounded border border-tropic-green/25 bg-white px-2 py-1 text-xs font-semibold text-tropic-green transition-colors hover:bg-tropic-lime/10"
                  onClick={resetNewEntry}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="rounded border border-tropic-green/40 bg-tropic-green px-2 py-1 text-xs font-semibold text-white transition-colors hover:bg-tropic-green/90 disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={saveProposal}
                  disabled={!canSaveProposal(proposedQuestion)}
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </article>
  );
}

export { KnowledgeList };
