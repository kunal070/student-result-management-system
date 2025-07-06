import React from 'react';

interface ActionButtonProps {
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  variant?: 'primary' | 'secondary' | 'danger';
}

const ActionButton: React.FC<ActionButtonProps> = ({
  onClick,
  icon,
  label,
  variant = 'secondary'
}) => {
  const variants = {
    primary: 'text-blue-600 hover:text-blue-800 hover:bg-blue-50',
    secondary: 'text-gray-600 hover:text-gray-800 hover:bg-gray-50',
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

export default ActionButton;
