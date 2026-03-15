import { EntityItem, PaginatedResponse, PaletteColors } from "@/lib/utils"
import { graphqlGet } from "./graphql"
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toPlural } from "@/components/BaseContent";
import listofAttributes from "@/configs/listOfAttributes";
import { managePageDeps } from "@/hooks/routeChange";
import { useAuthStore } from "@/hooks/authStore";

type StoreQueryArgs = 
{
    attributeName : string
    args         ?: Record<string, any>
    fields?       : string[],
    optionals    ?: 
    {
      toType       ?: string
      [key: string] : any
    }
}

export type eltQuery = 
{
    entity      : string
    fields      : string
    args       ?: any
    optionals  ?: Record<string, any>,
    skipInNeeds?: boolean
}

type resultQuery = 
{
    entity : string,
    data  ?: any
    errors?: string
}

interface InitOptions
{
  page          : any;
  attributeName : string;
  force        ?: boolean;
}

interface GlobalState
{
    dataPage       : Record<string, PaginatedResponse<EntityItem>>
    updateItem     : any
    isLoading      : boolean
    error          : string | null
    errors         : Record<string, string>
    lastInitialized: string | null
    scope          : Record<any,    any>
  
    initialize : (options: InitOptions) => Promise<void>
    getElements: (args: StoreQueryArgs) => Promise<void>
    pageChanged: (args: StoreQueryArgs) => Promise<void>
    reset      : () => void
    setState   : (key: keyof GlobalState, value: any) => void
}

async function fetchEntities(needs: eltQuery[], defaultCount = 10): Promise<resultQuery[]>
{
    const promises = needs.map(async (element) =>
    {
        const finalType = element.optionals?.toType ?? element.entity
        try
        {
            const data = await graphqlGet<PaginatedResponse<EntityItem>>(
            {
                entity: element.entity,
                fields: element.fields,
                args  : element.args || { page: 1, count: defaultCount },
            })
            return { entity: finalType, data }
        } 
        catch (err: any)
        {
            return { entity: finalType, error: err.message || `Erreur pour ${element.entity}` }
        }
    })

    const settled = await Promise.allSettled(promises);
    
    return settled.map((result, index) =>
    {
        if (result.status === "fulfilled") return result.value
        const el        = needs[index]
        const finalType = el.optionals?.toType ?? el.entity
        return { entity: finalType, error: result.reason?.message || "Erreur inconnue" }
    })
}

function applyResults(current: Record<string, any>, results: resultQuery[]): { newDataPage: Record<string, any>; newErrors: Record<string, string> }
{
    const newDataPage              = { ...current }
    const newErrors: Record<string, string> = {}

    results.forEach(({ entity, data, errors }) =>
    {
            // permissions_deps se merge dans permissions
        const targetEntity = entity === 'permissions_deps' ? 'permissions' : entity

        if (data)
        {
            const existing = newDataPage[targetEntity]

            if (Array.isArray(existing) && Array.isArray(data))
                newDataPage[targetEntity] = [...existing, ...data]
            else if (existing?.data && data?.data)
                newDataPage[targetEntity] = { ...data, data: [...existing.data, ...data.data] }
            else
                newDataPage[targetEntity] = data
        }
        if (errors) newErrors[targetEntity] = errors
    })

    return { newDataPage, newErrors }
}

export const useGlobalStore = create<GlobalState>()(
    persist( (set, get) =>
    ({
        dataPage       : {},
        updateItem     : null,
        isLoading      : false,
        error          : null,
        errors         : {},
        lastInitialized: null,
        scope          : {},

        getElements: async ({ attributeName, fields, args = {}, optionals }: StoreQueryArgs) =>
        {
            set({ isLoading: true })

            const goodType = toPlural(attributeName)

            const needs: eltQuery[] = [
                {
                    entity: goodType,
                    fields: fields && Array.isArray(fields) ? fields: ((listofAttributes[goodType] && listofAttributes[goodType][0]) || ["id"]),
                    args,
                    optionals: optionals ?? {},
                },
            ]

            const results = await fetchEntities(needs)

            set((state) =>
            {
                const { newDataPage, newErrors } = applyResults(state.dataPage, results)
                return {
                    dataPage : newDataPage,
                    errors   : { ...state.errors, ...newErrors },
                    isLoading: false,
                }
            })
        },

        pageChanged: async ({ attributeName, args = {}, optionals }: StoreQueryArgs) =>
        {
            const goodType = toPlural(attributeName)

            set({ isLoading: true })

            const needs: eltQuery[] = [
                {
                    entity   : goodType,
                    fields   : (listofAttributes[goodType] && listofAttributes[goodType][0]) || ["id"],
                    args     : { page: 1, count: 10, ...args },
                    optionals: optionals ?? {},
                },
            ]

            const results = await fetchEntities(needs)

            set((state) =>
            {
                const { newDataPage, newErrors } = applyResults(state.dataPage, results)
                return {
                    dataPage : newDataPage,
                    errors   : { ...state.errors, ...newErrors },
                    isLoading: false,
                }
            })
        },

        initialize: async (options: InitOptions) =>
        {
            const { page, attributeName, force = false } = options

            if (!page?.link) return
            if (!force && get().lastInitialized === attributeName) return

            set({
                isLoading      : true,
                dataPage       : {},
                updateItem     : null,
                lastInitialized: null,
                error          : null,
                errors         : {},
            })

            const currentUser = useAuthStore.getState().user
            const argPerms    = { search: `-${attributeName}` }

            const needs: eltQuery[] = []

            needs.push({
                entity: "permissions",
                fields: "id,name",
                args  : !currentUser ? argPerms: { ...argPerms, user_id: currentUser.id },
            })

            let needsEltsDeps: eltQuery[] = []
                needsEltsDeps             = managePageDeps(page.link, needsEltsDeps)
            needs.push(...needsEltsDeps)

            const results = await fetchEntities(needs)

            set((state) =>
            {
                const { newDataPage, newErrors } = applyResults(state.dataPage, results)
                return {
                    dataPage       : newDataPage,
                    updateItem     : null,
                    errors         : newErrors,
                    isLoading      : false,
                    lastInitialized: attributeName,
                    scope: { ...state.scope, currentPage: page, needsEltsDeps: needsEltsDeps.filter((need) => !need.skipInNeeds) },                }
            })
        },

        reset: () =>
        {
            set({
                dataPage       : {},
                updateItem     : null,
                isLoading      : false,
                error          : null,
                errors         : {},
                lastInitialized: null,
            })
        },

        setState: (key, value) => set((state) => ({ ...state, [key]: value })),
    }),

    {
        name: "global-store",

        partialize: (state) => ({
            scope: {
                collapsed: state.scope?.collapsed ?? false,
                theme    : state.scope?.theme ?? (typeof window !== "undefined" ? localStorage.getItem("theme") : "system"),
            },
        }),

        merge: (persistedState: any, currentState) =>
        {
            const theme = persistedState?.scope?.theme
                ?? (typeof window !== "undefined" ? localStorage.getItem("theme") : "system")
                ?? "system"

            const isDark = theme === "dark"
                || (
                       theme         === "system"
                    && typeof window !== "undefined"
                    && window.matchMedia("(prefers-color-scheme: dark)").matches
                )

            return {
                ...currentState,
                scope: {
                    ...currentState.scope,
                    collapsed: persistedState?.scope?.collapsed ?? false,
                    theme,
                    palette: PaletteColors(isDark),
                },
            }
        },
    })
)

if (typeof window !== "undefined")
{
        // @ts-ignore
    window.store = useGlobalStore;
}