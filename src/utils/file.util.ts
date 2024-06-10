export function getFileType(name: string) {
  if (!name) {
    return null;
  }
  const fileName = name;
  const fileType = fileName?.split(".").pop();

  return fileType;
}

export function cutFileName(fileName: string, maxLength = 10) {
  const extension = fileName.split(".").pop();
  const nameWithoutExtension = fileName.replace(`.${extension}`, "");
  if (nameWithoutExtension.length <= maxLength) return fileName;
  return `${nameWithoutExtension.slice(0, maxLength)}...${extension}`;
}

export function combineOldAndNewFileNames(
  filename: string,
  newFileName: string,
) {
  if (!newFileName) {
    return filename;
  }
  if (filename && newFileName) {
    const newName = filename.replace(newFileName, "");
    return newName;
  }
}

export function removeFileNameOutOfPath(path: string) {
  return path.substring(0, path.lastIndexOf("/") + 1);
}
