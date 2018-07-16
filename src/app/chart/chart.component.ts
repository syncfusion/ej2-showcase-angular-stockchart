import { Component, ViewChild, OnInit } from '@angular/core';
import { Browser, remove, EmitType } from '@syncfusion/ej2-base';
import { Directive, HostListener } from '@angular/core';
import { Chart, RangeNavigator, IRangeLoadedEventArgs, IRangeSelectorRenderEventArgs, ILoadEventArgs } from '@syncfusion/ej2-ng-charts';
import { ChartTheme, PeriodSelectorSettingsModel, IChangedEventArgs, ChartSeriesType } from '@syncfusion/ej2-ng-charts';
import { TechnicalIndicators, TechnicalIndicatorModel, TrendlineTypes, AxisModel, Axis } from '@syncfusion/ej2-charts';
import { ItemModel } from '@syncfusion/ej2-navigations';
import { ChartAreaModel, TooltipSettingsModel, CrosshairSettingsModel, ZoomSettingsModel, getElement } from '@syncfusion/ej2-ng-charts';
import { ITooltipRenderEventArgs, IPointEventArgs, IAxisLabelRenderEventArgs, ILoadedEventArgs } from '@syncfusion/ej2-ng-charts';
import { IMouseEventArgs, MarginModel, IPointRenderEventArgs, AnimationModel, withInBounds, Series } from '@syncfusion/ej2-ng-charts';
import { RowModel, LegendSettingsModel, IAxisRangeCalculatedEventArgs, VisibleLabels, ExportType } from '@syncfusion/ej2-ng-charts';
import { goog, googl, aapl, amzn, tsla, IVolume, IClose } from './stock-data';
import { DropDownButton, MenuEventArgs } from '@syncfusion/ej2-splitbuttons';
import { Button } from '@syncfusion/ej2-buttons';


@Component({
  selector: 'stock',
  templateUrl: 'chart.component.html',
})


export class ChartComponent implements OnInit {

  //component initialization
  @ViewChild('chart')
  public chart: Chart;
  @ViewChild('range')
  public range: RangeNavigator;

  // range navigator
  public width: string = '90%';
  public selectedTheme: string = location.hash.split('/')[1] ? location.hash.split('/')[1] : 'Material';
  public theme: ChartTheme = <ChartTheme>(this.selectedTheme.charAt(0).toUpperCase() + this.selectedTheme.slice(1));
  public periods: PeriodSelectorSettingsModel;
  public rangeChanged: EmitType<IChangedEventArgs>;
  public rangeLoaded: EmitType<IRangeLoadedEventArgs>;
  public rangeLoad: EmitType<IRangeLoadedEventArgs>;
  public chartLoad: EmitType<ILoadedEventArgs>;
  public selectorRender: EmitType<IRangeSelectorRenderEventArgs>;
  public data: Object[] = googl;
  public secondaryData: Object[] = aapl;
  public thirdData: Object[] = goog;
  public fourthData: Object[] = amzn;
  public fifthData: Object[] = tsla;
  public firstContent: string;
  public setValue: boolean = false;
  public setValue1: boolean = false;
  public setValue2: boolean = false;
  public setValue3: boolean = false;
  //chart initialization
  public chartArea: ChartAreaModel;
  public primaryXAxis: AxisModel;
  public primaryYAxis: AxisModel;
  public tooltip: TooltipSettingsModel;
  public crosshair: CrosshairSettingsModel;
  public tooltipRender: EmitType<ITooltipRenderEventArgs>;
  public pointRender: EmitType<IPointRenderEventArgs>;
  public margin: MarginModel;
  public zoomSettings: ZoomSettingsModel;
  public axisLabelRender: EmitType<IAxisLabelRenderEventArgs>;
  public loaded: EmitType<ILoadedEventArgs>;
  public chartClick: EmitType<IMouseEventArgs>;
  public chartMouseMove: EmitType<IMouseEventArgs>;
  public chartMouseLeave: EmitType<IMouseEventArgs>;
  public axes: AxisModel[];
  public rows: RowModel[];
  public legendSettings: LegendSettingsModel;
  public axisRangeCalculated: EmitType<IAxisRangeCalculatedEventArgs>;
  public period: number;
  public fastPeriod: number = 8;
  public slowPeriod: number = 5;
  public macdType: string = 'Both';
  public annotationString: string = '<div id="annotation" class="e-annotation">';
  public animation: AnimationModel = { enable: false };
  public opacity: number;
  public secondaryOpacity: number;
  public thirdOpacity: number;
  public fourthOpacity: number;
  public fifthOpacity: number;
  public trendLineTooltip: boolean;
  public upperLine: object = {
    color: '#FFE200',
    width: 1
  };
  public periodLine: object = {
    width: 2
  };
  public lowerLine: object = {
    color: '#FAA512',
    width: 1
  };

  public pointColors: string[] = [];



