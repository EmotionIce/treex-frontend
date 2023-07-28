import { Component, Input } from '@angular/core';
import { TreeViewSummaryService } from '../services/tree-view-summary.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})
export class SummaryComponent {
  //@Input() summary!: string;
  private summary = "";

  constructor(private treeViewSummaryService: TreeViewSummaryService){
    this.treeViewSummaryService = treeViewSummaryService;
  }

  public getSummary(): string | null {
    return this.treeViewSummaryService.getSummaryText();
  }  

}
