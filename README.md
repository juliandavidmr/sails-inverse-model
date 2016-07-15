
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
  Generate models, controllers and views for Sails.js from the database any.

                  .-..-.																

    Sails-inverse-model  <|    .-..-.	v. 1.1.3                 
                          |																   
                         /|. 																   
                        / || 																   
                      ,'  |'  															   
                   .-'.-==|/_--'															   
                   `--'-------' 															   
      __---___--___---___--___---___--___--___--___					   
    ____---___--___---___--___---___--___-__--___--___					 

   -----------------------------------------------------------------						
   :: Fri Jul 15 2016 15:42:28 GMT-0500 (COT)														
   -----------------------------------------------------------------						
  Example:
  	 $ mkdir sails-output
  	 $ cd sails-output
    $ sails-inverse-model -u postgres -p root -d almacen -t pg -m -v -c

  User         : postgres
  Password     : root
  Database     : almacen
  Host         : localhost
  Pluralize    : No pluralize
  Models       : /home/julian/Documents/sails-output/models
  Views        : /home/julian/Documents/sails-output/views
  Controllers  : /home/julian/Documents/sails-output/controllers
  DB           : pg
  Schema (pg)  : public
  =====================================
  Complete views.
  =====================================
  Complete Models.
  =====================================
  Complete Controllers.

      Note: Copy models => your/project_sails/api
            Copy controllers => your/project_sails/api
            Copy views => your/project_sails/
   Then:
   $ cd your/project_sails/
   $ sails lift
   -----------------------------------------------------------------						
  Options
    -u, --user  User of database
    -p, --pass  Password of database
    -d, --database	Database name
    -h, --host	Host server 	Default: localhost
    -m, --models	Folder output models	Default: Folder actual
    -c, --controllers	Folder output	controllers Default: Folder actual
    -v, --views	Folder output	views Default: Folder actual
    -l, --lang  Pluralize models and controllers: es|en|fr  Default: no pluralize
    -t, --type  Type gestor database: mysql|postgres  Default: mysql
    -s, --schema  Schema of database postgres: Default: public (Only PostgreSQL)
```

# MySQL (Only models and controllers) ##

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

# PostgreSQL (Models, Views and Controllers) ##

Go to folder of project SailsJS and:
```bash
$ sails-inverse-model -u postgres -p root -d almacen -t pg -m -v -c
User         : postgres
Password     : root
Database     : almacen
Host         : localhost
Pluralize    : No pluralize
Models       : /home/julian/Documentos/Node_Projects/sails-inverse-model/models
Views        : /home/julian/Documentos/Node_Projects/sails-inverse-model/views
Controllers  : /home/julian/Documentos/Node_Projects/sails-inverse-model/controllers
DB           : pg
Schema (pg)  : public
=====================================
Complete views.
=====================================
Complete Models.
=====================================
Complete Controllers.
```

### Then navigate to the output folder and can find the js generated.
### I need help, fork me :).
----------