  //private variables:
  private indicators: TechnicalIndicators[] = [];
  private secondayIndicators: TechnicalIndicators[] = [];
  private secondaryValue: string = null;
  private thirdValue: string = null;
  private fourthValue: string = null;
  private fifthValue: string = null;
  private tmaValue: string = ': $124.79';
  private bollingerValue: string = ': $9.979';
  private rsiValue: string = ': $99.279';
  private smaValue: string = ': $106.719';
  private macdValue: string = ': 2.719';
  public sidePlacement: boolean = false;
  private candleValue: string = '534.07';
  private content: string;
  public ngOnInit(): void {

    //range navigator
    this.tmaValue = ': $124.79';
    this.bollingerValue = ': $9.979';
    this.rsiValue = ': $99.279';
    this.smaValue = ': $106.719';
    this.macdValue = ': 2.719';
    this.content = this.candle(this.candleValue);
    this.firstContent = this.candle('534.07');
    this.periods = {
      position: 'Top',
      periods: [
        { text: '1M', interval: 1, intervalType: 'Months' },
        { text: '3M', interval: 3, intervalType: 'Months', selected: Browser.isDevice ? true : false },
        { text: '6M', interval: 6, intervalType: 'Months' }, { text: 'YTD' },
        { text: '1Y', interval: 1, intervalType: 'Years', selected: Browser.isDevice ? false : true },
        { text: '2Y', interval: 2, intervalType: 'Years' },
        { text: 'All' }
      ]
    };

    this.rangeChanged = (args: IChangedEventArgs) => {
      let returnPoint: number;
      if (args.selectedData.length > 2000) {
        returnPoint = 10;
      } else if (args.selectedData.length > 1000) {
        returnPoint = 8;
      } else if (args.selectedData.length > 600) {
        returnPoint = 6;
      } else if (args.selectedData.length > 100) {
        returnPoint = 3;
      } else {
        returnPoint = 2;
      }
      let data: IVolume[] = googl.filter((data: IVolume, index: number) => {
        return ((data['x'].getTime() >= (args.start as Date).getTime() &&
          data['x'].getTime() <= (args.end as Date).getTime()) && index % returnPoint === 0);
      });
      let data1: IVolume[] = aapl.filter((data1: IVolume, index: number) => {
        return ((data1['x'].getTime() >= (args.start as Date).getTime() &&
          data1['x'].getTime() <= (args.end as Date).getTime()) && index % returnPoint === 0);
      });
      let data2: IClose[] = goog.filter((data2: IClose, index: number) => {
        return ((data2['x'].getTime() >= (args.start as Date).getTime() &&
          data2['x'].getTime() <= (args.end as Date).getTime()) && index % returnPoint === 0);
      });

      let data3: IClose[] = amzn.filter((data3: IClose, index: number) => {
        /* tslint:disable:no-string-literal */
        return ((data3['x'].getTime() >= (args.start as Date).getTime() &&
          data3['x'].getTime() <= (args.end as Date).getTime()) && index % returnPoint === 0);
      });
      let data4: IClose[] = tsla.filter((data4: IClose, index: number) => {
        /* tslint:disable:no-string-literal */
        return ((data4['x'].getTime() >= (args.start as Date).getTime() &&
          data4['x'].getTime() <= (args.end as Date).getTime()) && index % returnPoint === 0);
      });
      let diff: number = ((args.end as Date).getTime() - (args.start as Date).getTime()) / 1000;
      diff /= (60 * 60 * 24 * 7 * 4);
      let totalMonths: number = Math.abs(Math.round(diff));
      if (totalMonths >= 13) {
        this.chart.primaryXAxis.labelFormat = 'MMM yyy';
      } else if (totalMonths <= 6) {
        this.chart.primaryXAxis.labelFormat = 'MMM dd';
      }
      this.chart.series[0].animation.enable = false; this.chart.primaryXAxis.zoomPosition = 0;
      this.chart.primaryXAxis.zoomFactor = 1; this.chart.series[1].animation.enable = false;
      this.chart.primaryXAxis.stripLines = [{ visible: true }];
      this.pointColors = []; this.chart.series[6].dataSource = data4;
      this.chart.series[0].dataSource = data; this.chart.series[1].dataSource = data; this.chart.series[2].dataSource = data;
      this.chart.series[3].dataSource = data1; this.chart.series[4].dataSource = data2; this.chart.series[5].dataSource = data3;
      this.chart.refresh(); this.chart.setAnnotationValue(0, '<div id="annotation"></div>');
    };
    this.chartLoad = (args: ILoadedEventArgs) => {
      if (document.documentElement.offsetHeight) {
        let height: number = (document.documentElement.offsetHeight - 245);
        args.chart.height = height > 450 ? (height + '') : null;
      } else {
        args.chart.height = null;
      }
      document.body.style.overflowY = args.chart.height ? 'hidden' : 'auto';
      if (document.documentElement.offsetHeight > 700 && document.getElementById('_dialog-content')) {
        document.getElementById('_dialog-content').style.overflowY = 'hidden';
      }
      document.getElementById('close').style.display = Browser.isDevice ? 'none' : 'block';
      document.getElementById('atClose').style.display = Browser.isDevice ? 'none' : 'block';
      document.getElementById('stockRange').style.paddingTop = Browser.isDevice ? '1%' : '0.5%';
      document.getElementById('stockRange').style.paddingBottom = Browser.isDevice ? '1%' : '0.5%';
    }
    this.rangeLoaded = (args: IRangeLoadedEventArgs) => {
      let calendar: Element = document.getElementById('customRange');
      calendar.classList.add('e-flat');

      let icon: Element = document.getElementById('dateIcon');
      icon.classList.add('e-btn-icon');

      let rect: ClientRect = document.getElementsByClassName('chart-element')[0].getBoundingClientRect();
      let size: number = rect.width > 350 ? 10 : 18;
      document.getElementById('range_Secondary_Element').style.transform = 'translateX(' + (rect.left - size) + 'px)';
      document.getElementById('range_Secondary_Element').style.width = rect.width + 'px';
      document.getElementById('stockRange').style.transform = 'translateX(' + (rect.left - 10) + 'px)';
      let seriesType: DropDownButton = new DropDownButton({
        items: [{ text: 'Line' }, { text: 'Hilo' }, { text: 'HiloOpenClose' },
        { text: 'Hollow Candle' }, { text: 'Spline' }, { text: 'Candle' }],
        select: (args: MenuEventArgs) => {
          if (args.item.text === 'Candle') {
            this.chart.series[1].enableSolidCandles = true;
            this.chart.series[1].type = 'Candle';
          } else if (args.item.text === 'Hollow Candle') {
            this.chart.series[1].enableSolidCandles = false;
            this.chart.series[1].type = 'Candle';
          } else {
            this.chart.series[1].type = <ChartSeriesType>args.item.text;
          }
          this.chart.refresh();
          this.removeSecondaryElement(0);
        },
        iconCss: 'e-icons e-add', cssClass: 'e-caret-hide'
      });
      seriesType.appendTo('#seriesType');
      let comparision: DropDownButton = new DropDownButton({
        items: [{ text: 'GOOG' }, { text: 'AAPL' }, { text: 'GOOGL' }, { text: 'AMZN' }, { text: 'TSLA' }],
        select: (args: MenuEventArgs) => {
          if (args.item.text === 'AAPL' && !this.setValue) {
            this.secondaryValue = '467.5'
            this.chart.series[3].opacity = 1;
            this.chart.series[3].visible = true;
            this.setValue = true;
            this.chart.refresh();
          } else if (args.item.text === 'GOOGL' && !this.setValue1) {
            this.thirdValue = '467.5'
            this.chart.series[4].opacity = 1;
            this.chart.series[4].visible = true;
            this.setValue1 = true;
            this.chart.refresh();
          } else if (args.item.text === 'AMZN' && !this.setValue2) {
            this.fourthValue = '389.51'
            this.chart.series[5].opacity = 1;
            this.chart.series[5].visible = true;
            this.setValue2 = true;
            this.chart.refresh();
          } else if (args.item.text === 'TSLA' && !this.setValue3) {
            this.fifthValue = '205.27'
            this.chart.series[6].opacity = 1;
            this.chart.series[6].visible = true;
            this.setValue3 = true;
            this.chart.refresh();
          }
          this.removeSecondaryElement(0);
          this.renderAnnotation();
        },
        iconCss: 'e-icons e-add', cssClass: 'e-caret-hide'
      });
      comparision.appendTo('#comparision');
      let reset: Button = new Button({
        iconCss: 'e-icons e-reset', cssClass: 'e-flat'
      });
      reset.appendTo('#resetClick');
      let print: Button = new Button({
        iconCss: 'e-icons e-play-icon', cssClass: 'e-flat'
      });
      print.appendTo('#print');
      let exportChart: DropDownButton = new DropDownButton({
        items: [{ text: 'JPEG' }, { text: 'PNG' }, { text: 'SVG' }],
        iconCss: 'e-icons e-export', cssClass: 'e-caret-hide',
        select: (args: MenuEventArgs) => {
          let type: ExportType = <ExportType>args.item.text;
          this.chart.export(type, 'chart');
        }
      });
      exportChart.appendTo('#export');

      document.getElementById('print').onclick = () => {
        this.chart.print(['chartStock']);
      };
      document.getElementById('resetClick').onclick = () => {
        while (this.chart.indicators.length) {
          this.chart.indicators.pop();
        }
        this.indicators = [];
        this.secondayIndicators = [];
        this.chart.series[1].trendlines[0].width = 0;
        this.chart.series[1].type = 'Candle';
        this.secondaryValue = null;
        this.secondaryOpacity = 0;
        this.chart.series[3].opacity = 0;
        this.chart.series[3].visible = false;
        this.chart.indicatorElements = null;
        this.setValue = false;

        this.thirdValue = null;
        this.fourthValue = null;
        this.thirdOpacity = 0;
        this.fourthOpacity = 0;
        this.fifthValue = null;
        this.fifthOpacity = 0;

        this.chart.series[4].opacity = 0;
        this.chart.series[4].visible = false;
        this.setValue1 = false;

        this.chart.series[5].opacity = 0;
        this.chart.series[5].visible = false;
        this.setValue2 = false;

        this.chart.series[6].opacity = 0;
        this.chart.series[6].visible = false;
        this.setValue3 = false;
        this.chart.rows = [
          { height: '15%' },
          { height: '85%' }
        ];
        this.chart.axes = [{
          name: 'secondary', opposedPosition: true, rowIndex: 0, desiredIntervals: 2,
          majorGridLines: { width: 0, color: '#EDEDED' },
          lineStyle: { width: 1, color: 'whitesmoke' }, majorTickLines: { width: 0 }, rangePadding: 'None'
        }];
        this.chart.primaryYAxis = {
          crosshairTooltip: { enable: true },
          labelFormat: 'n0', plotOffset: 25,
          desiredIntervals: 5,
          rowIndex: 1, opposedPosition: true,
          lineStyle: { width: 1, color: 'whitesmoke' },
          rangePadding: 'None',
          majorGridLines: { width: 1, color: '#EDEDED' },
        };
        this.chart.refresh();

        if (window.innerWidth > 450) {
          this.range.periodSelectorModule.selectedIndex = 8;
          this.range.rangeSlider.performAnimation(1398105000000, 1429641000000, this.range);
        } else {
          this.range.periodSelectorModule.selectedIndex = 4;
          this.range.rangeSlider.performAnimation(1421971200000, 1429641000000, this.range);
        }
        this.chart.setAnnotationValue(1, this.candle(': $534.07'));
      };
      let indicatorType: DropDownButton = new DropDownButton({
        items: [{ text: 'TMA' }, { text: 'Bollinger Bands' }, { text: 'RSI' }, { text: 'SMA' },
        { text: 'MACD' }],
        iconCss: 'e-icons e-add', cssClass: 'e-caret-hide',
        select: (args: MenuEventArgs) => {
          let text: string = args.item.text.split(' ')[0].toLocaleLowerCase() + (args.item.text.split(' ')[1] ? args.item.text.split(' ')[1] : '');
          text = text.substr(0, 1).toUpperCase() + text.substr(1);
          let type: TechnicalIndicators = <TechnicalIndicators>text;
          if (type === 'Tma' || type === 'BollingerBands' || type === 'Sma') {
            if (this.indicators.indexOf(type) === -1) {
              let indicator: TechnicalIndicatorModel[] = [{
                type: type, period: 3, fastPeriod: 8, slowPeriod: 5,
                seriesName: 'Apple Inc', macdType: 'Both', width: 2,
                macdPositiveColor: '#6EC992', macdNegativeColor: '#FF817F',
                fill: type === 'Sma' ? '#32CD32' : '#6063ff',
                animation: { enable: false },
                upperLine: { color: '#FFE200', width: 1 },
                periodLine: { width: 2 },
                bandColor: 'rgba(245, 203, 35, 0.12)',
                lowerLine: { color: '#FAA512', width: 1 }
              }];

              this.indicators.push(type);
              this.chart.indicators = this.chart.indicators.concat(indicator);
              this.chart.refresh();
            }
          } else {
            if (this.indicators.indexOf(type) === -1) {
              this.indicators.push(type);
              this.secondayIndicators.push(type);
              let axis: AxisModel[];
              let row: RowModel[]
              let indicator: TechnicalIndicatorModel[];
              let len: number = this.chart.rows.length;
              this.chart.rows[this.chart.rows.length - 1].height = '15%';
              row = [{ height: '' + (100 - len * 15) + 'px' }];
              this.chart.rows = this.chart.rows.concat(row);
              axis = [{
                plotOffset: 10, name: type.toString(), opposedPosition: true, rowIndex: 0, desiredIntervals: 1,
                majorGridLines: { width: 0, color: '#EDEDED' }, lineStyle: { width: 1, color: 'whitesmoke' },
                majorTickLines: { width: 0 }, rangePadding: 'None'
              }];
              for (let i: number = 0; i < this.chart.axes.length; i++) {
                this.chart.axes[i].rowIndex += 1;
              }
              this.chart.axes = this.chart.axes.concat(axis);
              this.chart.primaryYAxis.rowIndex = len + 1;
              indicator = [{
                type: type, period: 3, fastPeriod: 8, slowPeriod: 5,
                seriesName: 'Apple Inc', macdType: 'Both', width: 2,
                macdPositiveColor: '#6EC992', macdNegativeColor: '#FF817F',
                fill: '#6063ff', yAxisName: type.toString(), animation: { enable: false },
                upperLine: { color: '#FFE200', width: 1 },
                periodLine: { width: 2 },
                bandColor: 'rgba(245, 203, 35, 0.12)',
                lowerLine: { color: '#FAA512', width: 1 }
              }];
              this.chart.indicators = this.chart.indicators.concat(indicator);
              this.chart.refresh();
            }
          }
          this.removeSecondaryElement(0);
          this.renderAnnotation();
        },
      });
      indicatorType.appendTo('#indicatorType');
      let trendType: DropDownButton = new DropDownButton({
        items: [{ text: 'Linear' }, { text: 'Polynomial' }, { text: 'MovingAverage' }],
        select: (args: MenuEventArgs) => {
          let type: TrendlineTypes = <TrendlineTypes>args.item.text;
          this.chart.series[1].trendlines[0].animation.enable = false;
          this.chart.series[1].trendlines[0].width = 3;
          this.chart.series[1].trendlines[0].type = type;
          this.chart.refresh();
        },
        iconCss: 'e-icons e-add', cssClass: 'e-caret-hide'
      });
      trendType.appendTo('#trendType');
      args.rangeNavigator.periodSelectorModule.toolbar.refreshOverflow();
    };
    this.selectorRender = (args: IRangeSelectorRenderEventArgs) => {
      args.enableCustomFormat = true;
      args.content = 'Date Range';
      let seriesModel: ItemModel = {
        template: ' <button id="seriesType" onclick="this.blur();">Series</button>', align: 'Left'
      };
      let indicatorModel: ItemModel = {
        template: ' <button id="indicatorType" onclick="this.blur();">Indicators</button>', align: 'Left'
      };
      let comparisionModel: ItemModel = {
        template: ' <button id="comparision" onclick="this.blur();">Comparison</button>', align: 'Left'
      };
      let trendLineModel: ItemModel = {
        template: ' <button id="trendType" onclick="this.blur();">Trendline</button>', align: 'Left'
      };
      let resetModel: ItemModel = {
        template: ' <button id="resetClick" onclick="this.blur();"></button>', align: 'Right', tooltipText: 'Reset'
      };
      let printModel: ItemModel = {
        template: ' <button id="print" onclick="this.blur();"></button>', align: 'Right', tooltipText: 'Print'
      };
      let exportModel: ItemModel = {
        template: ' <button id="export" onclick="this.blur();"></button>', align: 'Right', tooltipText: 'Export'
      };
      args.selector.splice(0, 0, trendLineModel);
      args.selector.splice(0, 0, indicatorModel);
      args.selector.splice(0, 0, comparisionModel);
      args.selector.splice(0, 0, seriesModel);
      args.selector.push(resetModel);
      args.selector.push(printModel);
      args.selector.push(exportModel);
    };


    //chart initialization
    this.trendLineTooltip = false;
    this.opacity = 0;
    this.secondaryOpacity = 0;
    this.thirdOpacity = 0;
    this.fourthOpacity = 0;
    this.fifthOpacity = 0;
    this.primaryXAxis = {
      valueType: 'DateTime', majorGridLines: { width: 0, color: '#EDEDED' }, crosshairTooltip: { enable: true },
      edgeLabelPlacement: 'Hide'
    };
    this.primaryYAxis = {
      crosshairTooltip: { enable: true },
      labelFormat: 'n0', plotOffset: 25,
      desiredIntervals: 5,
      rowIndex: 1, opposedPosition: true,
      lineStyle: { width: 1, color: 'whitesmoke' },
      rangePadding: 'None',
      majorGridLines: { width: 1, color: '#EDEDED' },
    };
    this.rows = [
      { height: '15%' },
      { height: '85%' }
    ];

    this.axes = [{
      name: 'secondary', opposedPosition: true, rowIndex: 0, desiredIntervals: 2,
      majorGridLines: { width: 0, color: '#EDEDED' },
      lineStyle: { width: 1, color: 'whitesmoke' }, majorTickLines: { width: 0 }, rangePadding: 'None'
    }];

    this.axisLabelRender = (args: IAxisLabelRenderEventArgs) => {
      if (args.axis.name === 'secondary') {
        args.text = Math.round((args.value / 10000000)) + 'B';
      } else if (args.axis.orientation === 'Vertical') {
        args.text = '$' + Math.round(args.value);
      }
    };
    this.axisRangeCalculated = (args: IAxisRangeCalculatedEventArgs) => {
      this.chart.setAnnotationValue(0, '<div></div>');
    };
    this.loaded = (args: ILoadedEventArgs) => {
      document.getElementById('stock-details').style.visibility = 'visible';
      document.getElementById('waitingpopup').style.display = 'none';
      let labels: VisibleLabels[] = (args.chart.axisCollections[0]).visibleLabels;
      let maxValue: number = args.chart.axisCollections[0].visibleRange.max;
      if (args.chart.primaryXAxis.stripLines.length === 1) {
        for (let i: number = 0; i < labels.length; i += 2) {
          args.chart.primaryXAxis.stripLines.push({
            start: new Date(labels[i].value), end: labels[i + 1] ? new Date(labels[i + 1].value) : new Date(maxValue),
            zIndex: 'Behind', border: { width: 0, color: 'transparent' }, rotation: null,
            opacity: 0.6, textStyle: {}, text: '', color: '#F1F5FB', visible: true
          });
        }
        args.chart.refresh();
      }
      this.handleResize();
    };

    this.chartClick = (args: IMouseEventArgs) => {
      if (args.target === 'tsla' || args.target === 'amzn' || args.target === 'aapl' || args.target === 'googl' || args.target === 'tma' || args.target === 'bollingerbands' || args.target === 'rsi' || args.target === 'sma' || args.target === 'macd') {
        this.removeSecondaryElement(0);
        if (args.target === 'aapl') {
          this.secondaryValue = null;
          this.secondaryOpacity = 0;
          this.chart.series[3].opacity = 0;
          this.chart.series[3].visible = false;
          this.setValue = false;
        }
        if (args.target === 'googl') {
          this.thirdValue = null;
          this.thirdOpacity = 0;
          this.chart.series[4].opacity = 0;
          this.chart.series[4].visible = false;
          this.setValue1 = false;
        }

        if (args.target === 'amzn') {
          this.fourthValue = null;
          this.fourthOpacity = 0;
          this.chart.series[5].opacity = 0;
          this.chart.series[5].visible = false;
          this.setValue2 = false;
        }

        if (args.target === 'tsla') {
          this.fifthValue = null;
          this.fifthOpacity = 0;
          this.chart.series[6].opacity = 0;
          this.chart.series[6].visible = false;
          this.setValue3 = false;
        }
        this.content = this.candle(this.candleValue);
        this.indicators = [];
        let removeIndex: number;
        this.chart.indicators.map((indicator: TechnicalIndicatorModel, index: number) => {
          let type: string = indicator.type.toLocaleLowerCase();
          if (type === args.target) {
            removeIndex = index;
            if (type === 'macd' || type === 'rsi') {
              this.secondayIndicators.splice(0, 1);
              this.chart.rows.splice(0, 1);
              let len: number = this.chart.rows.length;
              this.chart.rows[this.chart.rows.length - 1].height = '' + (100 - (len - 1) * 15) + 'px';
              for (let i: number = 0; i < this.chart.axes.length; i++) {
                if (this.chart.axes[i].name.toLowerCase() === type) {
                  this.chart.axes.splice(i, 1);
                  break;
                }
              }
              for (let i: number = 0; i < this.chart.axes.length; i++) {
                this.chart.axes[i].rowIndex -= 1;
              }

              this.chart.primaryYAxis.rowIndex = len - 1;
            }
            type = null;
          }
          if (type === 'tma') {
            this.indicators.push('Tma');
            this.content += this.tma(this.tmaValue);
          } else if (type === 'bollingerbands') {
            this.indicators.push('BollingerBands');
            this.content += this.bollinger(this.bollingerValue);
          } else if (type === 'rsi') {
            this.indicators.push('Rsi');
            this.content += this.rsi(this.rsiValue);
          } else if (type === 'sma') {
            this.indicators.push('Sma');
            this.content += this.sma(this.smaValue);
          } else if (type === 'macd') {
            this.indicators.push('Macd');
            this.content += this.macd(this.macdValue);
          }
        });
        if (removeIndex !== undefined) {
          this.chart.indicators.splice(removeIndex, 1);
        }
        if (this.secondaryValue) {
          this.content += this.compare(this.secondaryValue);
        }
        if (this.thirdValue) {
          this.content += this.compare1(this.thirdValue);
        }
        if (this.fourthValue) {
          this.content += this.compare2(this.fourthValue);
        }
        if (this.fifthValue) {
          this.content += this.compare3(this.fifthValue);
        }
        if (document.getElementById('chartStock_Annotation_1').childNodes.length === 1) {
          this.chart.indicatorElements = null;
        }
        if (this.chart.indicators.length === 0) {
          this.chart.indicatorElements = null;
        }
        this.chart.refresh();
        this.chart.setAnnotationValue(1, this.content);
      }
    };
    this.tooltip = {
      enable: true,
      shared: true,
      header: '',
      format: '${point.x}<br/>High : <b>${point.high}</b><br/>Low :' +
        ' <b>${point.low}</b><br/>Open : <b>${point.open}</b><br/>Close : <b>${point.close}</b><br/>Volume : <b>${point.volume}</b>'
    };
    this.crosshair = {
      enable: true, lineType: 'Both'
    };

    this.legendSettings = {
      visible: false
    };
    this.period = 3;
    this.chartArea = {
      border: { width: 1, color: 'whitesmoke' }
    };
    this.zoomSettings = { enableMouseWheelZooming: true, mode: 'X', toolbarItems: [] };

    this.tooltipRender = (args: ITooltipRenderEventArgs) => {
      if (args.series.name === 'Apple Inc') {
        this.content += this.candle(' :$' + args.text.split('<br/>')[4].split('<b>')[1].split('</b>')[0]);
      }
      if (args.series.type === 'Candle') {
        this.chart.setAnnotationValue(0, this.annotationString + (this.getContent(args.text) + '</table>') + '</div>');
      } else if (args.series.name === 'AAPL' && this.setValue) {
        this.content += this.compare(args.text.split('<br/>')[4].split('<b>')[1].split('</b>')[0]);
      } else if (args.series.name === 'GOOGL' && this.setValue1) {
        this.content += this.compare1(args.text.split('<br/>')[4].split('<b>')[1].split('</b>')[0]);
      } else if (args.series.name === 'AMZN' && this.setValue2) {
        this.content += this.compare2(args.text.split('<br/>')[4].split('<b>')[1].split('</b>')[0]);
      } else if (args.series.name === 'TSLA' && this.setValue3) {
        this.content += this.compare3(args.text.split('<br/>')[4].split('<b>')[1].split('</b>')[0]);
      } else {
        /* tslint:disable:no-string-literal */
        this.setIndicatorAnnotation(args.text, (args.series as Series)['parentObj']['type']);
      }
      args.text = '';
    };

    this.pointRender = (args: IPointRenderEventArgs) => {
      if (args.series.type === 'Candle') {
        this.pointColors.push(args.fill);
      } else {
        args.fill = this.pointColors[args.point.index];
      }
    };

    this.chartMouseLeave = (args: IMouseEventArgs) => { this.removeSecondaryElement(); };
    this.chartMouseMove = (args: IMouseEventArgs) => {
      if (!withInBounds(this.chart.mouseX, this.chart.mouseY, this.chart.chartAxisLayoutPanel.seriesClipRect)) {
        this.removeSecondaryElement();
      }
    };

  }
  public renderAnnotation(): void {
    this.content = this.candle(this.candleValue);
    if (this.secondaryValue) {
      this.content += this.compare(this.secondaryValue);
    }
    if (this.thirdValue) {
      this.content += this.compare1(this.thirdValue);
    }
    if (this.fourthValue) {
      this.content += this.compare2(this.fourthValue);
    }
    if (this.fifthValue) {
      this.content += this.compare3(this.fifthValue);
    }
    this.chart.indicators.map((indicator: TechnicalIndicatorModel) => {
      let type: string = indicator.type.toLocaleLowerCase();
      if (type === 'tma') {
        this.content += this.tma(this.tmaValue);
      } else if (type === 'bollingerbands') {
        this.content += this.bollinger(this.bollingerValue);
      } else if (type === 'rsi') {
        this.content += this.rsi(this.rsiValue);
      } else if (type === 'sma') {
        this.content += this.sma(this.smaValue);
      } else if (type === 'macd') {
        this.content += this.macd(this.macdValue);
      }
    });
    this.chart.setAnnotationValue(1, this.content);
  }
  public candle(value: string): string {
    this.candleValue = value.indexOf('$') > -1 ? value.split('$')[1] : value;
    return '<div style="height: 26px;margin-top:5px;padding: 5px;float:left;' +
      ' font-size: 13px;background: #fff; opacity:0.9; color: #464e56; ' +
      ' box-shadow:0 0 8px 0 rgba(70,78,86,.25);' +
      ' border-radius: 3px">' +
      '<span style="float:left;height: 26px;margin-top:-5px;margin-left:-5px;' +
      ' border-top-left-radius: 2px;border-bottom-left-radius: 2px;background-color: rgb(0, 129, 242);width:5px;"></span>' +
      '<span style="float:left;padding-left:5px;">GOOG: $' + this.candleValue + '</span></div>';
  }

