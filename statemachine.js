StateMachine = function(name)
{
    this.name = name;
    this.transits = {};
    return this;
};

StateMachine.prototype.addTransit = function(s1, e1, s2, func)
{
    var transit  = new Object();
    transit.event = e1;
    transit.target = s2;
    if ((typeof(func) == 'undefined') || (func == null))
    {
        transit.func = null;
    }
    else
        transit.func = func;
    if (typeof(this.transits[s1]) == 'undefined')
    {
        this.transits[s1] = new Array();
        this.transits[s1].push(transit);
    }
    else
    {
        this.transits[s1].push(transit);
    }
};

StateMachine.prototype.startState = function(s)
{
    this.currentState = s;
}

StateMachine.prototype.handleEvent = function(e, p1, p2)
{
    if (typeof(this.transits[this.currentState]) == 'undefined')
        return false;
    var transits = this.transits[this.currentState];
    for (var i = 0; i < transits.length; ++i)
    {
        if (transits[i].event == e)
        {
            if (transits[i].func == null)
            {     
                console.log(this.name + ":" + this.currentState + '---' + e + '--->' + transits[i].target);
                this.currentState = transits[i].target;
            }
            else
            {
                if (transits[i].func(e, p1, p2) == 0)
                {
                    console.log(this.name + ":" + this.currentState + '---' + e + '--->' + this.currentState);
                }
                else
                {
                    console.log(this.name + ":" + this.currentState + '---' + e + '--->' + transits[i].target);
                    this.currentState = transits[i].target;
                }
            }
            return true;
        }
    }
    
    console.log('event:' + e + ' is omitted for ' + this.name + 'at state ' + this.currentState)
    return false;
}

StateMachine.prototype.getState = function()
{
    return this.currentState;
}


class MessageBus {
    constructor() {
        this.sm_list = [];
        this.queue = [];
    }

    add_sm(sm) {
        this.sm_list.push(sm);
    }

    remove_sm(sm) {
        for (var i = 0; i < this.sm_list.length; ++i) {
            if (this.sm_list[i].name == sm) {
                this.sm_list.splice(i, 1);
            }
        }
    }

    _handle_event() {
        if(this.queue.length > 0) {
            var event = this.queue.shift();
            for (var i = 0; i < this.sm_list.length; ++i) {
                    this.sm_list[i].handleEvent(event.e, event.p1, event.p2);
            }
            setTimeout(this._handle_event.bind(this), 0);
        }
    }

    post_event(e, p1, p2) {
        var event = new Object();
        event.e = e;
        event.p1 = p1;
        event.p2 = p2;
        this.queue.push(event);
        setTimeout(this._handle_event.bind(this), 0);
    }
    
    create_sm(name) {
        var sm = new StateMachine(name);
        this.add_sm(sm);
        return sm;
    }
    
    get_sm(name) {
        for (var i = 0; i < this.sm_list.length; ++i) {
            if (this.sm_list[i].name == name) {
                return this.sm_list[i]
            }
        }
        return null
    }
}

module.exports = new MessageBus()



