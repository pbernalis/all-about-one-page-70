import { StudioSchema, JsonPatchOp } from '@/types/schema';

/**
 * Deep clone an object to avoid mutations
 */
function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (Array.isArray(obj)) return obj.map(item => deepClone(item)) as T;
  
  const cloned = {} as T;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      cloned[key] = deepClone(obj[key]);
    }
  }
  return cloned;
}

/**
 * Parse a JSON Pointer path into an array of keys
 * Examples: "/theme/brandColor" -> ["theme", "brandColor"]
 *          "/sections/0" -> ["sections", "0"]
 *          "/sections/-" -> ["sections", "-"]
 */
function parsePath(path: string): string[] {
  if (path === '') return [];
  if (path === '/') return [''];
  
  return path.split('/').slice(1).map(segment => 
    segment.replace(/~1/g, '/').replace(/~0/g, '~')
  );
}

/**
 * Get a value from an object using a path array
 */
function getValue(obj: any, pathSegments: string[]): any {
  let current = obj;
  
  for (const segment of pathSegments) {
    if (current === null || current === undefined) {
      return undefined;
    }
    
    if (Array.isArray(current) && segment === '-') {
      return current.length; // For array append operations
    }
    
    current = current[segment];
  }
  
  return current;
}

/**
 * Set a value in an object using a path array
 */
function setValue(obj: any, pathSegments: string[], value: any): void {
  if (pathSegments.length === 0) {
    throw new Error('Cannot set root value');
  }
  
  let current = obj;
  const lastSegment = pathSegments[pathSegments.length - 1];
  const parentPath = pathSegments.slice(0, -1);
  
  // Navigate to parent
  for (const segment of parentPath) {
    if (current[segment] === undefined) {
      // Create intermediate objects/arrays as needed
      const nextSegment = pathSegments[parentPath.indexOf(segment) + 1];
      current[segment] = /^\d+$/.test(nextSegment) || nextSegment === '-' ? [] : {};
    }
    current = current[segment];
  }
  
  // Set the value
  if (Array.isArray(current) && lastSegment === '-') {
    current.push(value); // Append to array
  } else if (Array.isArray(current) && /^\d+$/.test(lastSegment)) {
    const index = parseInt(lastSegment, 10);
    current[index] = value; // Set array index
  } else {
    current[lastSegment] = value; // Set object property
  }
}

/**
 * Remove a value from an object using a path array
 */
function removeValue(obj: any, pathSegments: string[]): void {
  if (pathSegments.length === 0) {
    throw new Error('Cannot remove root value');
  }
  
  let current = obj;
  const lastSegment = pathSegments[pathSegments.length - 1];
  const parentPath = pathSegments.slice(0, -1);
  
  // Navigate to parent
  for (const segment of parentPath) {
    if (current[segment] === undefined) {
      return; // Path doesn't exist, nothing to remove
    }
    current = current[segment];
  }
  
  // Remove the value
  if (Array.isArray(current) && /^\d+$/.test(lastSegment)) {
    const index = parseInt(lastSegment, 10);
    if (index >= 0 && index < current.length) {
      current.splice(index, 1); // Remove array element
    }
  } else if (current && typeof current === 'object') {
    delete current[lastSegment]; // Remove object property
  }
}

/**
 * Apply a single JSON Patch operation to a schema
 */
function applyOperation(schema: StudioSchema, op: JsonPatchOp): StudioSchema {
  const pathSegments = parsePath(op.path);
  
  try {
    switch (op.op) {
      case 'add':
        if (op.value === undefined) {
          throw new Error('Add operation requires a value');
        }
        setValue(schema, pathSegments, op.value);
        break;
        
      case 'replace':
        if (op.value === undefined) {
          throw new Error('Replace operation requires a value');
        }
        // Check if the path exists before replacing
        if (pathSegments.length > 0) {
          const parentPath = pathSegments.slice(0, -1);
          const parent = getValue(schema, parentPath);
          const lastSegment = pathSegments[pathSegments.length - 1];
          
          if (parent && (lastSegment in parent || Array.isArray(parent))) {
            setValue(schema, pathSegments, op.value);
          } else {
            throw new Error(`Path ${op.path} does not exist for replace operation`);
          }
        }
        break;
        
      case 'remove':
        removeValue(schema, pathSegments);
        break;
        
      default:
        throw new Error(`Unsupported operation: ${op.op}`);
    }
  } catch (error) {
    console.warn(`Failed to apply JSON Patch operation:`, op, error);
    throw new Error(`JSON Patch operation failed: ${error.message}`);
  }
  
  return schema;
}

/**
 * Apply an array of JSON Patch operations to a StudioSchema
 * Returns a new schema object (does not mutate the original)
 */
export function applyPatch(schema: StudioSchema, ops: JsonPatchOp[]): StudioSchema {
  if (!schema) {
    throw new Error('Schema is required');
  }
  
  if (!Array.isArray(ops)) {
    throw new Error('Operations must be an array');
  }
  
  // Deep clone the schema to avoid mutations
  const clonedSchema = deepClone(schema);
  
  // Apply each operation sequentially
  for (const op of ops) {
    if (!op || typeof op !== 'object') {
      console.warn('Invalid JSON Patch operation:', op);
      continue;
    }
    
    if (!op.op || !op.path) {
      console.warn('JSON Patch operation missing required fields:', op);
      continue;
    }
    
    try {
      applyOperation(clonedSchema, op);
    } catch (error) {
      console.error(`Failed to apply operation ${JSON.stringify(op)}:`, error);
      // Continue with other operations instead of throwing
    }
  }
  
  return clonedSchema;
}

/**
 * Validate a JSON Patch operation
 */
export function validateOperation(op: JsonPatchOp): boolean {
  if (!op || typeof op !== 'object') return false;
  if (!op.op || !op.path) return false;
  if (!['add', 'replace', 'remove'].includes(op.op)) return false;
  if ((op.op === 'add' || op.op === 'replace') && op.value === undefined) return false;
  
  return true;
}

/**
 * Validate an array of JSON Patch operations
 */
export function validatePatch(ops: JsonPatchOp[]): boolean {
  if (!Array.isArray(ops)) return false;
  return ops.every(validateOperation);
}