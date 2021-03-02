sap.ui.jsview("zui5sd00e01.info", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5sd00e01.info
	*/ 
	getControllerName : function() {
		return "zui5sd00e01.info";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5sd00e01.info
	*/ 
	createContent : function(oController) {
		
		//Main Form
		//-------------------------------------------------------------------------------
		var v002frm = new sap.ui.layout.form.SimpleForm({
			id				: 'v002.frm',
			layout          : "ResponsiveGridLayout",
			editable        : true,
			maxContainerCols: 2,
			breakpointL 	: 500,
			breakpointM 	: 500,
			columnsL   		: 2,
			columnsM   		: 2,
		});
		
		v002frm.addContent(new sap.m.Label({text:"Device UUID"}));
		v002frm.addContent(new sap.m.Input({id:'v002.inpUUID',editable:false,value:""}));
		v002frm.addContent(new sap.m.Label({text:"Virtual User"}));
		v002frm.addContent(new sap.m.Input({id:'v002.inpVname',editable:false,value:""}));
		v002frm.addContent(new sap.m.Label({text:"Register Key"}));
		v002frm.addContent(new sap.m.Input({id:'v002.inpGuid',editable:false,value:""}));
		v002frm.addContent(new sap.m.Label({text:"Logon Key"}));
		v002frm.addContent(new sap.m.Input({id:'v002.inpURL',editable:false,value:""}));
		v002frm.addContent(new sap.m.Label({text:""}));
		v002frm.addContent(new sap.m.Button({
			id		: 'v002.btnReset',
			icon	: 'sap-icon://delete',
			text	: 'Reset Device',
			press	: oCon.ui5Dispatch,
		}));
		
		//Table: DB List
		//---------------------------------------------------------------------------------
//		var v002rowId = new sap.m.ColumnListItem({
//			type	: sap.m.ListType.Navigation,
//			cells	:[ new sap.m.Text({text:"{vname}"}),
//			     	   new sap.m.Text({text:"{guid}"}),
//			           new sap.m.Text({text:"{uuid}"}),]
//		});  
//   		var v002tblId = new sap.m.Table({
//   			id			: "v002.tblId",
//   			columns		: [new sap.m.Column({header: new sap.m.Label({text:"Name",design:"Bold",})}),
//   			       		   new sap.m.Column({header: new sap.m.Label({text:"GUID",design:"Bold",})}),
//   			       		   new sap.m.Column({header: new sap.m.Label({text:"UUID",design:"Bold",})}),],
//   			items		: {path:'/dbData',template:v002rowId},
//   		});	

		
		//Reset Password Dialog
		//-------------------------------------------------------------------------------
		var v002frm2 = new sap.ui.layout.form.SimpleForm({
			id				: 'v002.frm2',
			layout          : "ResponsiveGridLayout",
			editable        : true,
			maxContainerCols: 2,
			breakpointL 	: 500,
			breakpointM 	: 500,
			columnsL   		: 2,
			columnsM   		: 2,
		});
		v002frm2.addContent(new sap.m.Label({text:"Reset Password"}));
		v002frm2.addContent(new sap.m.Input({id:'v002.inpReset',value:""}));
		v002frm2.addContent(new sap.m.Label({text:""}));
		v002frm2.addContent(new sap.m.Button({id:'v002.btnResetOk',text:'Reset',press:oCon.ui5Dispatch}));
		var v002diaReset = new sap.m.Dialog({
			id				: 'v002.diaReset',
			title			: 'Reset Device',
			beginButton		: new sap.m.Button({id:'v002.btnResetNo',text:'Cancel',press:oCon.ui5Dispatch}),
		    content			: [v002frm2],
		});
		
		//Info Page
		//-------------------------------------------------------------------------------
		//String
		var V002lblTitle = new sap.m.Label({text:"CPF-SAP Mobile",design:sap.m.LabelDesign.Bold});
		var v002btnBak   = new sap.m.Button({id:'v002.btnBak',icon:"sap-icon://nav-back",press:oCon.ui5Dispatch});
		var v002page = new sap.m.Page({
			id				: 'v002.page',
			title			: "CPF-SAP Mobile",
			customHeader	: new sap.m.Bar({ contentLeft  :[v002btnBak],
				    						  contentMiddle:[V002lblTitle]}),
			footer			: new sap.m.Bar({contentMiddle:[]}),
			content			: [v002frm]
		});	
		
		
		//Return
		//-------------------------------------------------------------------------------
		this.setDisplayBlock(true);
		return [v002page];
	}

});