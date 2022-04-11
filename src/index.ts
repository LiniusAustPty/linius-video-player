import LVP from "./lvp";

export default (elementId: string, config: any) => {
  return new LVP(elementId, config);
};
