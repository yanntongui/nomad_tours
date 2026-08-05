"use client";
import * as React from "react";
import { X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface TagListInputProps {
  tags: string[];
  onChange: (tags: string[]) => void;
  suggestions?: string[];
  placeholder?: string;
  listId?: string;
}

export function TagListInput({ tags, onChange, suggestions, placeholder = "Ajouter et appuyer sur Entrée...", listId }: TagListInputProps) {
  const [value, setValue] = React.useState("");
  const generatedId = React.useId();
  const datalistId = listId ?? `taglist-${generatedId}`;

  function addTag() {
    const v = value.trim();
    if (!v || tags.includes(v)) return;
    onChange([...tags, v]);
    setValue("");
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-1.5">
        {tags.map((tag) => (
          <Badge key={tag} variant="default" className="gap-1 pr-1">
            {tag}
            <button type="button" onClick={() => onChange(tags.filter((t) => t !== tag))} className="rounded-full hover:bg-black/10 p-0.5">
              <X className="h-2.5 w-2.5" />
            </button>
          </Badge>
        ))}
      </div>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            addTag();
          }
        }}
        placeholder={placeholder}
        list={suggestions ? datalistId : undefined}
      />
      {suggestions && (
        <datalist id={datalistId}>
          {suggestions.filter((s) => !tags.includes(s)).map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      )}
    </div>
  );
}
