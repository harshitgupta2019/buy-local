import './Input.css';

const Input = ({
  label,
  error,
  type = 'text',
  required = false,
  className = '',
  ...props
}) => {
  return (
    <div className="input-wrapper">
      {label && (
        <label className="input-label">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <input
        type={type}
        className={`input-field ${error ? 'input-error' : ''} ${className}`}
        required={required}
        {...props}
      />
      {error && <p className="input-error-message">{error}</p>}
    </div>
  );
};

export default Input;
