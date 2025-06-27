import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { NavigationItem } from '../../../types/navigation/navigation-item.type';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule
  ],
  template: `
    <mat-sidenav-container class="sidenav-container" [style.marginTop.px]="0">
      <!-- Sidebar -->
      <mat-sidenav
        #drawer
        class="sidenav"
        fixedInViewport
        [attr.role]="(isHandset$ | async) ? 'dialog' : 'navigation'"
        [mode]="(isHandset$ | async) ? 'over' : 'side'"
        [opened]="sidenavOpened()"
        (openedChange)="onSidenavToggle($event)">

        <div class="sidenav-content">
          <!-- Navigation Items -->
          <mat-nav-list>
            @for (item of navigationItems; track item.uuid) {
              @if (!item.isHidden()) {
                <!-- Section Headers -->
                @if (item.type === 'section') {
                  <div class="nav-section-header">
                    <span class="section-label">{{ item.label }}</span>
                  </div>
                }

                <!-- Items with Icon -->
                @if (item.type === 'itemWithIcon') {
                  <mat-list-item
                    class="nav-item"
                    [class.nav-item-active]="isActiveRoute(item.route)"
                    (click)="navigateToRoute(item.route)">
                    <mat-icon matListItemIcon>{{ item.icon }}</mat-icon>
                    <span matListItemTitle>{{ item.label }}</span>
                  </mat-list-item>

                  <!-- Children items -->
                  @if (item.children && item.children.length > 0) {
                    <div class="nav-children">
                      @for (child of item.children; track child.uuid) {
                        @if (!child.isHidden()) {
                          <mat-list-item
                            class="nav-child-item"
                            [class.nav-item-active]="isActiveRoute(child.route)"
                            (click)="navigateToRoute(child.route)">
                            @if (child.icon) {
                              <mat-icon matListItemIcon>{{ child.icon }}</mat-icon>
                            }
                            <span matListItemTitle>{{ child.label }}</span>
                          </mat-list-item>
                        }
                      }
                    </div>
                  }
                }

                <!-- Simple Items -->
                @if (item.type === 'item') {
                  <mat-list-item
                    class="nav-item nav-simple-item"
                    [class.nav-item-active]="isActiveRoute(item.route)"
                    (click)="navigateToRoute(item.route)">
                    <span matListItemTitle>{{ item.label }}</span>
                  </mat-list-item>
                }
              }
            }
          </mat-nav-list>
        </div>
      </mat-sidenav>

      <!-- Main Content -->
      <mat-sidenav-content class="main-content">
        <!-- Toggle Button for mobile -->
        @if (isHandset$ | async) {
          <button
            mat-icon-button
            class="sidenav-toggle"
            (click)="drawer.toggle()">
            <mat-icon>menu</mat-icon>
          </button>
        }

        <!-- Router Outlet - Aquí se renderiza el contenido de las rutas -->
        <div class="content-container">
          <router-outlet />
        </div>
      </mat-sidenav-content>
    </mat-sidenav-container>
  `,
  styles: [`
    .sidenav-container {
      height: 100vh;
    }

    .sidenav {
      width: 280px;
      background-color: #fafafa;
      border-right: 1px solid #e0e0e0;
    }

    .sidenav-content {
      padding: 16px 0;
    }

    .main-content {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .content-container {
      flex: 1;
      padding: 24px;
      overflow: auto;
    }

    .sidenav-toggle {
      position: fixed;
      top: 16px;
      left: 16px;
      z-index: 1000;
      background-color: white;
      box-shadow: 0 2px 5px rgba(0,0,0,0.2);
    }

    /* Navigation Styles */
    .nav-section-header {
      padding: 16px 16px 8px 16px;
      border-bottom: 1px solid #e0e0e0;
      margin-bottom: 8px;
    }

    .section-label {
      font-size: 12px;
      font-weight: 600;
      color: #666;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }

    .nav-item {
      cursor: pointer;
      transition: background-color 0.2s ease;
      margin: 2px 8px;
      border-radius: 8px;
    }

    .nav-item:hover {
      background-color: #f5f5f5;
    }

    .nav-item-active {
      background-color: #e3f2fd !important;
      color: #1976d2;
    }

    .nav-item-active mat-icon {
      color: #1976d2;
    }

    .nav-children {
      margin-left: 16px;
      border-left: 2px solid #e0e0e0;
      padding-left: 8px;
    }

    .nav-child-item {
      cursor: pointer;
      transition: background-color 0.2s ease;
      margin: 2px 8px;
      border-radius: 8px;
      font-size: 14px;
    }

    .nav-child-item:hover {
      background-color: #f5f5f5;
    }

    .nav-simple-item {
      padding-left: 32px;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .content-container {
        padding: 16px;
        margin-top: 60px;
      }
    }
  `]
})
export class AdminLayout implements OnInit {
  private breakpointObserver = new BreakpointObserver();

