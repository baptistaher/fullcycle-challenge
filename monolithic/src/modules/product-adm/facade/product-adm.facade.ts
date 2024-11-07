import UseCaseInterface from "../../@shared/use-case/use-case.interface";
import ProductAdmFacadeInterface, {
  AddProductFacadeInputDto,
  CheckStockFacadeInputDto,
  CheckStockFacadeOutputDto,
} from "./product-adm.facade.interface";

export interface UseCaseProps {
  addUseCase: UseCaseInterface;
  stockUseCase: UseCaseInterface;
}

export default class ProductAdmFacade implements ProductAdmFacadeInterface {
  private _addUseCase: UseCaseInterface;
  private _checkStockUseCase: UseCaseInterface;
  constructor(useCasesProps: UseCaseProps) {
    this._addUseCase = useCasesProps.addUseCase;
    this._checkStockUseCase = useCasesProps.stockUseCase;
  }

  addProduct(input: AddProductFacadeInputDto): Promise<void> {
    console.log(input);
    // case o dto do caso de uso for != do dto da facade, converter o dto da facade o dto do caso de uso
    return this._addUseCase.execute(input);
    // throw new Error("Method not implemented.");
  }
  checkStock(
    input: CheckStockFacadeInputDto
  ): Promise<CheckStockFacadeOutputDto> {
    return this._checkStockUseCase.execute(input);
    // throw new Error("Method not implemented.");
  }
}
