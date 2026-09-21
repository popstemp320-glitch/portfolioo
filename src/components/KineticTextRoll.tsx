import React from 'react';

interface KineticTextRollProps {
  primaryText: string;
  secondaryText?: string;
  className?: string;
  primaryClassName?: string;
  secondaryClassName?: string;
  id?: string;
}

export const KineticTextRoll: React.FC<KineticTextRollProps> = ({
  primaryText,
  secondaryText,
  className = '',
  primaryClassName = 'text-[#ece7db] group-hover:text-[#7a8058]',
  secondaryClassName = 'text-[#7a8058]',
  id,
}) => {
  const secondary = secondaryText || primaryText;

  return (
    <span
      id={id}
      className={`inline-block overflow-hidden align-baseline relative group ${className}`}
      style={{ height: '1.2em', lineHeight: '1.2em' }}
    >
      <span className="flex flex-col transition-transform duration-350 ease-[cubic-bezier(0.25,1,0.5,1)] group-hover:-translate-y-1/2">
        <span className={`block transition-colors duration-300 ${primaryClassName}`}>
          {primaryText}
        </span>
        <span className={`block transition-colors duration-300 ${secondaryClassName}`}>
          {secondary}
        </span>
      </span>
    </span>
  );
};
