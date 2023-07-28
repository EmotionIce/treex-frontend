import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class TreeViewSummaryService {
  private summaryText: string | null = null;

  constructor() { }

  setSummaryText(newSummary: string | null){
    this.summaryText = newSummary;
  }

  getSummaryText(): string|null {
    return this.summaryText;
  }
  
}