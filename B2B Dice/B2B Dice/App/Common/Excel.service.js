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
var xlsx_1 = require("xlsx");
var EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
var EXCEL_EXTENSION = '.xlsx';
var ExcelService = (function () {
    function ExcelService() {
    }
    ExcelService.prototype.exportAsExcelFile = function (json, excelFileName) {
        var worksheet = xlsx_1.utils.json_to_sheet(json);
        var workbook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        var out = xlsx_1.write(workbook, { bookType: 'xlsx', bookSST: true, type: 'binary' });
        var buf = new ArrayBuffer(out.length);
        var view = new Uint8Array(buf);
        for (var i = 0; i !== out.length; ++i) {
            view[i] = out.charCodeAt(i) & 0xFF;
        }
        ;
        this.saveAsExcelFile(buf, excelFileName);
        return false;
    };
    ExcelService.prototype.saveAsExcelFile = function (buffer, fileName) {
        var data = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        var saveAs = require('file-saver');
        if (saveAs.saveAs) {
            saveAs.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        }
        else {
            saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        }
    };
    return ExcelService;
}());
ExcelService = __decorate([
    core_1.Injectable(),
    __metadata("design:paramtypes", [])
], ExcelService);
exports.ExcelService = ExcelService;
//# sourceMappingURL=Excel.service.js.map