import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from "@angular/forms";
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component'
import { PurchaseOrdersTrackComponent } from './PurchaseOrders/PurchaseOrders.Track.component';
import { PurchaseOrdersBrowseComponent } from './PurchaseOrders/PurchaseOrders.Browse.component';
import { BusinessFlowComponent } from './PurchaseOrders/PurchaseOrders.BusinessFlow.component';
import { CustomersComponent } from './Customers/Customers.component';
import { AnalyticsComponent } from './Analytics/Analytics.component';
import { NavBarComponent } from './NavBar/NavBar.component';
import { TrackingInfoComponent } from './TrackingInfo/TrackingInfo.component';
import { FiltersComponent } from './Filters/Filters.component';
import { CustomersDisplayComponent } from './Customers/Customers.Display.component';
import { SuggestionsComponent } from './Suggestions/Suggestions.component';
import { SuggestionDetailsComponent } from './Suggestions/SuggestionDetails.component';
import { PurchaseOrdersBrowseDisplayComponent } from './PurchaseOrders/PurchaseOrders.Browse.Display.component';
import { TreeNodeComponent } from './Common/TreeNode.component';
import { CalendarModule } from 'primeng/primeng';
import { DragulaModule } from 'ng2-dragula/ng2-dragula'
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Ng2AutoCompleteModule } from 'ng2-auto-complete';
import { routing } from './app.routes';
import { SafePipe } from './Common/Safe.pipe';

@NgModule({
    imports: [BrowserModule, FormsModule, HttpModule, routing, CalendarModule, BrowserAnimationsModule, DragulaModule,
        Ng2AutoCompleteModule],
    declarations: [AppComponent, PurchaseOrdersTrackComponent, PurchaseOrdersBrowseComponent, FiltersComponent,
        CustomersComponent, AnalyticsComponent, NavBarComponent, TrackingInfoComponent, BusinessFlowComponent,
        CustomersDisplayComponent, TreeNodeComponent, PurchaseOrdersBrowseDisplayComponent, SuggestionsComponent,
        SuggestionDetailsComponent, SafePipe],
    bootstrap: [AppComponent]
})
export class AppModule { }
