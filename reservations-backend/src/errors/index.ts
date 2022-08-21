export type BusinessError = {
  status: number;
  message: string;
};

export const ResourceNotFound = (resourceType: string): BusinessError => ({
  status: 404,
  message: `The ${resourceType} could not be found.`,
});

export const InvalidRequest = (errors: string): BusinessError => ({
  status: 400,
  message: errors,
});

export const ResourceAcceptedWithErrors = (errors: string): BusinessError => ({
  status: 202,
  message: errors,
});

export const UnknownError = (): BusinessError => ({
  status: 500,
  message: "Unknown error",
});
