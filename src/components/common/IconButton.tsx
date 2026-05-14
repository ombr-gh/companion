import './IconButton.css';

export interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  icon: React.ReactNode;
  isLoading?: boolean;
}

export const IconButton = ({
  icon,
  onClick,
  disabled = false,
  isLoading = false,
  className,
  ...props
}: IconButtonProps) => {
  return (
    <button
      className={`icon-button ${disabled || isLoading ? 'icon-button--disabled' : ''} ${className ?? ''}`.trim()}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className="icon-button__loader">
          <span className="icon-button__loader-spinner" />
        </span>
      ) : (
        icon
      )}
    </button>
  );
};
