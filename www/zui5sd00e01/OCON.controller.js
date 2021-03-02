sap.ui.controller("zui5sd00e01.OCON", {
	
	//--------------------------------------------------------------------------------
	//DEVICE-EVENT
	//--------------------------------------------------------------------------------
	onDeviceReady: function(){
		
		oCon.getControl('v002.inpUUID').setValue(device.uuid);
		oCon.ui5DispatchBackEnd("SAP.EVT005","evt005","Loading User..");
		
//		window.plugins.uniqueDeviceID.get(
//			function(uuid){oCon.getControl('v002.inpUUID').setValue(uuid);
//						   oCon.ui5DispatchBackEnd("SAP.EVT005","evt005","Loading User..");
//			//			   oCon.dbDispatch('GAP.DBINIT');
//		    },
//			function(){oCon.ui5DispatchFcode("onUUIDErr");});
	},

	
	//--------------------------------------------------------------------------------
	//DEVICE-DATABASE
	//--------------------------------------------------------------------------------
	dbErr: function(oEvt){
		oCon.popMsgbox("Error processing SQL: "+oEvt.code);
	},
	
	//dbInit
	//--------------------------------------------------------------------------------
//	dbInit: function(oEvt){
//		
//		var sql    = 'SELECT * FROM ZREGIS2';
//		var oModel = new sap.ui.model.json.JSONModel();
//		
//		oEvt.executeSql(sql, [], 
//			function(tx, results){
//				oModel.setData({dbData : results.rows});
//				oCon.getControl("v002.tblId").setModel(oModel);
//			},
//			function(){oCon.ui5DispatchFcode("GAP.INIT.ERR");});
//	},
	
	//dbReadLogon
	//--------------------------------------------------------------------------------
	dbReadLogon: function(oEvt){

		var VName = oCon.getControl('v002.inpVname').getValue().toUpperCase();
		var sql   = 'SELECT * FROM ZREGIS2 WHERE vname = "'+VName+'"';
		
		oEvt.executeSql('CREATE TABLE IF NOT EXISTS ZREGIS2 (vname unique, uuid, guid)');
		oEvt.executeSql(sql, [], 
			function(tx, results){
				if(results.rows.length>0){
					oCon.getControl('v002.inpGuid').setValue(results.rows.item(0).guid);
					oCon.getControl('v002.inpVname').setValue(results.rows.item(0).vname);
					oCon.ui5DispatchFcode("GAP.INIT.SUC");
				};
			},
			function(){oCon.ui5DispatchFcode("GAP.INIT.ERR");});
	},
	
	//dbRegis
	//--------------------------------------------------------------------------------
	dbRegis: function(oEvt){
		
		var UUID  = oCon.getControl('v002.inpUUID').getValue();
		var VName = oCon.getControl('v001.inpVname').getValue().toUpperCase();
		var Regid = oCon.getControl('v002.inpGuid').getValue();
		
		oEvt.executeSql('CREATE TABLE IF NOT EXISTS ZREGIS2 (vname unique, uuid, guid)');
		oEvt.executeSql('DELETE FROM ZREGIS2 WHERE vname = "'+VName+'"');
		oEvt.executeSql('INSERT INTO ZREGIS2 (vname, uuid, guid) VALUES ("'+VName+'", "'+UUID+'", "'+Regid+'")',[],
			function(oEvt){oCon.ui5DispatchFcode("GAP.REGISTER.SUC");},
			function(){oCon.ui5DispatchFcode("GAP.REGISTER.ERR");});
	},
	
	//dbDeRegis
	//--------------------------------------------------------------------------------
	dbDeRegis: function(oEvt){
		oEvt.executeSql('DELETE FROM ZREGIS2', [], 
				function(){},
				function(){});
		oEvt.executeSql('DROP TABLE IF EXISTS ZREGIS2', [], 
				function(){},
				function(){});
	},
	
	//dbDispatch
	//--------------------------------------------------------------------------------
	dbDispatch: function(fcode){
		
		var oDb = window.openDatabase("SAPUI5DB", "1.0", "CPF-SAP", 200000);
		
		//if(fcode=='GAP.DBINIT'){oDb.transaction(oCon.dbInit, oCon.dbErr);};
		
		if(fcode=='GAP.READLOGON'){oDb.transaction(oCon.dbReadLogon, oCon.dbErr);};
		
		if(fcode=='GAP.DEREGISTER'){oDb.transaction(oCon.dbDeRegis, oCon.dbErr);};
		
		if(fcode=="GAP.REGISTER"){oDb.transaction(oCon.dbRegis, oCon.dbErr);};
	},
	
	//--------------------------------------------------------------------------------
	//SAPUI5-EVENT
	//--------------------------------------------------------------------------------
		
	//fcodeRegister
	//--------------------------------------------------------------------------------
	fcodeRegister: function(fcode){
		
		if(oCon.getControl('v001.inpVname').getValue()==''){
			oCon.popMsgbox("Please enter virtual user");
			return;
		}
		oCon.getControl('v001.diaReg').close();
		oCon.ui5DispatchBackEnd("SAP.EVT004","evt004","Registering Device..");
		
	},
	
	//ui5Dispatch
	//--------------------------------------------------------------------------------
	ui5Dispatch: function(oEvt){
		
		var vPar 	= '';
		try{
			vPar = oEvt.getSource().getParent().sId;
			if(vPar=="v001.til"){
				oCtx.oData.vname = oCon.getControl(oEvt.getSource().sId).getTitle();
				oCon.getControl('v002.inpVname').setValue(oCon.getControl(oEvt.getSource().sId).getTitle());
				oCon.ui5DispatchFcode(vPar);
				
			}else{
				oCon.ui5DispatchFcode(oEvt.getSource().sId);
			};
			
		}catch(err){};

	},
	
	//ui5DispatchFcode
	//--------------------------------------------------------------------------------
	ui5DispatchFcode: function(fcode,oModela){
		
		//Start Application
		//-----------------------------------------------
		if(fcode=='v001.til'){
			oCon.dbDispatch('GAP.READLOGON');
		};
		if(fcode=='GAP.INIT.SUC'){
			oCon.ui5DispatchBackEnd("SAP.EVT006","evt006","Request access..");			
		};
		if(fcode=="SAP.EVT006"){
			if(oCon.popMsgErr(oModela)){
				oCon.ui5DispatchModelSet(fcode,oModela);
				window.open(oCon.getiOrderUrl(), '_system', 'location=no');
			};
		};
		
		//Reset Device
		//------------------------------------------------
		if(fcode=='v002.btnReset'){//Reset Popup
			oCon.getControl('v002.inpReset').setValue();
			oCon.getControl('v002.diaReset').open();
		};
		if(fcode=='v002.btnResetNo'){//Cancel Reset
			oCon.getControl('v002.diaReset').close();
		};
		if(fcode=='v002.btnResetOk'){//OK Register
			oCon.ui5DispatchBackEnd("SAP.EVT007","evt007","Resetting Device..");
		};
		if(fcode=="SAP.EVT007"){
			if(oCon.popMsgErr(oModela)){
				oCon.ui5DispatchModelSet(fcode,oModela);
				oCon.dbDispatch("GAP.DEREGISTER");
			};
			oCon.getControl('v002.diaReset').close();
		};
		
		//Register Device
		//------------------------------------------------
		if(fcode=='v001.btnRegis'){//Register
			oCon.getControl('v001.inpVname').setValue();
			oCon.getControl('v001.diaReg').open();
		};
		if(fcode=='v001.btnRegisNo'){//Cancel Register
			oCon.getControl('v001.diaReg').close();
		};
		if(fcode=='v001.btnRegisOk'){//OK Register
			oCon.fcodeRegister(fcode);
		};
		if(fcode=="SAP.EVT004"){
			if(oCon.popMsgErr(oModela)){
				oCon.ui5DispatchModelSet(fcode,oModela);
				oCon.dbDispatch("GAP.REGISTER");
			};
		};
			
		//Reload User
		//------------------------------------------------
		if(fcode=='v001.btnLoad'){
			oCon.ui5DispatchBackEnd("SAP.EVT005","evt005","Loading User..");
			//oCon.dbDispatch('GAP.DBINIT');
		}
		
		//Model Set
		oCon.ui5DispatchModelSet(fcode,oModela);
		oCon.ui5DispatchUI(fcode);
		oCon.ui5DispatchNav(fcode);
	},
	
	//ui5DispatchBackEnd
	//--------------------------------------------------------------------------------
	ui5DispatchBackEnd: function(fcode,iAction,sBusy){
		
		var oModela = new sap.ui.model.json.JSONModel();
		var oDialog = oCon.getBusyDialog(sBusy);
		var oParam  = oCon.ui5DispatchParam(fcode);
		oModela.setSizeLimit(1000);
		
		//Register Handler
		oModela.attachRequestSent(function(){oDialog.open();});
		oModela.attachRequestCompleted(function(){
			oDialog.close();
			oCon.ui5DispatchFcode(fcode,oModela);
		});
		oModela.attachRequestFailed(function(){
			oDialog.close();
			oCon.popMsgbox("Coummunication to SAP fail !!!");
		});
		oModela.attachParseError(function(){
			oDialog.close();
			oCon.popMsgbox("Coummunication to SAP fail !!!");
		});
		
		//Call Back-end
		oModela.loadData(oCon.getModelURL(iAction),oParam);
		
	},
	

	//ui5DispatchModelSet
	//--------------------------------------------------------------------------------
	ui5DispatchModelSet: function(fcode,oModela){
		try
		{
			if(fcode=="SAP.EVT004"){//Register Device
				oCon.getControl('v002.inpGuid').setValue(oModela.oData.reginfo.guid);
				oCon.getControl("v001.til").setModel(oModela);
			};
			
			if(fcode=="SAP.EVT006"){//Login
				oCon.getControl("v002.inpURL").setValue(oModela.oData.reginfo.urlid);
			};
			
			if(fcode=="SAP.EVT005"){//List Registered User
				oCon.getControl("v001.til").setModel(oModela);
			};
			
			if(fcode=="SAP.EVT007"){//Reset Device
				oCon.getControl("v001.til").setModel(oModela);
			};
			
		}catch(err){};
		
	},

	//ui5DispatchUI
	//--------------------------------------------------------------------------------
	ui5DispatchUI: function(fcode){},
	
	//ui5DispatchNav
	//--------------------------------------------------------------------------------
	ui5DispatchNav: function(fcode){

		if(fcode=='v001.btninfo')//Info
			app.to('v002','slide');
		
		if(fcode=='v002.btnBak')
			app.to('v001','slide');
	},
	
	//ui5DispatchParam
	//--------------------------------------------------------------------------------
	ui5DispatchParam: function(fcode){
		
		var arrVname 	= new Array();
		var oBinding 	= oCon.getControl('v001.til').getBinding("tiles");
		
		if(oBinding){
			for(var i=0;i<oBinding.oList.length;i++){
				arrVname[i]     = new Array(1);
				arrVname[i][0]  = oBinding.oList[i].uname;
			};
		};
		
		if(fcode=='SAP.EVT006'){ //Start Login
			return oParameters = { 
				"uuid" 		: oCon.getControl("v002.inpUUID").getValue(),
				"guid"		: oCon.getControl("v002.inpGuid").getValue(),
				"vname"		: oCon.getControl("v002.inpVname").getValue(),
				"reset"		: oCon.getControl("v002.inpReset").getValue(),
			};
		};
		
		if(fcode=='SAP.EVT007'){ //Reset Device
			return oParameters = { 
				"uuid" 		: oCon.getControl("v002.inpUUID").getValue(),
				"uname"		: arrVname,
				"reset"		: oCon.getControl("v002.inpReset").getValue(),
			};
		};
		
		
		return oParameters = { 
			"uuid" 		: oCon.getControl("v002.inpUUID").getValue(),
			"guid"		: oCon.getControl("v002.inpGuid").getValue(),
			"vname"		: oCon.getControl("v001.inpVname").getValue(),
			"reset"		: oCon.getControl("v002.inpReset").getValue(),
		};
	},
	
	//--------------------------------------------------------------------------------
	//SAPUI5-H
	//--------------------------------------------------------------------------------
	
	//getiOrderUrl
	//--------------------------------------------------------------------------------
	getiOrderUrl: function(){
		return  "https://miorders4uat.cpf.co.th:44300/mobile/index.html?sap-ui-appcache=false&sap-ui-language=TH" +
		  "&prot-version=2" 						+
		  "&uuid="  + oCon.getControl("v002.inpUUID").getValue() +
		  "&guid="  + oCon.getControl("v002.inpGuid").getValue() +
		  "&urlid=" + oCon.getControl("v002.inpURL").getValue() +
		  "&vname=" + oCon.getControl("v002.inpVname").getValue();
	},
	
	//getModelURL
	//--------------------------------------------------------------------------------
	getModelURL: function(action){
		
		return "https://miorders4uat.cpf.co.th:44300/zui5?prot-version=2&application=mobi01&action=" + action;
	},
	
	//getBusyDialog
	//--------------------------------------------------------------------------------
	getBusyDialog: function(sText){
		return new sap.m.BusyDialog({
			text		: sText + '..',
			title		: 'CPF-SAP Mobile'});
	},

	//getControl
	//--------------------------------------------------------------------------------
	getControl: function(sName){
		return sap.ui.getCore().getControl(sName);
	},
	
	//popMsgbox
	//--------------------------------------------------------------------------------
	popMsgbox: function(sMsg){
		jQuery.sap.require("sap.m.MessageBox");
		sap.m.MessageBox.show(sMsg, {
		          title	: "CPF-SAP Mobile",
		 });		
	},
	
	//popMsgErr
	//--------------------------------------------------------------------------------
	popMsgErr: function(oModela){
		try
		{
			if(oModela.oData.reginfo.typ=="E"){
				oCon.popMsgbox(oModela.oData.reginfo.msg);
				return false;
			};
			return true;
		}catch (err){
			return false;
		};
	},
	
	//get Local Model
	//--------------------------------------------------------------------------------
	getCtx: function(){
		var oModel = new sap.ui.model.json.JSONModel();
		oModel.setData({
		    uuid	: "",
		    vname	: "",
		    guid	: "",
		    urlid	: "",
		    vname_i	: "",
		});
		return oModel;
	},
});
