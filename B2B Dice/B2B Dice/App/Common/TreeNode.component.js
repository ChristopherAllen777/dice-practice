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
var TreeNodeComponent = (function () {
    function TreeNodeComponent() {
        this.arrayOfKeys = [];
        this.childArrays = [];
        this.childObjects = [];
    }
    TreeNodeComponent.prototype.ngOnInit = function () {
        var keys = Object.keys(this.node);
        for (var i = 0; i < keys.length; i++) {
            var key = keys[i];
            if (this.node[key] != null) {
                this.arrayOfKeys.push(key);
            }
        }
        for (var _i = 0, _a = this.arrayOfKeys; _i < _a.length; _i++) {
            var key = _a[_i];
            if (typeof this.node[key] == 'object' && this.node[key] != null) {
                if (this.node[key].constructor.name == 'Object') {
                    this.childObjects.push(key);
                }
                else if (this.node[key].constructor.name == 'Array') {
                    this.childArrays.push(key);
                }
            }
        }
    };
    return TreeNodeComponent;
}());
__decorate([
    core_1.Input(),
    __metadata("design:type", Object)
], TreeNodeComponent.prototype, "node", void 0);
TreeNodeComponent = __decorate([
    core_1.Component({
        selector: 'tree-node',
        templateUrl: './TreeNode.component.html'
    })
], TreeNodeComponent);
exports.TreeNodeComponent = TreeNodeComponent;
//# sourceMappingURL=TreeNode.component.js.map