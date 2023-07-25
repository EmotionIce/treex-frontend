

import { Component, Input, OnInit, ElementRef, Renderer2 } from '@angular/core';

declare const MathJax: any;

@Component({
  selector: 'app-latex-render',
  template: '<div [innerHTML]="latex"></div>',
  styles: [':host { display: inline-block; }']
})
export class LatexRenderComponent implements OnInit {
  @Input() latex: string = ''; // Default value is an empty string

  constructor(private el: ElementRef, private renderer: Renderer2) { }

  ngOnInit() {
    this.renderMath();
  }

  private renderMath() {
    MathJax.Hub.Queue(['Typeset', MathJax.Hub, this.el.nativeElement]);
  }
}

