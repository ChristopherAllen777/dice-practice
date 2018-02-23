import { Component, Input, OnInit } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { FormsModule } from "@angular/forms";

@Component({
    selector: 'tree-node',
    templateUrl: './TreeNode.component.html'
})
export class TreeNodeComponent implements OnInit {
    public arrayOfKeys: string[] = [];
    public childArrays: string[] = [];
    public childObjects: string[] = [];

    @Input() node: any;

    ngOnInit() {
        let keys = Object.keys(this.node);
        for (let i = 0; i < keys.length; i++) {
            let key = keys[i];
            if (this.node[key] != null) {
                this.arrayOfKeys.push(key);
            }
        }
        for (let key of this.arrayOfKeys) {
            if (typeof this.node[key] == 'object' && this.node[key] != null) {
                if (this.node[key].constructor.name == 'Object') {
                    this.childObjects.push(key);
                } else if (this.node[key].constructor.name == 'Array') {
                    this.childArrays.push(key)
                }
            }
        }
    }
}