  public tma(value: string): string {
    this.tmaValue = value.indexOf(':') > -1 ? value.split(':')[1] : value;
    return '<div style="margin-left:5px;float:left;margin-top:5px;height: 26px;padding: 5px;' +
      ' font-size: 13px;background: #fff; opacity:0.9; color: #464e56; ' +
      ' box-shadow:0 0 8px 0 rgba(70,78,86,.25);' +
      ' border-radius: 3px">' +
      '<span style="float:left;padding-left:1px;">TMA:<span style="color:#6063ff">' + this.tmaValue + '</span></span>' +
      '<span id="tma" class="e-icons e-close" style="padding-left:5px;padding-top:2px;float:right;cursor:pointer;"></span></div>';
  };
  public compare(value: string): string {
    this.secondaryValue = value;
    return '<div style="margin-left:5px;float:left;margin-top:5px;height: 26px;padding: 5px;' +
      ' font-size: 13px;background: #fff; opacity:0.9; color: #464e56; ' +
      ' box-shadow:0 0 8px 0 rgba(70,78,86,.25);' +
      ' border-radius: 3px">' +
      '<span style="float:left;height: 26px;margin-top:-5px;margin-left:-5px;' +
      ' border-top-left-radius: 2px;border-bottom-left-radius: 2px;background-color: #ad6eff;width:5px;"></span>' +
      '<span style="float:left;padding-left:5px;">AAPL: $' + value + '</span>' +
      '<span id="aapl" class="e-icons e-close" style="padding-left:5px;padding-top:2px;float:right;cursor:pointer;"></span></div>';
  };

