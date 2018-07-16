import { NgModule } from '@angular/core';
import { APP_BASE_HREF, HashLocationStrategy, Location, LocationStrategy} from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';

import { ChartAllModule, RangeNavigatorAllModule } from '@syncfusion/ej2-ng-charts';

import { DialogAllModule } from '@syncfusion/ej2-ng-popups';

import { routing } from './app.router';
import { ChartComponent } from '../app/chart/chart.component';
import { MenuComponent } from '../app/menu/menu.component';
import { AboutComponent } from '../app/about/about.component';
import { AppComponent } from './app.component';


@NgModule({
    imports: [
        BrowserModule,
        ChartAllModule,
        DialogAllModule,
        RangeNavigatorAllModule,
        routing
    ],
    declarations: [
        ChartComponent,
        MenuComponent,
        AboutComponent,
        AppComponent
    ],
    entryComponents: [
        AppComponent,
        ChartComponent
      ],
    bootstrap: [AppComponent],
    providers: [ {provide: APP_BASE_HREF, useValue : '/' }, Location, {provide: LocationStrategy, useClass: HashLocationStrategy} ]
})
export class AppModule {
    private location: Location;
    constructor(location: Location) { this.location = location; }
 }