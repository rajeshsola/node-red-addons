/**
 * Copyright (C) 2015 - Rajesh Sola <rajeshsola@gmail.com>
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
    var can = require('socketcan');

    function CanDumpNode(n) {
        RED.nodes.createNode(this,n);
        this.vconfig = RED.nodes.getNode(n.vconfig);
	if(this.vconfig)
		this.channel=this.vconfig.channel;
	else
		this.channel="vcan0";
        var node = this;

	node.warn("channel="+this.channel);
	var channel;
	try {
		channel = can.createRawChannel(""+this.channel, true);
	}catch(ex) { 
		node.error("channel not found:"+this.channel);		
	}
	if(channel) 
	{
		channel.start();
		var canmsg={};
		channel.addListener("onMessage",function(frame) {
			//canmsg.channel=frame.channel;
			canmsg.canid=frame.id;
			canmsg.dlc=frame.data.length;
			canmsg.data=frame.data;
			canmsg.payload=frame.id+"#"+frame.data;
			node.send(canmsg);
		});
	        this.on("close", function() {
		    channel.stop();
	        });	
	}
    }
    RED.nodes.registerType("candump",CanDumpNode);
}
