import { Component, Input, AfterViewInit, OnChanges, SimpleChanges } from '@angular/core';

declare var MathJax: any;

@Component({
  selector: 'app-latex-render',
  templateUrl: './latex-render.component.html',
  styleUrls: ['./latex-render.component.scss']
})
export class LatexRenderComponent implements AfterViewInit, OnChanges {
  @Input() latexCode: string = '';

  constructor() {}

  ngAfterViewInit(): void {
    this.renderMathjax();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['latexCode']) {
      this.renderMathjax();
    }
  }

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
