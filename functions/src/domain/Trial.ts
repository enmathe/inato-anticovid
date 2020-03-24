interface TrialConstructorArgs {
  trialid: string;
  public_title: string;
  web_address: string;
  recruitment_status: string | null;
  therapeutic_classes: Array<string>;
  date_registration3: Date;
  rest: any;
}

export class Trial {
  public readonly trialid: string;
  public readonly public_title: string;
  public readonly web_address: string;
  public readonly recruitment_status: string | null;
  public readonly therapeutic_classes: Array<string>;
  public readonly date_registration3: Date;
  public readonly rest: any;

  constructor({
    trialid,
    public_title,
    web_address,
    recruitment_status,
    therapeutic_classes,
    date_registration3,
    rest
  }: TrialConstructorArgs) {
    this.trialid = trialid;
    this.public_title = public_title;
    this.web_address = web_address;
    this.recruitment_status = recruitment_status;
    this.therapeutic_classes = therapeutic_classes;
    this.date_registration3 = date_registration3;
    this.rest = rest;
  }
}
