"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var core_1 = require("@angular/core");
var PurchaseOrders_Track_component_1 = require("./PurchaseOrders/PurchaseOrders.Track.component");
var PurchaseOrders_Browse_component_1 = require("./PurchaseOrders.Browse.component");
var Filters_component_1 = require("./Filters/Filters.component");
var Analytics_component_1 = require("./Analytics/Analytics.component");
var Suggestions_component_1 = require("./Suggestions/Suggestions.component");
var routes = [
    { path: '', redirectTo: 'track/purchase-orders', pathMatch: 'full' },
    { path: 'track/purchase-orders', component: PurchaseOrders_Track_component_1.PurchaseOrdersTrackComponent },
    { path: 'browse/purchase-orders', component: PurchaseOrders_Browse_component_1.PurchaseOrdersBrowseComponent },
    { path: 'search/customers', component: CustomersComponent },
    { path: 'search', component: Filters_component_1.FiltersComponent },
    { path: 'browse/customers', component: CustomersComponent },
    { path: 'analytics', component: Analytics_component_1.AnalyticsComponent },
    { path: 'suggestions', component: Suggestions_component_1.SuggestionsComponent },
    { path: 'suggestion-detail', component: SuggestionDetailsComponent }
];
exports.routing = core_1.RouterModule.forRoot(routes, { useHash: true });
//# sourceMappingURL=app.routes.js.map