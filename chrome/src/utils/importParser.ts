import Papa from "papaparse";
import { Knowledge } from "../types/knowledge";
import { KnowledgeCategory } from "../types/knowledgeCategory";
import { parseLatex } from "./latexParser";
import { RawImportRow } from "../types/rawImportRow";

function parseBooleanFlag(value: any): boolean {
  if (typeof value === "boolean") return value;
  if (typeof value !== "string") return false;

  const normalized = value.trim().toLowerCase();
  if (["true", "1", "yes", "y"].includes(normalized)) return true;
  if (["false", "0", "no", "n", ""].includes(normalized)) return false;

  return false;
}

function parseImportRows(rows: RawImportRow[]): KnowledgeCategory[] {
  const groupedByCategory = new Map<string, Knowledge[]>();

  rows.forEach((row) => {
    const categoryName = row.name;
    const question = row.question;
    const answer = row.answer;
    const category = row.category;

    if (!categoryName || !question || !answer) return;

    const knowledgeEntry = {
      question: parseLatex(question),
      answer: parseLatex(answer),
      bidirectional: parseBooleanFlag(row.bidirectional),
      category: category,
      active: parseBooleanFlag(row.active),
    };

    const currentCategory = groupedByCategory.get(categoryName) ?? [];
    currentCategory.push(knowledgeEntry);
    groupedByCategory.set(categoryName, currentCategory);
  });

  return [...groupedByCategory.entries()].map(([name, knowledgeBase]) => ({
    name,
    knowledgeBase,
  }));
}

function parseImportFile(file: File): Promise<KnowledgeCategory[]> {
  return new Promise((resolve, reject) => {
    Papa.parse<RawImportRow>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0) {
          const [firstError] = results.errors;
          reject(new Error(firstError?.message || "Failed to parse CSV file"));
          return;
        }
        resolve(parseImportRows(results.data));
      },
      error: (error) => reject(error),
    });
  });
}

function mergeImportedCategories(
  currentCategories: KnowledgeCategory[],
  importedCategories: KnowledgeCategory[],
) {
  const mergedCategories = [...currentCategories];

  importedCategories.forEach((importedCategory) => {
    const existingIndex = mergedCategories.findIndex(
      (currentCategory) =>
        currentCategory.name.trim().toLowerCase() ===
        importedCategory.name.trim().toLowerCase(),
    );

    if (existingIndex === -1) {
      mergedCategories.push(importedCategory);
      return;
    }

    const existingCategory = mergedCategories[existingIndex];
    if (!existingCategory) return;

    mergedCategories[existingIndex] = {
      ...existingCategory,
      knowledgeBase: [
        ...existingCategory.knowledgeBase,
        ...importedCategory.knowledgeBase,
      ],
    };
  });

  return mergedCategories;
}

export { mergeImportedCategories, parseImportFile };
