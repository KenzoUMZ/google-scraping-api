export class SubmitSolutionDto {
  id!: string;
  // provide cookies string like "SID=...; HSID=...;"
  cookies?: string;
  // Or provide the HTML after human solved it
  htmlResolvedBase64?: string;
}
