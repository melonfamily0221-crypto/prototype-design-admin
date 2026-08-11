import { useState, useMemo } from "react"
import { FilterBarTree } from "@/components/filter-bar-tree-edit"
import { FilterBar, type FilterConfig } from "@/components/filter-bar"
import { DataTable } from "@/components/data-table"
import { TableToolbar } from "@/components/table-toolbar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
} from "@/components/ui/empty"
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, RefreshCw, Server, Trash } from "lucide-react"
import type { ColumnDef, RowSelectionState } from "@tanstack/react-table"
import type { Device, DeviceGroup, DeviceStatus } from "./types"
import { DeviceFormDrawer } from "./components/device-form-drawer"

// --- Mock Data ---
const mockGroups: DeviceGroup[] = [
  {
    id: "g1",
    name: "工厂A",
    children: [
      { id: "g1-1", name: "一号生产线" },
      {
        id: "g1-2", name: "二号生产线", children: [
          { id: "g1-2-1", name: "焊接区" },
          { id: "g1-2-2", name: "喷涂区" },
        ]
      },
    ]
  },
  {
    id: "g2",
    name: "工厂B",
    children: [
      { id: "g2-1", name: "测试车间" },
      { id: "g2-2", name: "组装车间" },
    ]
  },
  { id: "g3", name: "仓储中心" },
]

const initialDevices: Device[] = [
  { id: "D001", name: "温度传感器-01", sn: "SN-TEMP-001", firmware: "v2.3.1", groupId: "g1-1", status: "online", accessTime: "2024-01-15 08:00" },
  { id: "D002", name: "压力传感器-01", sn: "SN-PRES-001", firmware: "v1.8.0", groupId: "g1-1", status: "alarm", accessTime: "2024-01-16 09:30" },
  { id: "D003", name: "焊接机器人-A", sn: "SN-WLD-001", firmware: "v3.0.2", groupId: "g1-2-1", status: "online", accessTime: "2024-02-01 10:00" },
  { id: "D004", name: "喷涂机器人-A", sn: "SN-PNT-001", firmware: "v2.1.0", groupId: "g1-2-2", status: "offline", accessTime: "2024-02-05 11:00" },
  { id: "D005", name: "温度传感器-02", sn: "SN-TEMP-002", firmware: "v2.3.1", groupId: "g1-2", status: "online", accessTime: "2024-02-10 08:15" },
  { id: "D006", name: "AGV小车-01", sn: "SN-AGV-001", firmware: "v4.1.0", groupId: "g2-1", status: "online", accessTime: "2024-03-01 07:30" },
  { id: "D007", name: "组装机器人-A", sn: "SN-ASM-001", firmware: "v2.9.5", groupId: "g2-2", status: "online", accessTime: "2024-03-05 09:00" },
  { id: "D008", name: "货架扫描仪-01", sn: "SN-SCAN-001", firmware: "v1.2.3", groupId: "g3", status: "offline", accessTime: "2024-03-20 14:00" },
]

const statusConfig: Record<DeviceStatus, { label: string; variant: "default" | "secondary" | "destructive" }> = {
  online: { label: "在线", variant: "default" },
  offline: { label: "离线", variant: "secondary" },
  alarm: { label: "告警", variant: "destructive" },
}

function getAllGroupIds(group: DeviceGroup): string[] {
  const ids = [group.id]
  if (group.children) {
    group.children.forEach(c => ids.push(...getAllGroupIds(c)))
  }
  return ids
}

function findGroup(groups: DeviceGroup[], id: string): DeviceGroup | null {
  for (const g of groups) {
    if (g.id === id) return g
    if (g.children) {
      const r = findGroup(g.children, id)
      if (r) return r
    }
  }
  return null
}

