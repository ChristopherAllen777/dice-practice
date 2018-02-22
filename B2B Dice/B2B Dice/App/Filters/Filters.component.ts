import { Component, OnInit, Input } from '@angular/core';
import { CommonDataService } from '../Common/CommonData.service';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { MetricsService } from '../Common/MetricsService.service';
import { PurchaseOrdersService } from '../PurchaseOrders/PurchaseOrders.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
    selector: 'filters',
    templateUrl: './Filters.component.html'
})

export class FiltersComponent implements OnInit {
    showResults = false;
    noDisplaySelected = false;
    param: string = null;
    paramDisplay: string = null;
    paramVal: string = null;
    showCalender = false;
    showAutoComplete = true;
    arrayOfKeys: string[] = [];
    displayBrowse = false;
    displayCustomer = true;
    filters = {
    };

    params = [
        {
            "QueryName": "customerNumber",
            "DisplayName": "Profile ID"
        },
        {
            "QueryName": "startDate",
            "DisplayName": "Start Date"
        },
        {
            "QueryName": "endDate",
            "DisplayName": "End Date"
        },
        {
            "QueryName": "poNumber",
            "DisplayName": "PO Number"
        },
        {
            "QueryName": "threadID",
            "DisplayName": "Thread ID"
        }
    ];

    constructor(private commonDataService: CommonDataService, private _http: Http, private metrics: MetricsService,
        private poSrvc: PurchaseOrdersService, private router: Router) {
    }

    ngOnInit() {
        sessionStorage.setItem('currentPage', 'Filter Control');
        this.metrics.sendMetric('Filter Control loaded')
            .subscribe(() => {
                //needed to make call
            });

        this.commonDataService.setPageTitle('Search');
        this.commonDataService.pageChange();

        this.prefillFilters();
        this.paramDisplay = "Profile ID";
        this.param = 'customerNumber';

        this.getPurchaseOrders();
    }

    prefillFilters() {
        for (let param of this.params) {
            this.filters[param.QueryName] = null;
        }
    }

    setDisplay(display: string) {
        switch (display) {
            case 'browse':
                this.displayBrowse = true;
                this.displayCustomer = false;
                break;
            case 'customer':
                this.displayBrowse = false;
                this.displayCustomer = true;
                break;
        }
    }

    getPurchaseOrders() {
        if (this.displayBrowse || this.displayCustomer) {
            this.showResults = true;
            this.noDisplaySelected = false;
            this.commonDataService.setFilters(this.filters);
            this.commonDataService.filterChange();
        }
        else {
            this.showResults = false;
            this.noDisplaySelected = true;
        }
    }
    clearFilter() {
        this.paramVal = '';
    }

    setParamName(param: any) {
        this.param = param.QueryName;
        this.paramDisplay = param.DisplayName;
        this.paramVal = null;

        this.showCalender = false;
        this.showAutoComplete = false;
        if (this.param.toLowerCase().indexOf('date') != -1) {
            this.showCalender = true;
        }
        if (this.param == 'customerNumber') {
            this.showAutoComplete = true;
        }
    }

    handleEnter() {
        console.log(this.paramsContainValue())
        if (!this.paramsContainValue()) {
            this.addFilterParam();
        } else {
            this.getPurchaseOrders();
        }
    }

    paramsContainValue() {

        for (let key of Object.keys(this.filters)) {
            console.log(key);
            console.log(this.filters[key])
            if (this.filters[key] != null && this.filters[key].Value == this.paramVal) {
                return true;
            }
        }
        return false;
    }

    addFilterParam() {
        this.filters[this.param] = {
            "Value": this.paramVal,
            "DisplayName": this.paramDisplay
        }
        if (this.arrayOfKeys.indexOf(this.param) == -1) {
            this.arrayOfKeys.push(this.param);
        }
    }

    removeFilterParam(param: string) {
        this.filters[param] = null;
        var index = this.arrayOfKeys.indexOf(param);
        if (index != -1) {
            this.arrayOfKeys.splice(index, 1)
        }
    }

    autocompleteSource(keyword: string) {
        return this.poSrvc.getAutocomplete(keyword);
    }
}