  public compare1(value: string): string {
    this.thirdValue = value;
    return '<div style="margin-left:5px;float:left;margin-top:5px;height: 26px;padding: 5px;' +
      ' font-size: 13px;background: #fff; opacity:0.9; color: #464e56; ' +
      ' box-shadow:0 0 8px 0 rgba(70,78,86,.25);' +
      ' border-radius: 3px">' +
      '<span style="float:left;height: 26px;margin-top:-5px;margin-left:-5px;' +
      ' border-top-left-radius: 2px;border-bottom-left-radius: 2px;background-color: rgb(115, 211, 255);width:5px;"></span>' +
      '<span style="float:left;padding-left:5px;">GOOGL: $' + value + '</span>' +
      '<span id="googl" class="e-icons e-close" style="padding-left:5px;padding-top:2px;float:right;cursor:pointer;"></span></div>';
  };


  public compare2(value: string): string {
    this.fourthValue = value;
    return '<div style="margin-left:5px;float:left;margin-top:5px;height: 26px;padding: 5px;' +
      ' font-size: 13px;background: #fff; opacity:0.9; color: #464e56; ' +
      ' box-shadow:0 0 8px 0 rgba(70,78,86,.25);' +
      ' border-radius: 3px">' +
      '<span style="float:left;height: 26px;margin-top:-5px;margin-left:-5px;' +
      ' border-top-left-radius: 2px;border-bottom-left-radius: 2px;background-color: #70ad47;width:5px;"></span>' +
      '<span style="float:left;padding-left:5px;">AMZN: $' + value + '</span>' +
      '<span id="amzn" class="e-icons e-close" style="padding-left:5px;padding-top:2px;float:right;cursor:pointer;"></span></div>';
  };

