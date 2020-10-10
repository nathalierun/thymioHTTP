// ThymioHTTP via Javascript for Thymio Suite 2.X
// APACHE 2.0 License - VERHILLE Arnaud

import { createClient, Node, NodeStatus, Request, setup } from '@mobsya-association/thymio-api'

//Connect to the Thymio Suite
//We will need some way to get that url
let client = createClient("ws://localhost:8597");

// The Full List of all Thymio(s) nodes
let myNodes = [];
let selectedNode = undefined;

let thymioPrograms = [];

var socket = io.connect('ws://localhost:3000');


// PING Events
socket.on('ping', thymioPing);
async function thymioPing(data) {
    //console.log('Ping');
    await selectedNode.emitEvents({ "ping": null });
}

// B_behavior Events
socket.on('B_behavior', thymioB_behavior);
async function thymioB_behavior(data) {
    console.log('B_behavior');
    await selectedNode.emitEvents({ "B_behavior": data });
}

// ODOMETER Events
socket.on('Q_set_odometer', thymioQ_set_odometer);
async function thymioQ_set_odometer(data) {
    //console.log('Q_set_odometer');
    await selectedNode.emitEvents({ "Q_set_odometer": data });
}

//LEDs Events from Socket.io to Thymio
socket.on('V_leds_prox_h', thymioV_leds_prox_h);
async function thymioV_leds_prox_h(data) {
    await selectedNode.emitEvents({ "V_leds_prox_h": data});
}
socket.on('V_leds_circle', thymioV_leds_circle);
async function thymioV_leds_circle(data) {
    await selectedNode.emitEvents({ "V_leds_circle": data});
}
socket.on('V_leds_top', thymioV_leds_top);
async function thymioV_leds_top(data) {
    await selectedNode.emitEvents({ "V_leds_top": data});
}
socket.on('V_leds_bottom_left', thymioV_leds_bottom_left);
async function thymioV_leds_bottom_left(data) {
    await selectedNode.emitEvents({ "V_leds_bottom_left": data});
}
socket.on('V_leds_bottom_right', thymioV_leds_bottom_right);
async function thymioV_leds_bottom_right(data) {
    await selectedNode.emitEvents({ "V_leds_bottom_right": data});
}
socket.on('V_leds_prox_v', thymioV_leds_prox_v);
async function thymioV_leds_prox_v(data) {
    await selectedNode.emitEvents({ "V_leds_prox_v": data});
}
socket.on('V_leds_buttons', thymioV_leds_buttons);
async function thymioV_leds_buttons(data) {
    await selectedNode.emitEvents({ "V_leds_buttons": data});
}
socket.on('V_leds_rc', thymioV_leds_rc);
async function thymioV_leds_rc(data) {
    await selectedNode.emitEvents({ "V_leds_rc": data});
}
socket.on('V_leds_temperature', thymioV_leds_temperature);
async function thymioV_leds_temperature(data) {
    await selectedNode.emitEvents({ "V_leds_temperature": data});
}
socket.on('V_leds_sound', thymioV_leds_sound);
async function thymioV_leds_sound(data) {
    await selectedNode.emitEvents({ "V_leds_sound": data});
}

// Sound Events from Socket.io to Thymio
socket.on('A_sound_system', thymioA_sound_system);
async function thymioA_sound_system(data) {
    await selectedNode.emitEvents({ "A_sound_system": data});
}
socket.on('A_sound_freq', thymioA_sound_freq);
async function thymioA_sound_freq(data) {
    await selectedNode.emitEvents({ "A_sound_freq": data});
}
socket.on('A_sound_play', thymioA_sound_play);
async function thymioA_sound_play(data) {
    await selectedNode.emitEvents({ "A_sound_play": data});
}
socket.on('A_sound_record', thymioA_sound_record);
async function thymioA_sound_record(data) {
    await selectedNode.emitEvents({ "A_sound_record": data});
}
socket.on('A_sound_replay', thymioA_sound_replay);
async function thymioA_sound_replay(data) {
    await selectedNode.emitEvents({ "A_sound_replay": data});
}

// Motors Events from Socket.io to Thymio
socket.on('M_motor_both', thymioM_motor_both);
async function thymioM_motor_both(data) {
    await selectedNode.emitEvents({ "M_motor_both": data});
}
socket.on('M_motor_left', thymioM_motor_left);
async function thymioM_motor_left(data) {
    await selectedNode.emitEvents({ "M_motor_left": data});
}
socket.on('M_motor_right', thymioM_motor_right);
async function thymioM_motor_right(data) {
    await selectedNode.emitEvents({ "M_motor_right": data});
}

