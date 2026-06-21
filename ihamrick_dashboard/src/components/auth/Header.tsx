import React from "react";
interface HeaderProps {
  title: string;
  subtitle: string;
}

export default function Header({ title, subtitle }: HeaderProps) {
  return (
    <div className="mb-8">
      <h2 className="mb-2 font-poppins text-2xl font-bold text-black lg:text-3xl">
        {title}
      </h2>
      <p className="font-poppins font-normal text-sm text-[#666666] ">
        {subtitle}
      </p>
    </div>
  );
}
