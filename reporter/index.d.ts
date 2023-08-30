export = Reporter;
declare function Reporter(runner: any, options: any): void;
declare class Reporter {
    constructor(runner: any, options: any);
    _options: any;
    _runner: any;
    _reportDir: string;
    lastSuite(): any;
    getTestsuiteData(suite: any): {
        props: {
            name: string;
            tests: any;
        };
        tests: never[];
    };
    getSnapshotsData(test: any): any[];
    getTestcaseData(test: any, err: any): {
        props: {
            name: any;
            time: number;
        };
        snapshots: any[];
    };
}
//# sourceMappingURL=index.d.ts.map