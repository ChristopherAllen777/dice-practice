"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var router_1 = require("@angular/router");
var PurchaseOrders_Track_component_1 = require("./PurchaseOrders/PurchaseOrders.Track.component");
var PurchaseOrders_Browse_component_1 = require("./PurchaseOrders/PurchaseOrders.Browse.component");
var Customers_component_1 = require("./Customers/Customers.component");
var Filters_component_1 = require("./Filters/Filters.component");
var Analytics_component_1 = require("./Analytics/Analytics.component");
var Suggestions_component_1 = require("./Suggestions/Suggestions.component");
var SuggestionDetails_component_1 = require("./Suggestions/SuggestionDetails.component");
var routes = [
    { path: '', redirectTo: 'track/purchase-orders', pathMatch: 'full' },
    { path: 'track/purchase-orders', component: PurchaseOrders_Track_component_1.PurchaseOrdersTrackComponent },
    { path: 'browse/purchase-orders', component: PurchaseOrders_Browse_component_1.PurchaseOrdersBrowseComponent },
    { path: 'search/customers', component: Customers_component_1.CustomersComponent },
    { path: 'search', component: Filters_component_1.FiltersComponent },
    { path: 'browse/customers', component: Customers_component_1.CustomersComponent },
    { path: 'analytics', component: Analytics_component_1.AnalyticsComponent },
    { path: 'suggestions', component: Suggestions_component_1.SuggestionsComponent },
    { path: 'suggestion-detail', component: SuggestionDetails_component_1.SuggestionDetailsComponent }
];
exports.routing = router_1.RouterModule.forRoot(routes, { useHash: true });
//# sourceMappingURL=app.routes.js.map