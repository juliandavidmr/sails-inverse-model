import { ICrud } from 'src/interfaces/ICrud';
import { IModel } from 'src/interfaces/IModel';

var Handlebars = require('handlebars');
var components = require('./components');

//Generic function
export function op(title: string, author: string, model: IModel): Promise<ICrud> {
	return new Promise(resolve => {
		var data_create: ICrud = {
			title: title,
			author: author,
			name: model.model_name,
			elements: []
		};

		model
			.view_content
			.map((item) => {
				var element = JSON.parse(item);
				//element => '{"required":true,"name":"descripcion","type":"text"}',
				data_create
					.elements
					.push(element)
			});

		return resolve(data_create);
	});
};

//Create "create" html from handlebars
export function create(title: string, author: string, model: IModel): Promise<string> {
	return new Promise(resolve => {
		const data_create: ICrud = {
			title: title,
			author: author,
			name: model.model_name,
			elements: []
		};

		model.view_content.map(item => {
			const element = JSON.parse(item);
			// element => '{"required":true,"name":"descripcion","type":"text"}',
			data_create
				.elements
				.push(element)
		});

		components.create(hbs => {
			var template = Handlebars.compile(hbs);
			var html = template(data_create);
			//console.log(html);
			resolve(html);
		});
	});
};

//Create "edit" html from handlebars
export function edit(title: string, author: string, model: IModel): Promise<string> {
	return new Promise(resolve => {
		var data_create: ICrud = {
			title: title,
			author: author,
			name: model.model_name,
			elements: []
		};

		model.view_content.map((item) => {
			var element = JSON.parse(item);
			//element => '{"required":true,"name":"descripcion","type":"text"}',
			data_create
				.elements
				.push(element)
		});

		components.edit(hbs => {
			const template = Handlebars.compile(hbs);
			const html = template(data_create);
			//console.log(html);
			resolve(html);
		});
	});
};

//Create "index" html from handlebars
export function index(title: string, author: string, model: IModel): Promise<string> {
	return new Promise(resolve => {
		var data_list: ICrud = {
			title: title,
			author: author,
			name: model.model_name,
			elements: []
		};

		model
			.view_content
			.map((item) => {
				var element = JSON.parse(item);
				//element => '{"required":true,"name":"descripcion","type":"text"}',
				data_list
					.elements
					.push(element)
			});

		components.index(function (hbs) {
			var template = Handlebars.compile(hbs);
			var html = template(data_list);
			//console.log(html);
			resolve(html);
		});
	});
};

//Create "show" html from handlebars
export function show(title: string, author: string, model: IModel): Promise<string> {
	return new Promise(function (resolve, reject) {
		var data_list: ICrud = {
			title: title,
			author: author,
			name: model.model_name,
			elements: []
		};

		model
			.view_content
			.map((item) => {
				var element = JSON.parse(item);
				//element => '{"required":true,"name":"descripcion","type":"text"}',
				data_list
					.elements
					.push(element)
			});

		components.show(function (hbs) {
			var template = Handlebars.compile(hbs);
			var html = template(data_list);
			//console.log(html);
			resolve(html);
		});
	});
};

/*
EXAMPLE:
{
  model_name: 'tareasNoRealizadas',
  content: 'attributes: { id_tarea: {type: \'integer\',required: true}, descripcion: {type: \'string\',required: true}, fecha_registro: {type: \'datetime\',required: true}, fecha_realizado: {type: \'datetime\',required: true}, realizado: {type: \'boolean\',required: true}, fk_persona_empleado: {type: \'integer\',required: true}, categoria: {type: \'string\',required: true} }',
  view_content: ['{"required":true,"name":"id_tarea","type":"number"}',
    '{"required":true,"name":"descripcion","type":"text"}',
    '{"required":true,"name":"fecha_registro","type":"datetime"}',
    '{"required":true,"name":"fecha_realizado","type":"datetime"}',
    '{"required":true,"name":"realizado","type":"boolean"}',
    '{"required":true,"name":"fk_persona_empleado","type":"number"}',
    '{"required":true,"name":"categoria","type":"text"}'
  ]
}
*/