
Inverse modeling for SailsJS
-------------

#### Sails-inverse-model is an installable module that helps you generate models SailsJS from a database any.. ####

This library also provides all the functions necessary to convert between different data types and store in files.

* [Installation](#installation)
* [Options](#Options)
* [Usage](#usage)
* [Example](#Example)
------

## Installation ##

```bash
$> npm install sails-inverse-model -g
```

## __Usage__ ##

## Options ##

In the bash o cmd:

```bash

  Generate models for sails from the database

  Examples
    $ sails-inverse-model --help
    ...

    $ sails-inverse-model -u root -p root -d thedbname -f /home/julian/Documentos/sails/sails-inverse-model/test/api
    User:	 root
    Password: root
    Database: thedb
    Host:	 localhost
    Output folder:	 /home/julian/Documentos/Node_Projects/sails-inverse-model/test/api
    tablas
    ===============================================================================================

    complete
    ...

  Options
    -u, --user  User of mysql
    -p, --pass  Password of mysql
    -d, --database	Database of mysql
    -h, --host	Host server mysql		Default: localhost
    -f, --folder	Folder output	Default: Folder actual

```

# Example ##
==========
```bash

$ sails-inverse-model -u root -p root -d thedbname -f /home/julian/Documentos/Node_Projects/sails-inverse-model/test/api


User:	 root
Password: root
Database: independient
Host:	 localhost
Output folder:	 /home/julian/Documentos/Node_Projects/sails-inverse-model/test/api
 tablas
========

complete
```

### Then navigate to the output folder and can find the js generated.

> __It will soon be available a version for PostgreSQL.__
