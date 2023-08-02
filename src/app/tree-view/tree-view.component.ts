import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { NodeModel, ConnectorModel, SnapSettingsModel, LayoutModel, SnapConstraints, NodeConstraints, TreeInfo, DiagramComponent} from '@syncfusion/ej2-angular-diagrams';
import { DataManager} from '@syncfusion/ej2-data';
//import { SummaryComponent } from './summary/summary.component';

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

interface ReceivedData{
    tree: any[]
}


@Component({
    selector: "app-tree-view",
    templateUrl: './tree-view.component.html',
    styleUrls: ['./tree-view.component.scss'],
    //encapsulation: ViewEncapsulation.None
})
export class TreeViewComponent {
    @ViewChild('diagramComponent')
    public diagramComponent!: DiagramComponent;

// When switching to the treeView, get the current treeStructure from the Backend.
    public ngOnInit(){
        this.backendService.LoadTree().subscribe(
            (responseData: any) => {
                console.log(this.treeData)
                console.log((responseData as ReceivedData).tree)
                let newTreeData = (responseData as ReceivedData).tree
                this.generateNewTree(newTreeData)

            },
            (error :any ) => {
            })
        }
    
    
    // example Default-Data for testing purpose
    public treeData: Object[] = [
        {elementID: "000", content: "Einleitung", summary: "Text Zusammenfassung1", isLeaf: false},
        {elementID: "001", content: "Kapitel 1", parentID: "000", summary: "Text Zusammenfassung2", isLeaf: false},
        {elementID: "002", content: "Kapitel 1.1", parentID: "001", summary: "Text Zusammenfassung3", isLeaf: true},
        {elementID: "003", content: "Kapitel 1.2", parentID: "001", summary: "Text Zusammenfassung4", isLeaf: true},
        {elementID: "004", content: "Kapitel 1.3", parentID: "001", summary: "Text Zusammenfassung5", isLeaf: true},
        {elementID: "005", content: "Kapitel 2", parentID: "000", summary: "Text Zusammenfassung6", isLeaf: true},
        {elementID: "006", content: "Kapitel 3", parentID: "000", summary: "Text Zusammenfassung7", isLeaf: false},
        {elementID: "007", content: "Kapitel 3.1", parentID: "006", summary: "Text Zusammenfassung8", isLeaf: true},
        {elementID: "008", content: "Kapitel 3.2", parentID: "006", summary: "Text Zusammenfassung9", isLeaf: true},
        {elementID: "009", content: "Kapitel 3.2.2", parentID: "008", summary: "Text Zusammenfassung10", isLeaf: true}];
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
    } 
    
    
    // receives a JSON-Tree as input and updates the tree accordingly
    public generateNewTree(newTreeData: Object[]): void{
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

    
    public moveElement(elementId: string, parentId: string, previousChildId: string | null){
        this.backendService.MoveElementTree(elementId, parentId, previousChildId).subscribe(
            (newTreeData: Array<Object>) => {
                alert("generate new tree")
                this.generateNewTree(newTreeData)
            },
            (error) => {
                alert("Element could not be moved")
                this.reloadTree();
            }
          );
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
        defaultnode.height = 80;
        defaultnode.width = 150;

        defaultnode.constraints = NodeConstraints.Default  /*| NodeConstraints.Tooltip*/ | NodeConstraints.AllowDrop; // allow all default constraints as well as Dragg & Drop
        defaultnode.constraints &= ~NodeConstraints.Delete; // do not allow to delete a Node
        defaultnode.constraints &= ~NodeConstraints.Rotate; // do not allow to rotate a Node

        // Defines content shown within the Node
        if((defaultnode.data as ElementInfo).content != null){
        defaultnode.annotations = [
            {content: (defaultnode.data as ElementInfo).content, style: { color: "white" }}
        ]
    }
        
        /*
        defaultnode.tooltip = {
            content: (defaultnode.data as ElementInfo).summary,
            position: "BottomCenter"
        }*/

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
/*
        if((defaultnode.data as ElementInfo).isLeaf == true){
            defaultnode.visible = false;
        }*/

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

    /*
    public onNodeClick = function (event: any): void {
        let nodeID = event.element.id
        if(nodeID != undefined){ // triggered only if clicked on a Node
        alert('Node id:' + event.element.id+"___element ID:" + (event.element.data as ElementInfo).content);
      } else {
        alert("missed node")
      }
    };*/
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

    /*
    public onNodeOut(args: any): void{}
    */

    //dropEvent
    public drop(args: any): void{
            let draggedElementID = (args.element.data as ElementInfo).elementID;
            let targetElementID = (args.target.data as ElementInfo).elementID;
            this.moveElement(draggedElementID, targetElementID, null); 
    }
 
    // show summary when hovering over Node
    public onNodeHover(args: any): void {
          const node = args.actualObject;
          if(node.data != undefined){
          let summary = (node.data as ElementInfo).summary;
          
          this.treeViewSummary.setSummaryText(summary);

          clearTimeout(this.timeoutId);
          this.timeoutId = setTimeout(() => {
            this.treeViewSummary.setSummaryText(null);
          }, 2000);
        }
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
            //alert((args['source'].data as ElementInfo).content + " id: " + nodeID)
            this.dataService.changeActiveElement(nodeID);
            window.location.href = "Editor";
        }
    }
}
