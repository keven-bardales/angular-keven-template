import { Component } from '@angular/core';
import { NzContentComponent } from 'ng-zorro-antd/layout';
import { NzHeaderComponent } from 'ng-zorro-antd/layout';
import { NzLayoutComponent } from 'ng-zorro-antd/layout';
import { NzSiderComponent } from 'ng-zorro-antd/layout';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { RouterModule } from '@angular/router';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { CommonModule } from '@angular/common';
import { NzMenuModule } from 'ng-zorro-antd/menu';

@Component({
  selector: 'app-welcome',
  imports: [
    NzContentComponent,
    RouterModule,
    NzHeaderComponent,
    NzLayoutComponent,
    NzButtonModule,
    NzSiderComponent,
    NzIconModule,
    CommonModule,
    NzMenuModule,
  ],
  templateUrl: './welcome.html',
  styleUrl: './welcome.scss',
})
export class Welcome {
  isCollapsed = false;
}
