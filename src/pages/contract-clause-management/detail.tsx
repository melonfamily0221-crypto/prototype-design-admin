import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TableToolbar } from "@/components/table-toolbar"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { ArrowLeft, Edit, Trash2, Plus, FileText, Building2, Calendar, User, Clock, DollarSign } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { BaseDeleteAlertDialog } from "@/components/base-delete-alert-dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"

import type { Contract, Clause } from "./types"
import { ContractFormDrawer } from "./components/contract-form-drawer"
import { ClauseFormDrawer } from "./components/clause-form-drawer"

// --- Mock Data ---
const mockContract: Contract = {
  id: "c1",
  name: "2024年度云服务采购框架协议",
  code: "CT-2024-001",
  party: "星辰科技有限公司",
  amount: 1000000,
  status: "active",
  signDate: "2024-01-10",
  endDate: "2024-12-31",
  description: "本协议用于约定2024年度云服务采购相关事宜，包含基础计算资源、存储资源及相关技术支持服务。",
  creator: "张三",
  createTime: "2024-01-08 10:00",
}

const initialClauses: Clause[] = Array.from({ length: 5 }).map((_, i) => ({
  id: `cl${i + 1}`,
  contractId: "c1",
  sequence: `第${i + 1}条`,
  title: i === 0 ? "服务范围定义" : `条款标题-${i + 1}`,
  type: ["payment", "confidentiality", "breach", "other"][i % 4] as Clause["type"],
  content: `这是第${i + 1}条条款的详细内容概述，包含了双方在本次合作中的相关的各项约定。内容可能较长，在表格中会截断显示...`,
  remark: i % 2 === 0 ? "需法务重点复核" : undefined,
  creator: i % 2 === 0 ? "张三" : "李四",
  createTime: `2024-01-08 10:0${i % 10}`,
}))

