# sm-js
Simple State Machine (Javascript) Version 1.0.00

Copyright (C) 2017 Woody.Lee All rights reserved.

Redistribution and use in source and binary forms, with or without modification, are permitted provided that the following conditions are met:

Redistributions of source code must retain the above copyright notice, this list of conditions and the following disclaimer.
Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following disclaimer in the documentation and/or other materials provided with the distribution.
The name of the Woody Lee may not be used to endorse or promote products derived from this software without specific prior written permission.

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

---

# Introduction
This state machine is a compact table-driven state machine on Javascript. In general, a state machine contains a set of states, a set of possible input events and the actions should be performed when an event is recevied on a specified state. A state is changed to another state by performing specified actions when a specified event is received. State diagram or state table is used to describe state transitions, and the later is more formally, and easier to be implemented correspondingly. Although simply state machine can be implemented by nested switch/case or if/else, considering the requirement of re-usability or maintainable, table-driven state machine pattern is recommended to use for more complex cases.

This state machine is designed as compact as possible, so that developer has no need to define a seperated state table, event table. Developer only needs to define a state-transit table, each entry has quadruple (from_state, event, to_state, function). The function is optional. The quadruple defined which event is recevied under which state will be transitted to which state, which function will be called during this process. 

In webpage logic, so many async events are handled that deep nested callback functions have to be defined, which confusing developers and slow down developers work. Introducing this state machine would make your work much easier to be understood and manipulated. When we want to some module to handle an event, we throw it to MessageBus. When we want to handle some events, we implemented a state machine and add this state machine to MessageBus. Why we need to handle event by a state machine? Of course, we may handle event without state machine, instead, we may use a switch to do everything. But if you do not want to create the code hard to be maintained, you'd better not to do that. Because we have to admire a basic principle, that is any event is handled UNDER a special condition -- This condition may be treated as a STATE.


# Where we should use it
Where we should use state machine:

* simple parser, lexers, ... or any filter-pattern stuffs
* UI logic, which represents enable, disable, checked, unchecked and so on.
* device control, typical sample is like the control of recorder, player, or something like that

When you find you have to do with a group of complex rule and conditions, you should consider to use state machine pattern. 


# An example
A simple example is like:

* A device has 2 states, plugged, unplugged
* This device driver received 'tick_event' for each 1 second
* An event 'do_plug' to change state from 'unplugged' to 'plugged'
* An event 'unplug' to change state from 'plugged' to 'unplugged'
* On plugged state, when it received 'tick_event', it read data from device
* On unplugged state, when it received 'tick_event', it do nothing

We describe this rule by state diagram:
![Image](./state_diagram.png) 

Also, we may discribe this state transitions by a table:

|  	| unplugged 	| plugged 	|
|------------	|--------------------------	|----------------------------	|
| do_plug 	| transit to plugged state 	| no op 	|
| unplug 	| no op 	| transit to unplugged state 	|
| tick_event 	| no op 	| read data 	|

Columns represents a set of possible states: plugged, unplugged

Rows represents a set of possible events: tick_event, do_plug, unplug

The each cell represents the action that should be performed when received the event under the state.

```
sys_q = require('sm-js')
dev_sm = sys_q.create_sm('devsm')
dev_sm.addTransit('unplugged', 'do_plug', 'plugged', ()=>{
    console.log('plugged')
})
dev_sm.addTransit('plugged', 'unplug', 'unplugged')
dev_sm.addTransit('plugged', 'tick_event', 'plugged', ()=>{
    read_data()
})
dev_sm.startState('unplugged')
```

When 'do_plug' event is emitted, you write the code like:
```
sys_q.post_event('do_plug')
```

If multiple state machine handles same event 'do_plug', each state machine will have change to handle this event. If multiple state machines are created by a MessageBus (as the instance in example, it named 'sys_q'),
they always are broadcasted by each 'sys_q.post_event('any_event').



# Bug reports

Hope this small piece of code does your help, if it can make your code more simple, more maintainability, I shall feel happy. If you find any problems, or you have any improvement advice, please contact with me by the following e-mail address:

-- By woody(li.woodyli@gmail.com)




