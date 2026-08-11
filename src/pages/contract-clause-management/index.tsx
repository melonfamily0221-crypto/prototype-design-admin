import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { FilterBar, type FilterConfig } from "@/components/filter-bar"
import { Card, CardContent } from "@/components/ui/card"
import { TableToolbar } from "@/components/table-toolbar"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { RefreshCcw, Plus, Trash2 } from "lucide-react"
import { toast } from "@/components/ui/toast"
import { BaseDeleteAlertDialog } from "@/components/base-delete-alert-dialog"

import { useNavigate } from "react-router-dom"
import type { Contract, Clause } from "./types"
import { ContractFormDrawer } from "./components/contract-form-drawer"
import { ClauseFormDrawer } from "./components/clause-form-drawer"

// --- Mock Data ---
const initialContracts: Contract[] = Array.from({ length: 11 }).map((_, i) => ({
  id: `c${i + 1}`,
  name: i === 0 ? "2024年度云服务采购框架协议" : `测试合同-${i + 1}年度合作协议`,
  code: `CT-2024-${String(i + 1).padStart(3, '0')}`,
  party: i === 0 ? "星辰科技有限公司" : `合作方${i + 1}公司`,
  amount: 1000000 + i * 50000,
  status: ["draft", "active", "expired", "terminated"][i % 4] as Contract["status"],
  signDate: "2024-01-10",
  endDate: "2024-12-31",
  creator: i % 2 === 0 ? "张三" : "李四",
  createTime: `2024-01-08 10:0${i % 10}`,
}))

const initialClauses: Clause[] = Array.from({ length: 11 }).map((_, i) => ({
  id: `cl${i + 1}`,
  contractId: "c1", 
  sequence: `第${i + 1}条`,
  title: i === 0 ? "服务范围定义" : `条款标题-${i + 1}`,
  type: ["payment", "confidentiality", "breach", "other"][i % 4] as Clause["type"],
  content: `这是第${i + 1}条条款的详细内容概述，包含了双方在本次合作中的相关的各项约定...`,
  creator: i % 2 === 0 ? "张三" : "李四",
  createTime: `2024-01-08 10:0${i % 10}`,
}))

// --- Configurations ---
const searchFilters: FilterConfig[] = [
  { key: "name", label: "合同名称", type: "text", placeholder: "请输入合同名称" },
  { key: "code", label: "合同编号", type: "text", placeholder: "请输入合同编号" },
  { key: "party", label: "签约方", type: "text", placeholder: "请输入签约方" },
  {
    key: "status",
    label: "合同状态",
    type: "select",
    options: [
      { label: "全部", value: "" },
      { label: "草稿", value: "draft" },
      { label: "生效中", value: "active" },
      { label: "已到期", value: "expired" },
      { label: "已终止", value: "terminated" },
    ],
  },
  { key: "dateRange", label: "签约日期范围", type: "date-range", placeholder: "请选择时间范围" },
]

