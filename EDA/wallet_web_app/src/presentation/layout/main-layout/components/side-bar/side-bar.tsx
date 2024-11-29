import { useDispatch, useSelector } from '@/infra/store/store';

export const SideBar = () => {
  const dispatch = useDispatch();

  const { drawerOpen } = useSelector((state) => state.menu);

  return (
    <nav>
      {drawerOpen} ? <>drawer</> : <>MiniDrawerStyled </>
    </nav>
  );
};
