import { useState } from 'react';

interface TextFieldProps {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
  placeholder?: string;
  multiline?: boolean;
}

/** Campo de texto/textarea reutilizable. React escapa el valor (§4 XSS). */
export function TextField({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder = '',
  multiline = false,
}: TextFieldProps) {
  const [reveal, setReveal] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && reveal ? 'text' : type;

  return (
    <div className="field">
      <label htmlFor={id}>{label}</label>
      {multiline ? (
        <textarea
          id={id}
          value={value}
          required={required}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
        />
      ) : (
        <div className="input-wrap">
          <input
            id={id}
            type={inputType}
            className={isPassword ? 'has-toggle' : undefined}
            value={value}
            required={required}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
          />
          {isPassword && (
            <button
              type="button"
              className="reveal"
              onClick={() => setReveal((prev) => !prev)}
              aria-label={reveal ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            >
              {reveal ? '🙈' : '👁️'}
            </button>
          )}
        </div>
      )}
    </div>
  );
}
