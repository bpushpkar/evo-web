import {
  getDirectory,
  getFileNameWithoutExtension,
  getProperName,
} from "./common";

const a11yDocsTemplates = import.meta.glob(
  "../routes/_index/accessibility/**/*+page.marko",
);

export interface A11yDocsMap {
  [key: string]: {
    properName: string;
    name: string;
    list: {
      properName: string;
      name: string;
      fullPath: string;
      type: string;
    }[];
  };
}

export const a11yDocs = Object.keys(a11yDocsTemplates).reduce<A11yDocsMap>(
  (data, filePath) => {
    const parts = filePath.split("/");
    parts.slice(0, parts.length - 1).join("/");
    const name = getFileNameWithoutExtension(filePath).replace("+page", "");

    // This is when the actual file is simply +page.marko
    if (!name) {
      return data;
    }
    const type = getDirectory(filePath);
    const properName = getProperName(name);
    data[type] = data[type] || {};
    data[type].properName = getProperName(type);
    data[type].name = type;
    data[type].list = data[type].list || [];

    data[type].list.push({
      properName,
      name,
      fullPath: filePath,
      type,
    });

    return data;
  },
  {},
);

const customOrder = ["patterns", "anti-patterns", "techniques", "testing"];
export const a11yList = Object.keys(a11yDocs);

a11yList.sort((a, b) => {
  // 1. Determine the index in the custom order list
  const indexA = customOrder.indexOf(a);
  const indexB = customOrder.indexOf(b);
  if (indexA > -1 && indexB > -1) {
    return indexA - indexB;
  }
  // If only 'a' is in the custom list, it comes first (negative value)
  if (indexA > -1) {
    return -1;
  }
  // If only 'b' is in the custom list, it comes first (positive value in reverse comparison)
  if (indexB > -1) {
    return 1;
  }

  // 3. Secondary Sort: Alphabetical for the rest
  // If neither or both are in the custom list, sort them alphabetically
  // localeCompare provides a robust, native way to sort strings alphabetically
  return a.localeCompare(b);
});
