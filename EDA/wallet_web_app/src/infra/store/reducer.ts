import { combineReducers } from "redux";
import { menu } from "@/presentation/layout/main-layout/store/menu.slice";

export const reducer = combineReducers({
	menu: menu.reducer,
});
