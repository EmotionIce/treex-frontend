import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import {
  NodeModel,
  ConnectorModel,
  SnapSettingsModel,
  LayoutModel,
  TreeInfo,
  SnapConstraints,
  NodeConstraints,
  DiagramComponent,
  Diagram,
  DataBinding,
  HierarchicalTree,
  LayoutAnimation,
  TextStyleModel,
  DiagramConstraints
} from '@syncfusion/ej2-angular-diagrams';
//import { SummaryComponent } from './summary/summary.component';

import { DataService } from '../services/data.service';
import { BackendService } from '../services/backend.service';
import { TreeViewSummaryService } from '../services/tree-view-summary.service';
import { SelectionModel } from '@angular/cdk/collections';
import { LatexRenderComponent } from '../latex-render/latex-render.component';
import { Root } from '../models/root';
import { Element } from '../models/element';

import { registerLicense } from '@syncfusion/ej2-base';
registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NGaF1cWGhAYVF3WmFZfV1gd19GY1ZVQWY/P1ZhSXxQdk1hW35bcHdRQ2lfUEM='
);


import { DataManager } from '@syncfusion/ej2-data';
import { Parent } from '../models/parent';
Diagram.Inject(DataBinding, HierarchicalTree, LayoutAnimation);



export interface ElementInfo{
    content: string
    parentID: string
    elementID: string
    summary: string
    mimtype: string
    image: object|null|undefined
}

interface ReceivedData {
  tree: any[];
}

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss'],
  //encapsulation: ViewEncapsulation.None
})

export class TreeViewComponent {
    @ViewChild('diagramComponent')
    public diagramComponent!: DiagramComponent;
    public treeData?: Object[];
    //public jsonDatasourceSettings: Object;
    public items?: DataManager;
    public diagram: Diagram|null;
    rootInstance: Root;
    public style?: TextStyleModel;

    constructor(private router: Router, private dataService: DataService, private backendService: BackendService, private treeViewSummary: TreeViewSummaryService){
        this.dataService = dataService;
        this.backendService = backendService;
        this.treeViewSummary = treeViewSummary;
        this.rootInstance = Root.createRoot();
        this.diagram = null;
    } 

    // When switching to the treeView, get the current treeStructure from the Backend.
    public ngOnInit(){
        this.diagram = this.createNewDiagram()
            
        console.log("final:")
        console.log(this.diagram)
        this.diagram.appendTo('#diagram');

        this.backendService.LoadTree().subscribe(
            (responseData: any) => {
                //console.log(this.treeData)
                //console.log((responseData as ReceivedData).tree)
                let newTreeData = (responseData as ReceivedData).tree
                let processedData = this.processTreeData(newTreeData)
                this.generateNewTree(processedData);
            },
            (error) => {
            })
        }
        private timeoutId: any;


        private processTreeData(data: Object[]): Object[] {
          let rootNodes = data.filter((node: any) => node['parentID'] === 'null');
          if (rootNodes.length <= 1) return data; // If only one root, return original data
      
          let newParent = {
            elementID: 'root', // Generate a unique ID here if needed
            content: 'Root', // Provide a meaningful name if needed
            parentID: 'null',
            summary: 'null',
            chooseManualSummary: false,
          };
      
          // Change the parentID of all previous root nodes to newParent's elementID
          rootNodes.forEach((root: any) => {
            root['parentID'] = newParent.elementID;
          });
      
          // Add the new parent to the data and return
          data.push(newParent);
          return data;
        }

    

    // defines how the diagram/tree should look like
    public layoutSettings: LayoutModel = {
        type: 'HierarchicalTree',
        getLayoutInfo: (node: Node, options: TreeInfo) => {
          //if (!options.hasSubTree) {
              options.type = 'Right';
              options.orientation = 'Vertical';
        //  }
        },
        orientation: 'LeftToRight',
        verticalSpacing: 30,
        horizontalSpacing: 40,
        enableAnimation: true,
        margin: {
            left: 50,
            top: 50
        }
    }
    
