import MockAdapter from "axios-mock-adapter";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { ApiService } from "./api-services";

describe("ApiService integration Test", () => {
	let apiService: ApiService;
	let mock: MockAdapter;

	beforeEach(() => {
		apiService = new ApiService();
		mock = new MockAdapter(apiService["_api"]);
	});

	afterEach(() => {
		mock.reset();
	});

	it("should make a Get request and return data", async () => {
		const mockData = { message: "Success" };

		const url = "/test-endpoint";

		mock.onGet("http://localhost:8080" + url).reply(200, mockData);

		const response = await apiService.get(url);

		expect(response.status).toBe(200);
		expect(response.data).toEqual(mockData);
	});

	it("should the Get Request handle errors correctly", async () => {
		const mockData = { message: "Not Found" };
		const url = "/error-endpoint";

		mock.onGet("http://localhost:8080" + url).reply(404, mockData);

		await expect(apiService.get(url)).rejects.toThrow(
			"Request failed with status code 404",
		);
	});

	it("should make a Post request and return data", async () => {
		const endpoint = "/test-endpoint";
		const postData = { key: "value" };
		const mockResponse = { success: true };

		mock
			.onPost("http://localhost:8080" + endpoint, postData)
			.reply(201, mockResponse);

		const response = await apiService.post(endpoint, postData);

		expect(response.status).toBe(201);
		expect(response.data).toEqual(mockResponse);
	});

	it("should the Post Request handle errors correctly", async () => {
		const endpoint = "/error-endpoint";
		const postData = { key: "value" };
		const mockErrorResponse = { error: "Bad Request" };

		mock.onPost(endpoint, postData).reply(400, mockErrorResponse);

		// Expect the post method to reject with an error
		await expect(apiService.post(endpoint, postData)).rejects.toThrow(
			"Request failed with status code 400",
		);
	});
});
