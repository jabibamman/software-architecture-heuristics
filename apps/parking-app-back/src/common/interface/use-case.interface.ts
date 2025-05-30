export interface UseCaseInterface<Input = unknown, Output = unknown> {
  // This class can be extended by specific use cases
  // to implement the execute method for business logic.
  execute(input: Input): Output | Promise<Output>;
}
