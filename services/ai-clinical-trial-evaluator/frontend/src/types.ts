export interface Patient {
  name: string;
  gender: string;
  age: number;
  diagnosis: string;
  eligibility_decision?: string;
  eligibility_reasoning?: string;
}
