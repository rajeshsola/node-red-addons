/**
 * Copyright (C) 2015 - Rajesh Sola<rajeshsola@gmail.com>
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
// Prepared based on Sample Node-RED node file, 99-sample.js.demo

module.exports = function(RED) {
    "use strict";
    var myusb = require('usb');
    function UsbBulkInNode(n) {
        RED.nodes.createNode(this,n);

        this.devid = n.devid;
	this.iface = n.iface;
	this.epin  = n.epin;
	this.packetlen=n.packetlen;

        var node = this;

	this.vid=this.devid.split(":")[0];
	this.pid=this.devid.split(":")[1];
	node.warn("bulk::devid="+this.devid+",vid="+this.vid+",pid="+this.pid+
			",iface="+this.iface+",epin="+this.epin);
	var mydevice=myusb.findByIds(parseInt(this.vid,16),parseInt(this.pid,16));
	if(mydevice)
	{
		mydevice.open();
		var myinterface=mydevice.interface(parseInt(this.iface,16));
		if(myinterface)
		{
		  myinterface.claim();	//handle error LIBUSB_ERROR_BUSY
		  var myendpoint=myinterface.endpoint(parseInt(this.epin,16));
		  if(myendpoint)
		  {
			//myendpoint.transferType=2;
			//myendpoint.startStream(1,64);
			/*myendpoint.transfer(64,function(error,data) {
			if(!error)
				console.log(data);
			else
				console.log(error);
			});*/
		  	myendpoint.on('data',function(buffer) {
		 	msg.payload=buffer;
			node.send(msg);
		  });
		  this.on('input',function(data) {
			var str=new String(msg.payload);
			if(str=="start")
			{
				myendpoint.startPoll(10,this.packetlen);
				node.warn("poll started");
			}
			else if(str=="stop")
			{
				myendpoint.stopPoll(function(){
					node.warn("poll stop callback");
				});
				node.warn("poll stopped");
			}
		  });
	          this.on("close", function() {
	            // eg: mydevice.close, release interface etc.
		  myinterface.release(function(err){
			    if(err)
			    	node.warn("release errors:"+err);
			    node.warn("releasing interace");
	    	  });
		  mydevice.close();
        	  });
    		}	
		else
			node.error("endpoint not found :"+this.epin);
	       }
	       else
		      node.error("interface not found :"+this.iface);
	}
	else
		node.error("device not found ::"+this.vid+":"+this.pid);
    	}
	RED.nodes.registerType("usbbulkin",UsbBulkInNode);
	RED.httpAdmin.get("/bindevices", RED.auth.needsPermission('usb.read'),function(req,res){
		var mydevices=myusb.getDeviceList();
		var devstrlist=[];
		for(var i=0;i<mydevices.length;i++)
		{
			devstrlist.push(mydevices[i].deviceDescriptor.idVendor.toString(16)+":"+
			mydevices[i].deviceDescriptor.idProduct.toString(16));
		}
		res.json(devstrlist);
    	});
	RED.httpAdmin.get("/ifacelist", RED.auth.needsPermission('usb.read'), function(req,res){
		var mydevice=myusb.findByIds(parseInt("0000",16),parseInt("0000",16)); //TODO
		mydevice.open();
		var mylist=mydevice.interfaces;
		var ifstrlist=[];
		for(var i=0;i<mylist.length;i++)
			ifstrlist.push(mylist[i].descriptor.bInterfaceNumber.toString(10));
		res.json(ifstrlist);
	});
	RED.httpAdmin.get("/epinlist", RED.auth.needsPermission('usb.read'), function(req,res){
		var mydevice=myusb.findByIds(parseInt("0000",16),parseInt("0000",16)); //TODO
		mydevice.open();
		var epstrlist=[];
		var myinterface=mydevice.interfaces[0];
		for(var i=0;i<myinterface.descriptor.bNumEndpoints;i++)
			  epstrlist.push(myinterface.endpoints[i].descriptor.bEndpointAddress.toString(16));
		res.json(epstrlist);
	});
}
