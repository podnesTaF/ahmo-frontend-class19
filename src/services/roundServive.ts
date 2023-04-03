import {api} from "@/services/api";
import {IMove, IRound} from "@/models/IGame";
import { socket } from "@/utils/socket";

export const roundService = api.injectEndpoints({
    endpoints: (build) => ({
        getRounds: build.query<IRound[], number>({
            query: (gameId: number) => ({
                url: `rounds?gameId=${gameId}`,
                method: 'GET',
            }),
            providesTags: (result) => ['Round'],
            async onCacheEntryAdded(arg, {cacheDataLoaded, cacheEntryRemoved, updateCachedData}) {
                try {
                    await cacheDataLoaded
                    socket.on('getNewRound', (round: IRound) => {
                        updateCachedData((draft) => {
                            if (draft && round) {
                                draft.push(round);
                            }
                        })
                    })
                    await cacheEntryRemoved;
                    socket.off('getNewRound');
                } catch (e) {}
            }
        }),
        getRound: build.query<IRound, number>({
            query: (roundId: number) => ({
                url: `rounds/${roundId}`,
                method: 'GET',
            }),
            providesTags: (result) => ['Round'],
            async onCacheEntryAdded(arg, {cacheDataLoaded, cacheEntryRemoved, updateCachedData}) {
                try {
                    await cacheDataLoaded
                    socket.on('getMove', (move: IMove) => {
                        updateCachedData((draft) => {
                            if (draft && move) {
                                if (draft.id === move.round.id) {
                                    draft?.moves?.push(move);
                                }
                            }
                        })
                    })
                    await cacheEntryRemoved;
                    socket.off('getMove');
                } catch (e) {}
            }
        }),
        createRound: build.mutation<IRound, { riddlerId: number, chatId: number }>({
            query: (dto: { riddlerId: number, chatId: number }) => ({
                url: `rounds`,
                method: 'POST',
                body: dto,
            }),
            invalidatesTags: ['Round', 'Game'],
        }),
        updateRoundData: build.mutation({
            query: (dto: {id: number, round_data?: string, round_status?: string, round_winner?: number }) => ({
                url: `rounds/${dto.id}`,
                method: 'PATCH',
                body: dto,
            }),
            invalidatesTags:['Round', 'Game']
        }),
        createMove: build.mutation<IMove, any>({
            query: (dto: { move_data: string, move_type: string, roundId: number}) => ({
                url: `moves`,
                method: 'POST',
                body: dto,
            }),
            invalidatesTags: ['Round', 'Game']
        }),
    })
})

export const {useGetRoundsQuery, useGetRoundQuery, useCreateRoundMutation, useUpdateRoundDataMutation, useCreateMoveMutation} = roundService;