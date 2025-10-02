
export class KickByUniqueIdCommand {
    constructor(
        public uniqueId: string,
        public reason: string,
        public serverKick: boolean = true
    ) {}
}