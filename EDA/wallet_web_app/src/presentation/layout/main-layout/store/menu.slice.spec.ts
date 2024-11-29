import { describe, it, expect } from 'vitest';

import { activeItem, menu } from './menu.slice';

describe('Redux - Menu Slice', () => {
  it('should return the initial state', () => {
    expect(menu.getInitialState()).toEqual({
      selectedItem: [],
      selectedId: null,
      drawerOpen: false,
      error: null,
    });
  });

  it("should handle 'activeItem' action", () => {
    const state = menu.getInitialState();
    const action = activeItem(['item1']);
    const newState = menu.reducer(state, action);
    expect(newState.selectedItem).toEqual(['item1']);
  });
});
