/**
 * Copyright JS Foundation and other contributors, http://js.foundation
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
// If you use this as a template, update the copyright with your own name.
// Sample Node-RED node file


module.exports = function(RED) {
    "use strict";
    var EventSource = require("eventsource");
    var myurl=require('url');

    function OpenSensorsNode(n) {
        RED.nodes.createNode(this,n);

        this.topic = n.topic;
	this.apikey = n.apikey;
	this.ispublic=n.ispublic;

        var node = this;

        var msg = {};
	var url;
	if(this.ispublic)
		url=myurl.parse("https://realtime.opensensors.io/v1/public/events/topics/"+this.topic);
	else
		url=myurl.parse("https://realtime.opensensors.io/v1/events/topics/"+this.topic+"?api-key="+this.apikey);
        msg.payload = url;
        //node.warn(msg);
	var eventUrl = new EventSource(url);
	var msg= { };
	eventUrl.onmessage = function(event) {
 		console.log(event.data);
		msg.payload=event.data;
		node.send(msg);
	}
    	this.on("close", function() {
		
        });
    }
    RED.nodes.registerType("opensensors",OpenSensorsNode);
}
