export interface Resolution {
  size: string | null;
  images: {
    base: string;
    new: string;
    diff: string;
  };
  extraData: any;
}

export interface Snapshot {
  props: {
    name: string;
  };
  resolutions: Resolution[];
}

export interface Test {
  props: {
    name: string;
    time: number;
  };
  snapshots: Snapshot[];
  failure: {
    percentage: string;
    message: string;
  };
}

export interface Item {
  props: {
    name: string;
    tests: number;
  };
  tests: Test[];
}

export interface SelectedImage {
  snapshot: {
    props: {
      name: string;
    };
    resolutions: {
      size: string | null;
      images: {
        base: string;
        new: string;
        diff: string;
      };
      extraData: any;
    }[];
  };
  item: {
    props: {
      name: string;
      tests: number;
    };
    tests: Test[];
  };
  test: Test;
}
