interface CheckboxProps {
  onChecked: (event: React.ChangeEvent<HTMLInputElement>) => void;
  value: boolean;
  label?: string | null;
}

function CheckBox(props: CheckboxProps) {
  return (
    <label className="flex min-w-0 flex-col gap-1 text-left">
      {props.label && (
        <span className="text-xs text-tropic-green/80">{props.label}</span>
      )}
      <input
        className="checkbox"
        type="checkbox"
        checked={props.value}
        onChange={props.onChecked}
        onClick={(event) => event.stopPropagation()}
      />
    </label>
  );
}

export { CheckBox };
