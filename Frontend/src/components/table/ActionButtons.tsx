import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant?: 'danger';
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon,
  label,
  variant = 'danger'
}) => {
  const variants = {
    danger: 'text-red-600 hover:text-red-800 hover:bg-red-50'
  };

  return (
    <button
      onClick={onClick}
      className={`p-2 rounded-full transition-all duration-200 ${variants[variant]}`}
      title={label}
    >
      {icon}
    </button>
  );
};

export {ActionButton};
