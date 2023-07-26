import { Component, ViewEncapsulation, HostListener } from '@angular/core';
import { DiagramComponent, Diagram, NodeModel, ConnectorModel, SnapSettingsModel, LayoutModel, DiagramTooltipModel,
     DataSourceModel, TextModel, DecoratorModel, ShapeStyleModel, SnapConstraints, UserHandleModel, NodeConstraints, DataBinding, IClickEventArgs, IDoubleClickEventArgs, IDropEventArgs} from '@syncfusion/ej2-angular-diagrams';
import { DataManager} from '@syncfusion/ej2-data';
import { SummaryComponent } from './summary/summary.component';

import { DataService } from '../services/data.service';
import { BackendService } from '../services/backend.service'
import { TreeViewSummaryService } from '../services/tree-view-summary.service';
import { SelectionModel } from '@angular/cdk/collections';

//import { DataBinding } from '@syncfusion/ej2-angular-diagrams';
//Diagram.Inject(DataBinding);

export interface ElementInfo{
    content: string
    parentID: string
    elementID: string
    summary: string
}

@Component({
    selector: "app-tree-view",
    templateUrl: './tree-view.component.html',
    styleUrls: ['./tree-view.component.scss'],
    //encapsulation: ViewEncapsulation.None
})
export class TreeViewComponent {

    
    // example Data for testing purpose
    public treeData: object[] = [
        {elementID: "000", content: "Einleitung", summary: "Text Zusammenfassung1"},
        {elementID: "001", content: "Kapitel 1", parentID: "000", summary: "Text Zusammenfassung2"},
        {elementID: "002", content: "Kapitel 1.1", parentID: "001", summary: "Text Zusammenfassung3"},
        {elementID: "003", content: "Kapitel 1.2", parentID: "001", summary: "Text Zusammenfassung4"},
        {elementID: "004", content: "Kapitel 1.3", parentID: "001", summary: "Text Zusammenfassung5"},
        {elementID: "005", content: "Kapitel 2", parentID: "000", summary: "Text Zusammenfassung6"},
        {elementID: "006", content: "Kapitel 3", parentID: "000", summary: "Text Zusammenfassung7"},
        {elementID: "007", content: "Kapitel 3.1", parentID: "006", summary: "Text Zusammenfassung8"},
        {elementID: "008", content: "Kapitel 3.2", parentID: "006", summary: "Text Zusammenfassung9"},
        {elementID: "009", content: "Kapitel 3.2.2", parentID: "008", summary: "Text Zusammenfassung10"}];

        private timeoutId: any;

    // defines the parent/children relationship in the JSON (needed to create the tree) and holds the data of the tree.
    public jsonDatasourceSettings: Object = {
        id: "elementID",
        parentId: "parentID",
        dataSource: new DataManager(this.treeData as JSON[])
    }
    

    

    constructor(private dataService: DataService, private backendService: BackendService, private treeViewSummary: TreeViewSummaryService){
        this.dataService = dataService;
        this.backendService = backendService;
        this.treeViewSummary = treeViewSummary;
        /*this.timeoutId = null;

        this.treeData = [{elementID: "000", content: "Einleitung", summary: "Text Zusammenfassung1"},
        {elementID: "001", content: "Kapitel 1", parentID: "000", summary: "Text Zusammenfassung2"},
        {elementID: "005", content: "Kapitel 2", parentID: "000", summary: "Text Zusammenfassung6"},
        {elementID: "006", content: "Kapitel 3", parentID: "000", summary: "Text Zusammenfassung7"}];

        //this.generateNewTree(this.treeData);*/
        //this.dataService.changeActiveElement()
    } 
    
    
    // receives a JSON-Tree as input and updates the tree accordingly
    public generateNewTree(newTreeData: object[]): void{
        this.treeData = newTreeData;
        this.jsonDatasourceSettings = {
            id: "elementID",
            parentId: "parentID",
            dataSource: new DataManager(this.treeData as JSON[])
        }
    }

    public reloadTree(): void{
        window.location.reload();
        /*this.jsonDatasourceSettings = {
            id: "elementID",
            parentId: "parentID",
            dataSource: new DataManager(this.treeData as JSON[])
        }*/
    }

    
    public moveElement(elementId: string, parentId: string, previousChildId: string){
        this.backendService.MoveElementTree(elementId, parentId, previousChildId).subscribe(
            (newTreeData: Array<Object>) => {
                this.generateNewTree(newTreeData)
                alert("worked")
              //console.log(responseData);  // here responseData is the array of objects

            },
            (error) => {
                alert("error")
                this.reloadTree();
              //console.log(error);  // in case of an error, it will be logged here
            }
          );
    }

    //@ViewChild(SummaryComponent) childComponent: SummaryComponent;
   /* @ViewChild("diagram")
    public diagram?: DiagramComponent;
    public snapSettings?: SnapSettingsModel;
    public items?: DataManager;
    public layout?: LayoutModel;
    public dataSourceSettings?: DataSourceModel;
    */

