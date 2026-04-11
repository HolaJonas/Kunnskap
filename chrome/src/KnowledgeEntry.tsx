import { InlineMath } from "react-katex";
import { Knowledge } from "./types/knowledge";

interface KnowledgeEntryProps {
  knowledge: Knowledge;
  onSelect: () => void;
  selected: boolean;
  onToggleActive: () => void;
}

function KnowledgeEntry(props: KnowledgeEntryProps) {
  return (
    <div
      className="rounded-md border border-slate-200 bg-white p-3 shadow-sm"
      onClick={() => props.onSelect()}
      style={{ backgroundColor: props.selected ? "green" : "" }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
            {props.knowledge.category}
          </h2>
          <div className="mt-2 text-sm text-slate-800">
            <span className="font-medium">Question: </span>
            <InlineMath math={props.knowledge.question} />
          </div>
          <div className="mt-1 text-sm text-slate-800">
            <span className="font-medium">Answer: </span>
            <InlineMath math={props.knowledge.answer} />
          </div>
        </div>
        <input
          type="checkbox"
          checked={props.knowledge.active}
          onChange={(event) => {
            event.stopPropagation();
            props.onToggleActive();
          }}
          onClick={(event) => event.stopPropagation()}
        />
      </div>
    </div>
  );
}

export { KnowledgeEntry };
