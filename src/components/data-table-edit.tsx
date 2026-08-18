import React from "react"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus } from "lucide-react"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table"

export interface DataTableEditProps<TData, TValue> {
  data: TData[]
  columns: ColumnDef<TData, TValue>[]
  getRowKey?: (row: TData, index: number) => React.Key
  isReadonly?: boolean
  onAddRow?: () => void
  emptyMessage?: React.ReactNode
  tableClassName?: string
}

export function DataTableEdit<TData, TValue>({
  data,
  columns,
  getRowKey,
  isReadonly = false,
  onAddRow,
  emptyMessage = "暂无数据",
  tableClassName
}: DataTableEditProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: getRowKey ? (row, index) => String(getRowKey(row, index)) : undefined,
  })

  return (
    <div className="rounded-md border overflow-x-auto">
      <Table className={tableClassName}>
        <TableHeader className="bg-muted/50">
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const customClassName = (header.column.columnDef.meta as any)?.className
                return (
                  <TableHead key={header.id} className={customClassName}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id} className="align-top">
                    {flexRender(
                      cell.column.columnDef.cell,
                      cell.getContext()
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-32 text-center text-muted-foreground">
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      {!isReadonly && onAddRow && data.length > 0 && (
        <div className="p-3 border-t bg-muted/20 flex justify-center">
          <Button variant="ghost" size="sm" onClick={onAddRow} className="text-muted-foreground hover:text-primary">
            <Plus className="w-4 h-4 mr-1" /> 添加一行
          </Button>
        </div>
      )}
    </div>
  )
}
