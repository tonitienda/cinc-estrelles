export type BusinessError = {
  status: number;
  message: string;
};

export const ResourceNotFound = (resourceType: string): BusinessError => ({
  status: 404,
  message: `The ${resourceType} could not be found.`,
});

export const InputNotValid = (errors: string): BusinessError => ({
  status: 400,
  message: errors,
});
