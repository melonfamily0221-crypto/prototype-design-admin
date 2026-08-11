import { useState, useEffect } from "react"
import { BaseFormDrawer, FormSection, FormItemRow } from "@/components/base-form-drawer"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "@/components/ui/toast"
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
import { Button } from "@/components/ui/button"
import type { Device, DeviceGroup } from "../types"

interface DeviceFormDrawerProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  device?: Device | null
  currentGroupId?: string
  groups: DeviceGroup[]
  onSuccess?: () => void
}

// Helper to flatten groups for select
function flattenGroups(groups: DeviceGroup[], level = 0): { id: string; name: string; level: number }[] {
  let result: { id: string; name: string; level: number }[] = []
  groups.forEach(g => {
    result.push({ id: g.id, name: g.name, level })
    if (g.children) {
      result = result.concat(flattenGroups(g.children, level + 1))
    }
  })
  return result
}

export function DeviceFormDrawer({ open, onOpenChange, device, currentGroupId, groups, onSuccess }: DeviceFormDrawerProps) {
  // Form states
  const [name, setName] = useState("")
  const [sn, setSn] = useState("")
  const [groupId, setGroupId] = useState("")
  const [firmware, setFirmware] = useState("")
  const [remark, setRemark] = useState("")

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [isDirty, setIsDirty] = useState(false)
  const [showCancelAlert, setShowCancelAlert] = useState(false)

  // Initialize
  useEffect(() => {
    if (open) {
      if (device) {
        setName(device.name)
        setSn(device.sn)
        setGroupId(device.groupId)
        setFirmware(device.firmware)
        setRemark(device.remark || "")
      } else {
        setName("")
        setSn("")
        setGroupId(currentGroupId || "")
        setFirmware("")
        setRemark("")
      }
      setErrors({})
      setIsDirty(false)
      setShowCancelAlert(false)
      setIsSubmitting(false)
    }
  }, [open, device, currentGroupId])

  const handleChange = <T,>(setter: (val: T) => void, field: string) => (val: T) => {
    setter(val)
    setIsDirty(true)
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
  }

  const handleSave = () => {
    // Validate
    const newErrors: Record<string, string> = {}
    if (!name.trim()) newErrors.name = "设备名称不能为空"
    if (!sn.trim()) newErrors.sn = "设备序列号不能为空"
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      toast.add({ title: device ? "设备信息修改成功" : "设备新建成功", type: "success" })
      setIsDirty(false)
      onSuccess?.()
      onOpenChange(false)
    }, 1000)
  }

  const handleCancelClick = () => {
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

  const footer = (
    <>
      <Button variant="outline" onClick={handleCancelClick} disabled={isSubmitting}>取消</Button>
      <Button onClick={handleSave} disabled={isSubmitting}>
        {isSubmitting ? "保存中..." : "确定"}
      </Button>
    </>
  )

  const flatGroups = flattenGroups(groups)

  return (
    <>
      <BaseFormDrawer
        open={open}
        onOpenChange={onOpenChange}
        title={device ? "编辑设备" : "新增设备"}
        footer={footer}
      >
      <div className="space-y-6">
        <FormSection title="基本信息">
          <FormItemRow label="设备名称" required htmlFor="name">
            <Input 
              id="name"
              placeholder="请输入设备名称"
              value={name}
              onChange={e => handleChange(setName, "name")(e.target.value)}
              className={errors.name ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.name && <span className="text-xs text-destructive">{errors.name}</span>}
          </FormItemRow>
          <FormItemRow label="设备序列号(SN)" required htmlFor="sn">
            <Input 
              id="sn"
              placeholder="请输入设备序列号"
              value={sn}
              onChange={e => handleChange(setSn, "sn")(e.target.value)}
              className={errors.sn ? "border-destructive focus-visible:ring-destructive" : ""}
            />
            {errors.sn && <span className="text-xs text-destructive">{errors.sn}</span>}
          </FormItemRow>
          <FormItemRow label="所属分组">
            <Select 
              value={groupId} 
              onValueChange={handleChange(setGroupId, "groupId")}
            >
              <SelectTrigger>
                <SelectValue placeholder="请选择所属分组" />
              </SelectTrigger>
              <SelectContent>
                {flatGroups.map(g => (
                  <SelectItem key={g.id} value={g.id}>
                    <span style={{ paddingLeft: `${g.level * 12}px` }}>{g.name}</span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </FormItemRow>
          <FormItemRow label="固件版本" htmlFor="firmware">
            <Input 
              id="firmware"
              placeholder="请输入固件版本"
              value={firmware}
              onChange={e => handleChange(setFirmware, "firmware")(e.target.value)}
            />
          </FormItemRow>
        </FormSection>

        <FormSection title="其他信息">
          <FormItemRow label="设备备注" align="start">
            <Textarea 
              placeholder="请输入设备备注（选填）"
              className="resize-none h-24"
              value={remark}
              onChange={e => handleChange(setRemark, "remark")(e.target.value)}
            />
          </FormItemRow>
        </FormSection>
      </div>
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