  // Reactive state para el sidenav
  public sidenavOpened = signal(true);

  // Observable para detectar dispositivos móviles
  public isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  // Navigation items definidos como clases
  public navigationItems: NavigationItem[] = [
    new NavigationItem({ type: 'section', label: 'Principal' }),

    new NavigationItem({
      type: 'itemWithIcon',
      label: 'Dashboard',
      icon: 'dashboard',
      route: '/admin/dashboard'
    }),

    new NavigationItem({
      type: 'itemWithIcon',
      label: 'Usuarios',
      icon: 'people',
      children: [
        new NavigationItem({
          type: 'item',
          label: 'Lista de Usuarios',
          route: '/admin/users'
        }),
        new NavigationItem({
          type: 'item',
          label: 'Crear Usuario',
          route: '/admin/users/create'
        }),
        new NavigationItem({
          type: 'item',
          label: 'Roles',
          route: '/admin/users/roles'
        })
      ]
    }),

    new NavigationItem({ type: 'section', label: 'Gestión' }),

    new NavigationItem({
      type: 'itemWithIcon',
      label: 'Productos',
      icon: 'inventory',
      children: [
        new NavigationItem({
          type: 'item',
          label: 'Catálogo',
          route: '/admin/products'
        }),
        new NavigationItem({
          type: 'item',
          label: 'Categorías',
          route: '/admin/products/categories'
        }),
        new NavigationItem({
          type: 'item',
          label: 'Inventario',
          route: '/admin/products/inventory',
        })
      ]
    }),

    new NavigationItem({
      type: 'itemWithIcon',
      label: 'Ventas',
      icon: 'shopping_cart',
      children: [
        new NavigationItem({
          type: 'item',
          label: 'Órdenes',
          route: '/admin/sales/orders'
        }),
        new NavigationItem({
          type: 'item',
          label: 'Reportes',
          route: '/admin/sales/reports'
        })
      ]
    }),

    new NavigationItem({ type: 'section', label: 'Configuración' }),

    new NavigationItem({
      type: 'itemWithIcon',
      label: 'Configuración',
      icon: 'settings',
      children: [
        new NavigationItem({
          type: 'item',
          label: 'General',
          route: '/admin/settings/general'
        }),
        new NavigationItem({
          type: 'item',
          label: 'Seguridad',
          route: '/admin/settings/security'
        }),
        new NavigationItem({
          type: 'item',
          label: 'Integraciones',
          route: '/admin/settings/integrations',
          hidden: () => {
            // Ejemplo de función para hidden
            return false; // Aquí puedes poner lógica condicional
          }
        })
      ]
    }),

    new NavigationItem({
      type: 'itemWithIcon',
      label: 'Ayuda',
      icon: 'help',
      route: '/admin/help'
    })
  ];

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Ajustar el estado inicial del sidenav basado en el tamaño de pantalla
    this.isHandset$.subscribe(isHandset => {
      this.sidenavOpened.set(!isHandset);
    });
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
}
