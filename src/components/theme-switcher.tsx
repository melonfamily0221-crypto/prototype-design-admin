import { Moon, Sun, Palette, Monitor, Check } from "lucide-react"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function ThemeSwitcher() {
  const { theme, setTheme, colorTheme, setColorTheme } = useTheme()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full focus-visible:ring-0 focus-visible:ring-offset-0">
            <Palette className="h-4 w-4" />
            <span className="sr-only">切换主题</span>
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="w-44">
        {/* 深浅模式 */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>深浅模式</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuItem onClick={() => setTheme("light")}>
          <Sun className="mr-2 h-4 w-4" />
          浅色
          {theme === "light" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          <Moon className="mr-2 h-4 w-4" />
          深色
          {theme === "dark" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          <Monitor className="mr-2 h-4 w-4" />
          跟随系统
          {theme === "system" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        {/* 颜色主题 */}
        <DropdownMenuGroup>
          <DropdownMenuLabel>颜色主题</DropdownMenuLabel>
        </DropdownMenuGroup>
        <DropdownMenuItem onClick={() => setColorTheme("default")}>
          <span className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-zinc-800" />
          默认
          {colorTheme === "default" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setColorTheme("blue")}>
          <span className="mr-2 flex h-4 w-4 items-center justify-center rounded-full bg-blue-600" />
          专业蓝
          {colorTheme === "blue" && <Check className="ml-auto h-4 w-4" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
