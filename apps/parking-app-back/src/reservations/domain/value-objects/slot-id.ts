export class SlotId {
    private static readonly PATTERN = /^[A-F](0[1-9]|10)$/;
    private readonly value: string;
  
    private constructor(value: string) {
      this.value = value;
    }
  
    public static create(raw: string): SlotId {
      if (!SlotId.PATTERN.test(raw)) {
        throw new Error(
          `Invalid slotId "${raw}". Must match A01–F10 (rows A–F, numbers 01–10).`
        );
      }
      return new SlotId(raw);
    }
  
    public toString(): string {
      return this.value;
    }
  
    public equals(other: SlotId): boolean {
      return this.value === other.value;
    }
  }