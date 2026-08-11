import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { FilterBar, type FilterConfig } from "@/components/filter-bar"
import { Card, CardContent } from "@/components/ui/card"
import { RefreshCcw, Settings2, Plus, Search, ChevronRight, Folder, File, X, FileSpreadsheet, Download, UploadCloud } from "lucide-react"
import { TableToolbar } from "@/components/table-toolbar"
import { DataTable } from "@/components/data-table"
import type { ColumnDef } from "@tanstack/react-table"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BaseFormDrawer, FormSection, FormItemRow } from "@/components/base-form-drawer"
import { BaseFormDialog } from "@/components/base-form-dialog"
import { BaseDeleteAlertDialog } from "@/components/base-delete-alert-dialog"
import { toast } from "@/components/ui/toast"
import {
  Attachment,
  AttachmentContent,
  AttachmentDescription,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentActions,
  AttachmentAction
} from "@/components/ui/attachment"

type Task = {
  id: string
  taskName: string
  inputFileSet: string
  inputFileCount: number
  outputDataset: string
  creator: string
  createTime: string
}

// 模拟数据
const mockData: Task[] = [
  {
    id: "1",
    taskName: "智能客服语料清洗任务",
    inputFileSet: "客服聊天记录_2024Q1",
    inputFileCount: 15420,
    outputDataset: "客服清洗后语料_v1",
    creator: "张三",
    createTime: "2024-03-21 10:23:45",
  },
  {
    id: "2",
    taskName: "商品评价情感分析抽样",
    inputFileSet: "电商评价数据_2023",
    inputFileCount: 8900,
    outputDataset: "评价正负向样本_2024",
    creator: "李四",
    createTime: "2024-03-20 15:45:12",
  },
]

const searchFilters: FilterConfig[] = [
  { key: "taskName", label: "任务名称", type: "text", placeholder: "请输入任务名称" },
  { key: "inputFileSet", label: "输入文件集", type: "text", placeholder: "请输入输入文件集" },
  { key: "outputDataset", label: "输出数据集", type: "text", placeholder: "请输入输出数据集" },
  { key: "createTime", label: "创建时间", type: "date-range", placeholder: "请选择时间范围" },
]

const getColumns = (
  onEdit: (task: Task) => void,
  onDelete: (task: Task) => void
): ColumnDef<Task>[] => [
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
  {
    accessorKey: "taskName",
    header: "任务名称",
    cell: ({ row }) => (
      <div className="font-medium text-primary cursor-pointer hover:underline">
        {row.getValue("taskName")}
      </div>
    ),
  },
  {
    accessorKey: "inputFileSet",
    header: "输入文件集",
  },
  {
    accessorKey: "inputFileCount",
    header: "输入文件数量",
  },
  {
    accessorKey: "outputDataset",
    header: "输出高质量数据集",
  },
  {
    accessorKey: "creator",
    header: "创建人",
  },
  {
    accessorKey: "createTime",
    header: "创建时间",
  },
  {
    id: "actions",
    header: "操作",
    cell: ({ row }) => {
      return (
        <div className="flex items-center gap-2">
          <Button variant="link" className="px-0" onClick={() => onEdit(row.original)}>编辑</Button>
          <Button variant="link" className="px-0">任务配置</Button>
          <Button variant="link" className="px-0 text-destructive" onClick={() => onDelete(row.original)}>删除</Button>
        </div>
      )
    },
  },
]

function EditTaskDialog({ task, onClose }: { task: Task | null, onClose: () => void }) {
  const [taskName, setTaskName] = useState("")
  
  useEffect(() => {
    if (task) {
      setTaskName(task.taskName)
    }
  }, [task])

  const handleSubmit = () => {
    if (!taskName.trim()) return
    console.log("提交修改任务:", { ...task, taskName })
    onClose()
  }

  const footer = (
    <>
      <Button variant="outline" onClick={onClose}>取消</Button>
      <Button onClick={handleSubmit}>保存更改</Button>
    </>
  )

  return (
    <BaseFormDialog
      open={!!task}
      onOpenChange={(open) => !open && onClose()}
      title="编辑任务"
      footer={footer}
    >
      <div className="grid grid-cols-4 items-center gap-4">
        <Label htmlFor="edit-name" className="text-right">
          任务名称
        </Label>
        <Input 
          id="edit-name" 
          value={taskName} 
          onChange={e => setTaskName(e.target.value)} 
          className="col-span-3" 
        />
      </div>
    </BaseFormDialog>
  )
}

