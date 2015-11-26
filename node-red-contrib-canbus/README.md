A set of simple nodes for CANBus management on linux machines based on
socketcan npm package(https://www.npmjs.com/package/socketcan,
https://github.com/sebi2k1/node-can)

Current Status:-
- canconfig to configure channel, bitrate
- candump which listens for incoming frames and dumps id,dlc,data for each frame
- cansend to send frame based on specfied id, payload or combination
- Trying to implement similar functionality of socketcan utils like candump,cangen
- Not using many options for cansend such as id range, frame count, duration 
  in between as these are managed from input of additional function nodes

How to Enable Virtual CAN Channel:-

	modprobe vcan

	ip link add dev vcan0 type vcan

	ip link set up vcan0 

	#you can refer https://github.com/linux-can/can-utils/ 
	

TODO/Wish List:-
- Adding Support for extended frames
- Adding more configuration values
- Using random values for frame.dlc, frame.data for cansend
- Using better random engine 
- Integration with Kayak
- Better documentation


