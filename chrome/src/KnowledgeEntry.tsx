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
      className={`rounded-md border p-3 shadow-sm cursor-grab transition-colors ${
        props.selected
          ? "border-tropic-lime bg-tropic-lime/20 border-2"
          : "border-tropic-green/20 bg-white hover:border-tropic-orange/35 hover:bg-tropic-orange/10"
      }`}
      onClick={() => props.onSelect()}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-tropic-green/80">
            {props.knowledge.category}
          </h2>
          <div className="mt-2 text-sm text-tropic-green">
            <span className="font-medium">Question: </span>
            <InlineMath math={props.knowledge.question} />
          </div>
          <div className="mt-1 text-sm text-tropic-green">
            <span className="font-medium">Answer: </span>
            <InlineMath math={props.knowledge.answer} />
          </div>
        </div>
        <input
          type="checkbox"
          className="checkbox"
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
