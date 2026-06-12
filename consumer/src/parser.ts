export default function parseMetadata(template: string, metadata: any): string {
  // This regex looks for patterns like {comment.email} or ${comment.email}
  return template.replace(/\$?\{([\w.]+)\}/g, (match, path) => {
    // path will be "comment.email" or "comment.ammount"
    const keys = path.split("."); // ["comment", "email"]
    
    // Drill down into the metadata object
    let value = metadata;
    for (const key of keys) {
      value = value?.[key];
    }

    // Return the found value, or the original match if not found
    //console.log(value,typeof(value))
    return value !== undefined ? String(value) : match;
  });
}