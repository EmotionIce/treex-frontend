import { Injectable } from '@angular/core';

/**
 * Service responsible for managing the summary text in the tree view.
 */
@Injectable({
  providedIn: 'root'
})
export class TreeViewSummaryService {
  /**
   * The current summary text.
   */
  private summaryText: string | null = null;

  /**
   * Constructs the TreeViewSummaryService.
   */
  constructor() { }

  /**
   * Sets the summary text with the given new summary.
   *
   * @param newSummary {string | null} the new summary text
   */
  setSummaryText(newSummary: string | null) {
    this.summaryText = newSummary;
  }

  /**
   * Retrieves the current summary text.
   *
   * @returns {string | null} the current summary text
   */
  getSummaryText(): string | null {
    return this.summaryText;
  }
  
}
