declare namespace EqualToSheets {
  export declare function setLicenseKey(licenseKey: string): void;
  export declare function load(
    workbookId: string,
    element: HTMLElement,
    options: {
      syncChanges: boolean;
      onJSONChange?: (workbookId: string, workbookJson: string) => void;
    },
  ): {
    unmount: () => void;
  };
}
