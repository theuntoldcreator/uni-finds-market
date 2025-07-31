import { useState } from 'react';
import { Search, Filter, ShoppingBag, Laptop, BookOpen, Home, Car, Shirt, Gamepad2, Heart, Plus } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const categories = [
  { id: 'all', name: 'All Items', icon: ShoppingBag, count: 127 },
  { id: 'electronics', name: 'Electronics', icon: Laptop, count: 45 },
  { id: 'books', name: 'Books & Study', icon: BookOpen, count: 32 },
  { id: 'furniture', name: 'Furniture', icon: Home, count: 18 },
  { id: 'vehicles', name: 'Vehicles', icon: Car, count: 12 },
  { id: 'clothing', name: 'Clothing', icon: Shirt, count: 28 },
  { id: 'gaming', name: 'Gaming', icon: Gamepad2, count: 15 },
];

interface MarketplaceSidebarProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  onCreateListing: () => void;
}

export function MarketplaceSidebar({ 
  selectedCategory, 
  onCategoryChange, 
  searchQuery, 
  onSearchChange,
  onCreateListing 
}: MarketplaceSidebarProps) {
  const { state } = useSidebar();
  const collapsed = state === 'collapsed';

  return (
    <Sidebar collapsible="icon" className={collapsed ? "w-16" : "w-80"}>
      <SidebarContent className="bg-marketplace-bg border-r">
        {!collapsed && (
          <>
            {/* Search Section */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-foreground font-semibold mb-3">
                Search & Filter
              </SidebarGroupLabel>
              <SidebarGroupContent className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    placeholder="Search items..."
                    value={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10 bg-background/50 border-border/50 focus:bg-background"
                  />
                </div>
                
                <Button 
                  onClick={onCreateListing}
                  className="w-full bg-gradient-accent hover:opacity-90 transition-opacity shadow-md"
                  size="lg"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Listing
                </Button>
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator className="my-4" />

            {/* Categories Section */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-foreground font-semibold mb-3">
                Categories
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {categories.map((category) => (
                    <SidebarMenuItem key={category.id}>
                      <SidebarMenuButton
                        onClick={() => onCategoryChange(category.id)}
                        className={`w-full justify-between hover:bg-marketplace-listing-hover transition-colors ${
                          selectedCategory === category.id 
                            ? 'bg-primary/10 text-primary border-l-2 border-primary' 
                            : 'text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <category.icon className="w-4 h-4" />
                          <span>{category.name}</span>
                        </div>
                        <Badge variant="secondary" className="text-xs">
                          {category.count}
                        </Badge>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <Separator className="my-4" />

            {/* Quick Actions */}
            <SidebarGroup>
              <SidebarGroupLabel className="text-foreground font-semibold mb-3">
                Quick Actions
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  <SidebarMenuItem>
                    <SidebarMenuButton className="w-full text-foreground hover:bg-marketplace-listing-hover">
                      <Heart className="w-4 h-4 mr-3" />
                      My Favorites
                      <Badge variant="secondary" className="ml-auto text-xs">3</Badge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton className="w-full text-foreground hover:bg-marketplace-listing-hover">
                      <ShoppingBag className="w-4 h-4 mr-3" />
                      My Listings
                      <Badge variant="secondary" className="ml-auto text-xs">5</Badge>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </>
        )}
        
        {/* Collapsed state - just icons */}
        {collapsed && (
          <div className="flex flex-col items-center space-y-4 p-4">
            <Button
              onClick={onCreateListing}
              size="icon"
              className="bg-gradient-accent hover:opacity-90"
            >
              <Plus className="w-4 h-4" />
            </Button>
            
            {categories.slice(0, 4).map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.id ? "default" : "ghost"}
                size="icon"
                onClick={() => onCategoryChange(category.id)}
                className="w-10 h-10"
              >
                <category.icon className="w-4 h-4" />
              </Button>
            ))}
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}