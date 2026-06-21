import React from "react";

type SidebarButtonProps = {
  item: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
  };
  active?: boolean;
  onClick: (label: string) => void;
};

export default function SidebarButton({
  item,
  active,
  onClick,
}: SidebarButtonProps) {
  const Icon = item.icon;

  return (
    <button
      onClick={() => onClick(item.label)}
      className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-poppins font-medium transition-colors ${
        active
          ? "bg-white text-neutral-900"
          : "text-neutral-400 hover:bg-neutral-800 hover:text-white"
      }`}
    >
      <Icon className="h-5 w-5" />
      <span>{item.label}</span>
    </button>
  );
}
