import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { NavigationItem } from '../../../types/navigation/navigation-item.type';
import { INavigationService } from './navigation-service.interface';

/**
 * Navigation Service Implementation
 * Provides navigation items for the admin panel with reactive updates
 */
@Injectable({
  providedIn: 'root'
})
export class NavigationService implements INavigationService {

  // Private subject to manage navigation items state
  private navigationItemsSubject = new BehaviorSubject<NavigationItem[]>([]);

  /**
   * Observable that emits the current navigation items
   * Updates automatically when the navigation items change
   */
  public readonly navigationItems$: Observable<NavigationItem[]> = this.navigationItemsSubject.asObservable();

  constructor() {
    // Initialize with default navigation items
    this.initializeDefaultNavigationItems();
  }

  /**
   * Gets all current navigation items (snapshot)
   * @returns Current navigation items array
   */
  public getCurrentNavigationItems(): NavigationItem[] {
    return this.navigationItemsSubject.value;
  }

  /**
   * Loads navigation items from the data source
   * @returns Promise that resolves with the loaded navigation items
   */
  public async loadNavigationItems(): Promise<NavigationItem[]> {
    try {
      // Simulate async loading (replace with actual API call)
      const items = await this.fetchNavigationItemsFromSource();

      // Update the subject with new items
      this.navigationItemsSubject.next(items);

      return items;
    } catch (error) {
      console.error('Error loading navigation items:', error);
      throw error;
    }
  }

  /**
   * Manually sets the navigation items
   * @param items - Array of navigation items to set
   */
  public setNavigationItems(items: NavigationItem[]): void {
    this.navigationItemsSubject.next([...items]); // Create a copy to avoid reference issues
  }

  /**
   * Initializes the service with default navigation items
   * @private
   */
  private initializeDefaultNavigationItems(): void {
    const defaultItems = this.createDefaultNavigationItems();
    this.setNavigationItems(defaultItems);
  }

  /**
   * Creates the default navigation items structure
   * @private
   * @returns Array of default navigation items
   */
  private createDefaultNavigationItems(): NavigationItem[] {
    return [
      // Principal Section
      new NavigationItem({
        type: 'section',
        label: 'Principal'
      }),

      new NavigationItem({
        type: 'itemWithIcon',
        label: 'Dashboard',
        icon: 'dashboard',
        route: '/admin/dashboard'
      }),

      new NavigationItem({
        type: 'itemWithIcon',
        label: 'Users',
        icon: 'people',
        children: [
          new NavigationItem({
            type: 'item',
            label: 'User List',
            route: '/admin/users'
          }),
          new NavigationItem({
            type: 'item',
            label: 'Create User',
            route: '/admin/users/create'
          }),
          new NavigationItem({
            type: 'item',
            label: 'Roles & Permissions',
            route: '/admin/users/roles'
          })
        ]
      }),

      // Management Section
      new NavigationItem({
        type: 'section',
        label: 'Management'
      }),

      new NavigationItem({
        type: 'itemWithIcon',
        label: 'Products',
        icon: 'inventory',
        children: [
          new NavigationItem({
            type: 'item',
            label: 'Product Catalog',
            route: '/admin/products'
          }),
          new NavigationItem({
            type: 'item',
            label: 'Categories',
            route: '/admin/products/categories'
          }),
          new NavigationItem({
            type: 'item',
            label: 'Inventory',
            route: '/admin/products/inventory'
          })
        ]
      }),

      new NavigationItem({
        type: 'itemWithIcon',
        label: 'Sales',
        icon: 'shopping_cart',
        children: [
          new NavigationItem({
            type: 'item',
            label: 'Orders',
            route: '/admin/sales/orders'
          }),
          new NavigationItem({
            type: 'item',
            label: 'Reports',
            route: '/admin/sales/reports'
          }),
          new NavigationItem({
            type: 'item',
            label: 'Analytics',
            route: '/admin/sales/analytics'
          })
        ]
      }),

      new NavigationItem({
        type: 'itemWithIcon',
        label: 'Customers',
        icon: 'group',
        children: [
          new NavigationItem({
            type: 'item',
            label: 'Customer List',
            route: '/admin/customers'
          }),
          new NavigationItem({
            type: 'item',
            label: 'Customer Groups',
            route: '/admin/customers/groups'
          })
        ]
      }),

      // Configuration Section
      new NavigationItem({
        type: 'section',
        label: 'Configuration'
      }),

      new NavigationItem({
        type: 'itemWithIcon',
        label: 'Settings',
        icon: 'settings',
        children: [
          new NavigationItem({
            type: 'item',
            label: 'General Settings',
            route: '/admin/settings/general'
          }),
          new NavigationItem({
            type: 'item',
            label: 'Security',
            route: '/admin/settings/security'
          }),
          new NavigationItem({
            type: 'item',
            label: 'Email Configuration',
            route: '/admin/settings/email'
          }),
          new NavigationItem({
            type: 'item',
            label: 'Integrations',
            route: '/admin/settings/integrations',
            hidden: () => {
              // Example: Hide based on user role or feature flags
              return false; // Change this logic as needed
            }
          })
        ]
      }),

      new NavigationItem({
        type: 'itemWithIcon',
        label: 'System',
        icon: 'computer',
        children: [
          new NavigationItem({
            type: 'item',
            label: 'System Status',
            route: '/admin/system/status'
          }),
          new NavigationItem({
            type: 'item',
            label: 'Logs',
            route: '/admin/system/logs'
          }),
          new NavigationItem({
            type: 'item',
            label: 'Database',
            route: '/admin/system/database'
          })
        ]
      }),

      // Help Section
      new NavigationItem({
        type: 'section',
        label: 'Support'
      }),

      new NavigationItem({
        type: 'itemWithIcon',
        label: 'Help & Documentation',
        icon: 'help',
        route: '/admin/help'
      }),

      new NavigationItem({
        type: 'itemWithIcon',
        label: 'Contact Support',
        icon: 'support_agent',
        route: '/admin/support'
      })
    ];
  }

  /**
   * Simulates fetching navigation items from an external source
   * Replace this method with actual API calls to your backend
   * @private
   * @returns Promise that resolves with navigation items
   */
  private async fetchNavigationItemsFromSource(): Promise<NavigationItem[]> {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // In a real implementation, this would be an HTTP call to your API
    // Example:
    // const response = await this.http.get<NavigationItemDto[]>('/api/navigation').toPromise();
    // return response.map(dto => this.mapDtoToNavigationItem(dto));

    // For now, return the default items
    return this.createDefaultNavigationItems();
  }
}
