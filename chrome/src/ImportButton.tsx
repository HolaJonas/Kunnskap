import { ChangeEvent, useId, useRef } from "react";
import { KnowledgeCategory } from "./types/knowledgeCategory";
import { parseImportFile } from "./utils/importParser";

interface FileSelectorProps {
  onImport: (importedCategories: KnowledgeCategory[]) => void;
}

function FileSelector(props: FileSelectorProps) {
  const inputId = useId();
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleFileSelection(event: ChangeEvent<HTMLInputElement>) {
    const [selectedFile] = event.target.files ?? [];
    if (!selectedFile) return;

    try {
      const importedCategories = await parseImportFile(selectedFile);
      if (importedCategories.length > 0) props.onImport(importedCategories);
    } catch {
    } finally {
      event.target.value = "";
    }
  }

  return (
    <div className="flex min-w-0 items-center gap-1.5 text-[10px] text-tropic-green/75">
      <input
        ref={fileInputRef}
        id={inputId}
        type="file"
        accept=".csv,text/csv"
        className="sr-only"
        onChange={handleFileSelection}
      />
      <label
        htmlFor={inputId}
        className="cursor-pointer rounded-md border border-tropic-green/35 bg-white px-2 py-1 font-semibold text-tropic-green shadow-sm transition-colors hover:bg-tropic-lime/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-tropic-green/40"
      >
        Select File
      </label>
    </div>
  );
}

export { FileSelector };
