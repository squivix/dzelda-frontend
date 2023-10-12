import {z, ZodType} from "zod";
import constants from "@/constants.js";

export type QueryParamDef = { schema: ZodType, postProcess?: (param: string | string[]) => any }
export const generatePaginationQueryParams = (pageSizes: number[]) => {
    return {
        page: {schema: z.string().regex(/^[1-9][0-9]*$/).optional(), postProcess: Number},
        pageSize: {
            schema: z.string().regex(new RegExp(`${pageSizes.map(p => `^${p}$`).join("|")}`)).optional(),
            postProcess: Number
        }
    }
};
export const lessonFiltersQueryParams = {};
export const courseFiltersQueryParams = {
    level: {
        schema: z.union([
            z.enum(["beginner1", "beginner2", "intermediate1", "intermediate1", "advanced1", "advanced2"]),
            z.array(z.enum(["beginner1", "beginner2", "intermediate1", "intermediate1", "advanced1", "advanced2"]))
        ]).optional(),
    },
    addedBy: {schema: z.string().min(1).optional()}
};
export const vocabFiltersQueryParams = {
    level: {
        schema: z.union([
            z.string().regex(new RegExp(Object.values(constants.ALL_VOCAB_LEVELS).map(String).join("|"))),
            z.array(z.string().regex(new RegExp(Object.values(constants.ALL_VOCAB_LEVELS).map(String).join("|"))))
        ]).optional()
    }
};

export const searchQuery: QueryParamDef = {schema: z.string().min(1).optional()};
export const token: QueryParamDef = {schema: z.string().min(1).optional()}
