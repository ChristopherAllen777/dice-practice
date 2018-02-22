import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { CONSTANTS } from '../Common/CONSTANTS';
import 'rxjs/add/operator/map';
import { IPurchaseOrder } from './PurchaseOrder';

@Injectable()
export class PurchaseOrdersService {
    constructor(private _http: Http) { }

    getPurchaseOrderById(id: string) {
        return this._http.get(CONSTANTS._diceApiUrl() + '/purchaseorder/' + id)
            .map((response: Response) => response.json());
    }

    getPurchaseOrders(filters: any, currentPage: number, pageSize: number, displayType: string,
        sortColumn: string = "", sortOrder: string = "", allowNullThreadID: boolean = false) {
        var url = CONSTANTS._diceApiUrl();
        switch (displayType) {
            case 'browse':
                url += '/purchaseorder';
                break;
            case 'customer':
                url += '/customer';
                break;
            case 'excel':
                url += '/ExportToExcel'
                break;
        }

        var params: any = {};
        if (filters.startDate != null) {
            params.StartDate = this.formatDate(filters.startDate.Value);
        } else {
            params.StartDate = this.formatDate(new Date(-2208984820000));
        }
        if (filters.endDate != null) {
            params.EndDate = this.formatDate(filters.endDate.Value);
        } else {
            params.EndDate = this.formatDate(new Date(4102400380000));
        }
        if (filters.customerNumber != null) {
            params.CustomerNumber = filters.customerNumber.Value;
        }
        else {
            params.CustomerNumber = "";
        }
        if (filters.threadID != null) {
            params.ThreadID = filters.threadID.Value;
        }
        else {
            params.ThreadID = "";
        }
        if (filters.poNumber != null) {
            params.PONumber = filters.poNumber.Value;
        }
        else {
            params.PONumber = "";
        }
        params.Size = pageSize;
        params.Page = ((currentPage - 1) * pageSize);

        //not implemented yet
        params.SortColumn = sortColumn;
        params.SortOrder = sortOrder;
        params.AllowNullThreadID = allowNullThreadID;

        //console.log(params)
        return this._http.post(url, params).map((response: Response) => response.json());
    }

    getAutocomplete(keyword: string) {
        return this._http.get(CONSTANTS._diceApiUrl() + '/ProfileIDLookup/' + keyword)
            .map((response: Response) => response.json());
    }

    getAdditionalDetails(stepName: string, threadID: number, poNumber: string) {
        return this._http.get(CONSTANTS._diceApiUrl() + '/AdditionalDetails?threadID=' + threadID + '&step=' + stepName
            + '&PONumber=' + poNumber)
            .map((response: Response) => response.json());
    }

    private formatDate(date: Date) {
        return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getDate() + " "
            + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":"
            + ("0" + date.getMilliseconds()).slice(-2)
    }
}
