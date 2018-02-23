import { Injectable } from '@angular/core';
import { utils, write, WorkBook, WorkSheet } from 'xlsx';

const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Injectable()
export class ExcelService {

    constructor() { }

    public exportAsExcelFile(json: any[], excelFileName: string) {
        const worksheet: WorkSheet = utils.json_to_sheet(json);
        const workbook: WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
        const out: any = write(workbook, { bookType: 'xlsx', bookSST: true, type: 'binary' });

        const buf = new ArrayBuffer(out.length);
        const view = new Uint8Array(buf);
        for (let i = 0; i !== out.length; ++i) {
            view[i] = out.charCodeAt(i) & 0xFF;
        };

        this.saveAsExcelFile(buf, excelFileName);
        return false;
    }

    private saveAsExcelFile(buffer: any, fileName: string): void {
        const data: Blob = new Blob([buffer], {
            type: EXCEL_TYPE
        });
        let saveAs = require('file-saver');
        if (saveAs.saveAs) {
            saveAs.saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        } else {
            saveAs(data, fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION);
        }
    }

}