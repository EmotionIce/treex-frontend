import { Component, OnInit, Output, EventEmitter, Input} from '@angular/core';
import { Element } from '../models/element';
import { DataService } from '../services/data.service';
import { Root } from '../models/root';
import { LayerElement } from '../layer-element';
import { BackendService } from '../services/backend.service';
import { JsonToModelConverterService } from '../services/json-to-model-converter.service';


export class ConcreteElement extends Element {
  
}

@Component({
  selector: 'app-navigation-part',
  templateUrl: './navigation-part.component.html',
  styleUrls: ['./navigation-part.component.scss']
})

export class NavigationPartComponent implements OnInit {
  @Input() hoveredElementID: string | null = null;
  displayedNavigationElements: Element[] = [];
  rootInstance: Root;
  navigationParentElementID: string | null = null;
  parentElement: Element | null = null;
  layerElements: LayerElement[] = [];





  constructor(private backendService: BackendService, private converter: JsonToModelConverterService, private dataService: DataService) {


    this.rootInstance = Root.createRoot();
   


  }
 
  
  
  ngOnInit() {
    const element1 = new ConcreteElement('id1', 'Content 1Der deutsche Name des Tieres deutet sein auffälligstes Kennzeichen bereits an, den biegsamen Schnabel, der in der Form dem einer Ente ähnelt und dessen Oberfläche etwa die Beschaffenheit von glattem Rindsleder hat. Erwachsene Schnabeltiere haben keine Zähne, sondern lediglich Hornplatten am Ober- und Unterkiefer, die zum Zermahlen der Nahrung dienen. Bei der Geburt besitzen die Tiere noch dreispitzige Backenzähne, verlieren diese jedoch im Laufe ihrer Entwicklung. Um den Schnabel effektiv nutzen zu können, ist die Kaumuskulatur der Tiere modifiziert. Die Nasenlöcher liegen auf dem Oberschnabel ziemlich weit vorn; dies ermöglicht es dem Schnabeltier, in weitgehend untergetauchtem Zustand ', 'Kommentar: Schnabeltier sind die besten, 10 out of 10, toller Service, gerne wieder', 'Summary 1 Das Schnabeltier (Ornithorhynchus anatinus, englisch platypus) ist ein eierlegendes Säugetier aus Australien. Es ist die einzige lebende Art der Familie der Schnabeltiere (Ornithorhynchidae). Zusammen mit den vier Arten der Ameisenigel bildet es das Taxon der Kloakentiere (Monotremata), die sich stark von allen anderen Säugetieren unterscheiden.');
    const element2 = new ConcreteElement('id2', 'Content 2', 'Comment 2', 'Summary 2');
    const element3 = new ConcreteElement('id3', 'Content 3', 'Comment 3', 'Summary 3');
    this.displayedNavigationElements = [element1, element2, element3]

    
   
      this.layerElements = this.displayedNavigationElements.map(element => new LayerElement(element, this.backendService, this.converter, this.dataService));
      console.log("mapped layerElements in navigationpart", this.layerElements)
    


    this.dataService.currentNavigationElements.subscribe(newNavigationElements => {
     
      console.log("change in navigationpart elements", newNavigationElements)
      this.navigationParentElementID = newNavigationElements;
      this.parentElement = this.rootInstance.searchByID(this.navigationParentElementID);
      if (this.parentElement) {
      this.displayedNavigationElements = this.rootInstance.getElementsOfLayer(this.parentElement);
      }
      
      
      if (this.displayedNavigationElements.length > 0) {
        this.layerElements = this.displayedNavigationElements.map(element => new LayerElement(element, this.backendService,  this.converter, this.dataService));
  
        
      }
    }) 

    this.dataService.currentChange.subscribe(change => {

      if (this.parentElement) {
        this.displayedNavigationElements = this.rootInstance.getElementsOfLayer(this.parentElement);
        if (this.displayedNavigationElements.length > 0) {
          this.layerElements = this.displayedNavigationElements.map(element => new LayerElement(element, this.backendService,  this.converter, this.dataService));
        }
        }


    }); 
    
    
    
  }
  getFirstTwentyLetters(content: string): string {
    return content.slice(0, 20);
  }
}


