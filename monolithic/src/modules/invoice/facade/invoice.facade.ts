import FindInvoiceUseCase from "../use-case/find-invoice/find-invoice.usecase";
import GenerateInvoiceUseCase from "../use-case/generate-invoice/generate-invoice.usecase";
import InvoiceFacadeInterface, {
  FindInvoiceInputDto,
  FindInvoiceOutputDto,
  GenerateInvoiceFacadeInputDto,
  GenerateInvoiceFacadeOutputDto,
} from "./invoice.facade.interface";

export interface UseCaseProps {
  findUseCase: FindInvoiceUseCase;
  generatedUseCase: GenerateInvoiceUseCase;
}

export default class InvoiceFacade implements InvoiceFacadeInterface {
  private _findUseCase: FindInvoiceUseCase;
  private _generatedUseCase: GenerateInvoiceUseCase;

  constructor(props: UseCaseProps) {
    this._findUseCase = props.findUseCase;
    this._generatedUseCase = props.generatedUseCase;
  }
  async find(id: FindInvoiceInputDto): Promise<FindInvoiceOutputDto> {
    return await this._findUseCase.execute(id);
  }
  generate(
    input: GenerateInvoiceFacadeInputDto
  ): Promise<GenerateInvoiceFacadeOutputDto> {
    return this._generatedUseCase.execute(input);
    // throw new Error("Method not implemented.");
  }
}
