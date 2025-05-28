export interface UseCaseInterface {
  // This class can be extended by specific use cases
  // to implement the execute method for business logic.
  execute(dto: any): Promise<any>;
}
