import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, shareReplay, take, takeUntil, tap } from 'rxjs';
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
   * @returns Observable that emits the loaded navigation items
   */
  public loadNavigationItems(): Observable<NavigationItem[]> {
    try {
      // Simulate async loading (replace with actual API call)
      return this.fetchNavigationItemsFromSource()
        .pipe(
          shareReplay(1),
          take(1),
          tap(items => {
            this.navigationItemsSubject.next(items);
          })
        );
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
        label: 'Users',
        icon: 'people',
        children: [
          new NavigationItem({
            type: 'item',
            label: 'User List',
            route: '/admin-panel/users/user-management/list'
          }),
          new NavigationItem({
            type: 'item',
            label: 'Create User',
            route: '/admin-panel/users/create-user'
          }),
          new NavigationItem({
            type: 'item',
            label: 'Roles & Permissions',
            route: '/admin-panel/users/roles'
          })
        ]
      }),
    ];
  }

  /**
   * Simulates fetching navigation items from an external source
   * Replace this method with actual API calls to your backend
   * @private
   * @returns Observable that emits navigation items
   */
  private fetchNavigationItemsFromSource(): Observable<NavigationItem[]> {
    // Simulate network delay
    return new Observable<NavigationItem[]>(observer => {
      setTimeout(() => {
        observer.next(this.createDefaultNavigationItems());
        observer.complete();
      }, 1000);
    });
  }
}
