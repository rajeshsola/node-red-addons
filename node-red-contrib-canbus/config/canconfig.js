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
// Prepared based on Sample Node-RED node file,99-sample.js
module.exports = function(RED) {
   "use strict";
   function CanConfigNode(n) {
	RED.nodes.createNode(this,n);
	this.channel = n.channel;
	this.bitrate =n.bitrate;
   }
   RED.nodes.registerType("canconfig",CanConfigNode);
  /*RED.httpAdmin.get("/canchannels", RED.auth.needsPermission('serial.read'), function(req,res)    {
   	   var channels=[];
	   channels.push("vcan0");
           res.json(channels);
   });*/
}

