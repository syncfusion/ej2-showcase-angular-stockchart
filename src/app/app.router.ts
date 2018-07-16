import { ModuleWithProviders }  from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { ChartComponent } from './chart/chart.component';
import { MenuComponent } from './menu/menu.component';

// Route Configuration
export const routes: Routes = [
  { path: '', redirectTo: 'stockChart', pathMatch: 'full' },
  { path: 'stockChart', component: ChartComponent},
  { path: 'about', component: AboutComponent }
];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes);