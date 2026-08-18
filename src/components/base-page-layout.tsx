import React from "react"
import { ArrowLeft } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface BasePageLayoutProps {
  title: React.ReactNode
  description?: React.ReactNode
  extraHeader?: React.ReactNode
  footerActions?: React.ReactNode
  onBack?: () => void
  children: React.ReactNode
  contentClassName?: string
}

export function BasePageLayout({
  title,
  description,
  extraHeader,
  footerActions,
  onBack,
  children,
  contentClassName
}: BasePageLayoutProps) {
  const navigate = useNavigate()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      navigate(-1)
    }
  }

  return (
    <div className="flex flex-col h-full bg-muted/30 relative">
      {/* 页面标题栏 */}
      <div className="flex items-center justify-between px-6 py-4 bg-background border-b shrink-0">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={handleBack} className="shrink-0 rounded-full h-8 w-8 hover:bg-muted">
            <ArrowLeft className="h-5 w-5 text-muted-foreground" />
          </Button>
          <div>
            <h1 className="text-xl font-bold tracking-tight">{title}</h1>
            {description && (
              <p className="text-sm text-muted-foreground mt-1">
                {description}
              </p>
            )}
          </div>
        </div>
        {extraHeader && (
          <div>{extraHeader}</div>
        )}
      </div>

      {/* 主内容区 */}
      <div className={cn("flex-1 p-6 w-full max-w-[1400px] mx-auto space-y-6", contentClassName)}>
        {children}
      </div>

      {/* 底部悬浮操作栏 */}
      {footerActions && (
        <div className="sticky bottom-0 z-20 mt-6 border-t bg-background/95 backdrop-blur px-6 py-4 flex items-center justify-end gap-4 shadow-[0_-4px_12px_-4px_rgba(0,0,0,0.1)]">
          {footerActions}
        </div>
      )}
    </div>
  )
}
