"use client";
import * as React from "react";
import { FileText, Image as ImageIcon, UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  isImage: boolean;
}

interface FileUploaderProps {
  files: UploadedFile[];
  onChange: (files: UploadedFile[]) => void;
  accept?: string;
  multiple?: boolean;
  label?: string;
}

export function FileUploader({ files, onChange, accept = "image/*", multiple = true, label }: FileUploaderProps) {
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = React.useState(false);

  function addFiles(fileList: FileList | null) {
    if (!fileList) return;
    const next: UploadedFile[] = Array.from(fileList).map((f) => ({
      id: `${f.name}-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      name: f.name,
      url: URL.createObjectURL(f),
      isImage: f.type.startsWith("image/"),
    }));
    onChange(multiple ? [...files, ...next] : next);
  }

  return (
    <div className="space-y-3">
      {label && <p className="text-sm font-medium text-stone-700 dark:text-stone-300">{label}</p>}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-8 text-center transition-colors",
          dragOver ? "border-luxe-terracotta bg-luxe-terracotta/5" : "border-stone-300 hover:border-stone-400 dark:border-stone-700 dark:hover:border-stone-600"
        )}
      >
        <UploadCloud className="h-6 w-6 text-stone-400 dark:text-stone-500" />
        <p className="text-sm text-stone-600 dark:text-stone-400">
          Glissez-déposez des fichiers ici ou <span className="font-semibold text-luxe-terracotta">parcourir</span>
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
      </div>
      {files.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {files.map((f) => (
            <div key={f.id} className="group relative overflow-hidden rounded-lg border border-stone-200 bg-stone-50 dark:border-stone-800 dark:bg-stone-800/50">
              {f.isImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.url} alt={f.name} className="h-24 w-full object-cover" />
              ) : (
                <div className="flex h-24 w-full flex-col items-center justify-center gap-1 text-stone-400 dark:text-stone-500">
                  <FileText className="h-6 w-6" />
                </div>
              )}
              <button
                type="button"
                onClick={() => onChange(files.filter((x) => x.id !== f.id))}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
              >
                <X className="h-3 w-3" />
              </button>
              <p className="truncate px-1.5 py-1 text-[10px] text-stone-500 flex items-center gap-1 dark:text-stone-400">
                {f.isImage ? <ImageIcon className="h-3 w-3 shrink-0" /> : <FileText className="h-3 w-3 shrink-0" />}
                {f.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
