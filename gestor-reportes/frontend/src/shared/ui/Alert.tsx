interface AlertProps {
  message: string;
}

/** Muestra un mensaje de error de forma segura (§4: texto escapado por React). */
export function Alert({ message }: AlertProps) {
  return (
    <div className="alert alert-error" role="alert">
      {message}
    </div>
  );
}