export default function DeviceGroupList() {
  const [devices, setDevices] = useState<Device[]>(initialDevices)
  const [selectedGroupId, setSelectedGroupId] = useState<string | null>(null)
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)
  const [deleteGroupTarget, setDeleteGroupTarget] = useState<DeviceGroup | null>(null)
  const [batchDeleteOpen, setBatchDeleteOpen] = useState(false)
  
  // Group dialog states
  const [groupDialogOpen, setGroupDialogOpen] = useState(false)
  const [groupDialogMode, setGroupDialogMode] = useState<"addTop" | "addChild" | "edit">("addTop")
  const [groupFormName, setGroupFormName] = useState("")

  const selectedGroup = useMemo(() => {
    if (!selectedGroupId) return null
    return findGroup(mockGroups, selectedGroupId)
  }, [selectedGroupId])

  const visibleDevices = useMemo(() => {
    if (!selectedGroupId || !selectedGroup) return []
    const ids = getAllGroupIds(selectedGroup)
    return devices.filter(d => ids.includes(d.groupId))
  }, [devices, selectedGroupId, selectedGroup])

  const columns: ColumnDef<Device>[] = useMemo(() => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(v) => table.toggleAllPageRowsSelected(!!v)}
          aria-label="全选"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(v) => row.toggleSelected(!!v)}
          aria-label="选择行"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: "设备名称",
      cell: ({ row }) => (
        <Button
          variant="link"
          className="h-auto p-0 text-primary font-medium"
          onClick={() => { setEditingDevice(row.original); setDrawerOpen(true) }}
        >
          {row.original.name}
        </Button>
      )
    },
    { accessorKey: "sn", header: "设备序列号" },
    { accessorKey: "firmware", header: "固件版本" },
    {
      accessorKey: "groupId",
      header: "所属分组",
      cell: ({ row }) => findGroup(mockGroups, row.original.groupId)?.name ?? row.original.groupId
    },
    {
      accessorKey: "status",
      header: "状态",
      cell: ({ row }) => {
        const s = statusConfig[row.original.status]
        return <Badge variant={s.variant}>{s.label}</Badge>
      }
    },
    { accessorKey: "accessTime", header: "接入时间" },
    {
      id: "actions",
      header: () => <div className="text-center">操作</div>,
      cell: ({ row }) => (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="link"
            className="h-8 px-0 text-primary"
            onClick={() => { setEditingDevice(row.original); setDrawerOpen(true) }}
          >
            编辑
          </Button>
          <AlertDialog>
            <AlertDialogTrigger render={
              <Button variant="link" className="h-8 px-0 text-destructive">删除</Button>
            } />
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>确定要删除该设备吗？</AlertDialogTitle>
                <AlertDialogDescription>此操作无法撤销，设备将从系统中永久移除。</AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>取消</AlertDialogCancel>
                <AlertDialogAction onClick={() => {
                  setDevices(prev => prev.filter(d => d.id !== row.original.id))
                  toast.add({ title: "设备删除成功", type: "success" })
                }}>确定删除</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )
    },
  ], [])

  const searchFilters: FilterConfig[] = [
    { key: "name", label: "设备名称", type: "text", placeholder: "请输入设备名称" },
    { key: "sn", label: "设备序列号", type: "text", placeholder: "请输入设备序列号" },
    {
      key: "status",
      label: "设备状态",
      type: "select",
      options: [
        { label: "在线", value: "online" },
        { label: "离线", value: "offline" },
        { label: "告警", value: "alarm" },
      ]
    },
  ]

  const selectedCount = Object.keys(rowSelection).length

  return (
    <div className="flex flex-1 flex-col overflow-hidden">
      <div className="flex flex-1 overflow-hidden">

        {/* 左侧树形面板 */}
        <FilterBarTree
          title="设备分组"
          searchPlaceholder="搜索分组..."
          data={mockGroups}
          selectedId={selectedGroupId}
          defaultExpandedIds={["g1", "g2"]}
          onSelect={setSelectedGroupId}
          onAddTopLevel={() => {
            setGroupDialogMode("addTop")
            setGroupFormName("")
            setGroupDialogOpen(true)
          }}
          onAddChild={() => {
            setGroupDialogMode("addChild")
            setGroupFormName("")
            setGroupDialogOpen(true)
          }}
          onEdit={(node) => {
            setGroupDialogMode("edit")
            setGroupFormName(node.name)
            setGroupDialogOpen(true)
          }}
          onDelete={(node) => setDeleteGroupTarget(node as DeviceGroup)}
        />

        {/* 右侧内容区 */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {!selectedGroupId ? (
            <div className="flex flex-1 items-center justify-center p-8">
              <Empty>
                <EmptyHeader>
                  <EmptyMedia>
                    <Server className="w-12 h-12 text-muted-foreground/50" />
                  </EmptyMedia>
                  <EmptyTitle>请选择设备分组</EmptyTitle>
                  <EmptyDescription>在左侧选择对应分组以查看该分组下的设备列表</EmptyDescription>
                </EmptyHeader>
              </Empty>
            </div>
          ) : (
            <div className="flex flex-1 flex-col gap-4 p-4 md:gap-6 md:p-6 bg-muted/20 overflow-auto">
              <FilterBar filters={searchFilters} onSearch={() => {}} onReset={() => {}} />
              <div className="flex flex-col gap-4 rounded-xl border bg-card p-4 shadow-sm md:p-6 md:pt-4">
                <TableToolbar
                  title={`${selectedGroup?.name} - 设备列表`}
                  actions={[
                    {
                      key: "new",
                      label: "新增设备",
                      icon: <Plus className="mr-2 h-4 w-4" />,
                      onClick: () => { setEditingDevice(null); setDrawerOpen(true) },
                    },
                  ]}
                  extra={
                    <>
                      <Button variant="destructive" size="sm" onClick={() => {
                        if (selectedCount === 0) {
                          toast.add({ title: "请至少选择一条数据", type: "warning" })
                          return
                        }
                        setBatchDeleteOpen(true)
                      }}>
                        <Trash className="h-4 w-4 mr-1" />
                        批量删除
                      </Button>
                      <Button variant="outline" size="sm">
                        <RefreshCw className="h-4 w-4 mr-1" />刷新
                      </Button>
                    </>
                  }
                />
                {visibleDevices.length === 0 ? (
                  <Empty>
                    <EmptyHeader>
                      <EmptyMedia>
                        <Server className="w-8 h-8 text-muted-foreground/50" />
                      </EmptyMedia>
                      <EmptyTitle>暂无设备数据</EmptyTitle>
                      <EmptyDescription>当前分组下尚无设备，点击右上方新增设备进行添加</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  <DataTable
                    columns={columns}
                    data={visibleDevices}
                    rowSelection={rowSelection}
                    onRowSelectionChange={setRowSelection}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 批量删除设备弹窗 */}
      <AlertDialog open={batchDeleteOpen} onOpenChange={setBatchDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认批量删除？</AlertDialogTitle>
            <AlertDialogDescription>
              确认删除选中的 {selectedCount} 台设备吗？此操作无法撤销。
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                const toDeleteIds = Object.keys(rowSelection).map(i => visibleDevices[Number(i)]?.id).filter(Boolean)
                setDevices(prev => prev.filter(d => !toDeleteIds.includes(d.id)))
                setRowSelection({})
                setBatchDeleteOpen(false)
                toast.add({ title: `已删除 ${selectedCount} 台设备`, type: "success" })
              }}
            >
              确定删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 删除分组弹窗 */}
      <AlertDialog open={!!deleteGroupTarget} onOpenChange={(o) => !o && setDeleteGroupTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>确认删除分组？</AlertDialogTitle>
            <AlertDialogDescription>
              删除该分组将同步移除其下属所有设备关联关系，此操作无法恢复，确认删除？
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>取消</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                toast.add({ title: "分组删除成功", type: "success" })
                if (selectedGroupId === deleteGroupTarget?.id) setSelectedGroupId(null)
                setDeleteGroupTarget(null)
              }}
            >
              确定删除
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 分组表单弹窗 */}
      <Dialog open={groupDialogOpen} onOpenChange={setGroupDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {groupDialogMode === "addTop" && "新增一级分组"}
              {groupDialogMode === "addChild" && "新增子分组"}
              {groupDialogMode === "edit" && "编辑分组名称"}
            </DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="group-name" className="text-right">
                分组名称 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="group-name"
                value={groupFormName}
                onChange={(e) => setGroupFormName(e.target.value)}
                className="col-span-3"
                placeholder="请输入分组名称"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setGroupDialogOpen(false)}>取消</Button>
            <Button onClick={() => {
              if (!groupFormName.trim()) {
                toast.add({ title: "请输入分组名称", type: "warning" })
                return
              }
              toast.add({ title: "操作成功", type: "success" })
              setGroupDialogOpen(false)
            }}>
              确定
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* 设备抽屉 */}
      <DeviceFormDrawer
        open={drawerOpen}
        onOpenChange={setDrawerOpen}
        device={editingDevice}
        currentGroupId={selectedGroupId || undefined}
        groups={mockGroups}
        onSuccess={() => {}}
      />
    </div>
  )
}

