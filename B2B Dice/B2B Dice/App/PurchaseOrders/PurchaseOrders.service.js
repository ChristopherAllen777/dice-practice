"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var http_1 = require("@angular/http");
var CONSTANTS_1 = require("../Common/CONSTANTS");
require("rxjs/add/operator/map");
var PurchaseOrdersService = (function () {
    function PurchaseOrdersService(_http) {
        this._http = _http;
    }
    PurchaseOrdersService.prototype.getPurchaseOrderById = function (id) {
        return this._http.get(CONSTANTS_1.CONSTANTS._diceApiUrl() + '/purchaseorder/' + id)
            .map(function (response) { return response.json(); });
    };
    PurchaseOrdersService.prototype.getPurchaseOrders = function (filters, currentPage, pageSize, displayType, sortColumn, sortOrder, allowNullThreadID) {
        if (sortColumn === void 0) { sortColumn = ""; }
        if (sortOrder === void 0) { sortOrder = ""; }
        if (allowNullThreadID === void 0) { allowNullThreadID = false; }
        var url = CONSTANTS_1.CONSTANTS._diceApiUrl();
        switch (displayType) {
            case 'browse':
                url += '/purchaseorder';
                break;
            case 'customer':
                url += '/customer';
                break;
            case 'excel':
                url += '/ExportToExcel';
                break;
        }
        var params = {};
        if (filters.startDate != null) {
            params.StartDate = this.formatDate(filters.startDate.Value);
        }
        else {
            params.StartDate = this.formatDate(new Date(-2208984820000));
        }
        if (filters.endDate != null) {
            params.EndDate = this.formatDate(filters.endDate.Value);
        }
        else {
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
        return this._http.post(url, params).map(function (response) { return response.json(); });
    };
    PurchaseOrdersService.prototype.getAutocomplete = function (keyword) {
        return this._http.get(CONSTANTS_1.CONSTANTS._diceApiUrl() + '/ProfileIDLookup/' + keyword)
            .map(function (response) { return response.json(); });
    };
    PurchaseOrdersService.prototype.getAdditionalDetails = function (stepName, threadID, poNumber) {
        return this._http.get(CONSTANTS_1.CONSTANTS._diceApiUrl() + '/AdditionalDetails?threadID=' + threadID + '&step=' + stepName
            + '&PONumber=' + poNumber)
            .map(function (response) { return response.json(); });
    };
    PurchaseOrdersService.prototype.formatDate = function (date) {
        return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getDate() + " "
            + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":"
            + ("0" + date.getMilliseconds()).slice(-2);
    };
    return PurchaseOrdersService;
}());
PurchaseOrdersService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [http_1.Http])
], PurchaseOrdersService);
exports.PurchaseOrdersService = PurchaseOrdersService;
//# sourceMappingURL=PurchaseOrders.service.js.map