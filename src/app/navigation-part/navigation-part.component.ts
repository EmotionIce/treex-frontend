import { Component, Input } from '@angular/core';
import { Element } from '../models/element';

@Component({
  selector: 'app-navigation-part',
  templateUrl: './navigation-part.component.html',
  styleUrls: ['./navigation-part.component.scss']
})
export class NavigationPartComponent {
  @Input() displayedNavElements: Element[] = [];


}
