import './toggle.css';

export interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  ariaPressed?: boolean;
}

export function Toggle({ checked, onChange, ariaPressed }: ToggleProps) {
  return (
    <button
      type="button"
      className={`settings-switch ${checked ? 'settings-switch--on' : ''}`}
      onClick={onChange}
      aria-pressed={ariaPressed ?? checked}
    >
      <span></span>
    </button>
  );
}
