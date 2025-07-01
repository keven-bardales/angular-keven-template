import { BehaviorSubject, Observable } from 'rxjs';
import { NavigationItem } from '../../../types/navigation/navigation-item.type';

/**
 * Navigation Service Interface
 * Simple interface that provides navigation items for the admin panel
 */
export interface INavigationService {
  /**
   * Observable that emits the current navigation items
   * Updates automatically when the navigation items change
   */
  readonly navigationItems$: Observable<NavigationItem[]>;

  /**
   * Gets all current navigation items (snapshot)
   * @returns Current navigation items array
   */
  getCurrentNavigationItems(): NavigationItem[];

  /**
   * Loads navigation items from the data source
   * @returns Observable that emits the loaded navigation items
   */
  loadNavigationItems(): Observable<NavigationItem[]>;

  /**
   * Manually sets the navigation items
   * @param items - Array of navigation items to set
   */
  setNavigationItems(items: NavigationItem[]): void;
}
