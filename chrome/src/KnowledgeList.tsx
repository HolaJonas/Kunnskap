import { useState } from "react";
import { KnowledgeEntry } from "./KnowledgeEntry";
import { Knowledge } from "./types/knowledge";

interface KnowledgeListProps {
  knowledgeBase: Knowledge[];
  onSelect: (index: number) => void;
  selected: (index: number) => boolean;
  onToggleActive: (index: number) => void;
  name: string;
}

function KnowledgeList(props: KnowledgeListProps) {
  let [showKnowledgeList, setShowKnowledgeList] = useState(false);

  return (
    <>
      <button
        type="button"
        className="mt-3 flex w-full items-center justify-between rounded px-2 py-1 text-left text-sm font-semibold text-tropic-green transition-colors hover:bg-tropic-lime/15"
        onClick={() => setShowKnowledgeList((prev) => !prev)}
      >
        <span>{props.name}</span>
        <span
          className={`text-xs transition-transform ${showKnowledgeList ? "rotate-180" : "rotate-0"}`}
        >
          ▼
        </span>
      </button>
      {showKnowledgeList && (
        <section className="mt-2 max-h-80 w-full overflow-y-auto">
          {props.knowledgeBase.length === 0 ? (
            <p className="text-sm text-tropic-green/70">
              No stored knowledge yet.
            </p>
          ) : (
            <ul className="space-y-3">
              {props.knowledgeBase.map((knowledge, index) => (
                <li
                  key={`${knowledge.category}-${knowledge.question}-${index}`}
                >
                  <KnowledgeEntry
                    knowledge={knowledge}
                    onSelect={() => props.onSelect(index)}
                    selected={props.selected(index)}
                    onToggleActive={() => props.onToggleActive(index)}
                  />
                </li>
              ))}
            </ul>
          )}
        </section>
      )}
    </>
  );
}

export { KnowledgeList };
