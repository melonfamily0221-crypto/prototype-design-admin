# 项目专属规则 (Project Rules)

## 1. 组件使用规范 (Component Usage)
- **严格基于现有组件生成**：所有的页面及布局必须完全基于项目现有的 UI 组件（例如 `src/components/ui/` 目录下的 shadcn 组件）进行搭建与组装。
- **禁止使用原生组件及原生表现行为**：严禁在页面中直接使用原生 HTML 元素（如 `<button>`, `<input>`, `<table>`, `<select>` 等）。任何交互及展示必须通过引入现成的封装组件来实现。**特别注意：严禁通过向封装组件（如 `<Input />`）传递特定 type（如 `type="date"`, `type="time"`, `type="color"` 等）来触发浏览器原生的控件渲染，这类复杂交互必须使用纯 React 驱动的自定义组件（如基于 Popover + Calendar 组装的 DatePicker）来实现。**
- **禁止修改第三方 UI 组件**：严禁修改 `src/components/ui/` 目录下通过 shadcn/ui 安装的任何基础组件。如果需要调整样式或行为，应通过传入 className 或在业务层进行封装来实现，保持基础组件库的纯净。
- **优先使用现有组件**：生成新页面时，需优先使用现有组件，只有在找不到合适组件的情况下才能新建。

## 2. AI 助手行为规范 (AI Assistant Behavior)
- **强制组件嗅探 (Mandatory Component Sniffing)**：在开始编写任何新页面或复杂区块的布局代码之前，AI 必须先使用工具（如 `list_dir` 或搜索工具）主动扫描 `src/components/` 目录，确认是否已经存在相关的业务级封装组件（例如 `table-toolbar`, `filter-bar`, `base-form-drawer` 等）。严禁在未经充分搜索确认的情况下，直接使用基础 UI 组件进行手写拼凑。
- **模板优先参考 (Template Reference)**：开发新页面时，应优先检索并参考现有成熟业务页面（如 `contract-clause-management` 等）的代码结构，学习并复用其组件组合模式。
- **违反规则处理**：如果违反了项目规则，必须主动进行提示，并立即终止当前响应。

## 3. Base UI 组件使用规范 (Base UI Constraints)
- **避免使用 asChild**：项目底层无头组件库采用的是 `@base-ui/react` 而非 Radix UI。Base UI 不支持 Radix 风格的 `asChild` 属性。在替换组件默认触发器（Trigger）等元素时，必须使用 `render={<YourComponent />}` 属性模式，严禁使用 `asChild`。
- **严格遵守 Context 结构**：Base UI 对组件结构的合法性校验非常严格（例如 `Menu.GroupLabel` 必须包裹在 `Menu.Group` 内部，否则会引发 MenuGroupContext is missing 的报错）。拼装复杂组件时，必须确保层级结构严格遵照 Base UI 文档。
