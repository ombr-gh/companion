import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  fullWidth?: boolean;
  isLoading?: boolean;
}

export const Button = ({
  variant = 'primary',
  fullWidth = false,
  isLoading = false,
  disabled,
  children,
  className = '',
  ...props
}: ButtonProps) => {
  return (
    <button
      className={`${styles.button} ${styles[`button--${variant}`]} ${fullWidth ? styles['button--full-width'] : ''} ${className}`.trim()}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <span className={styles.button__loader}>
          <span className={styles['button__loader-spinner']} />
        </span>
      ) : (
        children
      )}
    </button>
  );
};
