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
    function ADKInitNode(n) {
        RED.nodes.createNode(this,n);

        this.topic = n.topic;
	this.devid = n.devid;
	this.vid = n.devid.split(":")[0];
	this.pid = n.devid.split(":")[1];

        var node = this;

	var mydevice=myusb.findByIds(parseInt(this.vid,16),parseInt(this.pid,16));
	if(mydevice)
	{
	        this.on('input', function (msg) {
		    	/*var msg={},myinterface,myendpoint;
			msg.bus=mydevice.busNumber;
			mydevice.open();
			for(var i=0;i<msg.numInterfaces;i++) {
				myinterface=mydevice.interfaces[i];
				node.warn("interface index:"+i+",class="+myinterface.descriptor.bInterfaceClass+",subclass="+myinterface.descriptor.bInterfaceSubClass);
				for(var j=0;j<myinterface.descriptor.bNumEndpoints;j++)
				{
					myendpoint=myinterface.endpoints[j];
					node.warn("endpoint-"+ myendpoint.direction + "::"+myendpoint.descriptor.bEndpointAddress.toString(16)+",type="+myendpoint.transferType);
				}
			}*/
			var callback=function(error,data) {
				if(!error)
					node.info(data);
				 else
					node.error(error);
                	};
			var manufacturer=new Buffer(n.manufacturer.toString());
			var model=new Buffer(n.model.toString());
			var adkver=new Buffer(n.version.toString());
			var buf=new Buffer("0");
			mydevice.controlTransfer(0xC0,51,0,0,2,callback);
			mydevice.controlTransfer(0x40,52,0,0,manufacturer,callback);
			mydevice.controlTransfer(0x40,52,0,1,model,callback);'
			mydevice.controlTransfer(0x40,52,0,3,adkver,callback);
			mydevice.controlTransfer(0x40,53,0,0,buf,callback); //delay issue
			msg.payload=""+msg.vid+":"+msg.pid;
		    	this.send(msg);
	        });
		//TODO:initialize android device in various modes with combinations
		//of AOA, AUDIO, HID based on input string
	        this.on("close", function() {
			//TODO, eg:- mydevice.close();
		});
	}
    }
    RED.nodes.registerType("adkinit",ADKInitNode);
    RED.httpAdmin.get("/aoadevices", RED.auth.needsPermission('usb.read'), function(req,res){
	    var mydevices=myusb.getDeviceList();
	    var devstrlist=[];
	    for(var i=0;i<mydevices.length;i++)
	    {
	        devstrlist.push(mydevices[i].deviceDescriptor.idVendor.toString(16)+":"+
                mydevices[i].deviceDescriptor.idProduct.toString(16));
	    }
	    res.json(devstrlist);
    });
}
