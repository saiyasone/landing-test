export function getFileType(name: string) {
  if (!name) {
    return null;
  }
  const fileName = name;
  const fileType = fileName?.split(".").pop();

  return fileType;
}
