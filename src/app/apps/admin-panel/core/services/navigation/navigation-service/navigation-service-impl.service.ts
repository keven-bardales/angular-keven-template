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