interface CreateTaskSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

function CreateTaskSheet({ open, onOpenChange }: CreateTaskSheetProps) {
  const [fileSelectionType, setFileSelectionType] = useState("all")
  
  // 表单状态
  const [taskName, setTaskName] = useState("")
  const [taskDescription, setTaskDescription] = useState("")
  const [inputFileSet, setInputFileSet] = useState("")
  const [outputDataset, setOutputDataset] = useState("")

  // 错误状态
  const [errors, setErrors] = useState<{
    taskName?: string;
    inputFileSet?: string;
    outputDataset?: string;
  }>({})

  const handleSubmit = (action: "create" | "createAndConfig") => {
    const newErrors: any = {}
    if (!taskName.trim()) newErrors.taskName = "任务名称不能为空"
    if (!inputFileSet.trim()) newErrors.inputFileSet = "请输入或选择输入文件集"
    if (!outputDataset) newErrors.outputDataset = "请选择高质量数据集"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    // 校验通过，提交数据
    setErrors({})
    console.log("提交新建任务:", { taskName, taskDescription, inputFileSet, fileSelectionType, outputDataset, action })
    
    // 重置并关闭
    setTaskName("")
    setTaskDescription("")
    setInputFileSet("")
    setOutputDataset("")
    setFileSelectionType("all")
    onOpenChange(false)
  }

  const footer = (
    <>
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        取消
      </Button>
      <Button variant="secondary" onClick={() => handleSubmit("create")}>
        创建
      </Button>
      <Button onClick={() => handleSubmit("createAndConfig")}>
        创建并进入配置
      </Button>
    </>
  )

  return (
    <BaseFormDrawer 
      open={open} 
      onOpenChange={onOpenChange} 
      title="新建数据集开发任务"
      footer={footer}
    >
      {/* 第一组: 基础信息 */}
      <FormSection title="基础信息">
        <FormItemRow label="任务名称" required htmlFor="taskName">
          <Input 
            id="taskName" 
            placeholder="请输入任务名称" 
            value={taskName}
            onChange={e => { setTaskName(e.target.value); if (errors.taskName) setErrors(p => ({ ...p, taskName: undefined })) }}
            className={errors.taskName ? "border-destructive focus-visible:ring-destructive" : ""}
          />
          {errors.taskName && <span className="text-xs text-destructive mt-1">{errors.taskName}</span>}
        </FormItemRow>
        <FormItemRow label="任务描述" htmlFor="taskDescription" align="start">
          <Textarea 
            id="taskDescription" 
            placeholder="请输入任务描述" 
            className="resize-none" 
            value={taskDescription}
            onChange={e => setTaskDescription(e.target.value)}
          />
        </FormItemRow>
      </FormSection>

      {/* 第二组: 输入配置 */}
      <FormSection title="输入配置">
        <FormItemRow label="输入文件集" required>
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              className={`pl-8 ${errors.inputFileSet ? "border-destructive focus-visible:ring-destructive" : ""}`} 
              placeholder="搜索并选择文件集" 
              value={inputFileSet}
              onChange={e => { setInputFileSet(e.target.value); if (errors.inputFileSet) setErrors(p => ({ ...p, inputFileSet: undefined })) }}
            />
          </div>
          {errors.inputFileSet && <span className="text-xs text-destructive mt-1">{errors.inputFileSet}</span>}
        </FormItemRow>
        
        <FormItemRow label="文件选择方式" align="start">
          <RadioGroup value={fileSelectionType} onValueChange={setFileSelectionType} className="flex flex-row items-center gap-6 mt-2">
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="all" id="r1" />
              <Label htmlFor="r1" className="font-normal">全部文件</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="specific" id="r2" />
              <Label htmlFor="r2" className="font-normal">指定文件</Label>
            </div>
          </RadioGroup>
        </FormItemRow>

        {/* 指定文件选择器模拟 */}
        {fileSelectionType === "specific" && (
          <FormItemRow label=" " align="start">
            <div className="grid grid-cols-2 gap-4 border rounded-md h-[300px] w-full">
              <div className="border-r flex flex-col">
                <div className="p-2 border-b bg-muted/50 text-sm font-medium">选择文件</div>
                <ScrollArea className="flex-1 p-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                      <Folder className="h-4 w-4 text-primary" />
                      <span className="text-sm">2024Q1_Dataset</span>
                    </div>
                    <div className="ml-6 space-y-2">
                      <div className="flex items-center gap-2">
                        <Checkbox id="file1" />
                        <File className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="file1" className="text-sm font-normal">chat_log_01.json</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <Checkbox id="file2" />
                        <File className="h-4 w-4 text-muted-foreground" />
                        <Label htmlFor="file2" className="text-sm font-normal">chat_log_02.json</Label>
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </div>
              <div className="flex flex-col">
                <div className="p-2 border-b bg-muted/50 text-sm font-medium flex justify-between items-center">
                  <span>已选文件 (2)</span>
                  <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">清空</Button>
                </div>
                <ScrollArea className="flex-1 p-2">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between group rounded-md p-1 hover:bg-muted">
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">chat_log_01.json</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between group rounded-md p-1 hover:bg-muted">
                      <div className="flex items-center gap-2">
                        <File className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">chat_log_02.json</span>
                      </div>
                      <Button variant="ghost" size="icon" className="h-6 w-6 opacity-0 group-hover:opacity-100">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </ScrollArea>
              </div>
            </div>
          </FormItemRow>
        )}
      </FormSection>

      {/* 第三组: 输出配置 */}
      <FormSection title="输出配置">
        <FormItemRow label="输出目标">
          <div className="flex items-center h-9 text-sm">
            <span className="text-foreground">高质量数据集合</span>
          </div>
        </FormItemRow>
        <FormItemRow label="选择高质量数据集" required>
          <div className="flex flex-col gap-1 w-full">
            <Select 
              value={outputDataset} 
              onValueChange={v => { setOutputDataset(v); if (errors.outputDataset) setErrors(p => ({ ...p, outputDataset: undefined })) }}
            >
              <SelectTrigger className={errors.outputDataset ? "border-destructive focus-visible:ring-destructive" : ""}>
                <SelectValue placeholder="请选择高质量数据集" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dataset1">高质量语料集 A</SelectItem>
                <SelectItem value="dataset2">高质量语料集 B</SelectItem>
              </SelectContent>
            </Select>
            {errors.outputDataset && <span className="text-xs text-destructive">{errors.outputDataset}</span>}
          </div>
        </FormItemRow>
      </FormSection>
    </BaseFormDrawer>
  )
}

