![enter image description here](http://sailsjs.org/images/bkgd_squiddy.png)

# Automated generator models, views and controllers for SailsJS & WaterLine

[![Build Status](https://travis-ci.org/juliandavidmr/sails-inverse-model.svg?branch=master)](https://travis-ci.org/juliandavidmr/sails-inverse-model)

**Sails Inverse Model** helps you build models, controllers and views JS Sails from any database. In addition, you can quickly and individually generate each model, view, controller or all three at the same time.

> Available for **PostgreSQL**, **MySQL** and **MongoDB**

- [Installation](#installation)
- [Individual generation](#individual-generation)
- [Generator](#generator)
- [Import](#import)

--------------------------------------------------------------------------------
# Installation ##

Linux or MacOS

```bash
$ sudo npm install sails-inverse-model -g
```

Microsoft Windows

```bash
$ npm install sails-inverse-model -g
```

# Individual generation ##

You can quickly generate a model, a controller, a view or these three at the same time simply define the attributes of your model. Let's look at an example:

```bash
# Generate model
$ sails-inverse-model -g model --name Pet -a "name:string:r owner:string"

# Generate Controller
$ sails-inverse-model -g controller --name Pet -a "name:string:r owner:string"

# Generate View
$ sails-inverse-model -g view --name Pet -a "name:string:r owner:string"

# Generate all (Model, View and Controller)
$ sails-inverse-model -g all --name Pet -a "name:string:r owner:string"
```

## Detail #

|Param         |                  Description        |
|-------------:|:------------------------------------|
|g             | Generate view, model, controller    |
|name          | Name: model, driver, and view folder|
|a             | Content of the element to generate  |
|name:string:r | Attribute name: data type: required |

Specifies the type of data that will be stored in this attribute. One of:
http://sailsjs.com/documentation/concepts/models-and-orm/attributes

# Generator ##

In the bash o cmd:

```bash
$ sails-inverse-model --help
 Generate models, controllers and views (MVC) for Sails.js from the database any.

                  .-..-.												      
															
  Sails-inverse-model<|    .-..-.	2.0.1
                      |										
      ~    ~   ~     /|. 									
         ~  ~       / || 									
           ~  ~   ,'  |'  									
               .-'.-==|/_--'								
               `--'-------' 								
     _--__--_---__---___--__---__--___      
   __---__--__---___--__---___--_-_---___    
 															
   -----------------------------------------------------------------						
  Example:
    $ mkdir sails-output
    $ cd sails-output
    $ sails-inverse-model -u postgres -p root -d almacen -t pg -m -v -c

  User         : postgres
  Password     : root
  Database     : almacen
  Host         : localhost
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

      Note: Copy models      => your/project_sails/api
            Copy controllers => your/project_sails/api
            Copy views/*     => your/project_sails/views/
   Then: 
   $ cd your/project_sails/
   $ sails lift

   More info: https://github.com/juliandavidmr/sails-inverse-model
   -----------------------------------------------------------------						
  Options:
   -u, --user        User of database
   -p, --pass        Password of database
   -d, --database    Database name
   -h, --host        Host server               Default: localhost
   -m, --models      Folder output models      Default: Folder actual
   -c, --controllers Folder output controllers Default: Folder actual
   -v, --views       Folder output views       Default: Folder actual (Experimental)
   -t, --type        Type gestor database: mysql|postgres|mongodb  Default: mysql
   -s, --schema      (Only PostgreSQL) Schema database postgres: Default: public
   -f, --file        (Only MySQL) .sql file path entry (Experimental)
```

## MySQL

```bash
$ sails-inverse-model -u root -p root -d mydbmysql -m -v -c
```

### MySQL from file .sql

```js
$ node sails-inverse-model -f /your/path/to/script.sql -m -v -c
```

## PostgreSQL

```bash
$ sails-inverse-model -u postgres -p root -d almacen -t pg -m -v -c
```

## MongoDB

```bash
$ sails-inverse-model -d blog_db -t mg -m -v -c
```

# Import ##

_Step 1:_

```bash
$ npm install sails-inverse-model --save
```

_Step 2 with **MySQL**_

```js
var sim = require('sails-inverse-model');

var config = {
  host: "localhost",
  database: "almacen",
  user: "root",
  pass: "root",
  port: 3306
}

var folder_controllers = "/your/project/sails/api/"; //if folder_models == "" then: no generate controllers
var folder_models = "/your/project/sails/api/"; //if folder_models == "" then: no generate models
var folder_views = "/your/project/sails/"; //if folder_models == "" then: no generate views

sim.generatemy(config, folder_models, folder_controllers, folder_views, plurallang);
```

_Step 2 with **PostgreSQL**_

```js
var sim = require('sails-inverse-model');

var config = {
  host: "localhost",
  database: "example",
  user: "postgres",
  pass: "root",
  port: 5432,
  schema: "public"
}

var folder_controllers = "/your/project/sails/api/"; //if folder_models == "" then: no generate controllers
var folder_models = "/your/project/sails/api/"; //if folder_models == "" then: no generate models
var folder_views = "/your/project/sails/"; //if folder_models == "" then: no generate views

sim.generatepg(config, folder_models, folder_controllers, folder_views, plurallang);
```

### Then navigate to the output folder and can find the js generated.

### Fork me :)
--------------------------------------------------------------------------------