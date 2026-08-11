import React from "react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

export interface BaseFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: React.ReactNode
  children: React.ReactNode
  footer?: React.ReactNode
  /** 默认强制为 60vw，传入其他 className 可覆盖 */
  className?: string 
}

export function BaseFormDrawer({ 
  open, 
  onOpenChange, 
  title, 
  description, 
  children, 
  footer,
  className
}: BaseFormDrawerProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent 
        className={cn("!w-[60vw] !max-w-[60vw] sm:!max-w-[60vw] overflow-y-auto", className)}
      >
        <SheetHeader className="mb-6">
          <SheetTitle className="text-xl">{title}</SheetTitle>
          {description && <SheetDescription>{description}</SheetDescription>}
        </SheetHeader>

        <div className="flex flex-col gap-8 pb-10 px-4">
          {children}
        </div>

        {footer && (
          <SheetFooter className="absolute bottom-0 left-0 right-0 p-4 border-t bg-background flex flex-row justify-end gap-2">
            {footer}
          </SheetFooter>
        )}
      </SheetContent>
    </Sheet>
  )
}

/** 
 * 表单区块组件：包含左侧的蓝色竖条和标题 
 */
export function FormSection({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="flex items-center">
        <div className="bg-primary w-1 h-4 mr-2 rounded-sm"></div>
        <h3 className="text-lg font-semibold">{title}</h3>
      </div>
      <div className="grid gap-6">
        {children}
      </div>
    </div>
  )
}

/** 
 * 表单行组件：负责 140px 左侧 Label 与右侧控件的对齐 
 */
export interface FormItemRowProps {
  label: string
  required?: boolean
  children: React.ReactNode
  align?: "center" | "start"
  htmlFor?: string
}

export function FormItemRow({ label, required, children, align = "center", htmlFor }: FormItemRowProps) {
  return (
    <div className={cn("grid grid-cols-[140px_1fr] gap-4", align === "center" ? "items-center" : "items-start")}>
      <Label htmlFor={htmlFor} className={cn(align === "start" && "pt-2")}>
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      <div className="flex flex-col gap-1">
        {children}
      </div>
    </div>
  )
}