export default function ContractClauseDetail() {
  const [contract] = useState<Contract>(mockContract)
  const [clauses, setClauses] = useState<Clause[]>(initialClauses)

  // Selection States
  const [clauseRowSelection, setClauseRowSelection] = useState({})

  // Drawer States
  const [contractDrawerOpen, setContractDrawerOpen] = useState(false)
  const [clauseDrawerOpen, setClauseDrawerOpen] = useState(false)
  const [editingClause, setEditingClause] = useState<Clause | null>(null)

  // Delete Alerts States
  const [deleteContext, setDeleteContext] = useState<{
    type: "contract" | "clause",
    items: any[],
    warning?: string
  } | null>(null)

  // --- Handlers ---
  const handleEditContract = () => {
    setContractDrawerOpen(true)
  }

  const handleEditClause = (clause: Clause) => {
    setEditingClause(clause)
    setClauseDrawerOpen(true)
  }

  const handleDelete = () => {
    if (!deleteContext) return
    const { type, items } = deleteContext
    const ids = items.map(item => item.id)

    if (type === "contract") {
      toast.add({ title: "合同已删除", type: "success" })
      // Typically we would redirect back to the list page here
      // window.history.back()
    } else {
      setClauses(prev => prev.filter(c => !ids.includes(c.id)))
      setClauseRowSelection({})
      toast.add({ title: "条款已删除", type: "success" })
    }
    setDeleteContext(null)
  }

  const handleBatchDeleteClauses = () => {
    const selectedIndices = Object.keys(clauseRowSelection).filter(k => (clauseRowSelection as any)[k])
    if (selectedIndices.length === 0) {
      toast.add({ title: "请至少选择一项进行删除", type: "warning" })
      return
    }
    const clausesToDelete = selectedIndices.map(i => clauses[Number(i)]).filter(Boolean)
    setDeleteContext({ type: "clause", items: clausesToDelete.map(c => c.id), warning: `即将删除选中的 ${clausesToDelete.length} 个条款` })
  }

  // --- Columns ---
  const getClauseColumns = (): ColumnDef<Clause>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    { accessorKey: "sequence", header: "条款序号" },
    {
      accessorKey: "title",
      header: "条款标题",
      cell: ({ row }) => (
        <div className="font-medium text-primary cursor-pointer hover:underline">
          {row.getValue("title")}
        </div>
      )
    },
    {
      accessorKey: "type",
      header: "条款类型",
      cell: ({ row }) => {
        const type = row.getValue("type") as string
        switch (type) {
          case "payment": return <Badge variant="outline" className="border-blue-500 text-blue-500">付款条款</Badge>
          case "confidentiality": return <Badge variant="outline" className="border-purple-500 text-purple-500">保密条款</Badge>
          case "breach": return <Badge variant="outline" className="border-red-500 text-red-500">违约条款</Badge>
          case "other": return <Badge variant="outline">其他</Badge>
          default: return null
        }
      }
    },
    {
      accessorKey: "content",
      header: "条款内容摘要",
      cell: ({ row }) => {
        const val = row.getValue("content") as string
        return <div className="max-w-[300px] truncate" title={val}>{val}</div>
      }
    },
    { accessorKey: "remark", header: "备注" },
    { accessorKey: "creator", header: "创建人" },
    { accessorKey: "createTime", header: "创建时间" },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="link" className="px-0" onClick={() => handleEditClause(row.original)}>编辑</Button>
          <Button
            variant="link"
            className="px-0 text-destructive"
            onClick={() => setDeleteContext({
              type: "clause",
              items: [row.original]
            })}
          >
            删除
          </Button>
        </div>
      ),
    },
  ]

  const clauseColumns = useMemo(() => getClauseColumns(), [])

  const InfoItem = ({ icon: Icon, label, value }: { icon: any, label: string, value: React.ReactNode }) => (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center text-sm text-muted-foreground">
        <Icon className="w-4 h-4 mr-2" />
        {label}
      </div>
      <div className="text-base font-medium">{value || "-"}</div>
    </div>
  )

  return (
    <div className="flex flex-col gap-6 pt-4 px-4 pb-8 max-w-7xl mx-auto w-full">
      {/* 头部导航与操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => window.history.back()}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <div className="flex items-center gap-3 flex-wrap">
              <h1 className="text-2xl font-bold tracking-tight">{contract.name}</h1>
              {contract.status === "draft" && <Badge variant="outline">草稿</Badge>}
              {contract.status === "active" && <Badge className="bg-green-500 hover:bg-green-600">生效中</Badge>}
              {contract.status === "expired" && <Badge variant="secondary">已到期</Badge>}
              {contract.status === "terminated" && <Badge variant="destructive">已终止</Badge>}
            </div>
            <p className="text-sm text-muted-foreground mt-1">合同编号：{contract.code}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleEditContract}>
            <Edit className="w-4 h-4 mr-2" />
            编辑合同
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteContext({
              type: "contract",
              items: [contract],
              warning: "删除此合同将同步清除其下所有条款记录，操作不可撤销"
            })}
          >
            <Trash2 className="w-4 h-4 mr-2" />
            删除合同
          </Button>
        </div>
      </div>

      {/* 基础信息 */}
      <Card className="rounded-xl border shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="text-lg flex items-center">
            <FileText className="w-5 h-5 mr-2 text-primary" />
            基础信息
          </CardTitle>
        </CardHeader>
        <Separator />
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-y-8 gap-x-6">
            <InfoItem icon={Building2} label="签约方" value={contract.party} />
            <InfoItem
              icon={DollarSign}
              label="合同金额 (元)"
              value={contract.amount ? <span className="text-orange-500 font-semibold">{contract.amount.toLocaleString()}</span> : "-"}
            />
            <InfoItem icon={Calendar} label="签约日期" value={contract.signDate} />
            <InfoItem icon={Calendar} label="到期日期" value={contract.endDate} />
            <InfoItem icon={User} label="创建人" value={contract.creator} />
            <InfoItem icon={Clock} label="创建时间" value={contract.createTime} />
            <div className="col-span-1 md:col-span-2 lg:col-span-4 flex flex-col gap-1.5">
              <div className="flex items-center text-sm text-muted-foreground">
                <FileText className="w-4 h-4 mr-2" />
                描述/摘要
              </div>
              <div className="text-sm bg-muted/30 p-4 rounded-md mt-1 leading-relaxed">
                {contract.description || "暂无描述"}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 合同条款列表 */}
      <Card className="flex flex-col rounded-xl border shadow-sm">
        <div className="px-4">
          <TableToolbar
            title="合同条款"
            actions={[
              {
                key: "new-clause",
                label: "新建条款",
                icon: <Plus className="mr-2 h-4 w-4" />,
                onClick: () => {
                  setEditingClause(null)
                  setClauseDrawerOpen(true)
                },
              },
            ]}
            extra={
              <>
                <Button variant="destructive" size="sm" onClick={handleBatchDeleteClauses}>
                  <Trash2 className="h-4 w-4 mr-1" />批量删除
                </Button>
              </>
            }
          />
        </div>
        <CardContent className="flex-1 overflow-auto p-0">
          {clauses.length === 0 ? (
            <div className="flex h-[200px] flex-col items-center justify-center text-muted-foreground bg-muted/10 border-t">
              <span className="text-sm">该合同暂无条款</span>
            </div>
          ) : (
            <div className="px-4 pb-4">
              <DataTable
                columns={clauseColumns}
                data={clauses}
                rowSelection={clauseRowSelection}
                onRowSelectionChange={setClauseRowSelection}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Drawers */}
      <ContractFormDrawer
        open={contractDrawerOpen}
        onOpenChange={setContractDrawerOpen}
        contract={contract}
      />

      <ClauseFormDrawer
        open={clauseDrawerOpen}
        onOpenChange={setClauseDrawerOpen}
        contractName={contract.name}
        clause={editingClause}
      />

      {/* Delete Dialog */}
      <BaseDeleteAlertDialog
        open={!!deleteContext}
        onOpenChange={(open) => !open && setDeleteContext(null)}
        title={deleteContext?.type === "contract" ? "删除合同？" : "删除条款？"}
        description={
          deleteContext?.warning
            ? `${deleteContext.warning}，确定要删除吗？`
            : `确定要删除此${deleteContext?.type === "contract" ? "合同" : "条款"}吗？操作不可撤销。`
        }
        onConfirm={handleDelete}
      />
    </div>
  )
}
