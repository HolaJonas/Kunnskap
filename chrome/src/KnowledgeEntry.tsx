import { InlineMath } from "react-katex";
import { Knowledge } from "./types/knowledge";
import { inverseParseLatex, parseLatex } from "./utils/latexParser";
import { CheckBox } from "./Checkbox";

interface KnowledgeEntryProps {
  knowledge: Knowledge;
  setKnowledge: (knowledge: Knowledge) => void;
  onSelect: () => void;
  selected: boolean;
  onToggleActive: () => void;
  editable: boolean;
  onDoubleClick?: () => void;
}

function KnowledgeEntry(props: KnowledgeEntryProps) {
  return (
    <div
      className={`rounded-md border p-3 shadow-sm transition-colors ${
        props.selected
          ? "border-tropic-lime bg-tropic-lime/20 border-2"
          : "border-tropic-green/20 bg-white hover:border-tropic-orange/35 hover:bg-tropic-orange/10"
      }`}
      onClick={() => {
        if (!props.editable) props.onSelect();
      }}
      onDoubleClick={() => props.onDoubleClick && props.onDoubleClick()}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          {!props.editable && (
            <h2 className="text-sm font-semibold uppercase tracking-wide text-tropic-green/80">
              {props.knowledge.category}
            </h2>
          )}
          {props.editable && (
            <div className="mt-1 text-sm text-tropic-green">
              <span className="font-medium">Category: </span>
              <input
                value={props.knowledge.category}
                onChange={(e) =>
                  props.setKnowledge({
                    ...props.knowledge,
                    category: e.target.value,
                  })
                }
                onClick={(event) => event.stopPropagation()}
                className="w-full rounded border border-tropic-green/20 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-tropic-green/20"
              />
            </div>
          )}
          <div className="mt-2 text-sm text-tropic-green">
            <span className="font-medium">Question: </span>
            {!props.editable && <InlineMath math={props.knowledge.question} />}
            {props.editable && (
              <input
                value={inverseParseLatex(props.knowledge.question)}
                onChange={(e) =>
                  props.setKnowledge({
                    ...props.knowledge,
                    question: parseLatex(e.target.value),
                  })
                }
                onClick={(event) => event.stopPropagation()}
                className="w-full rounded border border-tropic-green/20 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-tropic-green/20"
              />
            )}
          </div>
          <div className="mt-1 text-sm text-tropic-green">
            <span className="font-medium">Answer: </span>
            {!props.editable && <InlineMath math={props.knowledge.answer} />}
            {props.editable && (
              <input
                value={inverseParseLatex(props.knowledge.answer)}
                onChange={(e) =>
                  props.setKnowledge({
                    ...props.knowledge,
                    answer: parseLatex(e.target.value),
                  })
                }
                onClick={(event) => event.stopPropagation()}
                className="w-full rounded border border-tropic-green/20 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-tropic-green/20"
              />
            )}
          </div>
          {props.editable && (
            <div className="mt-2 flex flex-wrap items-center gap-4 text-sm text-tropic-green">
              <CheckBox
                value={props.knowledge.bidirectional}
                onChecked={(event) =>
                  props.setKnowledge({
                    ...props.knowledge,
                    bidirectional: event.target.checked,
                  })
                }
                label={"Bidirectional"}
              />
            </div>
          )}
        </div>
        {!props.editable && (
          <CheckBox
            value={props.knowledge.active}
            onChecked={(event) => {
              event.stopPropagation();
              props.onToggleActive();
            }}
          />
        )}
      </div>
    </div>
  );
}

export { KnowledgeEntry };
