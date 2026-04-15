interface AddButtonProps {
  onClick: () => void;
}

function AddButton(props: AddButtonProps) {
  return (
    <button
      type="button"
      className="mt-3 flex w-full items-center justify-between rounded border-2 border-dashed border-tropic-green/15 px-2 py-1 text-left text-sm font-semibold text-tropic-green transition-colors hover:bg-tropic-lime/15"
      onClick={props.onClick}
    >
      <span>+</span>
    </button>
  );
}

export { AddButton };
