import { LucideIcon, Construction } from "lucide-react";

interface ComingSoonProps {
  title: string;
  description: string;
  icon?: LucideIcon;
}

export function ComingSoon({ title, description, icon: Icon = Construction }: ComingSoonProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-stone-300 bg-white py-24 text-center px-6 dark:border-stone-700 dark:bg-stone-900">
      <span className="flex h-14 w-14 items-center justify-center rounded-full bg-luxe-terracotta/10 text-luxe-terracotta mb-4">
        <Icon className="h-7 w-7" />
      </span>
      <h2 className="text-lg font-semibold text-stone-800 dark:text-stone-100">{title}</h2>
      <p className="mt-2 max-w-md text-sm text-stone-500 dark:text-stone-400">{description}</p>
      <span className="mt-4 inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-500 dark:bg-stone-800 dark:text-stone-400">
        Disponible dans une prochaine phase
      </span>
    </div>
  );
}
