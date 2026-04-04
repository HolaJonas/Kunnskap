import { useState } from "react";
import { KnowledgeEntry } from "./KnowledgeEntry";
import { Knowledge } from "./types/knowledge";

interface KnowledgeListProps {
  knowledgeBase: Knowledge[];
  onSelect: (index: number) => void;
  selected: (index: number) => boolean;
  name: string;
}

function KnowledgeList(props: KnowledgeListProps) {
  let [showKnowledgeList, setShowKnowledgeList] = useState(false);

  return (
    <>
      <h3
        className="mt-3text-slate-500"
        onClick={() => setShowKnowledgeList(!showKnowledgeList)}
      >
        {props.name}
      </h3>
      {showKnowledgeList && (
        <section className="mt-3 w-full max-h-80 overflow-y-auto rounded-md border border-slate-300 bg-slate-50 p-3">
          {props.knowledgeBase.length === 0 ? (
            <p className="text-sm text-slate-600">No stored knowledge yet.</p>
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
