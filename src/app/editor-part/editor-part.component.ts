import { Component, Input } from '@angular/core';
import { Element } from '../models/element';

@Component({
  selector: 'app-editor-part',
  templateUrl: './editor-part.component.html',
  styleUrls: ['./editor-part.component.scss']
})
export class EditorPartComponent {
  @Input() displayedEditorElements: Element[] = [];

  // Rest of the component code
}

