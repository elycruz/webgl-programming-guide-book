export interface LocationInfo {
  label?: string,
  uri?: string,
  componentFilePath?: string,
  items?: LocationInfo[],

  // @deprecated
  reactRouterRouteParams?: object
}
