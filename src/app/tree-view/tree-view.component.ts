import { Component} from '@angular/core';
import { Router } from '@angular/router';

// Removes syncfusion license banner
// Expires on Sept. 21 2023
// More info on https://ej2.syncfusion.com/documentation/licensing
import { registerLicense } from '@syncfusion/ej2-base';
registerLicense(
  'Ngo9BigBOggjHTQxAR8/V1NGaF1cWGhAYVF3WmFZfV1gd19GY1ZVQWY/P1ZhSXxQdk1hW35bcHdRQ2lfUEM='
);
import {
  NodeModel,
  ConnectorModel,
  SnapSettingsModel,
  LayoutModel,
  SnapConstraints,
  NodeConstraints,
  Diagram,
  DataBinding,
  HierarchicalTree,
  LayoutAnimation
} from '@syncfusion/ej2-angular-diagrams';

import { DataService } from '../services/data.service';
import { BackendService } from '../services/backend.service';
import { TreeViewSummaryService } from '../services/tree-view-summary.service';
import { LatexRenderComponent } from '../latex-render/latex-render.component';
import { Root } from '../models/root';
import { Element } from '../models/element';
import { DataManager } from '@syncfusion/ej2-data';
import { Parent } from '../models/parent';
Diagram.Inject(DataBinding, HierarchicalTree, LayoutAnimation);

// Attributes of Elements sent from Backend
export interface ElementInfo {
  content: string;
  parentID: string;
  elementID: string;
  summary: string;
  mimtype: string;
  image: object | null | undefined;
}

interface ReceivedData {
  tree: any[];
}

@Component({
  selector: 'app-tree-view',
  templateUrl: './tree-view.component.html',
  styleUrls: ['./tree-view.component.scss']
})

export class TreeViewComponent {
  private static NODE_BACKGROUND_COLOR_DEFAULT = '#107700';
  private static NODE_BACKGROUND_COLOR_IMAGE = '#0000AA';
  private static NODE_BACKGROUND_COLOR_ROOT = '#771111';
  private treeData?: Object[];
  private diagram: Diagram | null;
  private rootInstance: Root;

  constructor(
    private router: Router, // used in order to switch from TreeView to Editor properly (through double clicking on a node)
    private dataService: DataService,
    private backendService: BackendService,
    private treeViewSummary: TreeViewSummaryService
  ) {
    this.dataService = dataService;
    this.backendService = backendService;
    this.treeViewSummary = treeViewSummary;
    this.rootInstance = Root.createRoot();
    this.diagram = null;
  }

  // When switching to treeView, get the current treeStructure from Backend.
  public ngOnInit() {
    this.diagram = this.createNewDiagram();
    this.backendService.LoadTree().subscribe(
      (responseData: any) => {
        let newTreeData = (responseData as ReceivedData).tree;
        let processedData = this.processTreeData(newTreeData);
        this.generateNewTree(processedData);
      },
      (error) => {} // if Backend sends an error, don't generate a tree.
    );
    this.diagram.appendTo('#diagram');
  }
  private timeoutId: any;


  // If there is more than one parent in the highest layer (multiple roots) the treeView would display multiple independent trees.
  // In order to prevent that, this method generates a "virtuall Root" that combines the other roots into a single tree
  // and changes the treeData accordingly
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
    rootNodes.forEach((root:any) =>{
      root['parentID'] = newParent.elementID;
    });

