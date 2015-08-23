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
    function UsbScanNode(n) {
        RED.nodes.createNode(this,n);

        this.topic = n.topic;
        var node = this;

        var msg = {};
        msg.topic = this.topic;
        msg.payload = "Ready to Scan USB Devices !"
        this.send(msg);

	node.warn("topic="+msg.topic);
	var mydevices=myusb.getDeviceList();

        this.on('input', function (msg) {
	    for(var i=0;i<mydevices.length;i++) {
	    	var msg={},device=mydevices[i];
		msg.bus=device.busNumber;
		msg.dev=device.deviceAddress;
		msg.vid=device.deviceDescriptor.idVendor.toString(16);
		msg.pid=device.deviceDescriptor.idVendor.toString(16);
		//TODO: device string
		msg.payload=""+msg.vid+":"+msg.pid;
	    	this.send(msg);
	    }
        });
        this.on("close", function() {
            // eg: node.client.disconnect();
        });
    }
    RED.nodes.registerType("usbscan",UsbScanNode);
}
