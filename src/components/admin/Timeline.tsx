import { Circle } from "lucide-react";

export interface TimelineItem {
  id: string;
  label: string;
  detail?: string;
  actor?: string;
  date: string;
}

export function Timeline({ items }: { items: TimelineItem[] }) {
  if (items.length === 0) {
    return <p className="text-sm text-stone-400 py-6 text-center dark:text-stone-500">Aucun événement pour le moment.</p>;
  }
  return (
    <ol className="relative border-l border-stone-200 pl-5 space-y-6 dark:border-stone-800">
      {items.map((item) => (
        <li key={item.id} className="relative">
          <Circle className="absolute -left-[26px] top-1 h-3 w-3 fill-luxe-terracotta text-luxe-terracotta" />
          <p className="text-sm font-medium text-stone-800 dark:text-stone-100">{item.label}</p>
          {item.detail && <p className="text-xs text-stone-500 mt-0.5 dark:text-stone-400">{item.detail}</p>}
          <p className="text-[11px] text-stone-400 mt-1 dark:text-stone-500">
            {new Date(item.date).toLocaleString("fr-FR", { dateStyle: "medium", timeStyle: "short" })}
            {item.actor ? ` · ${item.actor}` : ""}
          </p>
        </li>
      ))}
    </ol>
  );
}
