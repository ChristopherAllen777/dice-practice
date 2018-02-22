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
require("rxjs/add/operator/finally");
var SuggestionDetailsComponent = (function () {
    function SuggestionDetailsComponent(commonDataService, router, http, metrics, profiles) {
        this.commonDataService = commonDataService;
        this.router = router;
        this.http = http;
        this.metrics = metrics;
        this.profiles = profiles;
        this.suggestions = null;
        this.suggestion = null;
        this.newComment = null;
        this.index = null;
        this.showLoading = true;
        this.showDetails = false;
        this.isUpvotePressed = false;
        this.isDownvotePressed = false;
    }
    SuggestionDetailsComponent.prototype.ngOnInit = function () {
        var _this = this;
        sessionStorage.setItem('currentPage', 'Suggestion Details');
        this.metrics.sendMetric('Suggestion Details loaded')
            .subscribe(function () {
            //needed to make call
        });
        this.commonDataService.setPageTitle('Suggestion Details');
        this.commonDataService.pageChange();
        this.router.routerState.root.queryParams
            .subscribe(function (params) {
            if (params['index']) {
                _this.index = params['index'];
                _this.suggestions = JSON.parse(sessionStorage.getItem('suggestions'));
                _this.suggestion = _this.suggestions[_this.index];
                _this.showDetails = true;
                _this.showLoading = false;
            }
        });
    };
    SuggestionDetailsComponent.prototype.formatDate = function (date) {
        return date.getFullYear() + "-" + ("0" + (date.getMonth() + 1)).slice(-2) + "-" + date.getDate() + " "
            + ("0" + date.getHours()).slice(-2) + ":" + ("0" + date.getMinutes()).slice(-2) + ":"
            + ("0" + date.getMilliseconds()).slice(-2);
    };
    SuggestionDetailsComponent.prototype.clearComment = function () {
        this.newComment = null;
    };
    SuggestionDetailsComponent.prototype.voteSuggestion = function (isUpvote) {
        if (isUpvote) {
            this.suggestion.Upvotes++;
        }
        else {
            this.suggestion.Downvotes++;
        }
        this.recalculateApproval();
        this.suggestions[this.index].Voters[this.suggestions[this.index].Voters.length] = sessionStorage.getItem('sessionUser');
        sessionStorage.setItem('suggestions', JSON.stringify(this.suggestions));
    };
    SuggestionDetailsComponent.prototype.recalculateApproval = function () {
        var upvotes = this.suggestion.Upvotes;
        var downvotes = this.suggestion.Downvotes;
        var diff = upvotes - downvotes;
        var totalVotes = upvotes + downvotes;
        this.suggestion.ApprovalRate = diff / totalVotes;
        //this.suggestion.ApprovalRate = upvotes / totalVotes;
        //if (downvotes > upvotes) {
        //    this.suggestion.ApprovalRate -= 1;
        //}
    };
    SuggestionDetailsComponent.prototype.getTextColor = function (rate) {
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
    SuggestionDetailsComponent.prototype.addComment = function () {
        this.suggestion.Comments[this.suggestion.Comments.length] = {
            Text: this.newComment,
            Date: this.formatDate(new Date()),
            CommentedBy: sessionStorage.getItem('sessionUser')
        };
        sessionStorage.setItem('suggestions', JSON.stringify(this.suggestions));
        this.newComment = null;
    };
    SuggestionDetailsComponent.prototype.getBackgroundColor = function (isUpvote) {
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
        return {
            'background-color': '#ededed'
        };
    };
    SuggestionDetailsComponent.prototype.togglePress = function (isUpvote, isPressed) {
        if (!isPressed) {
            this.isUpvotePressed = false;
            this.isDownvotePressed = false;
        }
        else {
            if (isUpvote) {
                this.isUpvotePressed = true;
            }
            else {
                this.isDownvotePressed = true;
            }
        }
    };
    return SuggestionDetailsComponent;
}());
SuggestionDetailsComponent = __decorate([
    core_1.Component({
        selector: 'suggestion-details',
        templateUrl: './SuggestionDetails.component.html'
    }),
    __metadata("design:paramtypes", [CommonData_service_1.CommonDataService, router_1.Router, http_1.Http,
        MetricsService_service_1.MetricsService, Profile_service_1.ProfileService])
], SuggestionDetailsComponent);
exports.SuggestionDetailsComponent = SuggestionDetailsComponent;
//# sourceMappingURL=SuggestionDetails.component.js.map