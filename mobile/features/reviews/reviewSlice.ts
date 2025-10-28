import { BASE_URL } from "@/config";
import { Review } from "@/types/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";




interface ReviewState{
    reviews:Review[],
    status:"idle"|"loading"|"success"|"failed",
    error:string|null;
}

const initialState:ReviewState={
    reviews:[],
    status:"idle",
    error:null
}

const URL_Review=`${BASE_URL}/reviews`;

export const reviewList=createAsyncThunk<Review[],void,{rejectValue:string}>(
    "review/getAll",
    async (_,{rejectWithValue})=>{
        try {
            const res=await fetch(URL_Review)
            const data=await res.json()
            if(!res.ok) return rejectWithValue("Lỗi tải")
                return data as Review[]
        } catch (error) {
            return rejectWithValue("Lỗi kêt nối")
        }
    }
)

const reviewSlice=createSlice({
    name:"review",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(reviewList.pending,state=>{
            state.status="loading"
        })
        .addCase(reviewList.fulfilled,(state,action:PayloadAction<Review[]>)=>{
            state.status="success"
            state.reviews=action.payload
            state.error=null
        })
        .addCase(reviewList.rejected,(state,action)=>{
            state.status="failed"
            state.error=action.payload??"that bai"
        })
    }
})

export default reviewSlice.reducer