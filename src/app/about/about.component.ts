import { LowerCasePipe } from '@angular/common';
import { Directive, HostListener } from '@angular/core';
import { Component, ViewEncapsulation, OnInit } from '@angular/core';

import { MenuComponent } from '../menu/menu.component';


@Component({
    templateUrl: 'about.component.html',
    encapsulation: ViewEncapsulation.None,
})
export class AboutComponent implements OnInit {
    public title: string;
    public listTitle: string;
    public description: string;
    public controlList: Object[];

    /** Configurations for the About page */
    constructor(
        public menu: MenuComponent
    ) {
        this.title = 'About this sample';
        this.listTitle = 'List of EJ2 components used in this sample';
        this.description = 'This stock chart demo application showcases using  Essential JS 2 '
            + 'components together in a real-world application scenario. You can further explore the source '
            + 'code of this application and use it as a reference for integrating Essential JS 2 components '
            + 'into your applications.';

        this.controlList = [
            { 'control': 'Chart', 'link': 'http://ej2.syncfusion.com/angular/documentation/chart/getting-started.html' },
            { 'control': 'Button', 'link': 'http://ej2.syncfusion.com/angular/documentation/button/getting-started.html' },
            { 'control': 'DropDownButton', 'link': 'http://ej2.syncfusion.com/angular/documentation/drop-down-button/getting-started.html' },
            { 'control': 'Toolbar', 'link': 'http://ej2.syncfusion.com/angular/documentation/toolbar/getting-started.html' },
            { 'control': 'DateRangePicker', 'link': 'http://ej2.syncfusion.com/angular/documentation/daterangepicker/getting-started.html' },
            { 'control': 'RangeNavigator', 'link': 'http://ej2.syncfusion.com/angular/documentation/daterangepicker/getting-started.html' },
        ];
        this.handleResize();
    }


    public ngOnInit(): void {
    }

    public handleResize(): void {
        setTimeout(() => {
            if (document.documentElement.offsetWidth > 1400) {
                document.getElementById('about-overall').style.minHeight = 'auto';
                document.getElementById('about-overall').style.minHeight = document.documentElement.offsetHeight + 'px';
            }
        }, 100);
    }

    @HostListener('window:resize', ['$event'])
    onResize(event: any): void {
        /** Document height alignment corrections for high resoultion screens */
        this.handleResize();
    }

}