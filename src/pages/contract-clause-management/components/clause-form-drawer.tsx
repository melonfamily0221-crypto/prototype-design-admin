import React, { useState, useEffect } from "react"
import { BaseFormDrawer, FormSection, FormItemRow } from "@/components/base-form-drawer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/toast"
import type { Clause, ClauseType } from "../types"

interface ClauseFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contractName: string
  clause?: Clause | null
  onSuccess?: () => void
}

export function ClauseFormDrawer({ open, onOpenChange, contractName, clause, onSuccess }: ClauseFormDrawerProps) {
  // Form states
  const [title, setTitle] = useState("")
  const [type, setType] = useState<ClauseType | "">("")
  const [content, setContent] = useState("")
  const [remark, setRemark] = useState("")

  const typeLabels: Record<ClauseType | "", string> = {
    "": "请选择条款类型",
    "payment": "付款条款",
    "confidentiality": "保密条款",
    "breach": "违约条款",
    "other": "其他"
  }

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [isDirty, setIsDirty] = useState(false)
  const [showCancelAlert, setShowCancelAlert] = useState(false)

  // Initialize
  useEffect(() => {
    if (open) {
      if (clause) {
        setTitle(clause.title)
        setType(clause.type)
        setContent(clause.content)
        setRemark(clause.remark || "")
      } else {
        setTitle("")
        setType("")
        setContent("")
        setRemark("")
      }
      setErrors({})
      setIsDirty(false)
      setIsSubmitting(false)
    }
  }, [open, clause])

  const handleChange = (setter: React.Dispatch<React.SetStateAction<any>>, field: string) => (val: any) => {
    setter(val)
    setIsDirty(true)
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined as any }))
    }
  }

  const handleCloseAttempt = () => {
    if (isDirty) {
      setShowCancelAlert(true)
    } else {
      onOpenChange(false)
    }
  }

  const confirmCancel = () => {
    setShowCancelAlert(false)
    onOpenChange(false)
  }

  const handleSubmit = async () => {
    const newErrors: Record<string, string> = {}
    if (!title.trim()) newErrors.title = "条款标题不能为空"
    if (!type) newErrors.type = "请选择条款类型"
    if (!content.trim()) newErrors.content = "条款全文不能为空"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setIsSubmitting(false)
    toast.add({ title: clause ? "条款修改成功" : "条款新建成功", type: "success" })
    onOpenChange(false)
    onSuccess?.()
  }

  const footer = (
    <>
      <Button variant="outline" onClick={handleCloseAttempt} disabled={isSubmitting}>取消</Button>
      <Button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? "保存中..." : "确定"}
      </Button>
    </>
  )

  return (
    <>
      <BaseFormDrawer
        open={open}
        onOpenChange={(v) => { if (!v) handleCloseAttempt() }}
        title={clause ? "编辑条款" : "新建条款"}
        footer={footer}
      >
        <FormSection title="基础信息">
          <FormItemRow label="所属合同">
            <Input 
              value={contractName}
              disabled
              className="bg-muted text-muted-foreground"
            />
          </FormItemRow>
          <FormItemRow label="条款标题" required htmlFor="title">
            <Input 
              id="title"
              placeholder="请输入条款标题"
              value={title}
              onChange={e => handleChange(setTitle, "title")(e.target.value)}
              className={errors.title ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.title && <span className="text-xs text-destructive">{errors.title}</span>}
          </FormItemRow>
          <FormItemRow label="条款类型" required>
            <Select 
              value={type} 
              onValueChange={handleChange(setType, "type")}
            >
              <SelectTrigger className={errors.type ? "border-destructive focus-visible:ring-destructive" : ""}>
                <SelectValue placeholder="请选择条款类型">
                  {type ? typeLabels[type] : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="payment">付款条款</SelectItem>
                <SelectItem value="confidentiality">保密条款</SelectItem>
                <SelectItem value="breach">违约条款</SelectItem>
                <SelectItem value="other">其他</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && <span className="text-xs text-destructive">{errors.type}</span>}
          </FormItemRow>
        </FormSection>

        <FormSection title="条款内容">
          <FormItemRow label="条款全文" required align="start">
            <Textarea 
              placeholder="请输入条款全文内容"
              className={`resize-none min-h-[150px] ${errors.content ? "border-destructive focus-visible:ring-destructive" : ""}`}
              value={content}
              onChange={e => handleChange(setContent, "content")(e.target.value)}
            />
            {errors.content && <span className="text-xs text-destructive">{errors.content}</span>}
          </FormItemRow>
          <FormItemRow label="备注" align="start">
            <Textarea 
              placeholder="请输入备注（选填）"
              className="resize-none h-24"
              value={remark}
              onChange={e => handleChange(setRemark, "remark")(e.target.value)}
            />
          </FormItemRow>
        </FormSection>
      </BaseFormDrawer>

      <AlertDialog open={showCancelAlert} onOpenChange={setShowCancelAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>放弃修改？</AlertDialogTitle>
            <AlertDialogDescription>
              您有未保存的更改，确认要放弃修改并离开吗？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction onClick={confirmCancel}>确定离开</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
