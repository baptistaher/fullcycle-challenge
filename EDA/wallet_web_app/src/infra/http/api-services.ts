import axios, { type AxiosInstance } from "axios";

export class ApiService {
	private _api: AxiosInstance;

	constructor() {
		this._api = axios.create({
			baseURL: "http://localhost:8080",
			headers: {
				"Content-Type": "application/json",
			},
		});
	}

	//Get method
	get(endpoint: string, config = {}) {
		return this._api.get(endpoint, config);
	}

	//Post method
	post(endpoint: string, data: unknown, config = {}) {
		return this._api.post(endpoint, data, config);
	}
}
