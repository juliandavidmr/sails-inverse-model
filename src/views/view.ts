import { concat } from "src/configs/route";
import { create, edit, index, show } from './crud';
import chalk from 'chalk';
import { save } from 'src/utils/file';
import { IModel } from 'src/interfaces/IModel';

var mkdir = require("mkdir-promise");
var ProgressBar = require('progress');

const author = "sails-inverse-model";

export async function generate(Models: IModel[], folder_views: string) {
	await mkdir(folder_views)
	var bar3 = new ProgressBar(':bar', {
		total: Models.length
	});

	Models.forEach(async model => {
		var route = concat(folder_views, model.model_name);

		await mkdir(route)

		const htmlCreate = await create(model.model_name, author, model);
		await save(htmlCreate, route, "create.ejs");

		const htmlEdit = await edit(model.model_name, author, model)
		await save(htmlEdit, route, "edit.ejs")

		const htmlIndex = await index(model.model_name, author, model)
		await save(htmlIndex, route, "index.ejs")

		const htmlShow = await show(model.model_name, author, model)
		await save(htmlShow, route, "show.ejs")

		bar3.tick();
		if (bar3.complete) {
			console.log('Views ' + chalk.green("[OK]"));
		}
	});
};