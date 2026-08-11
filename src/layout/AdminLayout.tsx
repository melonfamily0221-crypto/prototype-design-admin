import { AppSidebar, appSidebarData } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Outlet, useLocation, Link } from "react-router-dom"
import React from "react"
import { ThemeSwitcher } from "@/components/theme-switcher"

export default function AdminLayout() {
  const location = useLocation()
  
  let breadcrumbs: { title: string, url?: string }[] = []

  if (location.pathname === "/dashboard" || location.pathname === "/") {
    breadcrumbs = [{ title: "核心平台" }, { title: "仪表盘", url: "/dashboard" }]
  } else {
    // 1. Check navMain exact match or prefix match
    for (const group of appSidebarData.navMain) {
      let activeItem = group.items?.find((item) => item.url === location.pathname)
      
      if (!activeItem) {
        activeItem = group.items?.find((item) => item.url !== "#" && item.url !== "/" && location.pathname.startsWith(item.url + "/"))
      }

      if (activeItem) {
        breadcrumbs = [{ title: group.title }, { title: activeItem.title, url: activeItem.url }]
        if (location.pathname !== activeItem.url) {
          if (location.pathname.endsWith("/detail")) {
            breadcrumbs.push({ title: "详情" })
          } else {
            breadcrumbs.push({ title: "页面" })
          }
        }
        break
      }
    }
    
    // 2. Check projects exact match or prefix match
    if (breadcrumbs.length === 0) {
      let activeProject = appSidebarData.projects.find((p) => p.url === location.pathname)
      
      if (!activeProject) {
        activeProject = appSidebarData.projects.find((p) => p.url !== "#" && p.url !== "/" && location.pathname.startsWith(p.url + "/"))
      }

      if (activeProject) {
        breadcrumbs = [{ title: "项目组" }, { title: activeProject.name, url: activeProject.url }]
        if (location.pathname !== activeProject.url) {
          if (location.pathname.endsWith("/detail")) {
            breadcrumbs.push({ title: "详情" })
          } else {
            breadcrumbs.push({ title: "页面" })
          }
        }
      }
    }
  }

  if (breadcrumbs.length === 0) {
    breadcrumbs = [{ title: "系统管理" }, { title: "当前页面" }]
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4 !self-center" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
                  <React.Fragment key={index}>
                    <BreadcrumbItem className={index === 0 ? "hidden md:block" : ""}>
                      {index === breadcrumbs.length - 1 ? (
                        <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink render={<Link to={crumb.url || "#"} />}>
                          {crumb.title}
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                    {index < breadcrumbs.length - 1 && (
                      <BreadcrumbSeparator className="hidden md:block" />
                    )}
                  </React.Fragment>
                ))}
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="flex items-center gap-2">
            <ThemeSwitcher />
          </div>
        </header>
        <div className="flex flex-1 flex-col overflow-hidden">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}
