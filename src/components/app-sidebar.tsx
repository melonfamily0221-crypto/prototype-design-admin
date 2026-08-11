"use client"

import * as React from "react"

import { NavMain } from "@/components/nav-main"
import { NavProjects } from "@/components/nav-projects"
import { NavUser } from "@/components/nav-user"
import { TeamSwitcher } from "@/components/team-switcher"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
  SidebarGroup,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar"
import { GalleryVerticalEndIcon, AudioLinesIcon, TerminalIcon, TerminalSquareIcon, BotIcon, BookOpenIcon, Settings2Icon, FrameIcon, PieChartIcon, MapIcon, LayoutDashboardIcon } from "lucide-react"

import { Link, useLocation } from "react-router-dom"

// This is sample data.
export const appSidebarData = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  teams: [
    {
      name: "星辰科技有限公司",
      logo: (
        <GalleryVerticalEndIcon
        />
      ),
      plan: "企业版",
    },
    {
      name: "云创工坊",
      logo: (
        <AudioLinesIcon
        />
      ),
      plan: "初创版",
    },
    {
      name: "个人开发者",
      logo: (
        <TerminalIcon
        />
      ),
      plan: "免费版",
    },
  ],
  navMain: [
    {
      title: "工作台",
      url: "#",
      icon: (
        <TerminalSquareIcon
        />
      ),
      isActive: true,
      items: [
        {
          title: "数据集开发",
          url: "/dataset-development",
        },
        {
          title: "合同与合同条款管理",
          url: "/contract-clause-management",
        },
        {
          title: "设备分组",
          url: "/device-group-list",
        },
        {
          title: "历史记录",
          url: "#",
        },
        {
          title: "星标项目",
          url: "#",
        },
        {
          title: "工作台设置",
          url: "#",
        },
      ],
    },
    {
      title: "基础模型",
      url: "#",
      icon: (
        <BotIcon
        />
      ),
      items: [
        {
          title: "创世模型",
          url: "#",
        },
        {
          title: "探索者模型",
          url: "#",
        },
        {
          title: "量子模型",
          url: "#",
        },
      ],
    },
    {
      title: "使用文档",
      url: "#",
      icon: (
        <BookOpenIcon
        />
      ),
      items: [
        {
          title: "系统介绍",
          url: "#",
        },
        {
          title: "快速入门",
          url: "#",
        },
        {
          title: "开发教程",
          url: "#",
        },
        {
          title: "更新日志",
          url: "#",
        },
      ],
    },
    {
      title: "系统设置",
      url: "#",
      icon: (
        <Settings2Icon
        />
      ),
      items: [
        {
          title: "常规设置",
          url: "#",
        },
        {
          title: "团队管理",
          url: "#",
        },
        {
          title: "账单信息",
          url: "#",
        },
        {
          title: "资源配额",
          url: "#",
        },
      ],
    },
  ],
  projects: [
    {
      name: "设计工程",
      url: "#",
      icon: (
        <FrameIcon
        />
      ),
    },
    {
      name: "销售与市场",
      url: "#",
      icon: (
        <PieChartIcon
        />
      ),
    },
    {
      name: "差旅服务",
      url: "#",
      icon: (
        <MapIcon
        />
      ),
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const location = useLocation()

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={appSidebarData.teams} />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton 
                tooltip="仪表盘" 
                isActive={location.pathname === "/dashboard" || location.pathname === "/"} 
                className="data-active:bg-sidebar-primary data-active:text-sidebar-primary-foreground data-active:hover:bg-sidebar-primary data-active:hover:text-sidebar-primary-foreground data-active:[&>svg]:text-sidebar-primary-foreground"
                render={<Link to="/dashboard" />}
              >
                <LayoutDashboardIcon />
                <span>仪表盘</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
        <NavMain items={appSidebarData.navMain} />
        <NavProjects projects={appSidebarData.projects} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={appSidebarData.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
