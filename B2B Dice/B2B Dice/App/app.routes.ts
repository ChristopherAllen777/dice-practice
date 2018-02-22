import { RouterModule, Routes } from '@angular/router';
import { PurchaseOrdersTrackComponent } from './PurchaseOrders/PurchaseOrders.Track.component';
import { PurchaseOrdersBrowseComponent } from './PurchaseOrders/PurchaseOrders.Browse.component';
import { CustomersComponent } from './Customers/Customers.component';
import { FiltersComponent } from './Filters/Filters.component';
import { AnalyticsComponent } from './Analytics/Analytics.component';
import { SuggestionsComponent } from './Suggestions/Suggestions.component';
import { SuggestionDetailsComponent } from './Suggestions/SuggestionDetails.component';

const routes: Routes = [
    { path: '', redirectTo: 'track/purchase-orders', pathMatch: 'full' },
    { path: 'track/purchase-orders', component: PurchaseOrdersTrackComponent },
    { path: 'browse/purchase-orders', component: PurchaseOrdersBrowseComponent },
    { path: 'search/customers', component: CustomersComponent },
    { path: 'search', component: FiltersComponent },
    { path: 'browse/customers', component: CustomersComponent },
    { path: 'analytics', component: AnalyticsComponent },
    { path: 'suggestions', component: SuggestionsComponent },
    { path: 'suggestion-detail', component: SuggestionDetailsComponent }
];

export const routing = RouterModule.forRoot(routes, { useHash: true });