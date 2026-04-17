export function parseRedisFields(fields: string[]): Record<string, string> {
    const result: Record<string, string> = {};
  
    for (let i = 0; i < fields.length; i += 2) {
      result[fields[i]] = fields[i + 1];
    }
  
    return result;
  }