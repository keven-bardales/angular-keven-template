import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterLink } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subject } from 'rxjs';
import { map, shareReplay, takeUntil } from 'rxjs/operators';
import { NavigationItem } from '../../../types/navigation/navigation-item.type';
import { NavigationService } from '../../../services/navigation/navigation-service/navigation-service-impl.service';
import { NzContentComponent } from 'ng-zorro-antd/layout';
import { RouterModule } from '@angular/router';
import { NzHeaderComponent } from 'ng-zorro-antd/layout';
import { NzLayoutComponent } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzSiderComponent } from 'ng-zorro-antd/layout';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    NzContentComponent,
    RouterModule,
    NzHeaderComponent,
    NzLayoutComponent,
    NzButtonModule,
    NzSiderComponent,
    NzIconModule,
    NzMenuModule,
  ],
  template: `
    <nz-layout class="app-layout">
      <nz-sider
        class="menu-sidebar"
        nzCollapsible
        nzWidth="256px"
        nzBreakpoint="md"
        [(nzCollapsed)]="isCollapsed"
        [nzTrigger]="null"
      >
        <div class="sidebar-logo">
          <a href="https://ng.ant.design/" target="_blank">
            <img src="https://ng.ant.design/assets/img/logo.svg" alt="logo" />
            <h1>Ant Design of Angular</h1>
          </a>
        </div>
        <ul nz-menu nzTheme="dark" nzMode="inline" [nzInlineCollapsed]="isCollapsed">
          <li nz-submenu nzOpen nzTitle="Dashboard" nzIcon="dashboard">
            <ul>
              <li nz-menu-item nzMatchRouter>
                <a routerLink="/welcome">Welcome</a>
              </li>
              <li nz-menu-item nzMatchRouter>
                <a>Monitor</a>
              </li>
              <li nz-menu-item nzMatchRouter>
                <a>Workplace</a>
              </li>
            </ul>
          </li>
          <li nz-submenu nzOpen nzTitle="Form" nzIcon="form">
            <ul>
              <li nz-menu-item nzMatchRouter>
                <a>Basic Form</a>
              </li>
            </ul>
          </li>
        </ul>
      </nz-sider>
      <nz-layout>
        <nz-header>
          <div class="app-header">
            <span class="header-trigger" (click)="isCollapsed = !isCollapsed">
              <nz-icon class="trigger" [nzType]="isCollapsed ? 'menu-unfold' : 'menu-fold'" />
            </span>
          </div>
        </nz-header>
        <nz-content>
          <div class="inner-content">
            <router-outlet></router-outlet>
          </div>
        </nz-content>
      </nz-layout>
    </nz-layout>
  `,
  styles: [
    `
      :host {
        display: flex;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      .app-layout {
        height: 100vh;
      }

      .menu-sidebar {
        position: relative;
        z-index: 10;
        min-height: 100vh;
        box-shadow: 2px 0 6px rgba(0, 21, 41, 0.35);
      }

      .header-trigger {
        height: 64px;
        padding: 20px 24px;
        font-size: 20px;
        cursor: pointer;
        transition: all 0.3s, padding 0s;
      }

      .trigger:hover {
        color: #1890ff;
      }

      .sidebar-logo {
        position: relative;
        height: 64px;
        padding-left: 24px;
        overflow: hidden;
        line-height: 64px;
        background: #001529;
        transition: all 0.3s;
      }

      .sidebar-logo img {
        display: inline-block;
        height: 32px;
        width: 32px;
        vertical-align: middle;
      }

      .sidebar-logo h1 {
        display: inline-block;
        margin: 0 0 0 20px;
        color: #fff;
        font-weight: 600;
        font-size: 14px;
        font-family: Avenir, Helvetica Neue, Arial, Helvetica, sans-serif;
        vertical-align: middle;
      }

      nz-header {
        padding: 0;
        width: 100%;
        z-index: 2;
      }

      .app-header {
        position: relative;
        height: 64px;
        padding: 0;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);
      }

      nz-content {
        margin: 24px;
      }

      .inner-content {
        padding: 24px;
        background: #fff;
        height: 100%;
      }
    `,
  ],
})
export class AdminLayout implements OnInit {
  isCollapsed = false;
  private breakpointObserver = new BreakpointObserver();
  private destroy$ = new Subject<void>();

  private navigationService = inject(NavigationService);
  private router = inject(Router);

  // Reactive state para el sidenav
  public sidenavOpened = signal(true);

  // Navigation items from service
  public navigationItems: NavigationItem[] = [];

  // Observable para detectar dispositivos móviles
  public isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  ngOnInit(): void {
    // Subscribe to navigation items from service
    this.navigationService.navigationItems$.pipe(takeUntil(this.destroy$)).subscribe(items => {
      this.navigationItems = items;
    });

    // Ajustar el estado inicial del sidenav basado en el tamaño de pantalla
    this.isHandset$.pipe(takeUntil(this.destroy$)).subscribe(isHandset => {
      this.sidenavOpened.set(!isHandset);
    });

    // Load navigation items (optional, they're already loaded by default)
    this.loadNavigationItems();
  }

  ngOnDestroy(): void {
    // Clean up subscriptions
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Loads navigation items from the service
   * @private
   */
  private async loadNavigationItems(): Promise<void> {
    try {
      this.navigationService.loadNavigationItems();
    } catch (error) {
      console.error('Error loading navigation items in component:', error);
    }
  }

  public onSidenavToggle(opened: boolean): void {
    this.sidenavOpened.set(opened);
  }

  public navigateToRoute(route?: string): void {
    if (route) {
      this.router.navigate([route]);
    }
  }

  public isActiveRoute(route?: string): boolean {
    if (!route) return false;
    return this.router.url === route || this.router.url.startsWith(route + '/');
  }

  public toggleSidebar(): void {
    this.sidenavOpened.update(opened => !opened);
  }

  public closeSidebar(): void {
    this.sidenavOpened.set(false);
  }

  public getIconChar(icon?: string): string {
    const iconMap: Record<string, string> = {
      dashboard: '📊',
      users: '👥',
      settings: '⚙️',
      home: '🏠',
      menu: '☰',
      person: '👤',
      group: '👥',
      admin_panel_settings: '⚙️',
      security: '🔒',
      analytics: '📈',
      notifications: '🔔',
      help: '❓',
    };
    return iconMap[icon || ''] || '•';
  }
}
