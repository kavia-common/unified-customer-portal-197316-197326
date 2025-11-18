import React from 'react';

/**
 * PUBLIC_INTERFACE
 * Button provides a themed button with variants.
 */
export default function Button({ children, variant = 'primary', ...rest }) {
  const className = `btn ${variant === 'secondary' ? 'secondary' : variant === 'ghost' ? 'ghost' : ''}`;
  return (
    <button className={className} {...rest}>
      {children}
    </button>
  );
}
