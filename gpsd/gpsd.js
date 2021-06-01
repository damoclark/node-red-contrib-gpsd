
/*
 * node-red-contrib-gpsd - Node for Node Red that reads GPS data from the GPSD software
 *
 * Copyright (C) 2016 Damien Clark (damo.clarky@gmail.com)
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */


module.exports = function(RED) {
	"use strict";
	// require any external libraries we may need....
	var node_gpsd = require('node-gpsd') ;


	// The main node definition - most things happen in here

	/**
	 * The gpsd node
	 *
	 * @constructor
	 * 
	 * @param {Object} config Configuration options as selected through the UI
	 */
	function gpsd(config) {
		/*jshint validthis: true */
		
		// Create a RED node
		RED.nodes.createNode(this,config) ;

		// STORE LOCAL COPIES OF THE NODE CONFIGURATION (AS DEFINED IN THE .HTML)
		
		// Capture the topic
		this.topic = config.topic ;

		// Capture the name
		this.name = config.name ;

		// copy "this" object in case we need it in context of callbacks of other
		// functions.
		var node = this ;

		node.infoLogger = function(s) {
			node.log(s)
		}

		node.warnLogger = function(s) {
			node.warn(s)
		}

		node.errorLogger = function(s) {
			node.error(s)
		}
		
		// Capture the config for connecting to the listener
		var settings = {
			"hostname": config.hostname,
			"port": config.port,
			"logger": {
				"info": node.infoLogger,
				"warn": node.warnLogger,
				"error": node.errorLogger
			},
			"parse": true
		} ;
		
		// If we have disconnected from gpsd, then this will be set to a Timeout
		// as returned by setInterval to repeatedly attempt to reconnect to gpsd
		// Otherwise, it will be set null
		this.reconnect = null ;
		
		// In gpsd, mode 1 means no valid data to determine fix (i.e No fix)
		this.fixed = 1 ;
		
		// Possible events that can be selected from the configuration
		var gpsd_events = [
			'tpv',
			'sky',
			'info',
			'device',
			'gst',
			'att'
		] ;
		
		
		// Do whatever you need to do in here - declare callbacks etc
		
		node.listener = new node_gpsd.Listener(settings) ;

		// Register specific listener for TPV events (location) and check the
		// mode property to see if we have a fix
		// Then update the status.  This status info can be used for other flows
		// when the fix state changes
		node.listener.on('TPV',function(data) {
			
			// If no change in fix state, then do nothing
			if(node.fixed === data.mode) {
				return ;
			}
			
			// Update fixed state
			node.fixed = data.mode ;
			
			// Update status in UI
			switch(data.mode) {
				case 3: {
					node.status({fill:"green",shape:"dot",text:"3D fix"}) ;
					break ;
				}
				case 2: {
					node.status({fill:"yellow",shape:"dot",text:"2D fix"}) ;
					break ;
				}
				case 1: {
					node.status({fill:"grey",shape:"ring",text:"No fix"}) ;
					break ;
				}
			}
		}) ;

		// Register listeners for the UI selected events
		gpsd_events.forEach(function(ev) {
			if(config[ev] === true) {
				node.log('Registering "'+ev+'" event') ;
				node.listener.on(ev.toUpperCase(), function (data) {

					var msg = {} ;
					msg.payload = data ;
			
					// send out the message to the rest of the workspace.
					node.send(msg);
				});
				
			}
		}) ;
		
		// Attempt to auto-reconnect if disconnected from gpsd
		node.listener.on('disconnected', function () {
			
			// If we are already attempt to reconnect, then ignore this
			if(node.reconnect !== null) {
				return ;
			}
			//Set UI status to disconnected
			node.status({fill:"red",shape:"ring",text:"Disconnected: No fix"}) ;
			
			node.warn('Disconnected from gpsd') ;

			// Let's attempt to reconnect to gpsd every 3 seconds (maybe it restarted)
			node.reconnect = setInterval(function() {
				node.warn('Attempting to reconnect to gpsd') ;
				node.listener.connect(function() {

					// Reset our interval timer for reconnecting
					if(node.reconnect !== null) {
						clearInterval(node.reconnect) ;
						node.reconnect = null ;

						// Set UI status to connected
						node.status({fill:"grey",shape:"ring",text:"No fix"}) ;
						node.warn('Reconnected to gpsd') ;
						
						// Lets get back to watching for events again
						node.listener.watch() ;
					}

				}) ;
			},3000) ; // @todo Make the retry timeout configurable
		}) ;
	
		// Connect on initialisation of the node
		node.listener.connect(function() {
			//Set UI status to connected
			node.status({fill:"grey",shape:"ring",text:"No fix"}) ;
			node.log('Connected to gpsd') ;
			node.listener.watch();
		});

		node.on('close', function(done) {
			// Called when the node is shutdown - eg on redeploy.
			// Remove all current listeners so events no longer fire
			node.listener.removeAllListeners() ;
			// If we are currently connected, then disconnect from gpsd
			if(node.listener.isConnected()) {
				node.listener.disconnect(function() {
					node.log('Disconnecting from gpsd on close of gpsd node') ;
					node.listener = null ;
					done() ;
				}) ;
			} else {
				if (node.reconnect) {
					clearInterval(node.reconnect);
					node.reconnect = null;
					node.listener = null;
				}
				done();
			}
		});
	}

	// Register the node by name. This must be called before overriding any of the
	// Node functions.
	RED.nodes.registerType("gpsd",gpsd) ;

} ;
