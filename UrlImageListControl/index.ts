import {IInputs, IOutputs} from "./generated/ManifestTypes";
import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
type DataSet = ComponentFramework.PropertyTypes.DataSet;

import * as React from "react";
import * as ReactDOM from "react-dom";
import { UrlImageList, IUrlImageListProps,IItem } from "./UrlImageList";

export class UrlImageListControl implements ComponentFramework.StandardControl<IInputs, IOutputs> {

	private _container: HTMLDivElement;
	private _context: ComponentFramework.Context<IInputs>;

	private _noImagePlaceholder: string = "https://via.placeholder.com/250x250.png";

	public init(context: ComponentFramework.Context<IInputs>, notifyOutputChanged: () => void, state: ComponentFramework.Dictionary, container:HTMLDivElement)
	{
		this._container = container;
	}

	public updateView(context: ComponentFramework.Context<IInputs>): void
	{
		if(context.parameters.sampleDataSet.loading){return;}
		
		this._context = context;

		var dataset = context.parameters.sampleDataSet;

		var ids = dataset.sortedRecordIds;
		var records = dataset.records;

		const items: IItem[] = ids.map(id => ({
				url: records[id].getValue("url") == null ? this._noImagePlaceholder : records[id].getValue("url").toString(),
				name: records[id].getValue("name").toString(),
				id: id	  
			})
		);

		var pageSize = (<any>dataset.paging).pageSize;
		var recordCount = dataset.paging.totalResultCount;

		let props: IUrlImageListProps = {	
			items:items,
			pageCount: Math.ceil(recordCount/pageSize),
			loadPage: this.loadPage.bind(this),
			openRecord: this.openRecord.bind(this)
		};

		ReactDOM.render(
			React.createElement(UrlImageList, props),
			this._container
		);
	}

	private openRecord(id:string){
		let pageInput = {
			pageType: "entityrecord",
			entityName: this._context.parameters.sampleDataSet.getTargetEntityType(),
			entityId: id
		};

		let navigationOptions = {
			target: 2,
			width:{value: 100, unit: "%"},
			height:{value: 100, unit: "%"},
			position:1
		};

		(<any>this._context.navigation).navigateTo(pageInput,navigationOptions);
	}
	
	private loadPage(pageNumber: number){
		(<any>this._context.parameters.sampleDataSet.paging).loadExactPage(pageNumber);
	}

	public getOutputs(): IOutputs
	{
		return {};
	}

	public destroy(): void
	{
		
	}

}