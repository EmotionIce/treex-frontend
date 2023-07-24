import { Component, Input, SimpleChanges } from '@angular/core';
import { Element } from '../models/element';

@Component({
  selector: 'app-navigation-part',
  templateUrl: './navigation-part.component.html',
  styleUrls: ['./navigation-part.component.scss']
})
export class NavigationPartComponent  {
  @Input() displayedNavElements: Element[] = [];
  
  
  ngOnChanges(changes: SimpleChanges) {
   
    if (changes['displayedNavElements']) {
      console.log('Displayed Nav Elements:', this.displayedNavElements);
    }
  }


}
