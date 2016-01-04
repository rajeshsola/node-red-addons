This addon provides set of simple nodes for following USB functionality
- usbscan to list all usb devices along with their ids 
- usbscan also notify hot plugging events
- node-red-node-notify is helpful for better desktop notifications
- usbenum to enumerate a specific device with given device id
- adkinit to initialize android phone in AOA mode
- bulkin,bulkout for bulk transfer(under testing,reference code is kept in repository,but skipped in package.son)


TODO:-
- Well tested bulkin,bulout nodes
- Add more output to usbscan,usbenum
- HID support
- More sample flows

Test Flow:-

	[{"id":"5e006cc4.f8e734","type":"usbscan","z":"3908cf90.f983f","name":"usbscan","topic":"usb","x":364,"y":86,"wires":[["c9d95ff9.33c3c"]]},{"id":"271ab7e9.4754a","type":"inject","z":"3908cf90.f983f","name":"listusb","topic":"","payload":"","payloadType":"none","repeat":"","crontab":"","once":false,"x":132,"y":86,"wires":[["5e006cc4.f8e734"]]},{"id":"c9d95ff9.33c3c","type":"debug","z":"3908cf90.f983f","name":"","active":true,"console":"false","complete":"false","x":576,"y":127,"wires":[]},{"id":"e3046d97.506d28","type":"usbenum","z":"3908cf90.f983f","name":"usbenum","devid":"0000:0000","x":367,"y":196,"wires":[["c9d95ff9.33c3c"]]},{"id":"472697d0.9c644","type":"inject","z":"3908cf90.f983f","name":"","topic":"","payload":"enumerate","payloadType":"string","repeat":"","crontab":"","once":false,"x":156,"y":197,"wires":[["e3046d97.506d28"]]}]

