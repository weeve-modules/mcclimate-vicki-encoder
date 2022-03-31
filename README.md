# McClimate Vicki Encoder

|                |                                 |
| -------------- | ------------------------------- |
| Name           | McClimate Vicki Encoder               |
| Version        | v1.0.0                          |
| Dockerhub Link | [weevenetwork/mcclimate-vicki-encoder]() |
| Authors        | Mesud Pasic                     |



- [MQTT Ingress](#mcclimate-decoder)
  - [Description](#description)
  - [Features](#features)
  - [Environment Variables](#environment-variables)
    - [Module Specific](#module-specific)
    - [Set by the weeve Agent on the edge-node](#set-by-the-weeve-agent-on-the-edge-node)
  - [Dependencies](#dependencies)




## Description

Encoder for Vicki LoRaWAN's commands.

## Features

* Parsing Melita.io data for thermostat
* Sends data to next module service via REST API

## Environment Variables

* HOST_NAME
* HOST_PORT

### Module Specific

### Set by the weeve Agent on the edge-node

| Environment Variables | type   | Description                            |
| --------------------- | ------ | -------------------------------------- |
| MODULE_NAME           | string | Name of the module                     |
| HOST_NAME           | string | Host where app is running              |
| HOST_PORT           | string | Port where app is running              |



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