function ExcelImportSheet({ open, onOpenChange }: { open: boolean, onOpenChange: (open: boolean) => void }) {
  const [taskName, setTaskName] = useState("")
  const [description, setDescription] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const handleUploadClick = () => {
    const mockFile = new window.File(["dummy content"], "dataset_export_2024.xlsx", { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    setFile(mockFile)
  }

  const handleDownloadTemplate = () => {
    toast.add({ title: "模板开始下载...", type: "success" })
    const link = document.createElement("a")
    link.href = "data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,"
    link.download = "数据集导入模板.xlsx"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const handleSubmit = () => {
    if (!taskName) {
      toast.add({ title: "请输入任务名称", type: "warning" })
      return
    }
    if (!file) {
      toast.add({ title: "请选择要导入的Excel文件", type: "warning" })
      return
    }
    toast.add({ title: "导入任务已创建并开始执行", type: "success" })
    
    // reset state
    setTaskName("")
    setDescription("")
    setFile(null)
    onOpenChange(false)
  }

  const footer = (
    <>
      <Button variant="outline" onClick={() => onOpenChange(false)}>
        取消
      </Button>
      <Button onClick={handleSubmit}>
        开始导入
      </Button>
    </>
  )

  return (
    <BaseFormDrawer 
      open={open} 
      onOpenChange={onOpenChange} 
      title="Excel 导入数据集"
      description="上传 Excel 格式文件并自动创建高质量数据集"
      footer={footer}
    >
      <FormSection title="导入配置">
        <FormItemRow label="任务名称" required htmlFor="importTaskName">
          <Input 
            id="importTaskName" 
            placeholder="例如：2024第一季度销售数据导入" 
            value={taskName}
            onChange={e => setTaskName(e.target.value)}
          />
        </FormItemRow>
        
        <FormItemRow label="描述信息" htmlFor="importDescription" align="start">
          <Textarea 
            id="importDescription" 
            placeholder="简要描述该数据集的用途..." 
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="resize-none"
          />
        </FormItemRow>

        <FormItemRow label="上传 Excel 文件" required align="start">
          <div className="flex flex-col gap-2 w-full">
            <div className="flex items-center justify-end w-full">
              <Button variant="link" size="sm" className="h-auto p-0 text-primary" onClick={handleDownloadTemplate}>
                <Download className="w-4 h-4 mr-1" />
                下载模板
              </Button>
            </div>
            
            {!file ? (
              <div 
                className="mt-1 flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 hover:bg-muted/50 transition-colors cursor-pointer w-full"
                onClick={handleUploadClick}
              >
                <div className="rounded-full bg-primary/10 p-3 mb-3 flex items-center justify-center">
                  <UploadCloud className="h-6 w-6 text-primary" />
                </div>
                <p className="text-sm font-medium mb-1">点击或拖拽文件到此区域上传</p>
                <p className="text-xs text-muted-foreground">支持 .xlsx, .xls 格式，最大不超过 50MB</p>
              </div>
            ) : (
              <div className="mt-1 w-full">
                <Attachment state="done" orientation="horizontal" className="w-full max-w-[300px]">
                  <AttachmentMedia variant="icon">
                    <FileSpreadsheet className="text-green-600 h-6 w-6" />
                  </AttachmentMedia>
                  <AttachmentContent>
                    <AttachmentTitle>{file.name}</AttachmentTitle>
                    <AttachmentDescription>2.4 MB • Excel 工作簿</AttachmentDescription>
                  </AttachmentContent>
                  <AttachmentActions>
                    <AttachmentAction variant="ghost" size="icon-xs" onClick={(e) => { e.stopPropagation(); setFile(null); }}>
                      <X className="h-4 w-4" />
                    </AttachmentAction>
                  </AttachmentActions>
                </Attachment>
              </div>
            )}
          </div>
        </FormItemRow>
      </FormSection>
    </BaseFormDrawer>
  )
}

export default function DatasetDevelopment() {
  const [sheetOpen, setSheetOpen] = useState(false)
  const [importSheetOpen, setImportSheetOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [deletingTask, setDeletingTask] = useState<Task | null>(null)

  const columns = React.useMemo(() => getColumns(setEditingTask, setDeletingTask), [])

  const handleDelete = () => {
    if (!deletingTask) return
    console.log("确认删除任务:", deletingTask.taskName)
    setDeletingTask(null)
  }

  return (
    <div className="flex h-full flex-col gap-4 pt-4 px-4 pb-4">
      {/* 搜索区 */}
      <FilterBar 
        filters={searchFilters} 
        onSearch={(values) => console.log("Search values:", values)} 
        onReset={() => console.log("Reset search")} 
      />

      {/* 列表区 */}
      <Card className="flex flex-1 flex-col rounded-xl border shadow-sm">
        {/* 工具栏 */}
        <div className="px-4">
          <TableToolbar
            title="数据集开发"
            actions={[
              {
                key: "new",
                label: "新建任务",
                icon: <Plus className="mr-2 h-4 w-4" />,
                onClick: () => setSheetOpen(true),
              },
              {
                key: "import",
                label: "Excel导入",
                icon: <FileSpreadsheet className="mr-2 h-4 w-4" />,
                onClick: () => setImportSheetOpen(true),
                variant: "outline"
              },
            ]}
            extra={
              <>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <RefreshCcw className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="icon" className="h-8 w-8">
                  <Settings2 className="h-4 w-4" />
                </Button>
              </>
            }
          />
        </div>
        
        {/* 表格 */}
        <CardContent>
          <DataTable columns={columns} data={mockData} />
        </CardContent>
      </Card>

      <CreateTaskSheet open={sheetOpen} onOpenChange={setSheetOpen} />
      <ExcelImportSheet open={importSheetOpen} onOpenChange={setImportSheetOpen} />
      <EditTaskDialog task={editingTask} onClose={() => setEditingTask(null)} />

      <BaseDeleteAlertDialog
        open={!!deletingTask}
        onOpenChange={(open) => !open && setDeletingTask(null)}
        title="确认删除任务？"
        description={`删除任务 "${deletingTask?.taskName}" 后将无法恢复，确认要删除吗？`}
        onConfirm={handleDelete}
      />
    </div>
  )
}