export default function ContractClauseManagement() {
  const navigate = useNavigate()
  // Data States
  const [contracts, setContracts] = useState<Contract[]>(initialContracts)
  const [clauses, setClauses] = useState<Clause[]>(initialClauses)
  
  // Selection States
  const [selectedContractId, setSelectedContractId] = useState<string | null>(null)
  const [contractRowSelection, setContractRowSelection] = useState({})
  const [clauseRowSelection, setClauseRowSelection] = useState({})

  // Drawer States
  const [contractDrawerOpen, setContractDrawerOpen] = useState(false)
  const [clauseDrawerOpen, setClauseDrawerOpen] = useState(false)
  const [editingContract, setEditingContract] = useState<Contract | null>(null)
  const [editingClause, setEditingClause] = useState<Clause | null>(null)

  // Delete Alerts States
  // target can be "contract" or "clause", and items is an array of IDs to delete
  const [deleteContext, setDeleteContext] = useState<{
    type: "contract" | "clause",
    items: any[],
    warning?: string
  } | null>(null)

  const selectedContract = useMemo(() => 
    contracts.find(c => c.id === selectedContractId) || null,
  [contracts, selectedContractId])

  const filteredClauses = useMemo(() => 
    clauses.filter(c => c.contractId === selectedContractId),
  [clauses, selectedContractId])

  // --- Handlers ---
  const handleEditContract = (contract: Contract) => {
    setEditingContract(contract)
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
      setContracts(prev => prev.filter(c => !ids.includes(c.id)))
      // Cascade delete clauses
      setClauses(prev => prev.filter(c => !ids.includes(c.contractId)))
      if (selectedContractId && ids.includes(selectedContractId)) {
        setSelectedContractId(null)
      }
      setContractRowSelection({})
      toast.add({ title: "合同及关联条款已删除", type: "success" })
    } else {
      setClauses(prev => prev.filter(c => !ids.includes(c.id)))
      setClauseRowSelection({})
      toast.add({ title: "条款已删除", type: "success" })
    }
    setDeleteContext(null)
  }

  // --- Columns ---
  const getContractColumns = (): ColumnDef<Contract>[] => [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={table.getIsAllPageRowsSelected()}
          onCheckedChange={(value) => {
            table.toggleAllPageRowsSelected(!!value)
            // setTimeout to wait for table internal state update, or handle selection better
            // In a real app we might use table.getSelectedRowModel() in a useEffect, but this is a simple mock
          }}
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
    {
      accessorKey: "name",
      header: "合同名称",
      cell: ({ row }) => (
        <div 
          className={`font-medium cursor-pointer hover:underline ${selectedContractId === row.original.id ? "text-primary font-bold" : ""}`}
          onClick={() => setSelectedContractId(row.original.id)}
        >
          {row.getValue("name")}
        </div>
      ),
    },
    { accessorKey: "code", header: "合同编号" },
    { accessorKey: "party", header: "签约方" },
    { 
      accessorKey: "amount", 
      header: "合同金额 (元)",
      cell: ({ row }) => {
        const val = row.getValue("amount") as number
        return val ? val.toLocaleString() : "-"
      }
    },
    {
      accessorKey: "status",
      header: "合同状态",
      cell: ({ row }) => {
        const status = row.getValue("status") as string
        switch (status) {
          case "draft": return <Badge variant="outline">草稿</Badge>
          case "active": return <Badge className="bg-green-500 hover:bg-green-600">生效中</Badge>
          case "expired": return <Badge variant="secondary">已到期</Badge>
          case "terminated": return <Badge variant="destructive">已终止</Badge>
          default: return null
        }
      }
    },
    { accessorKey: "signDate", header: "签约日期" },
    { accessorKey: "endDate", header: "到期日期" },
    { accessorKey: "creator", header: "创建人" },
    { accessorKey: "createTime", header: "创建时间" },
    {
      id: "actions",
      header: "操作",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button variant="link" className="px-0" onClick={() => navigate('/contract-clause-management/detail')}>详情</Button>
          <Button variant="link" className="px-0" onClick={() => handleEditContract(row.original)}>编辑</Button>
          <Button 
            variant="link" 
            className="px-0 text-destructive" 
            onClick={() => setDeleteContext({
              type: "contract",
              items: [row.original],
              warning: "删除此合同将同步清除其下所有条款记录，操作不可撤销"
            })}
          >
            删除
          </Button>
        </div>
      ),
    },
  ]

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
        return <div className="max-w-[200px] truncate" title={val}>{val}</div>
      }
    },
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

  // Columns memo
  const contractColumns = useMemo(() => getContractColumns(), [selectedContractId])
  const clauseColumns = useMemo(() => getClauseColumns(), [])

  const handleBatchDeleteContracts = () => {
    const selectedIndices = Object.keys(contractRowSelection).filter(k => (contractRowSelection as any)[k])
    if (selectedIndices.length === 0) {
      toast.add({ title: "请至少选择一项进行删除", type: "warning" })
      return
    }
    const contractsToDelete = selectedIndices.map(i => contracts[Number(i)]).filter(Boolean)
    setDeleteContext({ type: "contract", items: contractsToDelete.map(c => c.id), warning: `即将删除选中的 ${contractsToDelete.length} 个合同及其关联条款` })
  }

  const handleBatchDeleteClauses = () => {
    const selectedIndices = Object.keys(clauseRowSelection).filter(k => (clauseRowSelection as any)[k])
    if (selectedIndices.length === 0) {
      toast.add({ title: "请至少选择一项进行删除", type: "warning" })
      return
    }
    const clausesToDelete = selectedIndices.map(i => filteredClauses[Number(i)]).filter(Boolean)
    setDeleteContext({ type: "clause", items: clausesToDelete.map(c => c.id), warning: `即将删除选中的 ${clausesToDelete.length} 个条款` })
  }

  return (
    <div className="flex flex-col gap-4 pt-4 px-4 pb-4">
      {/* 搜索区 */}
      <FilterBar 
        filters={searchFilters} 
        onSearch={(values) => console.log("Search values:", values)} 
        onReset={() => console.log("Reset search")} 
      />

      {/* 合同主表格区 */}
      <Card className="flex flex-col rounded-xl border shadow-sm">
        <div className="px-4">
          <TableToolbar
            title="合同列表"
            actions={[
              {
                key: "new",
                label: "新建合同",
                icon: <Plus className="mr-2 h-4 w-4" />,
                onClick: () => {
                  setEditingContract(null)
                  setContractDrawerOpen(true)
                },
              },
            ]}
            extra={
              <>
                <Button variant="destructive" size="sm" onClick={handleBatchDeleteContracts}>
                  <Trash2 className="h-4 w-4 mr-1" />批量删除
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCcw className="h-4 w-4 mr-1" />刷新
                </Button>
              </>
            }
          />
        </div>
        <CardContent className="flex-1 overflow-auto">
          {contracts.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">暂无合同数据</div>
          ) : (
            <DataTable columns={contractColumns} data={contracts} rowSelection={contractRowSelection} onRowSelectionChange={setContractRowSelection} />
          )}
        </CardContent>
      </Card>



      {/* 合同条款从表格区 */}
      <Card className="flex flex-col rounded-xl border shadow-sm bg-muted/10">
        <div className="px-4">
          <TableToolbar
            title={selectedContract ? `${selectedContract.name} - 条款列表` : "条款列表"}
            actions={selectedContract ? [
              {
                key: "new-clause",
                label: "新建条款",
                icon: <Plus className="mr-2 h-4 w-4" />,
                onClick: () => {
                  setEditingClause(null)
                  setClauseDrawerOpen(true)
                },
              },
            ] : []}
            extra={selectedContract ? (
              <>
                <Button variant="destructive" size="sm" onClick={handleBatchDeleteClauses}>
                  <Trash2 className="h-4 w-4 mr-1" />批量删除
                </Button>
                <Button variant="outline" size="sm">
                  <RefreshCcw className="h-4 w-4 mr-1" />刷新
                </Button>
              </>
            ) : null}
          />
        </div>
        <CardContent className="flex-1 overflow-auto">
          {!selectedContractId ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground bg-background rounded-md border border-dashed">
              <span className="text-sm">请在上方选择一份合同以查看其条款</span>
            </div>
          ) : filteredClauses.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-muted-foreground bg-background rounded-md border border-dashed">
              <span className="text-sm">该合同暂无条款</span>
            </div>
          ) : (
             <DataTable columns={clauseColumns} data={filteredClauses} rowSelection={clauseRowSelection} onRowSelectionChange={setClauseRowSelection} />
          )}
        </CardContent>
      </Card>

      {/* Drawers */}
      <ContractFormDrawer 
        open={contractDrawerOpen}
        onOpenChange={setContractDrawerOpen}
        contract={editingContract}
      />

      <ClauseFormDrawer 
        open={clauseDrawerOpen}
        onOpenChange={setClauseDrawerOpen}
        contractName={selectedContract?.name || ""}
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
