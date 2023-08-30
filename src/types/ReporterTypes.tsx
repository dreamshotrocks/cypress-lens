export interface Snapshot {
  props: {
    name: string;
  };
  images: {
    base: string;
    new: string;
    diff: string;
  };
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
    images: {
      base: string;
      new: string;
      diff: string;
    };
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
