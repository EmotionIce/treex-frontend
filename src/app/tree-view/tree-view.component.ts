import { Component, ViewEncapsulation } from '@angular/core';
import { DiagramComponent, Diagram, NodeModel, ConnectorModel, SnapSettingsModel, LayoutModel,
     DataSourceModel, TextModel, DecoratorModel, ShapeStyleModel, SnapConstraints, UserHandleModel} from '@syncfusion/ej2-angular-diagrams';
import { DataManager} from '@syncfusion/ej2-data';
//import { DataBinding } from '@syncfusion/ej2-angular-diagrams';
//Diagram.Inject(DataBinding);

export interface ElementInfo{
    Title: string
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
        {Title: "Einleitung", AllowChildren: "true" },
        {Title: "Kapitel 1.1", Parent: "Einleitung", AllowChildren: "true"},
        {Title: "Kapitel 1.1.1", Parent: "Kapitel 1.1", AllowChildren: "true"},
        {Title: "Kapitel 1.1.2", Parent: "Kapitel 1.1", AllowChildren: "true"},
        {Title: "Kapitel 1.1.3", Parent: "Kapitel 1.1", AllowChildren: "true"},
        {Title: "Kapitel 2", Parent: "Einleitung", AllowChildren: "true"},
        {Title: "Kapitel 3", Parent: "Einleitung", AllowChildren: "true"},
        {Title: "Kapitel 3.1", Parent: "Kapitel 3", AllowChildren: "false"},
        {Title: "Kapitel 3.2", Parent: "Kapitel 3", AllowChildren: "false"},
        {Title: "Kapitel 3.21", Parent: "Kapitel 3", AllowChildren: "false"},
        {Title: "Kapitel 3.22", Parent: "Kapitel 3", AllowChildren: "false"}
    ];

    public jsonDatasourceSettings: Object = {
        id: "Title",
        parentId: "Parent",
        dataSource: new DataManager(this.treeData as JSON[])
    }

    public layoutSettings: LayoutModel = {
        type: 'ComplexHierarchicalTree',
        //type: 'OrganizationalChart',
        //orientation: 'TopToBottom',

        //springLength: 1,
        //springFactor: 0.99,
        //maxIteration: 1,
        margin: {
            left: 100,
            top: 100
        }
    }

    
    public RemoveGridLines: SnapSettingsModel = { constraints: SnapConstraints.None };

    public getNodeDefaults(defaultnode: NodeModel): NodeModel{
        defaultnode.height = 50;
        defaultnode.width = 100;
        defaultnode.annotations = [
            {content: (defaultnode.data as ElementInfo).Title, style: { color: "white" }}
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

        defaultnode.style = {fill: '#048785', strokeColor: 'Transparent', strokeWidth: 2}

        return defaultnode;
    }

    public getConnectorDefaults(defaultconnector: ConnectorModel) : ConnectorModel{
        defaultconnector.type = 'Orthogonal';
        defaultconnector.style = { strokeColor: '#6f409f', strokeWidth: 2}
        //defaultconnector.targetDecorator = { style: { fill: '6f409f', strokeColor: '6f409f' }};
        return defaultconnector;
    }


}