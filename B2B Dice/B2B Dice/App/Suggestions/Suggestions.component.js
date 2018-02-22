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
var MetricsService_service_1 = require("../Common/MetricsService.service");
var Profile_service_1 = require("../Profile/Profile.service");
var Pager_service_1 = require("../Common/Pager.service");
require("rxjs/add/operator/finally");
var SuggestionsComponent = (function () {
    function SuggestionsComponent(commonDataService, router, http, metrics, pagerService, profiles) {
        this.commonDataService = commonDataService;
        this.router = router;
        this.http = http;
        this.metrics = metrics;
        this.pagerService = pagerService;
        this.profiles = profiles;
        this.suggestions = [{
                Title: 'Add Fancy Pictures',
                Description: 'I think the white background is kind of plain and needs to be fancier',
                CreatedBy: 'Bob_Smith',
                CreatedDate: this.formatDate(new Date()),
                Upvotes: 5,
                Downvotes: 2,
                ApprovalRate: 0.429,
                Voters: ['Bob_Smith', 'T_Staley'],
                Comments: []
            }, {
                Title: 'Pay my taxes',
                Description: 'I buy so many computers that Dell should pay my taxes for me',
                CreatedBy: 'Jane_Jones',
                CreatedDate: this.formatDate(new Date()),
                Upvotes: 1000,
                Downvotes: 2,
                ApprovalRate: 0.996,
                Voters: ['Jane_Jones'],
                Comments: [{
                        Text: "I AGREE!!!",
                        CommentedBy: "Bob_Smith",
                        Date: this.formatDate(new Date())
                    }, {
                        Text: "Me too, taxes are horrible.  Please pay mine as well.",
                        CommentedBy: "Michael Dell",
                        Date: this.formatDate(new Date())
                    }]
            }, {
                Title: 'Blow up the moon',
                Description: 'The moon is so bright it keeps me up at night, please get rid of it',
                CreatedBy: 'Bob_Smith',
                CreatedDate: this.formatDate(new Date()),
                Upvotes: 2,
                Downvotes: 10,
                ApprovalRate: -0.667,
                Voters: ['Bob_Smith'],
                Comments: []
            }];
        this.pager = {};
        this.page = 0;
        this.pageSize = 100;
        this.total = 3;
        this.sortColumn = "";
        this.sortOrder = "";
        this.counts = [5, 10, 25, 50, 100];
        this.newTitle = null;
        this.newDescription = null;
        this.isUpvotePressed = false;
        this.isDownvotePressed = false;
        this.clickedIndex = null;
        this.filterTitle = null;
    }
    SuggestionsComponent.prototype.ngOnInit = function () {
        sessionStorage.setItem('currentPage', 'Suggestions');
        this.metrics.sendMetric('Suggestions loaded')
            .subscribe(function () {
            //needed to make call
        });
        this.commonDataService.setPageTitle('Suggestions');
        this.commonDataService.pageChange();
        this.getSuggestions();
        this.pager = this.pagerService.getPager(this.total, this.page, this.pageSize);
        this.setPage(1);
    };
    SuggestionsComponent.prototype.setPage = function (page) {
        if (page < 1 || page > this.pager.totalPages) {
            return;
        }
        this.page = page;
        this.pager = this.pagerService.getPager(this.total, this.page, this.pageSize);
        //this.getSuggestions();
    };
    SuggestionsComponent.prototype.setPageSize = function (size) {
        this.pageSize = size;
        this.setPage(1);
    };
    SuggestionsComponent.prototype.setSort = function (sortCol) {
        if (this.sortColumn != sortCol) {
            this.sortColumn = sortCol;
            this.sortOrder = "asc";
        }
        else {
            if (this.sortOrder == "asc") {
                this.sortOrder = "desc";
            }
            else {
                this.sortOrder = "asc";
            }
        }
        console.log(this.sortColumn);
        console.log(this.sortOrder);
        //this.getSuggestions();
    };
    SuggestionsComponent.prototype.formatDate = function (date) {
        return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getDate() + " "
            + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":"
            + ("0" + date.getMilliseconds()).slice(-2);
    };
    SuggestionsComponent.prototype.clearTitle = function () {
        this.newTitle = null;
    };
    SuggestionsComponent.prototype.clearDescription = function () {
        this.newDescription = null;
    };
    SuggestionsComponent.prototype.getSuggestions = function () {
        if (!sessionStorage.getItem('suggestions')) {
            sessionStorage.setItem('suggestions', JSON.stringify(this.suggestions));
        }
        else {
            this.suggestions = JSON.parse(sessionStorage.getItem('suggestions'));
        }
    };
    SuggestionsComponent.prototype.voteSuggestion = function (index, isUpvote) {
        if (isUpvote) {
            this.suggestions[index].Upvotes++;
        }
        else {
            this.suggestions[index].Downvotes++;
        }
        this.recalculateApproval(index);
        this.suggestions[index].Voters[this.suggestions[index].Voters.length] = sessionStorage.getItem('sessionUser');
        sessionStorage.setItem('suggestions', JSON.stringify(this.suggestions));
    };
    SuggestionsComponent.prototype.recalculateApproval = function (index) {
        var upvotes = this.suggestions[index].Upvotes;
        var downvotes = this.suggestions[index].Downvotes;
        var diff = upvotes - downvotes;
        var totalVotes = upvotes + downvotes;
        this.suggestions[index].ApprovalRate = diff / totalVotes;
        //if (downvotes > upvotes) {
        //    this.suggestions[index].ApprovalRate -= 1;
        //}
    };
    SuggestionsComponent.prototype.getTextColor = function (rate) {
        if (rate > 0) {
            return {
                'color': '#009900'
            };
        }
        else if (rate < 0) {
            return {
                'color': '#cc0000'
            };
        }
        return {
            'color': '#000000'
        };
    };
    SuggestionsComponent.prototype.addSuggestion = function () {
        this.suggestions[this.suggestions.length] = {
            Title: this.newTitle,
            Description: this.newDescription,
            CreatedBy: sessionStorage.getItem('sessionUser'),
            CreatedDate: this.formatDate(new Date()),
            Upvotes: 0,
            Downvotes: 0,
            ApprovalRate: 0,
            Voters: [],
            Comments: []
        };
        sessionStorage.setItem('suggestions', JSON.stringify(this.suggestions));
        this.newTitle = null;
        this.newDescription = null;
    };
    SuggestionsComponent.prototype.getBackgroundColor = function (isUpvote, index) {
        if (this.clickedIndex == index) {
            if (isUpvote && this.isUpvotePressed) {
                return {
                    'background-color': 'lawngreen'
                };
            }
            if (!isUpvote && this.isDownvotePressed) {
                return {
                    'background-color': 'red'
                };
            }
        }
        return {
            'background-color': '#ededed'
        };
    };
    SuggestionsComponent.prototype.togglePress = function (isUpvote, isPressed, index) {
        if (!isPressed) {
            this.isUpvotePressed = false;
            this.isDownvotePressed = false;
            this.clickedIndex = null;
        }
        else {
            if (isUpvote) {
                this.isUpvotePressed = true;
            }
            else {
                this.isDownvotePressed = true;
            }
            this.clickedIndex = index;
        }
    };
    SuggestionsComponent.prototype.clearFilterTitle = function () {
        this.filterTitle = null;
    };
    SuggestionsComponent.prototype.getFilterValue = function (compareTitle) {
        return this.filterTitle == null || this.filterTitle == ''
            || (compareTitle.toLowerCase().indexOf(this.filterTitle.toLowerCase()) > -1);
    };
    return SuggestionsComponent;
}());
SuggestionsComponent = __decorate([
    core_1.Component({
        selector: 'suggestions',
        templateUrl: './Suggestions.component.html'
    }),
    __metadata("design:paramtypes", [CommonData_service_1.CommonDataService, router_1.Router, http_1.Http,
        MetricsService_service_1.MetricsService, Pager_service_1.PagerService, Profile_service_1.ProfileService])
], SuggestionsComponent);
exports.SuggestionsComponent = SuggestionsComponent;
//# sourceMappingURL=Suggestions.component.js.map