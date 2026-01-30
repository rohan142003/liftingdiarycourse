# UI Coding Standards

## Component Library: shadcn/ui Only

This project uses **shadcn/ui** as its sole UI component library. All UI elements must be built using shadcn/ui components.

## Rules

1. **No custom components.** Do not create custom UI components. Every UI element in the application must come from shadcn/ui.
2. **No third-party UI libraries.** Do not install or use any other component library (e.g., Material UI, Chakra UI, Ant Design, Radix primitives directly, Headless UI, etc.).
3. **No hand-rolled UI primitives.** Do not build buttons, dialogs, inputs, selects, dropdowns, tooltips, or any other standard UI element from scratch. Use the corresponding shadcn/ui component.
4. **Composition over creation.** Build pages and features by composing shadcn/ui components together. If a layout or pattern is needed, assemble it from existing shadcn/ui components rather than creating a new abstraction.
5. **Adding new shadcn/ui components.** When a component is needed that hasn't been added yet, install it via the shadcn/ui CLI:
   ```bash
   npx shadcn@latest add <component-name>
   ```
6. **Styling.** Use Tailwind CSS utility classes for layout, spacing, and any visual adjustments. Do not write custom CSS for component styling — rely on shadcn/ui's built-in theming and Tailwind classes.
7. **Theming.** Follow shadcn/ui's theming system using CSS variables defined in `globals.css`. Do not create parallel theming mechanisms.

## Available Components

Refer to the [shadcn/ui documentation](https://ui.shadcn.com/docs/components) for the full list of available components. Common ones include:

- Button, Input, Label, Textarea
- Card, Dialog, Sheet, Drawer
- Select, Checkbox, Radio Group, Switch
- Table, Tabs, Accordion
- Toast, Alert, Badge
- Form (with React Hook Form + Zod integration)
- Navigation Menu, Sidebar, Breadcrumb
- Calendar, Date Picker
- Dropdown Menu, Context Menu, Command

## Date Formatting

All date formatting must use **date-fns**. Do not use `Intl.DateTimeFormat`, `toLocaleDateString()`, `moment`, `dayjs`, or manual string concatenation for dates.

**Standard format:** `do MMM yyyy`

```
1st Jan 2025
2nd Mar 2025
1st Sep 2026
4th Jun 2024
```

Usage:

```ts
import { format } from "date-fns";

format(new Date(), "do MMM yyyy"); // "30th Jan 2026"
```

This is the only accepted date display format across the entire application.

## Summary

**Use shadcn/ui for everything. No exceptions.**