  public compare3(value: string): string {
    this.fifthValue = value;
    return '<div style="margin-left:5px;float:left;margin-top:5px;height: 26px;padding: 5px;' +
      ' font-size: 13px;background: #fff; opacity:0.9; color: #464e56; ' +
      ' box-shadow:0 0 8px 0 rgba(70,78,86,.25);' +
      ' border-radius: 3px">' +
      '<span style="float:left;height: 26px;margin-top:-5px;margin-left:-5px;' +
      ' border-top-left-radius: 2px;border-bottom-left-radius: 2px;background-color: #dd8abd;width:5px;"></span>' +
      '<span style="float:left;padding-left:5px;">TSLA: $' + value + '</span>' +
      '<span id="tsla" class="e-icons e-close" style="padding-left:5px;padding-top:2px;float:right;cursor:pointer;"></span></div>';
  };
  public bollinger(value: string): string {
    this.bollingerValue = value.indexOf(':') > -1 ? value.split(':')[1] : value;
    return '<div style="margin-left:5px;float:left;margin-top:5px;height: 26px;padding: 5px;' +
      ' font-size: 13px;background: #fff; opacity:0.9; color: #464e56; ' +
      ' box-shadow:0 0 8px 0 rgba(70,78,86,.25);' +
      ' border-radius: 3px">' +
      '<span style="float:left;padding-left:1px;">Bollinger: <span style="color:rgba(245, 203, 35, 1)">' + this.bollingerValue + '</span></span>' +
      '<span id="bollingerbands" class="e-icons e-close" style="padding-left:5px;padding-top:2px;float:right;cursor:pointer;"></span></div>';
  };
  public rsi(value: string): string {
    this.rsiValue = value.indexOf(':') > -1 ? value.split(':')[1] : value;
    return '<div style="margin-left:5px;float:left;margin-top:5px;height: 26px;padding: 5px;' +
      ' font-size: 13px;background: #fff; opacity:0.9; color: #464e56; ' +
      ' box-shadow:0 0 8px 0 rgba(70,78,86,.25);' +
      ' border-radius: 3px">' +
      '<span style="float:left;padding-left:1px;">RSI:<span style="color:#FAA512">' + this.rsiValue + '</span></span>' +
      '<span id="rsi" class="e-icons e-close" style="padding-left:5px;padding-top:2px;float:right;cursor:pointer;"></span></div>';
  };
  public sma(value: string): string {
    this.smaValue = value.indexOf(':') > -1 ? value.split(':')[1] : value;
    return '<div style="margin-left:5px;float:left;margin-top:5px;height: 26px;padding: 5px;' +
      ' font-size: 13px;background: #fff; opacity:0.9; color: #464e56; ' +
      ' box-shadow:0 0 8px 0 rgba(70,78,86,.25);' +
      ' border-radius: 3px">' +
      '<span style="float:left;padding-left:1px;">SMA:<span style="color:#32CD32">' + this.smaValue + '</span></span>' +
      '<span id="sma" class="e-icons e-close" style="padding-left:5px;padding-top:2px;float:right;cursor:pointer;"></span></div>';
  };
  public macd(value: string): string {
    this.macdValue = value.indexOf(':') > -1 ? value.split(':')[1] : value;
    return '<div style="margin-left:5px;float:left;margin-top:5px;height: 26px;padding: 5px;' +
      ' font-size: 13px;background: #fff; opacity:0.9; color: #464e56; ' +
      ' box-shadow:0 0 8px 0 rgba(70,78,86,.25);' +
      ' border-radius: 3px">' +
      '<span style="float:left;padding-left:1px;">MACD:<span style="color:#ff9933">' + this.macdValue + '</span></span>' +
      '<span id="macd" class="e-icons e-close" style="padding-left:5px;padding-top:2px;float:right;cursor:pointer;"></span></div>';
  };

