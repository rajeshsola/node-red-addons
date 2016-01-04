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
// Prepared based on Sample Node-RED node file,99-sample.js.demo


module.exports = function(RED) {
    "use strict";
    var myusb = require('usb');
    function UsbEnumNode(n) {
        RED.nodes.createNode(this,n);

        this.topic = n.topic;
	this.devid = n.devid;
	this.vid=this.devid.split(":")[0];
	this.pid=this.devid.split(":")[1];
        var node = this;

	var mydevice=myusb.findByIds(parseInt(this.vid,16),parseInt(this.pid,16));
	if(mydevice)
	{
		mydevice.open();	
        	this.on('input', function (msg) {
	    		var msg={},myinterface,myendpoint;
			msg.bus=mydevice.busNumber;
			msg.vid=mydevice.deviceDescriptor.idVendor.toString(16);
			msg.pid=mydevice.deviceDescriptor.idProduct.toString(16);
			msg.manufacturer=mydevice.deviceDescriptor.iManufacturer;
			msg.product=mydevice.deviceDescriptor.iProduct;
			msg.serial=mydevice.deviceDescriptor.iSerialNumber;
			msg.numInterfaces=mydevice.configDescriptor.bNumInterfaces;
			for(var i=0;i<msg.numInterfaces;i++) {
				myinterface=mydevice.interfaces[i];
				node.warn("interface index:"+i+",class="+myinterface.descriptor.bInterfaceClass+",subclass="+myinterface.descriptor.bInterfaceSubClass);
				for(var j=0;j<myinterface.descriptor.bNumEndpoints;j++)
				{
					myendpoint=myinterface.endpoints[j];
					node.warn("endpoint-"+ myendpoint.direction + "::"+myendpoint.descriptor.bEndpointAddress.toString(16)+",type="+myendpoint.transferType);
				}
			}
			msg.payload=""+msg.vid+":"+msg.pid;
		    	this.send(msg);
        	});
		//TODO:put more enumerated details on interfaces,endpoints as part of
		//msg properties
	        this.on("close", function() {
        	    mydevice.close();
	        });
	}
	else
		node.error("device not found ::"+this.vid+":"+this.pid);
    }
    RED.nodes.registerType("usbenum",UsbEnumNode);
    RED.httpAdmin.get("/usbdevices", RED.auth.needsPermission('usb.read'), function(req,res){
	       var mydevices=myusb.getDeviceList();
	       var devicestr=[];
	       for(var i=0;i<mydevices.length;i++)
	       {
	       	devicestr.push(mydevices[i].deviceDescriptor.idVendor.toString(16)+":"+
			mydevices[i].deviceDescriptor.idProduct.toString(16));
	       }
	       res.json(devicestr);
    });
}
