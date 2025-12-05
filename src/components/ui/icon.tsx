
"use client";

import { icons } from "lucide-react";
import { type LucideProps } from "lucide-react";

export const Icon = ({ name, ...props }: LucideProps & { name: keyof typeof icons }) => {
  const LucideIcon = icons[name];

  if (!LucideIcon) {
    return null;
  }

  return <LucideIcon {...props} />;
};
