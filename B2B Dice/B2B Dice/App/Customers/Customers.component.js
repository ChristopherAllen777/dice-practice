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
var router_1 = require("@angular/router");
var MetricsService_service_1 = require("../Common/MetricsService.service");
var CustomersComponent = (function () {
    function CustomersComponent(_http, metrics, router) {
        this._http = _http;
        this.metrics = metrics;
        this.router = router;
    }
    CustomersComponent.prototype.ngOnInit = function () {
        sessionStorage.setItem('currentPage', 'Customer Search');
        this.metrics.sendMetric('Page loaded')
            .subscribe(function () {
            //needed to make call
        });
    };
    return CustomersComponent;
}());
CustomersComponent = __decorate([
    core_1.Component({
        selector: 'customers',
        templateUrl: './Customers.component.html'
    }),
    __metadata("design:paramtypes", [http_1.Http, MetricsService_service_1.MetricsService, router_1.Router])
], CustomersComponent);
exports.CustomersComponent = CustomersComponent;
//# sourceMappingURL=Customers.component.js.map