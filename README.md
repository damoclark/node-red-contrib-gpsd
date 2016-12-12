# node-red-contrib-gpsd

A contributed Node-RED node, for retrieving data from a GPS Module via the
[GPSd Service Daemon](http://www.catb.org/gpsd/).

## Overview
The goal of this software is to make it easy for makers to incorporate the use
of GPS modules into their IoT projects, via the awesome
[Node-RED Framework](http://nodered.org/).

To do this, it leverages the great work of the
[GPSd Service Daemon](http://www.catb.org/gpsd/).  This software is
[relatively easy to install](http://www.catb.org/gpsd/installation.html) on a
UNIX-like operating system, such as GNU/Linux (including Raspbian for Raspberry
Pi), or BSD (and derivatives including macOS).

It also makes use of the [node-gpsd](https://github.com/eelcocramer/node-gpsd)
npm module by [Eelco Cramer](https://github.com/eelcocramer)

## Installation

Install `node-red-contrib-gpsd` by following the
[adding nodes](http://nodered.org/docs/getting-started/adding-nodes)
instructions from the
[Node-RED Getting Started Documentation](http://nodered.org/docs/getting-started/).
These instructions use [npm](https://www.npmjs.com/).

Or if TL;DR, as the user running Node-RED type:

```bash
cd $HOME/.node-red
npm install node-red-contrib-gpsd
```

## Usage

To use the node, launch or re-launch Node-RED (see
[running Node-RED](http://nodered.org/docs/getting-started/running.html) for
help getting started).

A [gpsd example flow](https://raw.githubusercontent.com/damoclark/node-red-contrib-gpsd/master/examples/node-red-contrib-gpsd-example-flow.json) is available
that highlights all the features of this node, and is illustrated below.  You
can copy and paste this flow into Node-RED and tinker to get a feel for how it
works.

![gpsd example flow screen shot](https://raw.githubusercontent.com/damoclark/node-red-contrib-gpsd/master/examples/node-red-contrib-gpsd-example-flow.png)

Or if you prefer, read the following explanation and screen shots.

The gpsd node&rsquo;s configuration window contains the following options:

### Connection Details

In this accordion, you specify which Internet host and port your GPSd daemon
is listening on.  By default, it will use `localhost` and the default GPSd
port `2947`.  If your GPSd is running on another computer, enter the hostname or
IP address in the `hostname` field.

![gpsd connection details screen shot](https://raw.githubusercontent.com/damoclark/node-red-contrib-gpsd/master/examples/node-red-contrib-gpsd-connection-details.png)

### Events

The gpsd node allows you to specify which GPS events you would like it to
emit via `msg.payload`.  These events are
[well documented](http://www.catb.org/gpsd/gpsd_json.html), along with an
explanation of field names and values, but again for TL;DR

* TPV - A TPV object is a time-position-velocity report. The "class" and "mode"
	fields will reliably be present. The "mode" field will be emitted before
	optional fields that may be absent when there is no fix. Error estimates will
	be emitted after the fix components they're associated with. Others may be
	reported or not depending on the fix quality.
	
* SKY - A SKY object reports a sky view of the GPS satellite positions. If there
	is no GPS device available, or no skyview has been reported yet, only the
	"class" field will reliably be present.
	
* GST - A GST object is a pseudorange noise report.

* ATT - An ATT object is a vehicle-attitude report. It is returned by
	digital-compass and gyroscope sensors; depending on device, it may include:
	heading, pitch, roll, yaw, gyroscope, and magnetic-field readings. Because
	such sensors are often bundled as part of marine-navigation systems, the ATT
	response may also include water depth.

* INFO - Returns an object with details such as Public release level, Internal
	revision-control level, API major revision level, API minor revision level,
	and URL of the remote daemon reporting this version. If empty, this is the
	version of the local daemon.

![gpsd event details screen shot](https://raw.githubusercontent.com/damoclark/node-red-contrib-gpsd/master/examples/node-red-contrib-gpsd-event-details.png)

## TODO

A [TODO List](TODO.md) of possible future features is included.  Contributions
welcome.

## Licence
Copyright (c) 2016 Damien Clark, [Damo's World](https://damos.world)<br/> <br/>
Licenced under the terms of the
[GPLv3](https://www.gnu.org/licenses/gpl.txt)<br/>
![GPLv3](https://www.gnu.org/graphics/gplv3-127x51.png "GPLv3")

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND
ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED
WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
DISCLAIMED. IN NO EVENT SHALL DAMIEN CLARK BE LIABLE FOR ANY DIRECT,
INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING,
BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE
OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF
ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

## Acknowledgements

Like others who stand on the shoulders of giants, I'd like to acknowledge
the contributions of the following people/groups without which, more directly,
this modest Node-RED node would not be possible.

* [Contributors to GPSd](http://www.catb.org/gpsd/history.html)
* [Eelco Cramer](https://github.com/eelcocramer) of
[node-gpsd](https://github.com/eelcocramer/node-gpsd), and,
* [Pascal Deschenes](http://github.com/pdeschen) of the
[Bancroft Project](http://github.com/pdeschen/bancroft).

