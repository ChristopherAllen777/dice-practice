import { Injectable } from '@angular/core';
import { Subject } from 'rxjs/Subject';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import { IPurchaseOrder } from '../PurchaseOrders/PurchaseOrder';

@Injectable()
export class CommonDataService {
    private _selectedPurchaseOrder: string = null;
    private _previousPage: string = null;
    private _filters: any = null;
    private _pageTitle: string = null;
    constructor(private _http: Http) { }

    setSelectedPO(po: string) {
        this._selectedPurchaseOrder = po;
    }

    getSelectedPO() {
        return this._selectedPurchaseOrder;
    }

    setPreviousPage(previousPage: string) {
        this._previousPage = previousPage;
    }

    getPreviousPage() {
        return this._previousPage;
    }

    setFilters(filters: any) {
        this._filters = filters;
    }

    getFilters() {
        return this._filters;
    }

    setPageTitle(pageTitle: any) {
        this._pageTitle = pageTitle;
    }

    getPageTitle() {
        return this._pageTitle;
    }

    onPageChange = new Subject<void>();

    pageChange(): void {
        this.onPageChange.next();
    }

    onFilterChange = new Subject<void>();

    filterChange(): void {
        this.onFilterChange.next();
    }

    //onPoSearch = new Subject<void>();

    //poSearch(): void {
    //    this._http.get('#/track/purchase-orders')
    //        .subscribe(() => {
    //            this.onPoSearch.next();
    //        })
    //}
}