    // creates a default diagram 
    public createNewDiagram(): Diagram{
        let diagram = new Diagram({
            width: '100%',
            height: '600px',
            snapSettings: { constraints: SnapConstraints.None },
            // defines the parent/children relationship in the JSON (needed to create the tree) and holds the data of the tree.
            dataSourceSettings: {
                id: "elementID",
                parentId: "parentID",
                dataSource: new DataManager()
            },
        
            //Configures automatic layout
            layout: this.layoutSettings,
            mouseOver: this.onNodeHover,
            drop: this.dropElement,
            //dragEnter: this.emptyAlert,
            //dragLeave: this.emptyAlert,
            //dragOver: this.emptyAlert,
            dragLeave: this.emptyAlert ,
            doubleClick: this.doubleClick,
            //Define the default node and connector properties
            getNodeDefaults: this.getNodeDefaults,
            getConnectorDefaults: this.getConnectorDefaults
            
          });
          return diagram;
        }
    
    
    // receives a JSON-Tree as input and updates the diagram accordingly
    public generateNewTree(newTreeData: Object[]): void{
        this.treeData = newTreeData;
        if(this.diagram != null){
            this.diagram.dataSourceSettings.dataSource = new DataManager(this.treeData as any);
            this.diagram.dataBind();
            
        
           for(let i = 0 ; i < this.diagram.nodes.length; i++){
            //this.diagram.nodes[i].isExpanded = false;
        }
      }
    }


  public collapseAll(){
    if(this.diagram != null){
        for(let i = 0 ; i < this.diagram.nodes.length; i++){
          this.diagram.nodes[i].isExpanded = false;
        }
      this.diagram.dataBind()
    }
  }

    
    public moveElement(elementId: string, parentId: string, previousChildId: string | null){
        this.backendService.MoveElementTree(elementId, parentId, previousChildId).subscribe(
            (responseData: any) => {
              let newTreeData = (responseData as ReceivedData).tree
              let processedData = this.processTreeData(newTreeData)
              this.generateNewTree(processedData)
            },
            (error) => {
                //this.reloadTree();
            }
          );
    }
    

    public RemoveGridLines: SnapSettingsModel = { constraints: SnapConstraints.None};


    
    /*nodeTemplate = {
      customTemplate: '<app-node-template [text]="data.text" [imageUrl]="data.imageUrl"></app-node-template>'
    }function (diagram, node) {
      node.name = node.Id;
      node.source = node.ImageUrl;
    }*/

    // Define Nodes
    public getNodeDefaults(defaultnode: NodeModel): NodeModel{
        let nodeBackgroundColor = '#107700'
        defaultnode.height = 80;
        defaultnode.width = 150;
        //(defaultnode.shape as TextModel).margin = { left: 50, right: 5, bottom: 500, top: 5 };

        defaultnode.constraints = NodeConstraints.Default  /*| NodeConstraints.Tooltip*/ | NodeConstraints.AllowDrop ; // allow all default constraints as well as Dragg & Drop
        defaultnode.constraints &= ~NodeConstraints.Delete; // do not allow deleting a Node
        defaultnode.constraints &= ~NodeConstraints.Rotate; // do not allow rotating a Node
          

        // Defines the content shown within the Node
        let nodeID = (defaultnode.data as ElementInfo).elementID
        let nodeContent = (defaultnode.data as ElementInfo).content 
        let nodeIsImage = String((defaultnode.data as ElementInfo).image) != "undefined"
        
       
         if(nodeIsImage){
          nodeBackgroundColor = "#0000AA"
          defaultnode.annotations = [
            {
              content: "Image", style: { color: "white" }
            }
          ]
        } else if(nodeContent != null){
            defaultnode.annotations = [
              {
                content: nodeContent.substring(0,100), style: { color: "white" }
              }
          ]
        }

        if(nodeID == "root"){
          nodeBackgroundColor = '#771111'
        }

    //define expand/collapse Icons for the Nodes
    defaultnode.expandIcon = {
      shape: 'Minus',
      //height: 10,
      // position on the node of the "expandIcon"
      offset: {
        x: 0.5,
        y: 0.15,
      },
      verticalAlignment: 'Center'
    };


    defaultnode.collapseIcon = {
      shape: 'Plus',
    };
    

        defaultnode.style = {
          fill: nodeBackgroundColor,
          strokeColor: 'Transparent',
          strokeWidth: 2,
        };
        
        return defaultnode;
    }

    

