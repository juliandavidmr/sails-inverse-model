
![enter image description here](http://sailsjs.org/images/bkgd_squiddy.png)
# Inverse modeling for SailsJS & Waterline ##

[![Build Status](https://travis-ci.org/juliandavidmr/sails-inverse-model.svg?branch=master)](https://travis-ci.org/juliandavidmr/sails-inverse-model)

#### Sails-inverse-model is an installable module that helps you generate models and controllers SailsJS from a database any. ####

This npm also provides all the functions necessary to convert between different data types.

* [Installation](#installation)
* [Usage](#usage)
* [Steps tutorial](#)

------

## Installation ##

```bash
$> npm install sails-inverse-model -g
```

## __Usage__ ##

## Options ##

In the bash o cmd:

```bash
$ sails-inverse-model --help
  Generate models for Sails.js from the database any.

  Examples
    $ sails-inverse-model --help

  Generate models for Sails.js from the database any.

  Examples
    $ sails-inverse-model --help
    ...

    $ sails-inverse-model -u root -p root -d independiente -m -c
    User:	 root
    Password: root
    Database: dbname
    Host:	 localhost
    Output folder:	 /home/julian/Documentos/Node_Projects/sails-inverse-model/test/api
    53 tables
    ===============================================================================================

    complete
    ...

  Options
    -u, --user  User of mysql
    -p, --pass  Password of mysql
    -d, --database	Database of mysql
    -h, --host	Host server mysql		Default: localhost
    -m, --models	Folder output models	Default: Folder actual
    -c, --controllers	Folder output	controllers Default: Folder actual
    -l, --lang  Pluralize models and controllers: es|en|fr  Default: no pluralize
```

# Example ##
==========

Go to folder of project SailsJS and:
```bash

$ sails-inverse-model -u root -p root -d yourdb -m -c

User:	 root
Password: root
Database: yourdb
Host:	 localhost
Pluralize:	 undefined
Models:	 /home/julian/Escritorio/test/models
Controllers:	 /home/julian/Escritorio/test/controllers
8 tables
========

Complete models.

 xxxController.js created successfull
 xxyController.js created successfull
 xxzController.js created successfull
 xxuController.js created successfull
 xxgController.js created successfull
 xxhController.js created successfull  
 xxjController.js created successfull
 xxkController.js created successfull
```
### Then navigate to the output folder and can find the js generated.


----------


> __It will soon be available a version for PostgreSQL.__
