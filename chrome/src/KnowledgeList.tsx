import { useState } from "react";
import { AddButton } from "./AddButton";
import { KnowledgeEntry } from "./KnowledgeEntry";
import { Knowledge } from "./types/knowledge";

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
}

function KnowledgeList(props: KnowledgeListProps) {
  let [showKnowledgeList, setShowKnowledgeList] = useState(false);
  let [creatingNew, setCreatingNew] = useState(false);
  let [proposedQuestion, setProposedQuestion] = useState<Knowledge | null>(
    null,
  );

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

  return (
    <>
      <div
        className={`mt-3 flex w-full items-center gap-1 ${props.editMode ? "" : "hover:bg-tropic-lime/15"}`}
        onClick={() => {
          if (!props.editMode) setShowKnowledgeList(!showKnowledgeList);
        }}
      >
        <button
          type="button"
          className={`flex-1 rounded px-2 py-1 text-left text-sm font-semibold transition-colors ${
            props.selectedCategory
              ? "border border-tropic-lime bg-tropic-lime/20 text-tropic-green"
              : `text-tropic-green ${props.editMode ? "hover:bg-tropic-orange/10" : ""}`
          }`}
          onClick={() => {
            if (props.editMode) {
              props.onSelectCategory();
            }
          }}
        >
          {props.name}
        </button>
        <button
          type="button"
          className={`rounded px-2 py-1 text-left text-sm font-semibold text-tropic-green transition-colors ${props.editMode ? "hover:bg-tropic-lime/15" : ""}`}
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
        <section className="mt-2 w-full">
          {props.knowledgeBase.length === 0 ? (
            <p className="text-sm text-tropic-green/70">
              No stored knowledge yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {props.knowledgeBase.map((knowledge, index) => (
                <li key={`${knowledge.category}-${index}`}>
                  <KnowledgeEntry
                    knowledge={knowledge}
                    onSelect={() => props.onSelect(index)}
                    selected={props.editMode && props.selected(index)}
                    onToggleActive={() => props.onToggleActive(index)}
                    editable={props.editMode}
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
    </>
  );
}

export { KnowledgeList };