socket.on('M_motor_timed', thymioM_motor_timed);
async function thymioM_motor_timed(data) {
    await selectedNode.emitEvents({ "M_motor_timed": data});
}

socket.on('Q_reset', thymioQ_reset);
async function thymioQ_reset(data) {
    await selectedNode.emitEvents({ "Q_reset": null});
}

// ********** CONTROL THYMIO FROM JAVASCRIPT HERE  ***************
// ***************************************************************

socket.on('thymio', thymioUpdate);
function thymioUpdate(data) {
    //socket.emit('thymio', data);
}

async function thymioSetup() {
    try {
        thymioSetupPrograms();
        if (myNodes.length != 0) {
        selectedNode = myNodes[0]
        await selectedNode.sendAsebaProgram(thymioPrograms[0]);
        await selectedNode.runProgram();
        }
        
    } catch (e) {
        //console.log(e);
    }
}

async function thymioDraw(data) {
    try {
        //socket.emit('thymio', data);
    } catch (e) {
        console.log(e);
    }
}


// ******************  ASEBA PROGRAMS  *****************************
// ***************************************************************
async function thymioSetupPrograms() {

    // Basic Test
    thymioPrograms.push(`
    ##! Basic Thymio Motion AESL 
    ##! David J Sherman - david.sherman@inria.fr
    ##! Arnaud Verhille - gist974arobasegmailpointcom
    ##!
    ##! This AESL program defines high-level behaviors for the Thymio-II robot that enable
    ##! it to cooperate with programs like
    ##! Snap! with Nodejs and thymioHTTP REST API

    var R_state[29]          ##! [out] Robot FULL State

    var chronometer = 0      ##! BUSY Motors counter
    var busy = 0             ##! LOGO Motor Stuff
    var behavior = 0         ##! High Level Stuff

    var odo.delta ##! [out] @private instantaneous speed difference
    var odo.theta = 0 ##! [out] odometer current angle
    var odo.x = 0 ##! [out] odometer x
    var odo.y = 0 ##! [out] odometer y
    var odo.degree ##! [out] odometer direction

    # reusable temp vars for event handlers
    var tmp[9]
    var rgb[3]
    var i = 0

    # default value
    mic.threshold = 12

    ##! THYMIO UPDATE REPORTERS ##### 10Hz, 20 Hz, 100Hz ################
    ##! #################################################################   

    ##! 10 Hz THYMIO BROADCAST STATE
    onevent prox
        R_state[13] = prox.comm.rx
        R_state[14] = prox.comm.tx
        R_state[15] = prox.ground.delta[0]
        R_state[16] = prox.ground.delta[1]
        R_state[17] = prox.horizontal[0]
        R_state[18] = prox.horizontal[1]
        R_state[19] = prox.horizontal[2]
        R_state[20] = prox.horizontal[3]
        R_state[21] = prox.horizontal[4]
        R_state[22] = prox.horizontal[5]
        R_state[23] = prox.horizontal[6]
        R_state[24] = temperature     

        if (behavior == 1) then
            callsub behavior1
        end
        if (behavior == 2) then
            callsub behavior2
        end

    ##! 20 Hz THYMIO
    onevent buttons
        R_state[4] = button.backward
        R_state[5] = button.center
        R_state[6] = button.forward
        R_state[7] = button.left
        R_state[8] = button.right
        R_state[0] = acc[0]
        R_state[1] = acc[1]
        R_state[2] = acc[2]
        R_state[3] = mic.intensity 
        R_state[9] = motor.left.target
        R_state[10] = motor.right.target
        R_state[11] = motor.left.speed
        R_state[12] = motor.right.speed
        R_state[25] = odo.degree
        R_state[26] = odo.x
        R_state[27] = odo.y
        R_state[28] = busy
        
        emit R_state_update(R_state)
            

    ##! 100 Hz THYMIO
    onevent motor # loop runs at 100 Hz
        odo.delta = (motor.right.target + motor.left.target) / 2
        call math.muldiv(tmp[0], (motor.right.target - motor.left.target), 3406, 10000)
        odo.theta += tmp[0]
        call math.cos(tmp[0:1],[odo.theta,16384-odo.theta])
        call math.muldiv(tmp[0:1], [odo.delta,odo.delta],tmp[0:1], [32767,32767])
        odo.x += tmp[0]/45
        odo.y += tmp[1]/45
        odo.degree = 90 - (odo.theta / 182)

        if (busy == 1) then
            chronometer = chronometer - 1
            if (chronometer == 0) then
                motor.left.target = 0
                motor.right.target = 0
                busy = 0
            end
        end
                

    ##! THYMIO INTERNAL EVENTS ##########################################
    ##! #################################################################

    ##! PING THYMIO EVENTS
    onevent ping
        call math.rand(rgb)
        for i in 0:2 do
            rgb[i] = abs rgb[i]
            rgb[i] = rgb[i] % 20
        end
        call leds.top(rgb[0], rgb[1], rgb[2])
        i++
    ##!     emit pong i  

    ##! ODOMETER THYMIO EVENTS
    onevent Q_set_odometer
        odo.theta = (((event.args[0] + 360) % 360) - 90) * 182
        odo.x = event.args[1] * 28
        odo.y = event.args[2] * 28


    ##! LED THYMIO EVENTS
    onevent V_leds_prox_h
        call leds.prox.h(event.args[0],event.args[1],event.args[2],
                         event.args[3],event.args[4],event.args[5],
                         event.args[6],event.args[7])
    onevent V_leds_circle
        call leds.circle(event.args[0],event.args[1],event.args[2],
                         event.args[3],event.args[4],event.args[5],
                         event.args[6],event.args[7])
    onevent V_leds_top
        call leds.top(event.args[0],event.args[1],event.args[2])
    onevent V_leds_bottom_left
        call leds.bottom.left(event.args[0],event.args[1],event.args[2])
    onevent V_leds_bottom_right
        call leds.bottom.right(event.args[0],event.args[1],event.args[2])
    onevent V_leds_prox_v
        call leds.prox.v(event.args[0],event.args[1])
    onevent V_leds_buttons
        call leds.buttons(event.args[0],event.args[1],
                          event.args[2],event.args[3])    
    onevent V_leds_rc
        call leds.rc(event.args[0])   
    onevent V_leds_temperature
        call leds.temperature(event.args[0],event.args[1])
    onevent V_leds_sound
        call leds.sound(event.args[0])
    
    ##! SOUND THYMIO EVENTS
    onevent A_sound_freq
        call sound.freq(event.args[0],event.args[1])
    onevent A_sound_play
        call sound.play(event.args[0])
    onevent A_sound_system
        call sound.system(event.args[0])
    onevent A_sound_replay
        call sound.replay(event.args[0])
    onevent A_sound_record
        call sound.record(event.args[0])
    
    ##! MOTOR THYMIO EVENTS
    onevent M_motor_both 
        motor.left.target = event.args[0]
        motor.right.target = event.args[1] 
    onevent M_motor_left
        motor.left.target = event.args[0]
    onevent M_motor_right
        motor.right.target = event.args[0] 

    ##! SYNC LOGO MOTOR BUSY THYMIO ACTION STARTING EVENT
    onevent M_motor_timed
        behavior = 0
        busy = 1
        motor.left.target = event.args[0]
        motor.right.target = event.args[1]
        chronometer = event.args[2]

    ##! Reset the queue and stop motors
    onevent Q_reset
        chronometer = 0
        busy = 0
        behavior = 0  
        motor.left.target = 0
        motor.right.target = 0

    ##! THYMIO BEHAVIOR EVENTS

    onevent B_behavior
        behavior = event.args[0]

    ##! THYMIO BEHAVIORS SUBPROGRAMS
    ##! ############################################

    ##! Follow a black path very fast
    sub behavior1 
        if (prox.ground.delta[1] > 400) then
            motor.left.target = 100
            motor.right.target = 500
        elseif (prox.ground.delta[0] > 400) then
            motor.left.target = 500
            motor.right.target = 100
        else
            motor.left.target = 350
            motor.right.target = 350
        end

    ##! Follow a wall
    sub behavior2  
        when prox.horizontal[0] > 150 do
            motor.left.target = 200
            motor.right.target = -200	
        end
        when prox.horizontal[0] < 150 do
            motor.left.target = 250
            motor.right.target = 250
        end
        when prox.horizontal[4] > 150 do
            motor.left.target = -200
            motor.right.target = 200	
        end
        when prox.horizontal[4] < 150 do
            motor.left.target = 250
            motor.right.target = 250
        end

    `);

  
    thymioPrograms.push(`

    `);
}

