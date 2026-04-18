import { CheckBox } from "./Checkbox";
import { FileSelector } from "./ImportButton";
import { KnowledgeCategory } from "./types/knowledgeCategory";

interface EditSelectionActionsProps {
  editMode: boolean;
  onEditModeChange: (nextEditMode: boolean) => void;
  displayedSelectedEntriesCount: number;
  totalSelected: number;
  onDeleteSelected: () => void;
  onImport: (importedCategories: KnowledgeCategory[]) => void;
}

function EditSelectionActions(props: EditSelectionActionsProps) {
  return (
    <div className="flex items-center justify-between gap-2 text-xs text-tropic-green/80">
      <CheckBox
        label={"Edit"}
        onChecked={(event) => props.onEditModeChange(event.target.checked)}
        value={props.editMode}
      />
      {!props.editMode && <FileSelector onImport={props.onImport} />}
      {props.editMode && (
        <>
          <span className="ml-3">
            {`${props.displayedSelectedEntriesCount} entries selected`}
          </span>
          <button
            className="rounded-md border border-tropic-orange/45 bg-tropic-orange px-2.5 py-1 text-xs font-semibold text-white shadow-sm transition-colors hover:bg-tropic-orange/90 focus:outline-none focus:ring-2 focus:ring-tropic-orange/40 disabled:cursor-not-allowed disabled:border-tropic-orange/20 disabled:bg-tropic-orange/40 text-[10px]"
            disabled={props.totalSelected === 0}
            onClick={props.onDeleteSelected}
          >
            Delete Selected
          </button>
        </>
      )}
    </div>
  );
}

export { EditSelectionActions };
