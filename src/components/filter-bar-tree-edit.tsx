import { useState, useMemo } from "react"
import { Search, Plus, MoreHorizontal, ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type FilterBarTreeNodeType = {
  id: string
  name: string
  children?: FilterBarTreeNodeType[]
  [key: string]: any
}

export interface FilterBarTreeProps {
  title?: string
  searchPlaceholder?: string
  data: FilterBarTreeNodeType[]
  selectedId: string | null
  defaultExpandedIds?: string[]
  onSelect: (id: string) => void
  onAddTopLevel?: () => void
  onAddChild?: (parentId: string) => void
  onEdit?: (node: FilterBarTreeNodeType) => void
  onDelete?: (node: FilterBarTreeNodeType) => void
  className?: string
}

type InternalTreeNodeProps = {
  node: FilterBarTreeNodeType
  level: number
  selectedId: string | null
  expandedIds: Set<string>
  onSelect: (id: string) => void
  onToggle: (id: string) => void
  onEdit?: (node: FilterBarTreeNodeType) => void
  onDelete?: (node: FilterBarTreeNodeType) => void
  onAddChild?: (parentId: string) => void
}

function TreeNode({ node, level, selectedId, expandedIds, onSelect, onToggle, onEdit, onDelete, onAddChild }: InternalTreeNodeProps) {
  const isExpanded = expandedIds.has(node.id)
  const isSelected = selectedId === node.id
  const hasChildren = !!node.children?.length

  return (
    <div className="flex flex-col">
      <div
        className={`group/node flex items-center h-8 rounded-md cursor-pointer text-sm transition-colors hover:bg-muted/50 pr-1 ${isSelected ? "bg-primary/10 text-primary font-medium" : "text-foreground"}`}
        style={{ paddingLeft: `${level * 14 + 8}px` }}
        onClick={() => onSelect(node.id)}
      >
        {/* 展开/折叠箭头 */}
        <span
          className="w-4 h-4 mr-1 flex items-center justify-center text-muted-foreground shrink-0"
          onClick={(e) => { e.stopPropagation(); if (hasChildren) onToggle(node.id) }}
        >
          {hasChildren ? (isExpanded ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />) : <span className="w-3.5" />}
        </span>
        {/* 文件夹图标 */}
        {hasChildren && isExpanded
          ? <FolderOpen className="w-4 h-4 mr-1.5 text-muted-foreground shrink-0" />
          : <Folder className="w-4 h-4 mr-1.5 text-muted-foreground shrink-0" />}

        <span className="flex-1 truncate min-w-0">{node.name}</span>

        {/* 操作按钮（hover 时显示）*/}
        <span className="opacity-0 group-hover/node:opacity-100 flex items-center gap-0.5 ml-1 transition-opacity" onClick={(e) => e.stopPropagation()}>
          {onAddChild && (
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 text-muted-foreground hover:text-foreground"
              onClick={() => onAddChild(node.id)}
            >
              <Plus className="w-3 h-3" />
            </Button>
          )}
          {(onEdit || onDelete) && (
            <DropdownMenu>
              <DropdownMenuTrigger render={
                <Button variant="ghost" size="icon" className="h-5 w-5 text-muted-foreground hover:text-foreground">
                  <MoreHorizontal className="w-3 h-3" />
                </Button>
              } />
              <DropdownMenuContent align="end" className="w-28">
                {onEdit && <DropdownMenuItem onClick={() => onEdit(node)}>编辑分组</DropdownMenuItem>}
                {onDelete && <DropdownMenuItem className="text-destructive" onClick={() => onDelete(node)}>删除分组</DropdownMenuItem>}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </span>
      </div>

      {/* 子节点 */}
      {hasChildren && isExpanded && (
        <div>
          {node.children!.map(child => (
            <TreeNode
              key={child.id}
              node={child}
              level={level + 1}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={onToggle}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function FilterBarTree({
  title = "分组",
  searchPlaceholder = "搜索...",
  data,
  selectedId,
  defaultExpandedIds = [],
  onSelect,
  onAddTopLevel,
  onAddChild,
  onEdit,
  onDelete,
  className
}: FilterBarTreeProps) {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(defaultExpandedIds))
  const [search, setSearch] = useState("")

  // 展开/折叠树节点
  const toggleNode = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  // 过滤树节点（按名称搜索）
  const filterTree = (nodes: FilterBarTreeNodeType[], keyword: string): FilterBarTreeNodeType[] => {
    if (!keyword) return nodes
    return nodes.reduce<FilterBarTreeNodeType[]>((acc, node) => {
      const filteredChildren = filterTree(node.children || [], keyword)
      if (node.name.includes(keyword) || filteredChildren.length > 0) {
        acc.push({ ...node, children: filteredChildren })
      }
      return acc
    }, [])
  }

  const filteredData = useMemo(() => filterTree(data, search), [data, search])

  return (
    <div className={cn("w-64 shrink-0 border-r bg-background flex flex-col h-full", className)}>
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">{title}</span>
          {onAddTopLevel && (
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 text-muted-foreground hover:text-primary"
              onClick={onAddTopLevel}
            >
              <Plus className="w-3.5 h-3.5" />
            </Button>
          )}
        </div>
        <div className="relative">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={searchPlaceholder}
            className="h-7 pl-7 text-xs"
          />
        </div>
      </div>
      <ScrollArea className="flex-1 p-2">
        {filteredData.length === 0 ? (
          <div className="text-xs text-muted-foreground text-center py-4">未找到匹配的分组</div>
        ) : (
          filteredData.map(node => (
            <TreeNode
              key={node.id}
              node={node}
              level={0}
              selectedId={selectedId}
              expandedIds={expandedIds}
              onSelect={onSelect}
              onToggle={toggleNode}
              onEdit={onEdit}
              onDelete={onDelete}
              onAddChild={onAddChild}
            />
          ))
        )}
      </ScrollArea>
    </div>
  )
}
