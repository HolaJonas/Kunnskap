import { KnowledgeList } from "./KnowledgeList";
import { KnowledgeCategory } from "./types/knowledgeCategory";

interface KnowledgeCategoryListProps {
  knowledgeBase: KnowledgeCategory[];
  onSelect: (index: number) => void;
  selected: (index: number) => boolean;
}

function KnowledgeCategoryList(props: KnowledgeCategoryListProps) {
  let runningOffset = 0;

  return (
    <ul>
      {props.knowledgeBase.map((category, categoryIndex) => {
        const categoryStartIndex = runningOffset;
        runningOffset += category.knowledgeBase.length;

        return (
          <li key={`${category.name}-${categoryIndex}`}>
            <KnowledgeList
              knowledgeBase={category.knowledgeBase}
              onSelect={(idx) => props.onSelect(categoryStartIndex + idx)}
              selected={(idx) => props.selected(categoryStartIndex + idx)}
              name={category.name}
            />
          </li>
        );
      })}
    </ul>
  );
}

export { KnowledgeCategoryList };
