import styles from './Toggle.module.css';

export interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  ariaPressed?: boolean;
}

export function Toggle({ checked, onChange, ariaPressed }: Readonly<ToggleProps>) {
  return (
    <button
      type="button"
      className={`${styles['settings-switch']} ${checked ? styles['settings-switch--on'] : ''}`.trim()}
      onClick={onChange}
      aria-pressed={ariaPressed ?? checked}
    >
      <span></span>
    </button>
  );
}
