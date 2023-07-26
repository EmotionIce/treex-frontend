import { Component } from '@angular/core';
import { TreeViewSummaryService } from 'src/app/services/tree-view-summary.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})


export class SummaryComponent {
  text = "defaultText";


  constructor(private treeViewSummary: TreeViewSummaryService){
    this.treeViewSummary = treeViewSummary;
  }

  
  public showSummary(summaryText: string){
    this.text = this.treeViewSummary.getSummaryText()
    //alert(summaryText)
  }

}
