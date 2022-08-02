# McClimate Vicki Encoder

|           |                                                                                                       |
| --------- | ----------------------------------------------------------------------------------------------------- |
| Name      | McClimate Vicki Encoder                                                                               |
| Version   | v1.0.0                                                                                                |
| DockerHub | [weevenetwork/mcclimate-vicki-encoder](https://hub.docker.com/r/weevenetwork/mcclimate-vicki-encoder) |
| Authors   | Mesud Pasic                                                                                           |

- [McClimate Vicki Encoder](#mcclimate-vicki-encoder)
  - [Description](#description)
  - [Features](#features)
  - [Environment Variables](#environment-variables)
    - [Module Specific](#module-specific)
    - [Set by the weeve Agent on the edge-node](#set-by-the-weeve-agent-on-the-edge-node)
  - [Dependencies](#dependencies)

## Description

Encoder for Vicki LoRaWAN's commands.

## Features

- Parsing Melita.io data for thermostat
- Sends data to next module service via REST API

## Environment Variables

| Environment Variables | type | Description |
| --- | --- | --- |
| EXECUTE_SINGLE_COMMAND | string | yes/no to specify if module supports only executing single command |
| SINGLE_COMMAND | string | if EXECUTE_SINGLE_COMMAND=no, then users will have to provide in request "command" parameter with command name |

### Module Specific

### Set by the weeve Agent on the edge-node

| Environment Variables | type   | Description                            |
| --------------------- | ------ | -------------------------------------- |
| MODULE_NAME           | string | Name of the module                     |
| INGRESS_HOST          | string | Host where app is running              |
| INGRESS_PORT          | string | Port where app is running              |
| EGRESS_URLS           | string | HTTP ReST endpoint for the next module |

## Available custom commands

- forceClose,
- getAllParams,
- getChildLock,
- getInternalAlgoParams,
- getInternalAlgoTdiffParams,
- getJoinRetryPeriod,
- getKeepAliveTime,
- getOpenWindowParams,
- getOpenWindowParams,
- getOperationalMode,
- getTemperatureRange,
- getUplinkType,
- recalibrateMotor,
- receivedKeepaliveCommand,
- sendCustomHexCommand,
- setChildLock,
- setInternalAlgoParams,
- setInternalAlgoTdiffParams,
- setJoinRetryPeriod,
- setKeepAlive,
- setOpenWindow,
- setOperationalMode,
- setTargetTemperature,
- setTargetTemperatureAndMotorPosition,
- setTemperatureRange,
- setUplinkType

* All setter commands (starting with 'set') require additional parameter values that need to be passed in params argument, so payload can look like this:

```js
{
	"command": {
		"name": "setTargetTemperature",
		"params": {
			"targetTemperature": 20
		}
	}
}
```

- If command is setup in module settings then only params need to be passed

```js
{
	"command": {
		"params": {
			"targetTemperature": 20
		}
	}
}
```

- Output will look like this

```js
{
	"status": true,
	"data": "0eBE"
}
```

- where "data" is encoded value of the command, in the case params are not valid or command is invalid output will look like this

```js
{
	"status": false,
	"message": "Bad command or params provided."
}
```

- For commands that are not setters, "command" value is only passed, params is not necessary (where EXECUTE_SINGLE_COMMAND=no)

```js
{
	"command":"recalibrateMotor"
}
```

## Dependencies

```js
"dependencies": {
    "body-parser": "^1.19.2",
    "express": "^4.17.3",
    "express-winston": "^4.2.0",
    "node-fetch": "^2.6.1",
    "winston": "^3.6.0"
}
```
