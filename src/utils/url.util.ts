export function getRouteName(route) {
  const lastElement = route.split("/").slice(-1)[0];
  if (lastElement === "") {
    const routeName = "landing-page";
    return routeName;
  }
  return lastElement;
}
