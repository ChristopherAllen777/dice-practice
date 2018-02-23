"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var platform_browser_1 = require("@angular/platform-browser");
var forms_1 = require("@angular/forms");
var http_1 = require("@angular/http");
var app_component_1 = require("./app.component");
var PurchaseOrders_Track_component_1 = require("./PurchaseOrders/PurchaseOrders.Track.component");
var PurchaseOrders_Browse_component_1 = require("./PurchaseOrders/PurchaseOrders.Browse.component");
var PurchaseOrders_BusinessFlow_component_1 = require("./PurchaseOrders/PurchaseOrders.BusinessFlow.component");
var Customers_component_1 = require("./Customers/Customers.component");
var Analytics_component_1 = require("./Analytics/Analytics.component");
var NavBar_component_1 = require("./NavBar/NavBar.component");
var TrackingInfo_component_1 = require("./TrackingInfo/TrackingInfo.component");
var Filters_component_1 = require("./Filters/Filters.component");
var Customers_Display_component_1 = require("./Customers/Customers.Display.component");
var Suggestions_component_1 = require("./Suggestions/Suggestions.component");
var SuggestionDetails_component_1 = require("./Suggestions/SuggestionDetails.component");
var PurchaseOrders_Browse_Display_component_1 = require("./PurchaseOrders/PurchaseOrders.Browse.Display.component");
var TreeNode_component_1 = require("./Common/TreeNode.component");
var primeng_1 = require("primeng/primeng");
var ng2_dragula_1 = require("ng2-dragula/ng2-dragula");
var animations_1 = require("@angular/platform-browser/animations");
var ng2_auto_complete_1 = require("ng2-auto-complete");
var app_routes_1 = require("./app.routes");
var Safe_pipe_1 = require("./Common/Safe.pipe");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [platform_browser_1.BrowserModule, forms_1.FormsModule, http_1.HttpModule, app_routes_1.routing, primeng_1.CalendarModule, animations_1.BrowserAnimationsModule, ng2_dragula_1.DragulaModule,
                ng2_auto_complete_1.Ng2AutoCompleteModule],
            declarations: [app_component_1.AppComponent, PurchaseOrders_Track_component_1.PurchaseOrdersTrackComponent, PurchaseOrders_Browse_component_1.PurchaseOrdersBrowseComponent, Filters_component_1.FiltersComponent,
                Customers_component_1.CustomersComponent, Analytics_component_1.AnalyticsComponent, NavBar_component_1.NavBarComponent, TrackingInfo_component_1.TrackingInfoComponent, PurchaseOrders_BusinessFlow_component_1.BusinessFlowComponent,
                Customers_Display_component_1.CustomersDisplayComponent, TreeNode_component_1.TreeNodeComponent, PurchaseOrders_Browse_Display_component_1.PurchaseOrdersBrowseDisplayComponent, Suggestions_component_1.SuggestionsComponent,
                SuggestionDetails_component_1.SuggestionDetailsComponent, Safe_pipe_1.SafePipe],
            bootstrap: [app_component_1.AppComponent]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map