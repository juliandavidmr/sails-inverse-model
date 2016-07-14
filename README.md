
![enter image description here](http://sailsjs.org/images/bkgd_squiddy.png)
# Inverse modeling for SailsJS & Waterline ##

[![Build Status](https://travis-ci.org/juliandavidmr/sails-inverse-model.svg?branch=master)](https://travis-ci.org/juliandavidmr/sails-inverse-model)

#### Sails-inverse-model is an installable module that helps you generate models and controllers SailsJS from a database any. ####
> Available for PostgreSQL and MySQL :)

This npm also provides all the functions necessary to convert between different data types.

* [Installation](#installation)
* [Usage](#usage)
* [Example MySQL](#MySQL)
* [Example PostgreSQL](#PostgreSQL)
------

## Installation ##

Linux or MacOS
```bash
$ sudo npm install sails-inverse-model -g
```

Microsoft Windows
```bash
$ npm install sails-inverse-model -g
```

## __Usage__ ##

In the bash o cmd:

```bash
$ sails-inverse-model --help

Generate models and controllers for Sails.js from the database any.

Examples
  $ sails-inverse-model --help
  ...

  $ sails-inverse-model -u root -p root -d independiente -m -c -l es
User:	 root
Password: root
Database: independiente
Host:	 localhost
Pluralize:	 No pluralize
Models:	 /home/julian/Documentos/sailsproject/api/models
Controllers:	 /home/julian/Documentos/sailsproject/api/controllers
9 tables
=========
Complete models.
=========
Complete Controllers.

Options
  -u, --user  User of database
  -p, --pass  Password of database
  -d, --database	Database name
  -h, --host	Host server 	Default: localhost
  -m, --models	Folder output models	Default: Folder actual
  -c, --controllers	Folder output	controllers Default: Folder actual
  -l, --lang  Pluralize models and controllers: es|en|fr  Default: no pluralize
  -t, --type  Type gestor database: mysql|postgres  Default: mysql
  -s, --schema  Schema of database postgres: Default: public (Only PostgreSQL)
  -i, --intelligen  Detects your attributes of type passwords and mail: y|n Default: n
```

# MySQL ##
==========

Go to folder of project SailsJS and:
```bash
$ sails-inverse-model -u root -p root -d independiente -m -c -l en
User:	 root
Password: root
Database: independiente
Host:	 localhost
Pluralize: en
Models:	 /home/julian/Documentos/Node_Projects/sails-inverse-model/models
Controllers: /home/julian/Documentos/Node_Projects/sails-inverse-model/controllers
DB:	 mysql
Schema (pg): public
9 tables
=========

Complete models.

=========

Complete Controllers.
```

# PostgreSQL ##
==========

Go to folder of project SailsJS and:
```bash
$ sails-inverse-model -u postgres -p root -d almacen -t pg -m -c -l es
User:	 postgres
Password: root
Database: almacen
Host:	 localhost
Pluralize: es
Models:	 /home/julian/Documentos/Node_Projects/sails-inverse-model/models
Controllers: /home/julian/Documentos/Node_Projects/sails-inverse-model/controllers
DB:	 pg
Schema (pg): public
=====================================

Complete Models.

=====================================

Complete Controllers.
```
### Then navigate to the output folder and can find the js generated.


----------
