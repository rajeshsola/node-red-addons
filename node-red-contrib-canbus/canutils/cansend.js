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
    var random = require('random-js')();	//uses native engine
    function CanSendNode(n) {
        RED.nodes.createNode(this,n);

	this.config = RED.nodes.getNode(n.config);
	if(this.config)
	        this.channel = this.config.channel;
	else
		this.channel = "vcan0";
	this.canid=n.canid;
	this.payload=n.payload;

        var node = this;

	node.warn("id="+this.canid+",channel="+this.channel);
	try {
		var channel = can.createRawChannel(""+this.channel, true);
	}catch(ex) {
		node.error("channel not found:"+this.channel);
	}
	if(channel)
	{
		channel.start();
		var frame={};
	        // respond to inputs....
        	this.on('input', function (msg) {
			msg.channel=this.channel;
			frame.canid=0;
			frame.dlc=0;
			if(msg.canid)
			{
				frame.canid=parseInt(msg.canid);
			}
			else if(this.canid)
			{
				frame.canid=parseInt(this.canid);
			}	
			/*--------------------------------------------------------*/
			if(msg.payload && msg.payload.indexOf("#")!=-1 && frame.canid==0)
			{
				frame.canid=parseInt(msg.payload.split("#")[0]);
				frame.data=new Buffer(msg.payload.split("#")[1]);
				frame.dlc=frame.data.length;
			}
			else if(msg.payload) 
			{
				frame.data=new Buffer(msg.payload);
				frame.dlc=frame.data.length;
			}
			else if(this.payload)
			{
				frame.data=new Buffer(this.payload);
				frame.dlc=frame.data.length;
			}
			else	 //no msg.payload and this.data is empty
			{
				frame.dlc=random.integer(1,8);
				frame.data=new Buffer(frame.dlc);
				for(var i=0;i<frame.dlc;i++)
					frame.data[i]=random.integer(65,90);
			//random.integer(1,255),random.integer(48,57),random.integer(96,121)
			}
			if(frame.canid==0)   //canid is not yet set
			{
				frame.canid=random.integer(1,4095);
			}
			node.warn("canid:"+frame.canid+",data:"+frame.data+",dlc:"+frame.dlc);
			if(frame.dlc<=8)	//try-catch?
				channel.send({ id: frame.canid,
					ext: false,
					data:frame.data });
			else
				node.warn("frame data is too long");
		});
		//TODO:support for extended frames, other cansend options
	        this.on("close", function() {
		    channel.stop();
	        });
	}
    }
    RED.nodes.registerType("cansend",CanSendNode);
}
