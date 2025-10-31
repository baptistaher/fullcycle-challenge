import { createSlice } from "@reduxjs/toolkit";
import type { MenuProps } from "../types/menu.types";

const initialState: MenuProps = {
	selectedItem: [],
	selectedId: null,
	drawerOpen: false,
	error: null,
};

export const menu = createSlice({
	name: "menu",
	initialState,
	reducers: {
		activeItem(state, action) {
			state.selectedItem = action.payload;
		},
		activeID(state, action) {
			state.selectedId = action.payload;
		},
		hasError(state, action) {
			state.error = action.payload;
		},
	},
});

export const { activeItem } = menu.actions;
