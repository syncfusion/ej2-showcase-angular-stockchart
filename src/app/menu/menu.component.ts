import { Component, Directive, ElementRef } from '@angular/core';
import { HostListener } from '@angular/core';
import { Browser, rippleEffect, isNullOrUndefined as isNOU, enableRipple } from '@syncfusion/ej2-base';
import { ViewChild, AfterViewInit } from '@angular/core';
import { DialogComponent } from '@syncfusion/ej2-ng-popups';
import { EmitType } from '@syncfusion/ej2-base';
enableRipple(true);


@Component({
  selector: 'menu',
  templateUrl: 'menu.component.html'
})

export class MenuComponent {
  public menu: HTMLElement;
  public userName: string;
  public filterMenu: HTMLElement;
  public overlay: HTMLElement;
  // Define Dialog properties
  @ViewChild('confirmDialog')
  public confirmDialog: DialogComponent;
  public confirmHeader: string = 'About';
  public showCloseIcon: Boolean = false;
  public visible: Boolean = true;
  public hidden: Boolean = false;
  public confirmCloseIcon: Boolean = true;
  public position: object = { X: 'center', Y: 'center' };
  public target: string = '.stock-details';
  public confirmWidth: string = '50%';
  public animationSettings: Object = { effect: 'None' };
  public hide: any;
  public title: string;
  public listTitle: string;
  public description: string;
  public controlList: Object[];
  public confirmHeight: string = '400px';

  constructor(public eleRef: ElementRef) {
    /** Loads the user data in the profile from the sidebar */
    rippleEffect(document.body, { selector: '.ripple-element', rippleFlag: true });
    this.title = 'About this sample';
    this.listTitle = 'List of EJ2 components used in this sample';
    this.description = ' This demo helps to track and visualize the stock price of various sectors/industries over a specific' +
      ' period using Essential JS 2 components. Different types of technical indicators' +
      ' in chart help you to track the price movement based on the past prices, and the time periods ' +
      'can be selected using range navigator. In addition to this, the DateRangePicker helps you to ' +
      'select custom periods to check the stock price. Different types of series help to visualize the' +
      ' open, high, low, and close values of the stock. You can further explore the source code of this ' +
      'application and use it as a reference for integrating Essential JS 2 components into your applications.';

    this.controlList = [
      { 'control': 'Chart', 'link': 'http://ej2.syncfusion.com/angular/documentation/chart/getting-started.html' },
      { 'control': 'Button', 'link': 'http://ej2.syncfusion.com/angular/documentation/button/getting-started.html' },
      { 'control': 'DropDownButton', 'link': 'http://ej2.syncfusion.com/angular/documentation/drop-down-button/getting-started.html' },
      { 'control': 'Toolbar', 'link': 'http://ej2.syncfusion.com/angular/documentation/toolbar/getting-started.html' },
      { 'control': 'Dialog', 'link': 'https://ej2.syncfusion.com/16.1.37/angular/documentation/dialog/getting-started.html' },
      { 'control': 'DateRangePicker', 'link': 'http://ej2.syncfusion.com/angular/documentation/daterangepicker/getting-started.html' },
      { 'control': 'RangeNavigator', 'link': 'https://ej2.syncfusion.com/angular/documentation/rangenavigator/getting-started.html ' },
    ];
  }

  public ngAfterViewInit(): void {
    /** Holds the sidebar elements for later use */
    this.menu = this.eleRef.nativeElement.querySelector('#sidebar-wrapper');
    this.overlay = this.eleRef.nativeElement.querySelector('#overlay');
  }


  /** Toggles the sidebar open and close actions - for small resoultion */
  public toggleMenu(): void {
    this.confirmDialog.show();
    this.dialogOpen();
  }

  public confirmDlgBtnClick: EmitType<object> = () => {
    this.confirmDialog.hide();
  }


  // On Dialog close, show the buttons
  public dialogClose: EmitType<object> = () => {
    (document.querySelectorAll('.container-control')[0] as HTMLElement).classList.remove('disabled-elemment')
  }
  // On Dialog open, hide the buttons
  public dialogOpen: EmitType<object> = () => {
    (document.querySelectorAll('.container-control')[0] as HTMLElement).classList.add('disabled-elemment')
  }


  public handleResize(): void {
   this.confirmDialog.refreshPosition();
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    /** Document height alignment corrections for high resoultion screens */
    this.handleResize();
  }

}