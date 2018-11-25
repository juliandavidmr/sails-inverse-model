import { controllerContent, toModel } from "../configs/to";
import chalk from "chalk";
import { capitalize, camelize } from "underscore.string";
import mkdir from "mkdir-promise";
import pretty from "pretty";
import { save } from './file';
import * as ora from 'ora';
import { IModel } from 'src/interfaces/IModel';

const spinner = ora('Loading controller');
/**
 * Save models in the folder Models
 */
export async function saveControllers(dir_folder_controllers: string, Models: any[]) {
	await mkdir(dir_folder_controllers)
	let count = 0;
	Models.map(async (model: any) => {
		spinner.start()
		var name_c = capitalize(model.model_name).trim().concat("Controller.js");
		await save(pretty(controllerContent(camelize(model.model_name))), dir_folder_controllers, name_c)

		if (++count === Models.length) {
			spinner.text = `Controllers [OK]`
			spinner.succeed().stop()
		}
	});
};

/**
 * saveModels save models in the folder Models
 */
export async function saveModels(dir_folder_model: string, Models: any) {
	let count = 0;
	await mkdir(dir_folder_model)
	Models.map(async (model: IModel) => {
		var name_m = capitalize(model.model_name).trim() + ".js";
		await save(pretty(toModel(model.content)), dir_folder_model, name_m)
		if (++count === Models.length) {
			spinner.text = `Models [OK]`
			spinner.succeed().stop()
		}
	});
};