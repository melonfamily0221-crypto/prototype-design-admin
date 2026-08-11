import React, { useState, useEffect } from "react"
import { BaseFormDrawer, FormSection, FormItemRow } from "@/components/base-form-drawer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format, parseISO } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
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
import type { Contract, ContractStatus } from "../types"

interface ContractFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  contract?: Contract | null
  onSuccess?: () => void
}

export function ContractFormDrawer({ open, onOpenChange, contract, onSuccess }: ContractFormDrawerProps) {
  // Form states
  const [name, setName] = useState("")
  const [code, setCode] = useState("")
  const [party, setParty] = useState("")
  const [amount, setAmount] = useState<string>("")
  const [status, setStatus] = useState<ContractStatus | "">("")
  const [signDate, setSignDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [description, setDescription] = useState("")

  const statusLabels: Record<ContractStatus | "", string> = {
    "": "请选择合同状态",
    "draft": "草稿",
    "active": "生效中",
    "expired": "已到期",
    "terminated": "已终止"
  }

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [isDirty, setIsDirty] = useState(false)
  const [showCancelAlert, setShowCancelAlert] = useState(false)

  // Initialize
  useEffect(() => {
    if (open) {
      if (contract) {
        setName(contract.name)
        setCode(contract.code)
        setParty(contract.party)
        setAmount(contract.amount ? contract.amount.toString() : "")
        setStatus(contract.status)
        setSignDate(contract.signDate)
        setEndDate(contract.endDate)
        setDescription(contract.description || "")
      } else {
        setName("")
        setCode("")
        setParty("")
        setAmount("")
        setStatus("")
        setSignDate("")
        setEndDate("")
        setDescription("")
      }
      setErrors({})
      setIsDirty(false)
      setIsSubmitting(false)
    }
  }, [open, contract])

  // Simple dirty check (any change marks it dirty)
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
    if (!name.trim()) newErrors.name = "合同名称不能为空"
    if (!code.trim()) newErrors.code = "合同编号不能为空"
    if (!party.trim()) newErrors.party = "签约方不能为空"
    if (!status) newErrors.status = "请选择合同状态"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    
    // Mock API delay
    await new Promise(resolve => setTimeout(resolve, 800))
    
    setIsSubmitting(false)
    toast.add({ title: contract ? "合同修改成功" : "合同创建成功", type: "success" })
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
        title={contract ? "编辑合同" : "新建合同"}
        footer={footer}
      >
        <FormSection title="合同信息">
          <FormItemRow label="合同名称" required htmlFor="name">
            <Input 
              id="name"
              placeholder="请输入合同名称"
              value={name}
              onChange={e => handleChange(setName, "name")(e.target.value)}
              className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
          </FormItemRow>
          <FormItemRow label="合同编号" required htmlFor="code">
            <Input 
              id="code"
              placeholder="请输入合同编号"
              value={code}
              onChange={e => handleChange(setCode, "code")(e.target.value)}
              className={errors.code ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.code && <span className="text-xs text-destructive">{errors.code}</span>}
          </FormItemRow>
          <FormItemRow label="签约方" required htmlFor="party">
            <Input 
              id="party"
              placeholder="请输入签约方名称"
              value={party}
              onChange={e => handleChange(setParty, "party")(e.target.value)}
              className={errors.party ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.party && <span className="text-xs text-destructive">{errors.party}</span>}
          </FormItemRow>
          <FormItemRow label="合同金额（元）" htmlFor="amount">
            <Input 
              id="amount"
              type="number"
              placeholder="请输入合同金额"
              value={amount}
              onChange={e => handleChange(setAmount, "amount")(e.target.value)}
            />
          </FormItemRow>
          <FormItemRow label="合同状态" required>
            <Select 
              value={status} 
              onValueChange={handleChange(setStatus, "status")}
            >
              <SelectTrigger className={errors.status ? "border-destructive focus-visible:ring-destructive" : ""}>
                <SelectValue placeholder="请选择合同状态">
                  {status ? statusLabels[status] : undefined}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">草稿</SelectItem>
                <SelectItem value="active">生效中</SelectItem>
                <SelectItem value="expired">已到期</SelectItem>
                <SelectItem value="terminated">已终止</SelectItem>
              </SelectContent>
            </Select>
            {errors.status && <span className="text-xs text-destructive">{errors.status}</span>}
          </FormItemRow>
        </FormSection>

        <FormSection title="日期信息">
          <FormItemRow label="签约日期">
            <Popover>
              <PopoverTrigger render={<Button variant="outline" className={cn("w-full justify-start text-left font-normal", !signDate && "text-muted-foreground")} />}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {signDate ? signDate : <span>选择日期</span>}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={signDate ? parseISO(signDate) : undefined}
                  onSelect={(d) => handleChange(setSignDate, "signDate")(d ? format(d, "yyyy-MM-dd") : "")}
                />
              </PopoverContent>
            </Popover>
          </FormItemRow>
          <FormItemRow label="到期日期">
            <Popover>
              <PopoverTrigger render={<Button variant="outline" className={cn("w-full justify-start text-left font-normal", !endDate && "text-muted-foreground")} />}>
                <CalendarIcon className="mr-2 h-4 w-4" />
                {endDate ? endDate : <span>选择日期</span>}
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={endDate ? parseISO(endDate) : undefined}
                  onSelect={(d) => handleChange(setEndDate, "endDate")(d ? format(d, "yyyy-MM-dd") : "")}
                />
              </PopoverContent>
            </Popover>
          </FormItemRow>
        </FormSection>

        <FormSection title="其他信息">
          <FormItemRow label="合同描述" align="start">
            <Textarea 
              placeholder="请输入合同描述（选填）"
              className="resize-none h-24"
              value={description}
              onChange={e => handleChange(setDescription, "description")(e.target.value)}
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
