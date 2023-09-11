export interface HierarchyItem{
    title: String, 
    prefix: String, 
    children: HierarchyItem[]
}

export interface SidebarHierarchy{
    items: HierarchyItem[],
}