    //Initializes data source
    // elementID might also be an important attribute...
    

    

    

    public test():void {
        alert("pop")
        this.treeData.pop()
    }

    

    // describes how the tree should look like
    public layoutSettings: LayoutModel = {
        type: 'ComplexHierarchicalTree',
        //type: 'OrganizationalChart',
        orientation: 'LeftToRight',

        //springLength: 1,
        //springFactor: 0.99,
        //maxIteration: 1,
        margin: {
            left: 100,
            top: 100
        }
    }

    
    public RemoveGridLines: SnapSettingsModel = { constraints: SnapConstraints.None};

    // Defines the Nodes
    public getNodeDefaults(defaultnode: NodeModel): NodeModel{
        defaultnode.height = 50;
        defaultnode.width = 100;

        defaultnode.constraints = NodeConstraints.Default | NodeConstraints.Tooltip | NodeConstraints.AllowDrop; // allow all default constraints such as dragging and rezising Nodes
        defaultnode.constraints &= ~NodeConstraints.Delete; // do not allow deleting a Node
        defaultnode.constraints &= ~NodeConstraints.Rotate; // do not allow rotating a Node

        defaultnode.annotations = [
            {content: (defaultnode.data as ElementInfo).content, style: { color: "white" }}
        ]
        
        defaultnode.tooltip = {
            content: (defaultnode.data as ElementInfo).summary,
            position: "BottomCenter"
        }

        //define expand/collapse Icons for the Nodes
        defaultnode.expandIcon = {
            shape: "Minus",
            height: 10,
            // position on the node of the "expandIcon"
            offset: { 
                x: 0.5,
                y: 0.15
            }
        }

        defaultnode.collapseIcon = {
            shape: "Plus"
        }

        // When loading the tree: only show children of root
        if((defaultnode.data as ElementInfo).parentID == null){
            defaultnode.isExpanded = true;
        } else {
            defaultnode.isExpanded = false;
        }

        defaultnode.style = {fill: '#048785', strokeColor: 'Transparent', strokeWidth: 2}

        
        
        return defaultnode;
    }



    // Defines the connecters of the Nodes
    public getConnectorDefaults(defaultconnector: ConnectorModel) : ConnectorModel{
        defaultconnector.type = 'Orthogonal';
        defaultconnector.style = { strokeColor: '#6f409f', strokeWidth: 2}
        //defaultconnector.targetDecorator = { style: { fill: '6f409f', strokeColor: '6f409f' }};
        return defaultconnector;
    }

    
    public onNodeClick = function (event: any): void {
        let nodeID = event.element.id
        if(nodeID != undefined){ // triggered only if clicked on a Node
        alert('Node id:' + event.element.id+"___element ID:" + (event.element.data as ElementInfo).content);
      } else {
        alert("missed node")
      }
    };
/*
    @HostListener('mouseover')
    onMouseOver() {
        this.timeoutId = setTimeout(() => {
            //if()
        this.emptyAlert();
    }, 1000);
  }

    @HostListener('mouseout')
    onMouseOut() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
    }
  }*/

    public onNodeOut(args: any): void{
        
    }

    //dropEvent
    public drop(args: any): void{
            let draggedElementID = (args.element.data as ElementInfo).elementID;
            let targetElementID = (args.target.data as ElementInfo).elementID;
            this.moveElement("001", targetElementID, "007");
       // }
        

        //alert((node.data as ElementInfo).elementID);
        
        //document.getElementById("000").
    }
 
    public onNodeHover(args: any): void {
          const node = args.actualObject;   
          
          let summary = (node.data as ElementInfo).summary;
          this.treeViewSummary.setSummaryText(summary);
          node.TooltipModule;


          
          
          
          //alert((node.data as ElementInfo).summary)

         /* if (node.id != undefined) {

            this.timeoutId = setTimeout(() => {

           // this.emptyAlert(); 

        }, 1000); 
    


    

        //clearTimeout(this.timeoutId);
        //this.timeoutId = null;
          

            //alert((node.data as ElementInfo).summary)


            //alert(node.annotations.length)
            //node.annotations[0].visibility = false;
            //alert("...")
            
        } else {
            //alert("when?")
                //clearTimeout(this.timeoutId);
                //this.timeoutId = null;
                
        }
      //  }*/
      }


      public emptyAlert(){
        alert("")
    }

    public doubleClick(args: any) : void
    {
        if(args.source == null){
            alert("is null");
        } else {
            let nodeID = (args['source'].data as ElementInfo).elementID;
            alert((args['source'].data as ElementInfo).content + " id: " + nodeID)
            this.dataService.changeActiveElement(nodeID);
            window.location.href = "Editor";
        }
    }


}
