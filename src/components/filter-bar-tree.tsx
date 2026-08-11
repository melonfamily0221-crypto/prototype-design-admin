import { useState, useMemo } from "react"
import { Search, ChevronDown, ChevronRight, Folder, FolderOpen } from "lucide-react"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"

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
}

type InternalTreeNodeProps = {
  node: FilterBarTreeNodeType
  level: number
  selectedId: string | null
  expandedIds: Set<string>
  onSelect: (id: string) => void
  onToggle: (id: string) => void
}

function TreeNode({ node, level, selectedId, expandedIds, onSelect, onToggle }: InternalTreeNodeProps) {
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
    <div className="w-64 shrink-0 border-r bg-background flex flex-col h-full">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-semibold">{title}</span>
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
            />
          ))
        )}
      </ScrollArea>
    </div>
  )
}
