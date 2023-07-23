import { Component } from '@angular/core';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.scss']
})


export class SummaryComponent {
  text = "defaultText";

  public showSummary(summaryText: string){
    alert(summaryText)
  }
}
