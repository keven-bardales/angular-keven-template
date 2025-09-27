import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, NavigationEnd, Router, RouterLink } from '@angular/router';
import { NzBreadCrumbModule } from 'ng-zorro-antd/breadcrumb';
import { filter, distinctUntilChanged } from 'rxjs/operators';

export interface BreadcrumbItem {
  label: string;
  url: string;
  params?: any;
}

@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, NzBreadCrumbModule, RouterLink],
  template: `
    <nz-breadcrumb [nzSeparator]="separator">
      <nz-breadcrumb-item *ngFor="let breadcrumb of breadcrumbs; let last = last">
        <a *ngIf="!last && breadcrumb.url" [routerLink]="breadcrumb.url">
          {{ breadcrumb.label }}
        </a>
        <span *ngIf="last || !breadcrumb.url">{{ breadcrumb.label }}</span>
      </nz-breadcrumb-item>
    </nz-breadcrumb>
  `,
  styles: [`
    :host {
      display: block;
      margin-bottom: 16px;
    }
    nz-breadcrumb {
      font-size: 14px;
    }
  `]
})
export class BreadcrumbComponent implements OnInit {
  @Input() separator: string = '/';
  @Input() customBreadcrumbs?: BreadcrumbItem[];

  breadcrumbs: BreadcrumbItem[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    if (this.customBreadcrumbs) {
      this.breadcrumbs = this.customBreadcrumbs;
    } else {
      this.buildBreadcrumbs();

      // Rebuild breadcrumbs on route change
      this.router.events
        .pipe(
          filter(event => event instanceof NavigationEnd),
          distinctUntilChanged()
        )
        .subscribe(() => {
          this.buildBreadcrumbs();
        });
    }
  }

  private buildBreadcrumbs(): void {
    this.breadcrumbs = [];
    let route : ActivatedRoute | null = this.activatedRoute.root || null;
    let url = '';

    // Always add home
    this.breadcrumbs.push({
      label: 'Home',
      url: '/admin-panel'
    });

    while (route) {
      if (route.snapshot.data && route.snapshot.data['breadcrumb']) {
        url += `/${route.snapshot.url.map(segment => segment.path).join('/')}`;
        this.breadcrumbs.push({
          label: route.snapshot.data['breadcrumb'],
          url: url
        });
      } else if (route.snapshot.url.length > 0) {
        // Auto-generate breadcrumb from URL segment
        const segment = route?.snapshot?.url?.[0]?.path;
        if (segment && segment !== 'admin-panel') {
          url += `/${segment}`;
          this.breadcrumbs.push({
            label: this.formatLabel(segment),
            url: url
          });
        }
      }

      route = route.firstChild || null;
    }
  }

  private formatLabel(segment: string): string {
    // Convert URL segment to readable label
    return segment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}