// ******************  LIBRARY SUBPROGRAMS  **********************
// ***************************************************************

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

client.onClose = async (event) => {
    console.log(event);
}

// Start monitoring for node event
// A node will have the state
//      * connected    : Connected but vm description unavailable - little can be done in this state
//      * available    : The node is available, we can start communicating with it
//      * ready        : We have an excusive lock on the node and can start sending code to it.
//      * busy         : The node is locked by someone else.
//      * disconnected : The node is gone
client.onNodesChanged = async (nodes) => {
    try {
        //console.log("Detection de ",nodes.length," Thymio(s) sur le HUB Thymio Suite 2")
        //Iterate over the nodes
        for (let node of nodes) {
            //console.log(`${node.id} : ${node.statusAsString}`)

            // Select the first non busy node
            if ( node.status == NodeStatus.available) {
                try {
                    //console.log(`Locking ${node.id}`)
                    // Lock (take ownership) of the node. We cannot mutate a node (send code to it), until we have a lock on it
                    // Once locked, a node will appear busy / unavailable to other clients until we close the connection or call `unlock` explicitely
                    // We can lock as many nodes as we want
                    await node.lock();
                    myNodes.push(node);
                } catch (e) {
                    console.log(`Unable To Log ${node.id} (${node.name})`)
                }
            }

            console.log(`${node.id} : ${node.statusAsString}`)
            
            if (node.status == NodeStatus.available)
                continue
            try {

                //This is requiered in order to receive the variables and node of a group
                node.watchSharedVariablesAndEvents(true)

                //Monitor the shared variables - note that because this callback is set on a group
                //It does not track group changes
                node.group.onVariablesChanged = (vars) => {
                    //console.log("shared variables : ", vars)
                }

                //Monitor the event descriptions - note that because this callback is set on a group, it does not track group changes
                node.group.onEventsDescriptionsChanged = (events) => {
                   // console.log("descriptions", events)
                }

                //Monitor variable changes
                node.onVariablesChanged = (vars) => {
                    thymioDraw(vars);
                }

                //Monitor events
                node.onEvents = async (events) => {
                    //console.log("events", events)
                    // Mainly R_state_update Broadcast to socket.io
                    socket.emit('thymio', events);
                    let { pong: pong } = events;
                    if (pong) {
                    }
                }


                // Thymio Events List 
                // Need to be updated if you want to create new events in aseba code
                await node.group.setEventsDescriptions([
                    { name: "ping", fixed_size: 0 },
                    { name: "pong", fixed_size: 1 },

                    { name: "V_leds_prox_h", fixed_size: 8 },
                    { name: "V_leds_circle", fixed_size: 8 },
                    { name: "V_leds_top", fixed_size: 3 },
                    { name: "V_leds_bottom_left", fixed_size: 3 },
                    { name: "V_leds_bottom_right", fixed_size: 3 },
                    { name: "V_leds_prox_v", fixed_size: 2 },
                    { name: "V_leds_buttons", fixed_size: 4 },
                    { name: "V_leds_rc", fixed_size: 1 },
                    { name: "V_leds_temperature", fixed_size: 2 },
                    { name: "V_leds_sound", fixed_size: 1 },

                    { name: "A_sound_freq", fixed_size: 2 },
                    { name: "A_sound_play", fixed_size: 1 },
                    { name: "A_sound_system", fixed_size: 1 },
                    { name: "A_sound_replay", fixed_size: 1 },
                    { name: "A_sound_record", fixed_size: 1 },

                    { name: "M_motor_both", fixed_size: 2 },
                    { name: "M_motor_left", fixed_size: 1 },
                    { name: "M_motor_right", fixed_size: 1 },

                    { name: "Q_add_motion", fixed_size: 4 },
                    { name: "Q_cancel_motion", fixed_size: 1 },
                    { name: "Q_motion_added", fixed_size: 5 },
                    { name: "Q_motion_cancelled", fixed_size: 5 },
                    { name: "Q_motion_started", fixed_size: 5 },
                    { name: "Q_motion_ended", fixed_size: 5 },
                    { name: "Q_motion_noneleft", fixed_size: 1 },
                
                    { name: "B_behavior", fixed_size: 1 },

                    { name: "M_motor_timed", fixed_size: 3 },

                    { name: "R_state_update", fixed_size: 29 },
                    { name: "Q_set_odometer", fixed_size: 3 },
                    { name: "Q_reset", fixed_size: 0 }
                    
                ]);
                
            }
            catch (e) {
       
                //console.log(e)
                
                //process.exit()
            }
        }

        


    } catch (e) {
        
   
        //console.log(e)
        
        //process.exit()
    }
    thymioSetup();
}

