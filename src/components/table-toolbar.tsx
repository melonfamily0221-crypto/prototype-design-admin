import * as React from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface TableAction {
  key: string
  label: React.ReactNode
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
  onClick?: () => void
  disabled?: boolean
  icon?: React.ReactNode
}

export interface TableToolbarProps extends Omit<React.HTMLAttributes<HTMLDivElement>, "title"> {
  title?: React.ReactNode
  actions?: TableAction[]
  extra?: React.ReactNode
}

export function TableToolbar({ title, actions = [], extra, className, ...props }: TableToolbarProps) {
  return (
    <div className={cn("flex items-center justify-between", className)} {...props}>
      <div className="flex-1">
        {title && (
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
        )}
      </div>
      <div className="flex items-center space-x-2 flex-wrap gap-y-2 justify-end">
        {actions.map((action) => (
          <Button
            key={action.key}
            variant={action.variant || "default"}
            size="sm"
            onClick={action.onClick}
            disabled={action.disabled}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
        {extra && <div className="flex items-center space-x-2">{extra}</div>}
      </div>
    </div>
  )
}
