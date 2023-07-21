import { Component, ViewEncapsulation } from '@angular/core';
import { DiagramComponent, Diagram, NodeModel, ConnectorModel, SnapSettingsModel, LayoutModel,
     DataSourceModel, TextModel, DecoratorModel, ShapeStyleModel, SnapConstraints, UserHandleModel, NodeConstraints, DataBinding, IClickEventArgs, IDoubleClickEventArgs} from '@syncfusion/ej2-angular-diagrams';
import { DataManager} from '@syncfusion/ej2-data';
//import { DataBinding } from '@syncfusion/ej2-angular-diagrams';
//Diagram.Inject(DataBinding);

export interface ElementInfo{
    content: string
    parentID: string
}

@Component({
    selector: "app-tree-view",
    templateUrl: './tree-view.component.html',
    styleUrls: ['./tree-view.component.scss'],
    //encapsulation: ViewEncapsulation.None
})
export class TreeViewComponent {
   /* @ViewChild("diagram")
    public diagram?: DiagramComponent;
    public snapSettings?: SnapSettingsModel;
    public items?: DataManager;
    public layout?: LayoutModel;
    public dataSourceSettings?: DataSourceModel;
    */

    //Initializes data source
    // elementID might also be an important attribute...
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
        {elementID: "009", content: "Kapitel 3.2.1", parentID: "008", summary: "Text Zusammenfassung10"},
        {elementID: "009", content: "Kapitel 3.2.2", parentID: "008", summary: "Text Zusammenfassung10"}];


    public jsonDatasourceSettings: Object = {
        id: "elementID",
        parentId: "parentID",
        dataSource: new DataManager(this.treeData as JSON[])
    }


    public layoutSettings: LayoutModel = {
        type: 'ComplexHierarchicalTree',
        //type: 'OrganizationalChart',
        //orientation: 'LeftToRight',

        //springLength: 1,
        //springFactor: 0.99,
        //maxIteration: 1,
        margin: {
            left: 100,
            top: 100
        }
    }

    
    public RemoveGridLines: SnapSettingsModel = { constraints: SnapConstraints.None};

    public getNodeDefaults(defaultnode: NodeModel): NodeModel{
        defaultnode.height = 50;
        defaultnode.width = 100;
        defaultnode.constraints = NodeConstraints.Default;
        defaultnode.constraints &= ~NodeConstraints.Delete;
        defaultnode.annotations = [
            {content: (defaultnode.data as ElementInfo).content, style: { color: "white" }}
        ]
        defaultnode.expandIcon = {
            shape: "ArrowDown",
            height: 10,
            // position on the node of the "expandIcon"
            offset: { 
                x: 0.5,
                y: 0.15
            }
        }

        defaultnode.collapseIcon = {
            shape: "ArrowUp"
        }

        // When loading tree: only show children of root
        if((defaultnode.data as ElementInfo).parentID == null){
            defaultnode.isExpanded = true;
        } else {
            defaultnode.isExpanded = false;
        }

        //alert(defaultnode.id)
        defaultnode.style = {fill: '#048785', strokeColor: 'Transparent', strokeWidth: 2}
        
        return defaultnode;
    }

    // enable the editing options to the TreeView
    public allowEditing: boolean = true;


    public collapseAll(){
        //this.getNodeDefaults()
    }

    public clicked(node: NodeModel){
        if((node.data as ElementInfo).content == "Einleitung"){
            alert("huray");
        }
    }

    public getConnectorDefaults(defaultconnector: ConnectorModel) : ConnectorModel{
        defaultconnector.type = 'Orthogonal';
        defaultconnector.style = { strokeColor: '#6f409f', strokeWidth: 2}
        //defaultconnector.targetDecorator = { style: { fill: '6f409f', strokeColor: '6f409f' }};
        return defaultconnector;
    }

    public onNodeClick = function (event: any): void {
        let nodeID = event.element.id
        if(nodeID != undefined){
        alert('Node id:' + event.element.id+"___element ID:" + (event.element.data as ElementInfo).content);
      } else {
        alert("missed node")
      }
    };
 
    public onNodeHover(args: any): void {
        //if (args.actualObject instanceof DataBinding.Node) {
          const node = args.actualObject;
          if (node.annotations.length > 0) {
            //alert(node.annotations.length)
            //node.annotations[0].visibility = false;
            //alert("...")
        }
      //  }
      }

      public emptyAlert(){
        alert("")
    }

    public doubleClick(args: any) : void
    {
        if(args.source == null){
            alert("is null");
        } else {
            alert((args['source'].data as ElementInfo).content)
        }
    }


}