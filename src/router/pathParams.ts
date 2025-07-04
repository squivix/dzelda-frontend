import {z} from "zod";
import type {RouteParamDef} from "@/router/queryParams.js";

export const languageCode: RouteParamDef = {schema: z.string().min(1).regex(/^[a-z]+$/)};
export const id: RouteParamDef = {schema: z.string().regex(/^\d+$/), postProcess: Number};

export const resourceType: RouteParamDef = {schema: z.union([z.literal("texts"), z.literal("collections")])};
