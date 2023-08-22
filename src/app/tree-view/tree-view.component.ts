import { Component, ViewEncapsulation, ViewChild } from '@angular/core';
import {
  NodeModel,
  ConnectorModel,
  SnapSettingsModel,
  LayoutModel,
  SnapConstraints,
  NodeConstraints,
  TreeInfo,
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


import { DataManager } from '@syncfusion/ej2-data';
import { Parent } from '../models/parent';
Diagram.Inject(DataBinding, HierarchicalTree, LayoutAnimation);

export interface ElementInfo{
    content: string
    parentID: string
    elementID: string
    summary: string
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


    constructor(private dataService: DataService, private backendService: BackendService, private treeViewSummary: TreeViewSummaryService){
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
                //alert("err, could not load tree")
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
        orientation: 'LeftToRight',
        verticalSpacing: 30,
        horizontalSpacing: 40,
        enableAnimation: true,
        margin: {
            left: 100,
            top: 100
        }
    }
    
    // creates a default diagram 
    public createNewDiagram(): Diagram{
        let diagram = new Diagram({
            width: '100%',
            height: '499px',
            snapSettings: { constraints: SnapConstraints.None },
            // defines the parent/children relationship in the JSON (needed to create the tree) and holds the data of the tree.
            dataSourceSettings: {
                id: "elementID",
                parentId: "parentID",
                dataSource: new DataManager()
            },
        
            //Configures automatic layout
            layout: this.layoutSettings,

            nodeTemplate: this.createNodeTemplate,
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

      
      public createNodeTemplate(obj: any){
          alert("")
          //let template = document.createElement("div");
          //template.className = "custom-node";
          //return template;
          return "";
      }
      /*public createNodeTemplate(node: NodeModel) {
          // Create a div element representing the custom node
          let template = document.createElement("dive");
          template.className = "custom-node";

          
          
          // Optionally, set node content using data binding
          if (node.annotations && node.annotations[0] && node.annotations[0].content) {
              template.textContent = "node.annotations[0].content";
          }
          
          return template; // Return the custom template element
      }*/
    
    
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

    
    public reloadTree(): void{
        //window.location.reload();
        /*this.jsonDatasourceSettings = {
            id: "elementID",
            parentId: "parentID",
            dataSource: new DataManager(this.treeData as JSON[])
        }*/
  }

  public collapseAll(){
      if(this.diagram != null){
      for(let i = 0 ; i < this.diagram.nodes.length; i++){
      this.diagram.nodes[i].isExpanded = false;
      }
    }
  }

    
    public moveElement(elementId: string, parentId: string, previousChildId: string | null){
        this.backendService.MoveElementTree(elementId, parentId, previousChildId).subscribe(
            (responseData: any) => {
              console.log(responseData)
              let newTreeData = (responseData as ReceivedData).tree
              let processedData = this.processTreeData(newTreeData)
              this.generateNewTree(processedData)
              this.reloadTree();
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
        defaultnode.height = 80;
        defaultnode.width = 150;
        //(defaultnode.shape as TextModel).margin = { left: 50, right: 5, bottom: 500, top: 5 };

        defaultnode.constraints = NodeConstraints.Default  /*| NodeConstraints.Tooltip*/ | NodeConstraints.AllowDrop ; // allow all default constraints as well as Dragg & Drop
        defaultnode.constraints &= ~NodeConstraints.Delete; // do not allow deleting a Node
        defaultnode.constraints &= ~NodeConstraints.Rotate; // do not allow rotating a Node
        
        //defaultnode.isExpanded = true;

        let id = defaultnode.id
        
        //let annotations: string|undefined = defaultnode.annotations[0].id
          //if(id != null){
            //let bounds = document.getElementById(id)?.getBoundingClientRect();
            //alert(bounds?.height)
        //}

        //for (let i = 0; i < this.diagram.nodes.length; i++) {
            
            /*let node: NodeModel = this.diagram.nodes[i];
            let annotation: string = node.annotations[0].id;
            let bounds: any = document
              .getElementById(node.id + "_" + annotation)
              .getBoundingClientRect();
            if (bounds.height > node.height) {
              node.height = bounds.height + 15;
              this.diagram.dataBind();*/
          // } 
           
          

        // Defines the content shown within the Node
        let nodeContent = (defaultnode.data as ElementInfo).content 
        if(nodeContent != null){
          if(nodeContent === "\n"){
            defaultnode.height = 10;
          } else {
            defaultnode.annotations = [
              {
                content: nodeContent.substring(0,100), style: { color: "white" }
              }
          ]
        }
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
    };

    defaultnode.collapseIcon = {
      shape: 'Plus',
    };
    /*
        if((defaultnode.data as ElementInfo).isLeaf == true){
            defaultnode.visible = false;
        }

        
        // When loading the tree: only show children of root
        if((defaultnode.data as ElementInfo).parentID == null){
            defaultnode.isExpanded = true;
        } else {
            defaultnode.isExpanded = false;
        }*/

       //defaultnode.style = {fill: '#048785', strokeColor: 'Transparent', strokeWidth: 2}

        defaultnode.style = {
          fill: '#048785',
          strokeColor: 'Transparent',
          strokeWidth: 2,
        };
        
        return defaultnode;
    }

    

    // Define the connecters of the Nodes
    public getConnectorDefaults(defaultconnector: ConnectorModel) : ConnectorModel{
        defaultconnector.type = 'Orthogonal';
        defaultconnector.style = { strokeColor: '#6f409f', strokeWidth: 2}
        //defaultconnector.targetDecorator = { style: { fill: '6f409f', strokeColor: '6f409f' }};
        return defaultconnector;
    }


    //dropEvent
    public dropElement = (args: any): void => {
            let draggedElementID = (args.element.data as ElementInfo).elementID;
            let targetElementID = (args.target.data as ElementInfo).elementID;
            //console.log("dragged:")
            //console.log(draggedElementID)
            //console.log("target:")
            //console.log(targetElementID);
            this.moveElement(draggedElementID, targetElementID, null); 
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
            window.location.href = "Editor";
        }
    }
  }

  
/*
function nodeDefaults(defaultnode: NodeModel): NodeModel{
    defaultnode.height = 80;
    defaultnode.width = 150;

    if((defaultnode.data as ElementInfo).content != null){
    defaultnode.annotations = [
        {content: (defaultnode.data as ElementInfo).content, style: { color: "white" }}
    ]
}
    defaultnode.style = {fill: '#048785', strokeColor: 'Transparent', strokeWidth: 2}
    return defaultnode;
}

function connectorDefaults(defaultconnector: ConnectorModel) : ConnectorModel{
        defaultconnector.type = 'Orthogonal';
        defaultconnector.style = { strokeColor: '#6f409f', strokeWidth: 2}
        return defaultconnector;
    }





//(data as ElementInfo)

import { Component } from '@angular/core';
import {
  Diagram,
  NodeModel,
  ConnectorModel,
  LayoutAnimation,
  DataBinding,
  HierarchicalTree,
  SnapConstraints,
  IDoubleClickEventArgs,
  NodeConstraints
} from '@syncfusion/ej2-diagrams';

import { DataManager } from '@syncfusion/ej2-data';
Diagram.Inject(DataBinding, HierarchicalTree, LayoutAnimation);

export interface ElementInfo {
  content: string;
}

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})


export class TreeViewComponent {

public diagram: Diagram|null = null;

constructor(){
}


public Data2: Object[] = [
  {
    elementID: '000',
    content: 'Leitung',
    summary: 'Text Zusammenfassung1',
    isLeaf: false,
  },
  {
    elementID: '001',
    content: 'Kapitel 1',
    parentID: '000',
    summary: 'Text Zusammenfassung2',
    isLeaf: false,
  }
];


  ngOnInit(){
    this.diagram = new Diagram({
    width: '100%',
    height: '499px',
    snapSettings: { constraints: SnapConstraints.None },
    //configures data source settings
    dataSourceSettings: {
      //sets the fields to bind
      id: 'elementID',
      parentId: 'parentID',
      dataSource: new DataManager(this.Data as any),
      //binds the data with the nodes
      // doBinding: (nodeModel: NodeModel, data: object, diagram: Diagram) => {
      //    nodeModel.shape = { type: 'Text', content: (data as EmployeeInfo).Name };
      // }
    },

    //Configures automatic layout
    layout: {
      type: 'HierarchicalTree',
      orientation: "LeftToRight",
      verticalSpacing: 30,
      horizontalSpacing: 40,
      enableAnimation: true,
    },

    doubleClick: this.clickOnDiagram,
    //Defines the default node and connector properties
    getNodeDefaults: this.nodeDefaults2,
    getConnectorDefaults: this.connectorDefaults,
  });
    this.diagram.appendTo('#diagram');
    console.log(this.diagram)
  }


  //sets node default value
  public nodeDefaults(defaultnode: NodeModel): NodeModel {
    //defaultnode.height = 80;
    //defaultnode.width = 150;
    //defaultnode.isExpanded = false;
    defaultnode.style = {
      fill: '#048785',
      strokeColor: 'Transparent',
      strokeWidth: 2,
    };

    if ((defaultnode.data as ElementInfo).content != null) {
      defaultnode.annotations = [
        {
          content: (defaultnode.data as ElementInfo).content,
          style: { color: 'white' },
        },
      ];
    }
    defaultnode.borderColor = '#3a6eb5';
    defaultnode.backgroundColor = '#659be5';

    //(obj.shape as TextModel).margin = { left: 5, right: 5, bottom: 5, top: 5 };
    return defaultnode;
  }

  public nodeDefaults2(defaultnode: NodeModel): NodeModel {
    defaultnode.height = 80;
    defaultnode.width = 150;
    

    defaultnode.constraints = NodeConstraints.Default  /*| NodeConstraints.Tooltip | NodeConstraints.AllowDrop; // allow all default constraints as well as Dragg & Drop
    defaultnode.constraints &= ~NodeConstraints.Delete; // do not allow to delete a Node
    defaultnode.constraints &= ~NodeConstraints.Rotate; // do not allow to rotate a Node
    //defaultnode.isExpanded = false;

    if ((defaultnode.data as ElementInfo).content != null) {
      defaultnode.annotations = [
        {
          content: (defaultnode.data as ElementInfo).content,
          style: { color: 'white' },
        },
      ];
    }
    defaultnode.style = {
      fill: '#048785',
      strokeColor: 'Transparent',
      strokeWidth: 2,
    };

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

  

    return defaultnode;
  }

  public connectorDefaults(defaultconnector: ConnectorModel): ConnectorModel {
    defaultconnector.type = 'Orthogonal';
    defaultconnector.style = { strokeColor: '#6f409f', strokeWidth: 2 };
    return defaultconnector;
  }

  // tslint:disable-next-line:max-func-body-length
  public Data: Object[] = [
    {
      elementID: '000',
      content: 'Leitung',
      summary: 'Text Zusammenfassung1',
      isLeaf: false,
    },
    {
      elementID: '001',
      content: 'Kapitel 1',
      parentID: '000',
      summary: 'Text Zusammenfassung2',
      isLeaf: false,
    },
    {
      elementID: '002',
      content: 'Kapitel 1.1',
      parentID: '001',
      summary: 'Text Zusammenfassung3',
      isLeaf: true,
    },
    {
      elementID: '003',
      content: 'Kapitel 1.2',
      parentID: '001',
      summary: 'Text Zusammenfassung4',
      isLeaf: true,
    },
    {
      elementID: '004',
      content: 'Kapitel 1.3',
      parentID: '001',
      summary: 'Text Zusammenfassung5',
      isLeaf: true,
    },
    {
      elementID: '005',
      content: 'Kapitel 2',
      parentID: '000',
      summary: 'Text Zusammenfassung6',
      isLeaf: true,
    },
    {
      elementID: '006',
      content: 'Kapitel 3',
      parentID: '000',
      summary: 'Text Zusammenfassung7',
      isLeaf: false,
    },
    {
      elementID: '007',
      content: 'Kapitel 3.1',
      parentID: '006',
      summary: 'Text Zusammenfassung8',
      isLeaf: true,
    },
    {
      elementID: '008',
      content: 'Kapitel 3.2',
      parentID: '006',
      summary: 'Text Zusammenfassung9',
      isLeaf: true,
    },
    {
      elementID: '009',
      content: 'Kapitel 3.2.2',
      parentID: '008',
      summary: 'Text Zusammenfassung10',
      isLeaf: true,
    },
  ];

  public clickOnDiagram = (args: any) => {
    console.log("show Diag:")
    console.log(this.diagram)
    if(this.diagram != null){
      this.diagram.dataSourceSettings.dataSource = new DataManager(this.Data2 as any);
    }
    //alert((args['source'].data as ElementInfo).content)
    //this.diagram.clear();
    //this.diagram.dataBind();
    //this.diagram.appendTo('#diagram')

   
    
  }  

  
  

  

  
}
*/ 