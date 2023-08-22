import { Component, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

declare var MathJax: any;

/**
 * LatexRenderComponent is responsible for rendering LaTeX code
 * within the application using MathJax.
 */
@Component({
  selector: 'app-latex-render',
  templateUrl: './latex-render.component.html',
  styleUrls: ['./latex-render.component.scss']
})
export class LatexRenderComponent implements AfterViewInit, OnChanges {
  /** LaTeX code to be rendered */
  @Input() latexCode: string = '';

  /** Constructor for LatexRenderComponent. */
  constructor() {}

  /**
   * Lifecycle hook called after the view has been initialized.
   * Triggers the rendering of LaTeX.
   */
  ngAfterViewInit(): void {
    this.renderMathjax();
  }

  /**
   * Lifecycle hook called when any data-bound property of a directive changes.
   * If the 'latexCode' changes, re-renders the LaTeX.
   * @param changes - Object containing the changes.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['latexCode']) {
      this.renderMathjax();
    }
  }

  /**
   * Renders LaTeX code using MathJax.
   */
  renderMathjax(): void {
    // Check if MathJax object is available
    if (typeof MathJax !== 'undefined') {
      setTimeout(() => {
        // Process the MathJax rendering
        MathJax.typesetClear();
        MathJax.typeset();
      }, 0);
    }
  }
}
