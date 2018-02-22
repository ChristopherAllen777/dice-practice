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
var ng2_dragula_1 = require("ng2-dragula/ng2-dragula");
var router_1 = require("@angular/router");
var MetricsService_service_1 = require("../Common/MetricsService.service");
var Profile_service_1 = require("../Profile/Profile.service");
var AnalyticsComponent = (function () {
    function AnalyticsComponent(commonDataService, dragulaService, metrics, profiles, router) {
        //this.urls = ['http://10.164.33.167:5601/app/kibana#/visualize/edit/8484a800-a227-11e7-bb50-ed4c862531ab?_g=(refreshInterval%3A(display%3AOff%2Cpause%3A!f%2Cvalue%3A0)%2Ctime%3A(from%3Anow%2FM%2Cmode%3Aquick%2Cto%3Anow%2FM))', 'http://10.164.33.167:5601/app/kibana#/visualize/edit/6c70de50-a227-11e7-bb50-ed4c862531ab?_g=(refreshInterval%3A(display%3AOff%2Cpause%3A!f%2Cvalue%3A0)%2Ctime%3A(from%3Anow%2FM%2Cmode%3Aquick%2Cto%3Anow%2FM))', 'https://www.wikipedia.org/wiki/Main_Page'];
        //this.urls = ['https://www.wikipedia.org/wiki/Main_Page', 'https://en.wikipedia.org/wiki/Dell', 'https://en.wikipedia.org/wiki/AngularJS'];
        this.commonDataService = commonDataService;
        this.dragulaService = dragulaService;
        this.metrics = metrics;
        this.profiles = profiles;
        this.router = router;
        this.urls = [];
        this.newUrl = '';
        this.urlRequired = false;
        this.profile = null;
        var bag = this.dragulaService.find('first-bag');
        if (bag !== undefined)
            this.dragulaService.destroy('first-bag');
    }
    AnalyticsComponent.prototype.ngOnInit = function () {
        var _this = this;
        sessionStorage.setItem('currentPage', 'Analytics');
        this.metrics.sendMetric('Page loaded')
            .subscribe(function () {
            //needed to make call
        });
        this.commonDataService.setPageTitle('Analytics');
        this.commonDataService.pageChange();
        this.dragulaService.drag.subscribe(function (value) {
            _this.onDrag(value.slice(1));
        });
        this.dragulaService.dragend.subscribe(function (value) {
            _this.onDragEnd(value.slice(1));
        });
        this.dragulaService.over.subscribe(function (value) {
            _this.onOver(value.slice(1));
        });
        this.dragulaService.out.subscribe(function (value) {
            _this.onOut(value.slice(1));
        });
        this.dragulaService.setOptions('first-bag', {
            invalid: function (el, handle) {
                return handle.className.indexOf('handle') == -1;
            }
        });
        this.urls.push('http://10.164.33.167:5601/goto/e41814ecc04ea8318e8e4fa6555fc730?embed=true');
        this.profile = JSON.parse(sessionStorage.getItem('profile'));
        for (var _i = 0, _a = this.profile.DashboardUrls; _i < _a.length; _i++) {
            var url = _a[_i];
            this.urls.push(url);
        }
    };
    AnalyticsComponent.prototype.addUrl = function (url) {
        if (url != '') {
            this.urlRequired = false;
            this.urls.push(url);
            this.newUrl = '';
            this.profile.DashboardUrls.push(url);
            this.updateProfile();
        }
        else {
            this.urlRequired = true;
        }
    };
    AnalyticsComponent.prototype.clearUrl = function () {
        this.newUrl = '';
    };
    AnalyticsComponent.prototype.removeUrl = function (url) {
        this.urls.splice(this.urls.indexOf(url), 1);
        this.profile.DashboardUrls.splice(this.profile.DashboardUrls.indexOf(url), 1);
        this.updateProfile();
    };
    AnalyticsComponent.prototype.updateProfile = function () {
        console.log(this.profile);
        this.profile.LastUpdate = new Date();
        sessionStorage.setItem('profile', JSON.stringify(this.profile));
        this.profiles.updateProfile()
            .subscribe(function () {
            //needed to make call
        });
    };
    AnalyticsComponent.prototype.onDrag = function (args) {
        var e = args[0], el = args[1];
        e.querySelectorAll('.blank').forEach(function (item) {
            item.style.display = "block";
        });
    };
    AnalyticsComponent.prototype.onDragEnd = function (args) {
        var e = args[0], el = args[1];
        e.querySelectorAll('.blank').forEach(function (item) {
            item.style.display = "none";
        });
    };
    AnalyticsComponent.prototype.onOver = function (args) {
        var e = args[0], el = args[1], container = args[2];
        container.querySelectorAll('.blank').forEach(function (item) {
            item.style.display = "block";
        });
    };
    AnalyticsComponent.prototype.onOut = function (args) {
        var e = args[0], el = args[1], container = args[2];
        container.querySelectorAll('.blank').forEach(function (item) {
            item.style.display = "none";
        });
    };
    return AnalyticsComponent;
}());
AnalyticsComponent = __decorate([
    core_1.Component({
        selector: 'analytics',
        templateUrl: './Analytics.component.html'
    }),
    __metadata("design:paramtypes", [CommonData_service_1.CommonDataService, ng2_dragula_1.DragulaService,
        MetricsService_service_1.MetricsService, Profile_service_1.ProfileService, router_1.Router])
], AnalyticsComponent);
exports.AnalyticsComponent = AnalyticsComponent;
//# sourceMappingURL=Analytics.component.js.map