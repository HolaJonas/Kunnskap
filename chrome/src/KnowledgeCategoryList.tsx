import { KnowledgeList } from "./KnowledgeList";
import { KnowledgeCategory } from "./types/knowledgeCategory";

interface KnowledgeCategoryListProps {
  knowledgeBase: KnowledgeCategory[];
  onSelect: (index: number) => void;
  selected: (index: number) => boolean;
  onToggleActive: (index: number) => void;
}

function KnowledgeCategoryList(props: KnowledgeCategoryListProps) {
  let runningOffset = 0;

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
              name={category.name}
            />
          </li>
        );
      })}
    </ul>
  );
}

export { KnowledgeCategoryList };
