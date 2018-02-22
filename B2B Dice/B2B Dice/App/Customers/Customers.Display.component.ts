import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonDataService } from '../Common/CommonData.service';
import { IPurchaseOrder } from '../PurchaseOrders/PurchaseOrder';
import { PurchaseOrdersService } from '../PurchaseOrders/PurchaseOrders.service';
import { Http, Response } from '@angular/http';
import { Router } from '@angular/router';
import { MetricsService } from '../Common/MetricsService.service';
import { ExcelService } from '../Common/Excel.service';
import { Subscription } from "rxjs/Subscription";
import { PagerService } from '../Common/Pager.service';

enum StepStatus {
    Completed = -1,
    NotStarted = 0,
    Failure = 1,
    InProgess = 2,
    Successful = 3,
    Warning = 4
}

@Component({
    selector: 'customers-display',
    templateUrl: './Customers.Display.component.html'
})

export class CustomersDisplayComponent implements OnInit, OnDestroy {
    purchaseOrders: IPurchaseOrder[] = null;
    showResults = false;
    showNoResults = false;
    pager: any = {};
    page: number = 0;
    pageSize: number = 100;
    total: number = null;
    resultsLoading = false;
    exportLoading = false;
    filterListener: Subscription = null;
    sortColumn = "";
    sortOrder = "";
    allowNullThreadID = false;

    counts: number[] = [5, 10, 25, 50, 100];

    private _filters: any = null;
    @Input()
    set filters(filters: any) {
        this._filters = filters;
        this.setPage(1);
    }
    get filters(): any { return this._filters; }

    constructor(private poSrvc: PurchaseOrdersService, private commonDataService: CommonDataService,
        private _http: Http, private metrics: MetricsService, private pagerService: PagerService,
        private router: Router, private excel: ExcelService) {
    }

    ngOnInit() {
        sessionStorage.setItem('currentPage', 'Customer Search');
        this.metrics.sendMetric('Page loaded')
            .subscribe(() => {
                //needed to make call
            });

        this.resultsLoading = true;
        this.filterListener = this.commonDataService.onFilterChange.subscribe(() => {
            this.filters = this.commonDataService.getFilters();
        })
    }

    ngOnDestroy() {
        this.filterListener.unsubscribe();
    }

    updateNullThreadIDResults() {
        this.allowNullThreadID = !this.allowNullThreadID;
        this.getPurchaseOrders();
    }

    getPurchaseOrders() {
        this.metrics.sendMetric('Getting filtered list of purchase orders started')
            .subscribe(() => {
                //needed to make call
            });

        this.poSrvc.getPurchaseOrders(this.filters, this.page, this.pageSize, 'customer', this.sortColumn,
            this.sortOrder, this.allowNullThreadID)
            .finally(() => {
                this.metrics.sendMetric('Getting filtered list of purchase orders finished')
                    .subscribe(() => {
                        //needed to make call
                    });
            })
            .subscribe((POs) => {
                if (POs.Total > 0) {
                    this.total = POs.Total;
                    this.purchaseOrders = POs.lst;
                    this.showResults = true;
                    this.showNoResults = false;

                    // get pager object from service
                    this.pager = this.pagerService.getPager(this.total, this.page, this.pageSize);
                }
                else {
                    this.purchaseOrders = null;
                    this.showNoResults = true;
                    this.showResults = false;
                }
                this.resultsLoading = false;
            });
    }

    loadPurchaseOrder(id: string) {
        this.metrics.sendMetric('Getting specific purchase order details started')
            .subscribe(() => {
                //needed to make call
            });

        this.poSrvc.getPurchaseOrderById(id)
            .finally(() => {
                this.metrics.sendMetric('Getting specific purchase order details finished')
                    .subscribe(() => {
                        //needed to make call
                    });
            })
            .subscribe((threads) => {
                if (this.validatePOs(threads)) {
                    for (let thread of threads) {
                        this.purchaseOrders.push(thread);
                    }
                }
            });
    }

    validatePOs(POs: IPurchaseOrder[]) {
        var valid = true;
        if (POs.length == 0) {
            valid = false;
        }
        return valid;
    }

    setSort(sortCol: string) {
        if (this.sortColumn != sortCol) {
            this.sortColumn = sortCol;
            this.sortOrder = "asc";
        }
        else {
            if (this.sortOrder == "asc") {
                this.sortOrder = "desc";
            }
            else {
                this.sortOrder = "asc";
            }
        }
        console.log(this.sortColumn);
        console.log(this.sortOrder);
        this.getPurchaseOrders();
    }

    getStepTooltip(stepStatus: number) {
        switch (stepStatus) {
            case StepStatus.Warning:
                return "Successful";
            case StepStatus.Successful:
                return "Successful";
            case StepStatus.Completed:
                return "Successful";
            case StepStatus.NotStarted:
                return "Not Started";
            case StepStatus.InProgess:
                return "In Progess";
            case StepStatus.Failure:
                return "Failure";
        }
    }

    setStatusColor(stepStatus: number) {
        return {
            successful: stepStatus == StepStatus.Successful || stepStatus == StepStatus.Warning,
            inProgress: stepStatus == StepStatus.InProgess,
            failed: stepStatus == StepStatus.Failure
        }
    }

    //trackPO(po: string) {
    //    this.commonDataService.setSelectedPO(po);
    //    this.commonDataService.poSearch();
    //    this.router.navigate(['/track/purchase-orders']);
    //}

    setPage(page: number) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }

        this.page = page;
        this.getPurchaseOrders();
    }

    setPageSize(size: number) {
        this.pageSize = size;
        this.setPage(1)
    }

    exportToExcel() {
        this.exportLoading = true;
        this.poSrvc.getPurchaseOrders(this.filters, 1, 9999, 'excel', this.sortColumn, this.sortOrder,
            this.allowNullThreadID)
            .subscribe((POs) => {
                if (POs.Total > 0) {
                    var json = this.reformatPOsAsJson(POs);
                    this.exportLoading = this.excel.exportAsExcelFile(json, 'CustomerSearch');
                }
            });
    }

    reformatPOsAsJson(POs: any) {
        var json: any[] = [];
        for (let po of POs.lst) {
            var jsonObj = {};
            jsonObj["Date"] = po.Date;
            jsonObj["ProfileID"] = po.ProfiLeID;
            jsonObj["PO Number"] = po.PONumber;
            jsonObj["ThreadID"] = po.ThreadID;
            for (let step of po.lstOfSteps) {
                jsonObj[step.Name] = step.POStatus;
            }
            json.push(jsonObj);
        }
        return json;
    }
}