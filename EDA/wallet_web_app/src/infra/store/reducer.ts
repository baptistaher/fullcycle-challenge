import { menu } from '@/presentation/layout/main-layout/store/menu.slice';
import { combineReducers } from 'redux';

export const reducer = combineReducers({
  menu: menu.reducer,
});
