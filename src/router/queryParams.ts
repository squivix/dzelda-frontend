import {z, ZodType} from "zod";
import constants from "@/constants.js";
import {LanguageLevel} from "dzelda-common";

export type RouteParamDef = { schema: ZodType, postProcess?: (param: string | string[]) => any }
export const booleanStringQueryParam: RouteParamDef = {schema: z.preprocess((v) => String(v).toLowerCase(), z.literal("true").or(z.literal("false"))), postProcess: v => v === "true"};
export const generatePaginationQueryParams = (pageSizes: number[]) => {
    return {
        page: {schema: z.string().regex(/^[1-9][0-9]*$/).optional(), postProcess: Number},
        pageSize: {
            schema: z.string().regex(new RegExp(`${pageSizes.map(p => `^${p}$`).join("|")}`)).optional(),
            postProcess: Number
        }
    };
};

export const textFilters = {
    level: {
        schema: z.union([
            z.nativeEnum(LanguageLevel),
            z.array(z.nativeEnum(LanguageLevel))
        ]).optional(),
    },
    addedBy: {schema: z.string().min(1).optional()},
    hasAudio: booleanStringQueryParam,
};
export const collectionFilters = {
    addedBy: {schema: z.string().min(1).optional()}
};
export const vocabFilters = {
    level: {
        schema: z.union([
            z.string().regex(new RegExp(`^(${Object.values(constants.ALL_VOCAB_LEVELS).map(String).join("|")})$`)),
            z.array(z.string().regex(new RegExp(`^(${Object.values(constants.ALL_VOCAB_LEVELS).map(String).join("|")})$`)))
        ]).optional()
    }
};

export const searchQuery: RouteParamDef = {schema: z.string().min(1).optional()};
export const token: RouteParamDef = {schema: z.string().min(1).optional()};