    // Define the connecters of the Nodes
    public getConnectorDefaults(defaultconnector: ConnectorModel) : ConnectorModel{
        //defaultconnector.targetDecorator?.style = 'None';
        defaultconnector.type = 'Orthogonal';
        defaultconnector.style = { strokeColor: '#000000', strokeWidth: 2};
        if(defaultconnector.targetDecorator != undefined){
          defaultconnector.targetDecorator.shape = 'None';
        }
        //defaultconnector.targetDecorator = { style:  { fill: 'ff0000', strokeColor: 'ff0000' }};
        return defaultconnector;
    }


    //dropEvent
    public dropElement = (args: any): void => {
            let draggedElementID = (args.element.data as ElementInfo).elementID;
            let targetElementID = (args.target.data as ElementInfo).elementID;
            this.moveElement(draggedElementID, targetElementID, null); 
            this.diagram?.doLayout();
    }
 

    private getSummary(node: NodeModel): string {
        let summary: string = (node.data as ElementInfo).summary;
        if(summary != "null"){
            return summary;
        } else {
            let summary = (node.data as ElementInfo).content.substring(0,100);
            if(summary.length >= 100){
                summary += "..."
            }
            return summary;
        }
      }


    public testEvent = (args: any) =>{
      
      const node = args.source; //....
      alert("m" + node)
      //alert(node)
          let pc = null
          if(node.data != undefined){
            alert("search..")
            alert((node.data as ElementInfo).content)
            let element = this.rootInstance.searchByID((node.data as ElementInfo).elementID)
            alert(element)
            if(element != null){
                pc = this.getPreviousElementByYoffset(element)
                alert((pc.data as ElementInfo).content)
                console.log((pc.data as ElementInfo).content)
                //this.moveElement()
            }
        }

    }

    // show summary when hovering over Node
    public onNodeHover = (args: any): void => {
          const node = args.actualObject;
         // alert("h" + node)
          let pc = null
          if(node.data != undefined){
            let summary = this.getSummary(node);
            this.treeViewSummary.setSummaryText(summary);
        
            let element = this.rootInstance.searchByID((node.data as ElementInfo).elementID)
            if(element != null){
                pc = this.getPreviousElementByYoffset(element)
                console.log((pc.data as ElementInfo).content)
            }

            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => {
                this.treeViewSummary.setSummaryText(null);
            }, 2000);
        }
      }

      private getNodeByElementID(id: string): NodeModel|null{
        let nodes = this.diagram?.nodes
        if(nodes != undefined){
          for(let node of nodes){
            if((node.data as ElementInfo).elementID === id){
              return node
            }
          }
        }
        return null
      }
      
      private getPreviousElementByYoffset(element: Element): NodeModel{
        let parent = element?.getParent()
        let elementNode: any = this.getNodeByElementID(element.getId())
        let pc = null
        if(parent instanceof Parent){  
          let children: Element[] = parent.getChildren()
          let childrenAsNodes: any = this.convertElementListToNodeList(children)
          for(let child of childrenAsNodes){
            if(child.offsetY - elementNode.offsetY < 0){
              if(pc == null || child.offsetY > pc.offsetY){
                pc = child
              }
            }
          } 
        }
        return pc
    }

      private convertElementListToNodeList(elements: Element[]): NodeModel[]{
          let nodes: NodeModel[] = new Array<NodeModel>(elements.length)
          for(let i = 0; i < elements.length; i++){
            let node = this.getNodeByElementID(elements[i].getId())
            if(node != null){
              nodes[i] = node
            }
          }
          return nodes
      }

    public emptyAlert(){
        alert("")
    }
  

    public doubleClick = (args: any) : void =>
    {    
        if(args.source == null){
            alert("");
        } else {
            let nodeID = (args['source'].data as ElementInfo).elementID;
            let newID: string = args['source'].id;

            this.dataService.changeActiveElement(nodeID);
            this.router.navigate(['Editor'])
        }
    }
  }