  public setIndicatorAnnotation(value: string, type: string): string {
    if (value.indexOf('SignalLine') > -1) {
      value = value.replace('SignalLine', '')
      if (type === 'Tma') {
        this.tmaValue = value.replace(' : ', ': $');
      } else if (type === 'Macd') {
        value = value;
        this.macdValue = value;
      } else if (type === 'BollingerBands') {
        this.bollingerValue = value.replace(' : ', ': $');
      } else if (type === 'Rsi') {
        this.rsiValue = value.replace(' : ', ': $');
      } else {
        this.smaValue = value.replace(' : ', ': $');
      }
    }
    this.renderAnnotation();
    return this.content;
  }

  public getContent(value: string): string {
    let text: string[] = value.split('<br/>'); let html: string = '<table>';
    for (let i: number = 1; i < text.length; i++) {
      let value: string[] = text[i].split(':');
      if (i === text.length - 1) {
        html += '<tr><td align = "left">' + value[0] + '</td><td align = "right">' +
          Math.round(((+value[1].split('</b>')[0].split('<b>')[1]) / 10000000)) + 'B';
      } else {
        html += '<tr><td align = "left">' + value[0] + '</td><td>$' +
          (+value[1].split(' <b>')[1].split('</b>')[0]).toFixed(2) + '</td></tr>';
      }
    }
    return html;
  };

  public removeSecondaryElement = (time?: number): void => {
    setTimeout(() => {
      if (getElement('annotation')) {
        remove(getElement('annotation'));
      }
    },
      // tslint:disable-next-line:align
      time === 0 ? this.chart.setAnnotationValue(0, '<div></div>') : 2000
    );
  }

  public handleResize(): void {
    document.getElementById('stock-details').style.minHeight = 'auto';
    document.getElementById('stock-details').style.minHeight = document.documentElement.offsetHeight + 'px';

    let elements: NodeList = document.querySelectorAll('.e-popup-open');
    let length: number = elements.length;
    for (let i: number = 0; i < length; i++) {
      (elements[i] as HTMLElement).classList.remove('e-popup-open');
      (elements[i] as HTMLElement).classList.add('e-popup-close');
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any): void {
    /** Document height alignment corrections for high resoultions screens */
    this.handleResize();
  }
}