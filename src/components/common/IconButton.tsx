import styles from './IconButton.module.css';

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
      className={`${styles['icon-button']} ${className ?? ''}`.trim()}
      onClick={onClick}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className={styles['icon-button__loader']}>
          <span className={styles['icon-button__loader-spinner']} />
        </span>
      ) : (
        icon
      )}
    </button>
  );
};
