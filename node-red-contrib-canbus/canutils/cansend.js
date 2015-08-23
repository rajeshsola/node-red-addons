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
    function CanSendNode(n) {
        RED.nodes.createNode(this,n);

	this.config = RED.nodes.getNode(n.config);
	if(this.config)
	        this.channel = this.config.channel;
	else
		this.channel = "vcan0";
	this.canid=n.canid;
	this.data=n.data;

        var node = this;

	node.warn("id="+this.canid+",channel="+this.channel);
	var channel = can.createRawChannel(""+this.channel, true);
	channel.start();

        // respond to inputs....
        this.on('input', function (msg) {
		node.warn("Sending a can frame: "+msg.payload);
		msg.channel=this.channel;
		if(msg.payload.indexOf("#")==-1)
		{
			msg.canid=parseInt(this.canid);
			msg.data=new Buffer(msg.payload);
		}
		else
		{
			msg.canid=parseInt(msg.payload.split("#")[0]);
			msg.data=new Buffer(msg.payload.split("#")[1]);
		}
		//node.warn(msg);
		channel.send({ id: msg.canid,
			ext: false,
			data:msg.data });
	});
	//TODO:support for extended frames, other cansend options
        this.on("close", function() {
	    channel.stop();
        });
    }
    RED.nodes.registerType("cansend",CanSendNode);
}
