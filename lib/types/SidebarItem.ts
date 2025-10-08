export interface SidebarItem {
  title: string
  href?: string
  icon: any
  badge?: string
  children?: SidebarItem[]
}