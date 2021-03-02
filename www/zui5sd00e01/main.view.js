sap.ui.jsview("zui5sd00e01.main", {

	/** Specifies the Controller belonging to this View. 
	* In the case that it is not implemented, or that "null" is returned, this View does not have a Controller.
	* @memberOf zui5sd00e01.main
	*/ 
	getControllerName : function() {
		return "zui5sd00e01.main";
	},

	/** Is initially called once after the Controller has been instantiated. It is the place where the UI is constructed. 
	* Since the Controller is given to this method, its event handlers can be attached right away. 
	* @memberOf zui5sd00e01.main
	*/ 
	createContent : function(oController) {
	
		//Login Form: iOrder URL
		//-------------------------------------------------------------------------------		
		//Tile Menu
		var v001tilItm = new sap.m.StandardTile({
            icon	: '{icon}',
            title	: '{uname}',
            info	: '{vtext}',
            press	: oCon.ui5Dispatch,
        });
		var v001til = new sap.m.TileContainer({
			id		: 'v001.til',
			tiles	: {path:'/t_user',template:v001tilItm},
		});

		//Register Dialog
		//-------------------------------------------------------------------------------
		var v001frm = new sap.ui.layout.form.SimpleForm({
			id				: 'v001.frm',
			layout          : "ResponsiveGridLayout",
			editable        : true,
			maxContainerCols: 2,
			breakpointL 	: 500,
			breakpointM 	: 500,
			columnsL   		: 2,
			columnsM   		: 2,
		});
		v001frm.addContent(new sap.m.Label({text:"Virtual User"}));
		v001frm.addContent(new sap.m.Input({id:'v001.inpVname',value:""}));
		v001frm.addContent(new sap.m.Label({text:""}));
		v001frm.addContent(new sap.m.Button({id:'v001.btnRegisOk',text:'Register',press:oCon.ui5Dispatch}));
		
		var v001diaReg = new sap.m.Dialog({
			id				: 'v001.diaReg',
			title			: 'Register Device',
			beginButton		: new sap.m.Button({id:'v001.btnRegisNo',text:'Cancel',press:oCon.ui5Dispatch}),
		    content			: [v001frm],
		});
		
		
		//Login Page
		//-------------------------------------------------------------------------------
		this.setDisplayBlock(true);
		var v001lblTitle = new sap.m.Label({text:"CPF-SAP Mobile",design:sap.m.LabelDesign.Bold});
		var v001btnLoad  = new sap.m.Button({id:'v001.btnLoad',text:'Load User',press:oCon.ui5Dispatch});
		var v001btnAdd   = new sap.m.Button({id:'v001.btnRegis',text:'Add User',icon:'sap-icon://add',press:oCon.ui5Dispatch});
		var v001btnInfo  = new sap.m.Button({id:'v001.btninfo',text:'Info',icon:'sap-icon://message-information',press:oCon.ui5Dispatch});
		var v001page = new sap.m.Page({
			id				: 'v001.page',
			enableScrolling	: false,
			customHeader	: new sap.m.Bar({contentLeft:[v001btnInfo],
											 contentMiddle:[v001lblTitle],
										     contentRight:[v001btnAdd]}),
			footer			: new sap.m.Bar({contentMiddle:[v001btnLoad],
											 contentRight:[]}),
			content			: [v001til]
		});	
		
		//Return
		//-------------------------------------------------------------------------------
		return [v001page];
	}

});