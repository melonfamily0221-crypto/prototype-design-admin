# DMS 管理后台原型系统

## 简介
本项目是一个基于现代前端技术栈构建的企业级管理后台原型系统。它主要聚焦于提供流畅且现代化的用户界面交互，当前已经实现了**控制台仪表盘 (Dashboard)** 与 **合同与条款管理** 等核心业务场景原型，并配备了高度定制化的主题系统。

## 技术栈
*   **核心框架**：[React 19](https://react.dev/) + TypeScript + [Vite 8](https://vitejs.dev/)
*   **路由**：[React Router DOM v7](https://reactrouter.com/)
*   **样式与组件**：
    *   [Tailwind CSS v4](https://tailwindcss.com/)
    *   [@base-ui/react](https://base-ui.com/) 作为无头组件基础
    *   提取与深度定制的 Shadcn UI 风格组件
    *   [Lucide React](https://lucide.dev/) (图标库)
*   **数据展示**：
    *   [@tanstack/react-table](https://tanstack.com/table/latest) (强大的无头表格库)
    *   [Recharts](https://recharts.org/) (可视化图表)

## 核心功能模块

### 1. 仪表盘 (Dashboard)
*   **指标概览**：顶部展示总收入、新客户数、活跃账号、增长率等关键数据卡片，附带增长趋势图标。
*   **趋势图表**：使用 Recharts 绘制的访客趋势堆叠面积图（Area Chart），具备平滑曲线过渡、多数据序列、透明渐变以及快捷的时间筛选按钮（如“最近3个月”、“最近30天”）。

### 2. 合同与条款管理
*   **复杂主从表联动**：上半部分为合同主列表，下半部分为选中合同的关联条款列表。
*   **高级筛选与工具栏**：支持多维度过滤（文本搜索、下拉筛选、时间范围），以及表格数据操作。
*   **抽屉式交互 (Drawer)**：合同的创建、编辑，条款的创建、编辑均采用右侧平滑弹出的侧边抽屉进行表单填写。
*   **级联与批量删除**：实现了基于选中的行进行批量删除操作，以及严格的删除二次确认（含危险操作红字提示）。

### 3. 主题系统与侧边栏
*   **灵活主题切换**：全局支持**浅色模式**和**深色模式**无缝切换，同时内置“默认”和“专业蓝”等多个色彩主色调配置。
*   **动态统一色彩**：侧边栏、按钮、图表 (Charts) 在深浅色模式下能够进行智能匹配与翻转。
*   **现代布局**：具备可折叠/展开、自适应移动端的侧边栏导航框架。

## 目录结构说明

```text
src/
├── components/          # 业务组合组件 (如 DataTable, FilterBar 等)
│   └── ui/              # 基础 UI 组件 (Button, Card, Chart, Drawer 等)
├── pages/               # 路由页面目录
│   ├── dashboard/                   # 仪表盘页面
│   └── contract-clause-management/  # 合同与条款管理页面及专属抽屉组件
├── themes/              # 颜色与主题相关的 CSS 变量配置
├── lib/                 # 工具函数 (如 Tailwind 类合并 cn 工具等)
└── ...
```

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev

# 3. 生产环境构建
npm run build
```
