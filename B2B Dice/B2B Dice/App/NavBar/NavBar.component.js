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
var CommonData_service_1 = require("../Common/CommonData.service");
var router_1 = require("@angular/router");
var http_1 = require("@angular/http");
var angular2_uuid_1 = require("angular2-uuid");
var MetricsService_service_1 = require("../Common/MetricsService.service");
var Profile_service_1 = require("../Profile/Profile.service");
require("rxjs/add/operator/finally");
var NavBarComponent = (function () {
    function NavBarComponent(commonDataService, router, http, metrics, profiles) {
        var _this = this;
        this.commonDataService = commonDataService;
        this.router = router;
        this.http = http;
        this.metrics = metrics;
        this.profiles = profiles;
        this.headerLinks = [
            //{
            //    Id: 'po-browse-link',
            //    Text: "Browse PO",
            //    Href: '/browse/purchase-orders'
            //},
            {
                Id: 'po-track-link',
                Text: "Track PO",
                Href: '/track/purchase-orders'
            },
            //{
            //    Id: 'customer-search-link',
            //    Text: "Search Customer",
            //    Href: '/search/customers'
            //},
            {
                Id: 'search-link',
                Text: "Search",
                Href: '/search'
            },
            {
                Id: 'analytics-link',
                Text: "Analytics",
                Href: '/analytics'
            },
            {
                Id: 'suggestions-link',
                Text: "Suggestions",
                Href: '/suggestions'
            }
        ];
        this.purchaseOrderNum = '';
        this.username = '';
        this.pageTitle = '';
        this.pageTitleListener = null;
        if (!sessionStorage.getItem('sessionUser')) {
            this.http.get(document.baseURI + 'api/Auth')
                .finally(function () {
                if (!sessionStorage.getItem('sessionID')) {
                    sessionStorage.setItem('sessionID', angular2_uuid_1.UUID.UUID());
                }
            })
                .subscribe(function (result) {
                var usernameDirty = result.json();
                var usernameIndex = usernameDirty.lastIndexOf('\\') + 1;
                _this.username = usernameDirty.substr(usernameIndex, usernameDirty.length - usernameIndex);
                sessionStorage.setItem('sessionUser', _this.username);
                _this.profiles.getProfile(_this.username)
                    .subscribe(function (profile) {
                    sessionStorage.setItem('profile', JSON.stringify(profile));
                });
            });
        }
        else {
            this.username = sessionStorage.getItem('sessionUser');
        }
    }
    NavBarComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.pageTitleListener = this.commonDataService.onPageChange.subscribe(function () {
            _this.pageTitle = _this.commonDataService.getPageTitle();
        });
    };
    NavBarComponent.prototype.ngOnDestroy = function () {
        this.pageTitleListener.unsubscribe();
    };
    NavBarComponent.prototype.clearPO = function () {
        this.purchaseOrderNum = '';
    };
    NavBarComponent.prototype.searchPO = function (poNum) {
        if (poNum != '') {
            window.open('#/track/purchase-orders?poNum=' + poNum, '_blank');
        }
    };
    return NavBarComponent;
}());
NavBarComponent = __decorate([
    core_1.Component({
        selector: 'my-nav',
        templateUrl: './NavBar.component.html'
    }),
    __metadata("design:paramtypes", [CommonData_service_1.CommonDataService, router_1.Router, http_1.Http,
        MetricsService_service_1.MetricsService, Profile_service_1.ProfileService])
], NavBarComponent);
exports.NavBarComponent = NavBarComponent;
//# sourceMappingURL=NavBar.component.js.map