    // Add the new parent to the data and return
    data.push(newParent);
    return data;
  }

    // Defines the visual layout of the Diagram/Tree
    private layoutSettings: LayoutModel = {
        type: 'HierarchicalTree',
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

            // Defines the parent/children relationship in the JSON (needed to create the tree) and holds the data of the tree.
            dataSourceSettings: {
                id: "elementID",
                parentId: "parentID",
                dataSource: new DataManager()
            },
        
            // Assignes fundamental properties of the diagram (like nodes) as well events (like drag and drop)
            layout: this.layoutSettings,
            mouseOver: this.onNodeHover,
            drop: this.dropElement,
            doubleClick: this.doubleClick,
            getNodeDefaults: this.getNodeDefaults,
            getConnectorDefaults: this.getConnectorDefaults
            
          });
          return diagram;
        }

  // Receives a JSON-Tree as input and updates the diagram accordingly
  private generateNewTree(newTreeData: Object[]): void {
    this.treeData = newTreeData;
    if (this.diagram != null) {
      this.diagram.dataSourceSettings.dataSource = new DataManager(
        this.treeData as any
      );
      this.diagram.dataBind();
    }
  }

  // Called by "collpase tree" - button
  public collapseAll() {
    if (this.diagram != null) {
      for (let i = 0; i < this.diagram.nodes.length; i++) {
        this.diagram.nodes[i].isExpanded = false;
      }
      this.diagram.dataBind();
    }
  }

  // Tries to move an element, if the move was validated from Backend accept the changes (genereate new Tree)
  private moveElement(
    elementId: string,
    parentId: string,
    previousChildId: string | null
  ) {
    this.backendService
      .MoveElementTree(elementId, parentId, previousChildId)
      .subscribe(
        (responseData: any) => {
          let newTreeData = (responseData as ReceivedData).tree;
          let processedData = this.processTreeData(newTreeData);
          this.generateNewTree(processedData);
        },
        (error) => {
        }
      );
  }

  // Diagram possibly displays gridlines per default, remove those.
  public RemoveGridLines: SnapSettingsModel = {
    constraints: SnapConstraints.None,
  };

  // Defines the Nodes in the Diagram
  private getNodeDefaults(defaultnode: NodeModel): NodeModel {
    defaultnode.height = 80;
    defaultnode.width = 150;
    let nodeBackgroundColor = TreeViewComponent.NODE_BACKGROUND_COLOR_DEFAULT;

    defaultnode.constraints =
      NodeConstraints.Default|NodeConstraints.AllowDrop; // allow all default constraints as well as Dragg & Drop
    defaultnode.constraints &= ~NodeConstraints.Delete; // do not allow deleting a Node
    defaultnode.constraints &= ~NodeConstraints.Rotate; // do not allow rotating a Node

    let nodeID = (defaultnode.data as ElementInfo).elementID;
    let nodeContent = (defaultnode.data as ElementInfo).content;
    let nodeIsImage = String((defaultnode.data as ElementInfo).image) != 'undefined';

    // Defines the content shown within the Node
    if (nodeIsImage) {
      nodeBackgroundColor = TreeViewComponent.NODE_BACKGROUND_COLOR_IMAGE;
      defaultnode.annotations = [
        {
          content: 'Image',
          style: { color: 'white' },
        },
      ];
    } else if (nodeContent != null) {
      defaultnode.annotations = [
        {
          content: nodeContent.substring(0, 100),
          style: { color: 'white' },
        },
      ];
    }

    if (nodeID == 'root') {
      nodeBackgroundColor = TreeViewComponent.NODE_BACKGROUND_COLOR_ROOT;
    }

    // Defines the expand/collapse Icons for the Nodes
    defaultnode.expandIcon = {
      shape: 'Minus',

      // relative position on the node of the "expandIcon"
      offset: {
        x: 0.5,
        y: 0.15,
      },
      verticalAlignment: 'Center',
    };

    defaultnode.collapseIcon = {
      shape: 'Plus'
    };

    // Assign style properties of node
    defaultnode.style = {
      fill: nodeBackgroundColor,
      strokeColor: 'Transparent',
      strokeWidth: 2,
    };

    return defaultnode;
  }

  // Defines the Connecters of the Nodes
  private getConnectorDefaults(defaultconnector: ConnectorModel): ConnectorModel {
    defaultconnector.type = 'Orthogonal';
    defaultconnector.style = { strokeColor: '#000000', strokeWidth: 2 };
    if (defaultconnector.targetDecorator != undefined) {
      defaultconnector.targetDecorator.shape = 'None';
    }
    return defaultconnector;
  }

  // Drop event
  private dropElement = (args: any): void => {
    let draggedElementID = (args.element.data as ElementInfo).elementID;
    let targetElementID = (args.target.data as ElementInfo).elementID;
    this.moveElement(draggedElementID, targetElementID, null);
    this.diagram?.doLayout(); // update/reset tree layout after an Element was dropped
  };
  
  // Double Click Event
  private doubleClick = (args: any): void => {
    if (args.source != null) {
      let nodeID = (args['source'].data as ElementInfo).elementID;
      // change the "active Element" (Element that is shown in Editor) and jump to the Editor
      this.dataService.changeActiveElement(nodeID); 
      this.router.navigate(['Editor']);
    }
  }

  // Show summary when hovering over Node
  private onNodeHover = (args: any): void => {
    const node = args.actualObject;
  
    if (node.data != undefined) {
      let summary = this.getSummary(node);
      this.treeViewSummary.setSummaryText(summary);

      // only show the summary for 2 seconds after hovering over node
      clearTimeout(this.timeoutId);
      this.timeoutId = setTimeout(() => {
        this.treeViewSummary.setSummaryText(null);
      }, 2000);
    }
  };

  // Returns the manually created summary of an Element/Node,
  // if there is none it generates and returns the default summary
  private getSummary(node: NodeModel): string {
    let summary: string = (node.data as ElementInfo).summary;
    if (summary != 'null') {
      return summary;
    } else {
      let summary = (node.data as ElementInfo).content.substring(0, 100);
      if (summary.length >= 100) {
        summary += '...';
      }
      return summary;
    }
  }


  // This method allows to change the order of Elements in the TreeView by comparing the Y-coordinates.
  // If an Element was dragged above another e.g. it automatically finds out what the previous Element is
  // and executes the moveElement() command to change the elements order.
  // However syncfusion does not provide a "mouseup" event - that is why changeElementOrder() is never used.
  // (If you just want to test this methods functionality you can overwrite the doubleclick event e.g. with this method)
  public changeElementOrder = (args: any) => {
    const node = args.source; 
    let pc = null;
    if (node.data != undefined) {
      let element = this.rootInstance.searchByID(
        (node.data as ElementInfo).elementID
      );
      if (element != null) {
        pc = this.getPreviousElementByYoffset(element);
        let previousElementID = (pc.data as ElementInfo).elementID
        let parent = element.getParent();
        let parentID = "";
        if(parent instanceof Parent || parent instanceof Element){
          parentID = parent.getId()
        }
        this.moveElement(element.getId(), parentID, previousElementID)
      }
    }
    this.diagram?.doLayout(); // update/reset tree layout
  };

  // Takes an Element as input and finds the previous Element (Element above) 
  // by comparing the current Y-values of all significant Elements.
  private getPreviousElementByYoffset(element: Element): NodeModel {
    let parent = element?.getParent();
    let elementNode: any = this.getNodeByElementID(element.getId());
    let pc = null;
    if (parent instanceof Parent) {
      let children: Element[] = parent.getChildren();
      let childrenAsNodes: any = this.convertElementListToNodeList(children);
      for (let child of childrenAsNodes) {
        if (child.offsetY - elementNode.offsetY < 0) {
          if (pc == null || child.offsetY > pc.offsetY) {
            pc = child;
          }
        }
      }
    }
    return pc;
  }

  // Takes an id as input and returns the according Node 
  private getNodeByElementID(id: string): NodeModel | null {
    let nodes = this.diagram?.nodes;
    if (nodes != undefined) {
      for (let node of nodes) {
        if ((node.data as ElementInfo).elementID === id) {
          return node;
        }
      }
    }
    return null;
  }

  // Takes an element list as input and returns the according Node list
  private convertElementListToNodeList(elements: Element[]): NodeModel[] {
    let nodes: NodeModel[] = new Array<NodeModel>(elements.length);
    for (let i = 0; i < elements.length; i++) {
      let node = this.getNodeByElementID(elements[i].getId());
      if (node != null) {
        nodes[i] = node;
      }
    }
    return nodes;
  }
}