"use client";
import * as React from "react";
import {
  ColumnDef,
  ColumnOrderState,
  RowSelectionState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, ChevronDown, ChevronLeft, ChevronRight, ChevronUp, Columns, Download } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

export function exportRowsToCsv<TRow extends object>(
  rows: TRow[],
  headers: { key: keyof TRow; label: string }[],
  filename: string
) {
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [
    headers.map((h) => escape(h.label)).join(","),
    ...rows.map((row) => headers.map((h) => escape(row[h.key])).join(",")),
  ];
  const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename.endsWith(".csv") ? filename : `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}

interface DataTableProps<TData> {
  columns: ColumnDef<TData, any>[];
  data: TData[];
  getRowId?: (row: TData) => string;
  onRowClick?: (row: TData) => void;
  enableSelection?: boolean;
  onSelectionChange?: (rows: TData[]) => void;
  rowClassName?: (row: TData) => string;
  onExportCsv?: () => void;
  pageSize?: number;
  emptyMessage?: string;
  storageKey?: string;
}

export function DataTable<TData>({
  columns,
  data,
  getRowId,
  onRowClick,
  enableSelection,
  onSelectionChange,
  rowClassName,
  onExportCsv,
  pageSize = 10,
  emptyMessage = "Aucun résultat.",
  storageKey,
}: DataTableProps<TData>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [rowSelection, setRowSelection] = React.useState<RowSelectionState>({});
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [columnOrder, setColumnOrder] = React.useState<ColumnOrderState>([]);

  const finalColumns = React.useMemo<ColumnDef<TData, any>[]>(() => {
    if (!enableSelection) return columns;
    const selectCol: ColumnDef<TData, any> = {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
        />
      ),
      cell: ({ row }) => (
        <Checkbox checked={row.getIsSelected()} onCheckedChange={(v) => row.toggleSelected(!!v)} onClick={(e) => e.stopPropagation()} />
      ),
      enableSorting: false,
      size: 32,
    };
    return [selectCol, ...columns];
  }, [columns, enableSelection]);

  const defaultColumnOrder = React.useMemo(
    () => finalColumns.map((c: any) => c.id ?? c.accessorKey as string),
    [finalColumns]
  );
  const defaultColumnOrderKey = defaultColumnOrder.join("|");

  React.useEffect(() => {
    if (storageKey && typeof window !== "undefined") {
      try {
        const raw = window.localStorage.getItem(`nomad-admin-columns-${storageKey}`);
        if (raw) {
          const stored = JSON.parse(raw) as string[];
          const valid = stored.filter((id) => defaultColumnOrder.includes(id));
          const missing = defaultColumnOrder.filter((id) => !valid.includes(id));
          setColumnOrder([...valid, ...missing]);
          return;
        }
      } catch {
        // ignore malformed storage
      }
    }
    setColumnOrder(defaultColumnOrder);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, defaultColumnOrderKey]);

  React.useEffect(() => {
    if (storageKey && columnOrder.length > 0 && typeof window !== "undefined") {
      window.localStorage.setItem(`nomad-admin-columns-${storageKey}`, JSON.stringify(columnOrder));
    }
  }, [storageKey, columnOrder]);

  function moveColumn(id: string, direction: "up" | "down") {
    setColumnOrder((prev) => {
      const order = prev.length > 0 ? prev : defaultColumnOrder;
      const idx = order.indexOf(id);
      if (idx === -1) return prev;
      const swapIdx = direction === "up" ? idx - 1 : idx + 1;
      if (swapIdx < 0 || swapIdx >= order.length) return order;
      const next = [...order];
      [next[idx], next[swapIdx]] = [next[swapIdx], next[idx]];
      return next;
    });
  }

  const table = useReactTable({
    data,
    columns: finalColumns,
    state: { sorting, rowSelection, columnVisibility, columnOrder },
    getRowId,
    onSortingChange: setSorting,
    onRowSelectionChange: setRowSelection,
    onColumnVisibilityChange: setColumnVisibility,
    onColumnOrderChange: setColumnOrder,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  });

  React.useEffect(() => {
    onSelectionChange?.(table.getSelectedRowModel().rows.map((r) => r.original));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rowSelection]);

  const rows = table.getRowModel().rows;
  const orderForMenu = columnOrder.length > 0 ? columnOrder : defaultColumnOrder;
  const menuColumns = [...table.getAllColumns()]
    .filter((c) => c.getCanHide())
    .sort((a, b) => orderForMenu.indexOf(a.id) - orderForMenu.indexOf(b.id));

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-end gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm">
              <Columns className="h-3.5 w-3.5" />
              Colonnes
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60">
            <DropdownMenuLabel>Afficher / réordonner les colonnes</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <div className="max-h-72 overflow-y-auto px-1 py-1">
              {menuColumns.map((column, idx) => (
                <div
                  key={column.id}
                  className="flex items-center justify-between gap-1 rounded-sm px-1.5 py-1 text-sm hover:bg-stone-100 dark:hover:bg-stone-800"
                >
                  <label className="flex min-w-0 flex-1 items-center gap-2 cursor-pointer">
                    <Checkbox checked={column.getIsVisible()} onCheckedChange={(v) => column.toggleVisibility(!!v)} />
                    <span className="truncate text-stone-700 dark:text-stone-300">{column.id}</span>
                  </label>
                  <div className="flex items-center gap-0.5">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={idx === 0}
                      onClick={() => moveColumn(column.id, "up")}
                    >
                      <ChevronUp className="h-3.5 w-3.5" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      disabled={idx === menuColumns.length - 1}
                      onClick={() => moveColumn(column.id, "down")}
                    >
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
        {onExportCsv && (
          <Button variant="outline" size="sm" onClick={onExportCsv}>
            <Download className="h-3.5 w-3.5" />
            Exporter CSV
          </Button>
        )}
      </div>

      <div className="rounded-xl border border-stone-200 bg-white overflow-hidden dark:border-stone-800 dark:bg-stone-900">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((hg) => (
              <TableRow key={hg.id}>
                {hg.headers.map((header) => {
                  const sortable = header.column.getCanSort();
                  const sortDir = header.column.getIsSorted();
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : sortable ? (
                        <button
                          type="button"
                          className="flex items-center gap-1 hover:text-stone-800 dark:hover:text-stone-200"
                          onClick={header.column.getToggleSortingHandler()}
                        >
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {sortDir === "asc" ? (
                            <ArrowUp className="h-3 w-3" />
                          ) : sortDir === "desc" ? (
                            <ArrowDown className="h-3 w-3" />
                          ) : (
                            <ArrowUpDown className="h-3 w-3 opacity-40" />
                          )}
                        </button>
                      ) : (
                        flexRender(header.column.columnDef.header, header.getContext())
                      )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={finalColumns.length} className="text-center py-10 text-stone-400 dark:text-stone-500">
                  {emptyMessage}
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() ? "selected" : undefined}
                  onClick={() => onRowClick?.(row.original)}
                  className={cn(onRowClick && "cursor-pointer", rowClassName?.(row.original))}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between text-sm text-stone-500 dark:text-stone-400">
        <span>
          {table.getFilteredSelectedRowModel().rows.length > 0 &&
            `${table.getFilteredSelectedRowModel().rows.length} sélectionné(s) · `}
          {data.length} ligne{data.length > 1 ? "s" : ""} au total
        </span>
        <div className="flex items-center gap-2">
          <span>
            Page {table.getState().pagination.pageIndex + 1} / {table.getPageCount() || 1}
          </span>
          <Button variant="outline" size="icon" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
