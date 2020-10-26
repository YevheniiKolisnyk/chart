import {Component, HostBinding, OnInit} from '@angular/core';
import {ChangesService} from '../shared/changes.service';

@Component({
  selector: 'app-graph',
  templateUrl: './graph.component.html',
  styleUrls: ['./graph.component.scss', './graph.media.scss']
})
export class GraphComponent implements OnInit {
  @HostBinding('class') componentCssClass;

  light = true;
  dark = false;
  green = false;

  sorted = {
    position: false,
    name: false,
    symbol: false,
    value: false
  };
  changesResponse;
  changes;
  changesPerHour = [];
  changesPerDay = [];
  changesPerWeek = [];
  roundEdges = false;
  showXAxis = true;
  showYAxis = true;
  gradient = false;
  showLegend = true;
  showXAxisLabel = true;
  xAxisLabel = 'Currency';
  showYAxisLabel = true;
  yAxisLabel = 'Changes';
  colorScheme = {domain: ['blue']};
  value = [];
  themes = [
    'light',
    'dark',
    'green'
  ];
  tableData = [];
  newValue = [];
  oldValue = [];
  filteringType = '';
  showPositionFilter: boolean = false;
  showNameFilter: boolean = false;
  showSymbolFilter: boolean = false;
  showPercentFilter: boolean = false;

  constructor(
    private changesService: ChangesService,
  ) {
  }


  ngOnInit(): void {
    this.changesService.getChanges().subscribe(res => {
      this.changes = res.data[0].entries.map(item => {
        return {name: item.name, value: item.percent, symbol: item.symbol, position: item.position};
      });
      this.value = this.changes;
      this.tableData = this.value;

      this.changesPerHour = res.data[0].entries.map(item => {
        return {name: item.name, value: item.percent_change_1h, symbol: item.symbol, position: item.position};
      });

      this.changesPerDay = res.data[0].entries.map(item => {
        return {name: item.name, value: item.percent_change_24h, symbol: item.symbol, position: item.position};
      });

      this.changesPerWeek = res.data[0].entries.map(item => {
        return {name: item.name, value: item.percent_change_7d, symbol: item.symbol, position: item.position};
      });
    });
  }

  sort(type) {
    this.tableData.sort((a, b) => {
      if (type === 'value' || type === 'position') {
        a[type] = +a[type];
        b[type] = +b[type];
      }

      if (a[type] < b[type]) {
        if (this.sorted[type]) {
          return -1;
        } else {
          return 1;
        }
      } else if (a[type] > b[type]) {
        if (this.sorted[type]) {
          return 1;
        } else {
          return -1;
        }
      }
      return 0;

    });
    this.sorted[type] = !this.sorted[type];
  }

  filter(value) {
    this.newValue = this.oldValue.filter(item => {
      return item[this.filteringType].toString().toLowerCase().startsWith(value.target.value.toLowerCase());
    });
    this.tableData = this.newValue;
  }

  openFilter(type) {
    this.filteringType = type;
    this.tableData = this.value;
    this.oldValue = this.tableData;
    this.newValue = [];
    switch (type) {
      case 'position':
        this.showPositionFilter = !this.showPositionFilter;
        this.showNameFilter = false;
        this.showSymbolFilter = false;
        this.showPercentFilter = false;
        break;
      case 'name':
        this.showNameFilter = !this.showNameFilter;
        this.showPositionFilter = false;
        this.showSymbolFilter = false;
        this.showPercentFilter = false;
        break;
      case 'symbol':
        this.showSymbolFilter = !this.showSymbolFilter;
        this.showPositionFilter = false;
        this.showNameFilter = false;
        this.showPercentFilter = false;
        break;
      case 'value':
        this.showPercentFilter = !this.showPercentFilter;
        this.showPositionFilter = false;
        this.showNameFilter = false;
        this.showSymbolFilter = false;
        break;
    }
  }

  closeFilters() {
    this.showPositionFilter = false;
    this.showNameFilter = false;
    this.showSymbolFilter = false;
    this.showPercentFilter = false;
  }

  changeThemeHandler(event) {
    switch (event.target.value) {
      case 'light':
        this.light = true;
        this.dark = false;
        this.green = false;
        this.colorScheme = {domain: ['blue']}
        break;
      case 'dark':
        this.light = false;
        this.dark = true;
        this.green = false;
        this.colorScheme = {domain: ['white']}
        break;
      case 'green':
        this.light = false;
        this.dark = false;
        this.green = true;
        this.colorScheme = {domain: ['yellow']}
        break;
    }
  }

}
