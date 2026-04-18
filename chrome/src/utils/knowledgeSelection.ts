import { KnowledgeCategory } from "../types/knowledgeCategory";

interface CategoryRange {
  start: number;
  endExclusive: number;
}

function buildCategoryRanges(
  knowledgeBase: KnowledgeCategory[],
): CategoryRange[] {
  let runningOffset = 0;

  return knowledgeBase.map((category) => {
    const start = runningOffset;
    runningOffset += category.knowledgeBase.length;
    return { start, endExclusive: runningOffset };
  });
}

function getEntryIndicesForCategory(
  categoryRanges: CategoryRange[],
  categoryIndex: number,
) {
  const range = categoryRanges[categoryIndex];
  if (!range) return [];

  const indices = [];
  for (let i = range.start; i < range.endExclusive; i += 1) indices.push(i);

  return indices;
}

function getCategoryIndexForEntry(
  categoryRanges: CategoryRange[],
  entryIndex: number,
) {
  return categoryRanges.findIndex(
    (range) => entryIndex >= range.start && entryIndex < range.endExclusive,
  );
}

function getDisplayedSelectedEntriesCount(
  knowledgeBase: KnowledgeCategory[],
  selectedKnowledge: number[],
  selectedCategories: number[],
) {
  const selectedCategorySet = new Set(selectedCategories);
  const effectiveSelectedEntries = new Set(selectedKnowledge);
  let flatIndex = 0;

  knowledgeBase.forEach((category, categoryIndex) => {
    const includeWholeCategory = selectedCategorySet.has(categoryIndex);
    category.knowledgeBase.forEach(() => {
      if (includeWholeCategory) effectiveSelectedEntries.add(flatIndex);
      flatIndex += 1;
    });
  });

  return effectiveSelectedEntries.size;
}

export {
  buildCategoryRanges,
  getCategoryIndexForEntry,
  getDisplayedSelectedEntriesCount,
  getEntryIndicesForCategory,
};
