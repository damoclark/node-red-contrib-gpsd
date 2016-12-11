# TODO

Following is a list of potential improvements that could be made to
node-red-contrib-gpsd.  Contributions are most welcome, including your own
enhancements.

## Tidy-up Event Checkboxes in gpsd Config UI

The checkboxes do not line up properly with their labels. A little patience
with css is all that is necessary.

## Add gpsd-request Node

This node would take an input, such as a trigger, and would only then request data
from the gpsd daemon and return on its output.

The node would listen to events from gpsd, and just keep the most recent data
for each event type.  On input trigger of gpsd-request, it will simply return
the most recently received event of the requested type/s, or null if no events
have been received for the requested type.

## Add a second output to gpsd that produces only the time

This would be an useful enhancement where the gps module is simplying providing
accurate time, rather than full location.  This time output could be used as
a trigger for other nodes.

## Allow to specify separate outputs for different event types from gpsd

In this case, rather than all GPSd events selected to be sent out a single
node output, instead be able to assign event types to particular outputs.

As it currently stands, a switch node is necessary if you want different
GPSd events to go to different nodes.