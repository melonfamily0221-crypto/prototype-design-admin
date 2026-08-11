import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"

export type FilterType = "text" | "select" | "date" | "date-range"

export interface FilterOption {
  label: string
  value: string
}

export interface FilterConfig {
  key: string
  label: string
  type: FilterType
  placeholder?: string
  options?: FilterOption[]
}

export interface FilterBarProps {
  filters: FilterConfig[]
  onSearch?: (values: Record<string, any>) => void
  onReset?: () => void
}

export function FilterBar({
  filters,
  onSearch,
  onReset,
}: FilterBarProps) {
  const [values, setValues] = React.useState<Record<string, any>>({})

  const handleChange = (key: string, value: any) => {
    setValues((prev) => ({ ...prev, [key]: value }))
  }

  const handleSearch = () => {
    onSearch?.(values)
  }

  const handleReset = () => {
    setValues({})
    onReset?.()
  }

  return (
    <Card>
      <CardContent>
        <div className="flex flex-col 2xl:flex-row gap-6 items-end w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 flex-1 w-full">
            {filters.map((filter) => (
              <div key={filter.key} className="flex flex-row items-center gap-3">
                <label className="text-sm font-medium shrink-0 w-[64px] text-right whitespace-nowrap">{filter.label}</label>
                <div className="flex-1 min-w-0">
                {filter.type === "text" ? (
                  <Input
                    placeholder={filter.placeholder}
                    value={values[filter.key] || ""}
                    onChange={(e) => handleChange(filter.key, e.target.value)}
                  />
                ) : filter.type === "date" ? (
                  <Popover>
                    <PopoverTrigger render={<Button variant="outline" className={cn("w-full justify-start text-left font-normal", !values[filter.key] && "text-muted-foreground")} />}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {values[filter.key] ? (
                        format(new Date(values[filter.key]), "PPP")
                      ) : (
                        <span>{filter.placeholder || "Pick a date"}</span>
                      )}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={values[filter.key] ? new Date(values[filter.key]) : undefined}
                        onSelect={(date) => handleChange(filter.key, date ? date.toISOString() : "")}
                      />
                    </PopoverContent>
                  </Popover>
                ) : filter.type === "date-range" ? (
                  <Popover>
                    <PopoverTrigger render={<Button variant="outline" className={cn("w-full justify-start text-left font-normal", !values[filter.key] && "text-muted-foreground")} />}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {values[filter.key]?.from ? (
                        values[filter.key].to ? (
                          <>
                            {format(values[filter.key].from, "LLL dd, y")} -{" "}
                            {format(values[filter.key].to, "LLL dd, y")}
                          </>
                        ) : (
                          format(values[filter.key].from, "LLL dd, y")
                        )
                      ) : (
                        <span>{filter.placeholder || "Pick a date range"}</span>
                      )}
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="range"
                        defaultMonth={values[filter.key]?.from}
                        selected={values[filter.key]}
                        onSelect={(range) => handleChange(filter.key, range)}
                        numberOfMonths={2}
                      />
                    </PopoverContent>
                  </Popover>
                ) : filter.type === "select" ? (
                  <Select
                    value={values[filter.key] || ""}
                    onValueChange={(val) => handleChange(filter.key, val)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={filter.placeholder}>
                        {values[filter.key]
                          ? filter.options?.find((opt) => opt.value === values[filter.key])?.label
                          : undefined}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {filter.options?.map((opt) => (
                        <SelectItem key={opt.value} value={opt.value}>
                          {opt.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ) : null}
              </div>
            </div>
          ))}
          </div>
          <div className="flex flex-row gap-2 shrink-0 justify-end w-full 2xl:w-auto">
            <Button variant="outline" onClick={handleReset}>
              重置
            </Button>
            <Button onClick={handleSearch}>
              搜索
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
