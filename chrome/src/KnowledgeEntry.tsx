import { InlineMath } from "react-katex";
import { Knowledge } from "./types/knowledge";

interface KnowledgeEntryProps {
  knowledge: Knowledge;
}

function KnowledgeEntry(props: KnowledgeEntryProps) {
  return (
    <div className="rounded-md border border-slate-200 bg-white p-3 shadow-sm">
      <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-600">
        {props.knowledge.category}
      </h2>
      <p className="mt-2 text-sm text-slate-800">
        <div className="font-medium">Question: </div>
        <InlineMath math={props.knowledge.question} />
      </p>
      <p className="mt-1 text-sm text-slate-800">
        <div className="font-medium">Answer: </div>
        <InlineMath math={props.knowledge.answer} />
      </p>
    </div>
  );
}

export { KnowledgeEntry };
